


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

    _proxify: (url) -> 
        (@_proxyhead + encodeURIComponent(url) if @_ipaddr else url

    _proxifySoap: (url) ->
        if _ipaddr:
            return "?id=lr_ALTUI_Handler" \
                    "&command=proxysoap" \
                    "&action={0}" \
                    "&newUrl={1}" \
                    "&envelop={2}" \
                    "&body={3}"
        else
            return url

    # ALTUI device for proxy if needed (secondary vera)
    _getUrlHead: () -> @urlhead 

    _veraUrl: (paramDict) ->
        @_proxify "#{_getUrlHead()}?#{$.params(paramDict}"

    _buildAttributeSetUrl: (deviceID, attribute, value) ->
        # TODO: investigate if we can use : http://192.168.1.16/port_3480/data_request?id=lu_variableset&DeviceNum=58&Variable=onDashboard&Value=0
        # var url = _getUrlHead()+"?id=lr_ALTUI_Handler&command=set_attribute&devid="+deviceID+"&attr="+attribute+"&value="+encodeURIComponent(value);
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

    _buildUPnpGetFileUrl: (file) ->
        @_proxify _getUrlHead().replace("data_request", "luvd/"+file
    
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
        @_getUrlHead().replace('/port_3480/data_request',
                                 '/port_49451/upnp/control/hag')

    _unproxifyResult: (data, textStatus, jqXHR, cbfunc) ->
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
                    @_unproxifyResult(data,
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

    _UPnpSetAttr: (deviceID, attribute, value, cbfunc) ->
        @_ModifyUserData {
            devices: {
                "devices_#{deviceID}": {
                    "#{attribute}": value
                }
            }
        }, cbfunc

    _UPnPSetAttrUI7: (deviceID, attribute, value, cbfunc) ->
        @_exec @_buildAttributeSetUrl(deviceID, attribute, value), cbfunc

    _UPnPSet: (deviceID, service, varName, varValue) ->
        @_exec @_buildVariableSetUrl(deviceID, service, varName, varValue)

    _UPnPAction: (deviceID, service, action, params, cbfunc) ->
        


    




