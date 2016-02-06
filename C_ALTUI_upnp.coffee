


class UPnPHelper
    constructor: (ip_addr, veraidx) ->
        @_ipaddr = trim(ip_addr or '')
        @_veraidx = veraidx or 0
        @_proxyresultarea = "altuictrl"+_veraidx
        if @_ipaddr
            @_urlhead = "http://#{@_ipaddr}/port_3480/data_request"
        else
            @_urlhead = window.location.pathname
        @_proxyhead = "?id=lr_ALTUI_Handler&command=proxyget&resultName=none&newUrl="

    proxify: (url) -> 
        (@_proxyhead + encodeURIComponent(url) if @_ipaddr else url

    proxifySoap: (url) ->
        if _ipaddr:
            return "?id=lr_ALTUI_Handler" \
                    "&command=proxysoap" \
                    "&action={0}" \
                    "&newUrl={1}" \
                    "&envelop={2}" \
                    "&body={3}"
        else
            return url

    getIpAddr: () -> @_ipaddr
    # ALTUI device for proxy if needed (secondary vera)
    getUrlHead: () -> @urlhead 

    _veraUrl: (paramDict) ->
        @proxify "#{getUrlHead()}?#{$.params(paramDict}"

    _buildAttributeSetUrl: (deviceID, attribute, value) ->
        # TODO: investigate if we can use : http://192.168.1.16/port_3480/data_request?id=lu_variableset&DeviceNum=58&Variable=onDashboard&Value=0
        # var url = getUrlHead()+"?id=lr_ALTUI_Handler&command=set_attribute&devid="+deviceID+"&attr="+attribute+"&value="+encodeURIComponent(value);
        @_veraUrl {
            id: "lu_variableset"
            DeviceNum: deviceID
            Variable: attribute
            Value: value
        }

    _buildVariableSetUrl: (deviceID, service, varName, varValue) ->
        @_veraUrl {
            id: "variableset"
            DeviceNum: deviceID
            serviceid: service
            Variable: attribute
            Value: value
        }

    _buildUPnPGetJobStatusUrl: (jobID) ->
        @_veraUrl { id: "jobstatus", job: jobID }
    
    _buildSceneCreateUrl: (scenejson) ->
        @_veraUrl { id: "scene", action: "create", json: scenejson }

    buildUPnpGetFileUrl: (file) ->
        @proxify getUrlHead().replace("data_request", "luvd/"+file
    
    _buildUPnpUpdatePluginVersion: (pluginid, version) ->
        @_veraUrl { 
            id: "action"
            serviceId: "urn:micasaverde-com:serviceId:HomeAutomationGateway1"
            action: "CreatePlugin"
            PluginNum: pluginid
            Version: version
        }

    _buildUPnPUpdatePlugin: (pluginid) ->
        @_veraUrl { id: "update_plugin", Plugin: pluginid }

    _buildUPnPActionUrl: (deviceID, service, action, params) ->
        args = {
            id: "action"
            output_format: "json"
            DeviceNum: deviceID
            serviceId: service
            action: action
        }
        # action params are appended as 0=$param0&1=$param1, etc.
        for p,i of params
            args[i] = p
        @_veraUrl args

    _buildUPnpRunLua: (code) ->
        @_veraUrl {
            id: "lu_action"
            serviceId: "urn:micasaverde-com:serviceId:HomeAutomationGateway1"
            action: "RunLua"
            Code: code
        }

    _buildHAGSoapUrl: () ->
        @getUrlHead().replace('/port_3480/data_request',
                                 '/port_49451/upnp/control/hag')

    unproxifyResult: (data, textStatus, jqXHR, cbfunc) ->
        if not $.isFunction cbfunc
            return
        cbData = data
        if @_ipaddr
            cbData = data.substr(2) if data[0] == "1" else null

        cbFunc(cbData, textStatus, jqXHR)

    _exec: (url, cbfunc, mimetype) ->
        options = { 
            url: url, 
            type: "GET" 
            beforeSend: (xhr) -> xhr.overrideMimeType("text/plain")
        }

        if not mimetype?
            options.dataType = "text"

        jqxhr = $.ajax(options).done (data, textStatus, jqXHR) ->
                    @unproxifyResult(data,
                                      textStatus,
                                      jqXHR,
                                      (data,textStatus,jqXHR) ->
                                        if $.isFunction cbFunc
                                            cbfunc(data, textStatus, jqXHR)
                .fail (jqXHR, textStatus, errorThrown) ->
                    if $.isFunction cbFunc
                        cbfunc(nul, textStatus, jqXHR)
                    else
                        PageMessage.message(formatAjaxErrorMessage(jqXHR, 
                                                                    textStatus),
                                            "warning")
        return jqxhr

    UPnpSetAttr: (deviceID, attribute, value, cbfunc) ->
        @ModifyUserData {
            devices: {
                "devices_#{deviceID}": {
                    "#{attribute}": value
                }
            }
        }, cbfunc

    UPnPSetAttrUI7: (deviceID, attribute, value, cbfunc) ->
        @_exec @_buildAttributeSetUrl(deviceID, attribute, value), cbfunc

    UPnPSet: (deviceID, service, varName, varValue) ->
        @_exec @_buildVariableSetUrl(deviceID, service, varName, varValue)

    UPnPAction: (deviceID, service, action, params, cbfunc) ->
        @_exec @_buildUPnPActionUrl(deviceID, service, action, params), cbfunc

    UPnPGetJobStatus: (jobID, cbfunc) ->
        @_exec @_buildUPnPGetJobStatusUrl(jobID), cbfunc

    UPnPGetFile: (devicefile, cbfunc) ->
        mimetype = "text/plain"
        lastfour = devicefile.slice(-4)
        if lastfour == ".xml" && @_veraidx == 0
            mimetype = "text/xml"

        @_exec @buildUPnPGetFileUrl(devicefile), (data, textStatus, jqXHR) ->
            if jqXHR.responseXML
                data = new XMLSerializer().serializeToString(jqXHR.responseXML)
                jqXHR.responseText = data
            cbfunc(data, jqXHR)
        , mimetype

    UPnPDeletePlugin: (pluginid, cbfunc) ->
        AltuiDebug.debug("UPnPDeletePlugin(#{pluginid}")

        xml = """
<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' 
            s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
    <s:Body>
        <u:DeletePlugin 
            xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>
            <PluginNum>#{pluginid}</PluginNum>
        </u:DeletePlugin>
    </s:Body>
</s:Envelope>
"""
        url = @_buildHAGSoapUrl()
        return $.ajax({
                url: url
                type: "POST"
                dataType: "text"
                contentType: "text/xml;charset=UTF-8"
                processData: false
                data: xml
                headers: {
                    SOAPACTION: '"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#DeletePlugin"'
                }
            }).done (data, textStatus, jqXHR) ->
                @_uproxifyResult data, textStatus, jqXHR, (data, textStatus, jqXHR) ->
                    if $.isFunction cbfunc
                        re = /<OK>(.+)<\/OK>/
                        result = data.match(re)
                        cbfunc(result[1] if (result != null and result.length >= 2) else null)
            .fail (jqXHR, textStatus, errorThrown) ->
                if $.isFunction cbfunc
                    cbfunc(null)

    UPnPUpdatePluginVersion: (pluginid, version, cbfunc) ->
        @_exec @_buildUPnPUpdatePluginVersion(pluginid, version), cbfunc

    UPnPUpdatePlugin: (pluginid, cbfunc) ->
        @_exec @_buildUPnPUpdatePlugin(pluginid), cbfunc

    UPnPRunLua: (code, cbfunc) ->
        @_exec @_buildUPnPRunLua(code), cbFunc

    reloadEngine: (cbfunc) ->
        # Resets the Luup engine with any new configuration settings.
        # Example: http://ip_address:3480/data_request?id=reload
        @_exec @_veraUrl { id: "reload" }, cbfunc

    renameDevice: (device, newname, roomid) ->
        oldname = device.name
        device.name = newname
        device.dirty = true
        args =  {
            id: "device"
            action: "rename"
            device: device.id
            name: newname
        }
        if roomid?
            args.room = roomid
        @_exec @_veraUrl(args), (result) ->
            if result != "OK"
                PageMessage.message(_T("Device modify failed!"), "warning")
            else
                PageMessage.message(_T("Device modified!"), "success")

    createDevice: (descr, dfile, ifile, roomnum, cbfunc) ->
        AltuiDebug.debug("createDevice(#{descr},#{dfile},#{ifile},#{roomnum})")
        if 0
            xml = """
<s:Envelope 
    xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' 
    s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
   <s:Body>
        <u:CreateDevice 
            xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>
            <deviceType></deviceType>
            <internalID></internalID>
            <Description>#{descr}</Description>
            <UpnpDevFilename>#{dfile}</UpnpDevFilename>
            <UpnpImplFilename>#{ifile}</UpnpImplFilename>
            <IpAddress></IpAddress>
            <MacAddress></MacAddress>
            <DeviceNumParent>0</DeviceNumParent>
            <RoomNum>#{roomnum}</RoomNum>
        </u:CreateDevice>
   </s:Body>
</s:Envelope>

"""
            url = @_buildHAGSoapUrl()
            return $.ajax({
                    url: url
                    type: "POST"
                    dataType: "text"
                    contentType: "text/xml;charset=UTF-8"
                    processData: false
                    data: xml
                    headers: {
                        SOAPACTION: '"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#CreateDevice"'
                    }
                }).done (data, textStatus, jqXHR) ->
                    @_uproxifyResult data, textStatus, jqXHR, (data, textStatus, jqXHR) ->
                        if $.isFunction cbfunc
                            re = /<DeviceNum>(\d+)<\/DeviceNum>/
                            result = data.match(re)
                            cbfunc(result[1] if (result != null and result.length >= 2) else null)
                .fail (jqXHR, textStatus, errorThrown) ->
                    if $.isFunction cbfunc
                        cbfunc(null)
        else
            params = {
                Description: descr
                UpnpDevFilename: dfile
                UpnpImplFilename: ifile
                RoomNum: roomnum
                Reload: 1
            }
            @UPnPaction 0,
                "urn:micasaverde-com:serviceId:HomeAutomationGateway1",
                "CreateDevice",
                params,
                (data, textStatus, jqXHR) ->
                    if data?
                        PageMessage.message(_T("Create Device succeeded"), "success")
                        if $.isFunction cbfunc
                            # typical result 
                            #   { "u:CreateDeviceResponse": 
                            #       { "DeviceNum": "224" } 
                            #   }
                            obj = JSON.parse(data)
                            cbfunc(obj["u:CreateDeviceResponse"]["DeviceNum"])
                    else
                        PageMessage.message(_T("Create Device faileD"), "danger")
                        if $.isFunction cbfunc
                            cbfunc(null)


# http://192.168.1.5/port_49451/upnp/control/hag
# POST /port_49451/upnp/control/hag HTTP/1.1
# Host: 192.168.1.16
# Connection: keep-alive
# Content-Length: 17389
# Origin: http://192.168.1.16
# User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36
# Content-Type: text/xml;charset=UTF-8
# Accept: */*
# X-Requested-With: XMLHttpRequest
# SOAPACTION: "urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#ModifyUserData"
# MIME-Version: 1.0
# Referer: http://192.168.1.16/cmh/
# Accept-Encoding: gzip, deflate
# Accept-Language: fr,fr-FR;q=0.8,en;q=0.6,en-US;q=0.4
# <?xml version="1.0" encoding="UTF-8"?>
# <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
#   <s:Body>
#       <u:ModifyUserData xmlns:u="urn:schemas-micasaverde-org:service:HomeAutomationGateway:1">
#           <inUserData>
#               {"devices":{},"scenes":{},"sections":{},"rooms":{},"StartupCode":"","InstalledPlugins":[],"PluginSettings":[{"plugin_id":1408,"AutoUpdate":1}],"users":{}}
#           </inUserData>
#           <DataFormat>json</DataFormat>
#       </u:ModifyUserData>
#    </s:Body>
# </s:Envelope>
#
    ModifyUserData: (user_data, cbfunc) ->
        target = {
            devices: {}
            scenes: {}
            sections: {}
            rooms: {}
            InstalledPlugins: []
            PluginSettings: []
            users: {}
        }
        $.extend(target, user_data)
        xml = """
<s:Envelope 
    xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' 
    s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>
    <s:Body>
        <u:ModifyUserData 
            xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>
            <inUserData>
                JSON.stringify(target).escapeXml();
            </inUserData>
            <DataFormat>json</DataFormat>
        </u:ModifyUserData>
    </s:Body>
</s:Envelope>
"""
        
        url = @_buildHAGSoapUrl()
        if @_ipaddr == ''
            return $.ajax({
                    url: url
                    type: "POST"
                    dataType: "text"
                    contentType: "text/xml;charset=UTF-8"
                    processData: false
                    data: xml
                    headers: {
                        SOAPACTION: '"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#ModifyUserData"'
                    }
                }).done (data, textStatus, jqXHR) ->
                    @_uproxifyResult data, textStatus, jqXHR, (data, textStatus, jqXHR) ->
                        if $.isFunction cbfunc
                            cbfunc(data)
                .fail (jqXHR, textStatus, errorThrown) ->
                    if $.isFunction cbfunc
                        cbfunc(null)
        else
            url2 = @proxifySoap(url).format(
                    "ModifyUserData",
                    encodeURIComponent(url),
                    encodeURIComponent(xml),
                    encodeURIComponent(JSON.stringify(target))
                )
            return $.ajax({
                    url: url
                    type: "GET"
                    dataType: "text"
                    contentType: "text/xml;charset=UTF-8"
                    processData: false
                }).done (data, textStatus, jqXHR) ->
                    @_uproxifyResult data, textStatus, jqXHR, (data, textStatus, jqXHR) ->
                        if $.isFunction cbfunc
                            cbfunc(data)
                .fail (jqXHR, textStatus, errorThrown) ->
                    if $.isFunction cbfunc
                        cbfunc(null)

    sceneAction: (sceneobj, cbfunc) ->
        newscene = $.extend(true, {}, sceneobj)
        delete newscene['altuiid']

        # if not @_ipaddr?
        if 0
            # Local mode
            id = newscene.id
            target = {
                devices: {}
                scenes: {}
                sections: {}
                rooms: {}
                InstalledPlugins: {}
                PluginSettings: {}
                users: {}
                "scenes_#{id}": newscene
            }
            @ModifyUserData target, (result) ->
                if not result?
                    PageMessage.message("Scene action failed!", "warning")
                else
                    PageMessage.message("Scene action succeeded! "
                                        "a LUUP reload will happen now, "
                                        "be patient", "success")
        else
            if newscene.id == ALTUI_NEW_SCENE_ID
                delete newscene.id
            @_exec @_buildSceneCreateUrl JSON.stringify(newscene), 
                        (data, textStatus, jqXHR) ->
                            if $.isFunction cbfunc
                                cbfunc(data, jqXHR)


