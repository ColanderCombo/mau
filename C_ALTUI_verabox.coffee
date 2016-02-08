## sourceURL=J_ALTUI_verabox.js
# "use strict";
# http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
# This program is free software: you can redistribute it and/or modify
# it under the condition that it is for private or home useage and 
# this whole comment is reproduced in the source code file.
# Commercial utilisation is not authorized without the appropriate
# written agreement from amg0 / alexis . mermet @ gmail . com
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

ALTUI_NEW_SCENE_ID = -1

class VeraBox
    constructor: (uniq_id, ip_addr) ->
        @_uniqID = uniq_id # assigned by Multibox, unique, 
                           # can be used for Settings & other things
        @_hagdevice = { id: 0, altuiid:"#{@_uniqID}-0" }
        @_upnpHelper = new UPnPHelper(ip_addr, uniq_id) # for common UPNP ajax
        @_dataEngine = null
        @_sysinfo = null
        @_rooms = null
        @_scenes = null
        @_devices = null
        @_categories = null
        @_devicetypes = {}
        @_user_data = {}
        @_change_cached_user_data = {}
        @_user_data_DataVersion = 1
        @_user_data_LoadTime = null
        @_status_data_DataVersion = 1
        @_status_data_LoadTime = null

    setRooms: (arr) -> @_rooms = arr
    setScenes: (arr) -> @_scenes = arr
    setCategories: (arr) -> @_categories = arr
    setDevices: (arr) -> @_devices = arr

    saveChangeCaches: (msgidx) ->
        promise = @_upnpHelper.ModifyUserData @_change_cached_user_data, () ->
            PageMessage.message(
                "ModifyUserData called & returned, a restart will occur now", 
                "success")
            PageMessage.clearMessage(msgidx)
        @_change_cached_user_data = {}
        user_changes = 0 # UI5 compat
        return promise

    updateChangeCache: (target) ->
        $.extend(true, @_change_cached_user_data, target)
        PageMessage.message("You need to save your changes", "info", true)
        user_changes = 1 # UI5 compat

    initializeSysinfo: () ->
        if @_sysinfo?
            return @_sysinfo
        url = @_upnpHelper.getUrlHead()
                .replace('/port_3480', '')
                .replace('/data_request', '/cgi-bin/cmh/sysinfo.sh')
        url = @_upnpHelper.proxify(url)
        jqxhr = $.ajax({
            url: url
            type: "GET"
            async: false
        }).done( (data,textStatus,jqXHR) ->
            @_upnpHelper.unproxifyResult data, textStatus, jqXHR, (data, textStatus, jqXHR) ->
                if isNullOrEmpty(data)
                    @_sysinfo = {}
                else if $.isPlainObject(data)
                    @_sysinfo = data
                else
                    @_sysinfo = JSON.parse(data)
        ).fail (jqXHR, textStatus, errorThrown) ->
            PageMessage.message(_T("Controller {0} did not respond").format(@_upnpHelper.getIpAddr()))
            @_sysinfo = {}

        return @_sysinfo

    _initializeJsonp: () ->
        jsonp = {
            ud: @_user_data
        }
        return jsonp

    _httpGet: (url,opts,cbfunc) ->
        options = $.extend true, {
            url: @_upnpHelper.proxify @_upnpHelper.getUrlHead()+url
            method: "GET"
            type: "GET"
            dataType: "text"
            cache: false
        }, opts

        jqxhr = $.ajax(options)
            .done( (data,textStatus,jqXHR) ->
                @_upnpHelper.unproxifyResult data, textStatus, jqXHR, (data,textStatus,jqXHR) ->
                    if $.isFunction cbfunc
                        cbfunc(data, textStatus, jqXHR)
            ).fail( (jqXHR, textStatus, errorThrown) ->
                PageMessage.message(_T("Controller {0} did not respond").format(@_upnpHelper.getIpAddr()), "warning")
                if $.isFunction cbfunc
                    (cbfunc)(null, textStatus, jqXHR)
            )
        return jqxhr

    _triggerAltUIUpgrade: (urlsuffix, newrev) ->
        urlsuffix += "&TracRev="+newrev
        return @_httpGet(urlsuffix,{}).always () ->
            PageMessage.message(_T("Upgrade Request succeeded, a Luup reload will happen"), "success")

    _reboot: () ->
        @runLua "os.execute('reboot')", (res) ->
            res = $.extend({success:false, result:"", output:""}, res)
            if res.success
                PageMessage.message("Reboot request succeeded", "success")
            else
                PageMessage.message("Reboot request failed", "danger")
    
    _reloadEngine: () ->
        @_upnpHelper.reloadEngine (data) ->
            if data?
                @_rooms = null
                @_devices = null
                @_scenes = null
                @_devicetypes = []
                @_change_cached_user_data = {}
                user_changes = 0 # UI5 compat

    _asyncResponse: (arr, func, filterfunc, endfunc) ->
        if arr?
            if $.isFunction filterfunc
                arr = $.grep arr, filterfunc
            if $.isFunction func
                $.each arr, (idx,obj) ->
                    func(idx+1,obj) # device id in LUA is idx+1
        if $.isFunction endfunc
            endfunc(arr)
        return arr

    _getPower: (cbfunc) ->
        @_httpGet("?id=live_energy_usage", {dataType: "text"},cbfunc)

    _setColor: (deviceid, hex) ->
        rgb = hexToRgb(hex)
        @_upnpHelper.UPnPAction(deviceid, 
                                'urn:micasaverde-com:serviceId:Color1',
                                'SetColorRGB', {
                                    newColorRGBTarget: "#{rgb.r},#{rgb.g},#{rgb.b}"
                                })
    
    _getWeatherSettings: () ->
        target = {tempFormat: "", weatherCountry: "", weatherCity: ""}
        $.extend(target, @_user_data.weatherSettings)
        return target

    _getRooms: (func, filterfunc, endfunc) ->
        if @_rooms?
            @_asyncResponse @_rooms.sort(altuiSortByName), func, filterfunc, endfunc
        else
            setTimeout (() -> @_getRooms(func, filterfunc, endfunc)), 500
        return @_rooms

    _getRoomByID: (roomid) ->
        room = null
        if @_rooms?
            for r,id in @_rooms
                if r.id == roomid
                    room = r
                    return false
        return room

    _getScenes: (func, filterfunc, endfunc) ->
        if @_scenes?
            @_asyncResponse @_scenes.sort(altuiSortByName), func, filterfunc, endfunc
        return @_scenes

    _getUsers: (func, filterfunc, endfunc) ->
        if @_user_data.users?
            @_asyncResponse @_user_data.users.sort(altuiSortByName2), func, filterfunc, endfunc
        return @_user_data.users

    _getUsersSync: () -> @_users_data.users

    _getUserByID: (userid) ->
        user = null
        if @_user_data.users?
            for usr,idx in @_user_data.users
                if usr.id == userid
                    user = usr
                    return false
        return user

    _getDevices: (func, filterfunc, endfunc) ->
        if @_devices?
            @_asyncResponse @_devices.sort(altuiSortByName), func, filterfunc, endfunc
        return @_devices

    _getCategories: (cbfunc, filterfunc, endfunc) ->
        # http://192.168.1.16:3480/data_request?id=sdata&output_format=json
        if not @_categories?
            jqxhr = @_httpGet "?id=sdata&output_format=json", {}, (data, textStatus, jqXHR) ->
                if data
                    arr = JSON.parse data
                    @_categories = arr.categories
                    if $.isFunction cbfunc
                        @_asyncResponse @_categories.sort(altuiSortByName), cbfunc, filterfunc, endfunc
        return @_categories

    _getIconPath: (name) ->
        if @_uniqID == 0
            start = window.local.hostname
        else
            start = @_upnpHelper.getIpAddr()
        return "//#{start}/cmh/skins/default/img/devices/device_states/#{name}"
    
    _getIcon: (imgpath, cbfunc) ->
        @_httpGet("?id=lr_ALTUI_Handler&command=image", 
                    { data: {path: imgpath} }, cbfunc)

    _getHouseMode: (cbfunc) ->
        @_httpGet "?"+$.params {
            id: "variableget"
            DeviceNum: 0
            serviceId: "urn:micasaverde-com:serviceId:HomeAutomationGateway1"
            Variable: "Mode"                     
        }, {}, cbfunc

    _setHouseMode: (newmode, cbfunc) ->
        if newmode <= 4 and newmode >= 1
            return @_upnpHelper.UPnPAction 0, 'urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode:newmode },cbfunc
        else
            return null

    _getHouseModeSwitchDelay: () ->
        if _isUI5()
            return 12
        else
            return parseInt(@_user_data.mode_change_delay or 9) + 3

    _findDeviceByID: (devid) ->
        for dev,i in @_user_data.devices
            if dev.id == devid
                return i
        return -1

    _getDeviceByType: (device_type) ->
        for dev in @_user_data.devices
            if dev.device_type == device_type
                return dev
        return null
        
    _getDeviceByAltID: (parentdevid, altid) ->
        for dev in @_user_data.devices
            if dev.id_parent == parentdevid and dev.altit == altid
                return dev
        return null

    getDeviceByID: (devid) ->
        if devid == 0
            return @_hagdevice
        for dev in @_user_data.devices
            if dev.id == devid
                return dev
        return null
    
    _getSceneByID: (sceneid) ->
        for scene in @_user_data.scenes
            if scene.id == sceneid
                return scene
        return null

    _getNewSceneID: () -> return ALTUI_NEW_SCENE_ID

    _getStates: (deviceid) -> @getDeviceByID(deviceid).states

    getStatusObject: (deviceid, service, variable, bCreate) ->
        foundState = null
        device = @getDeviceByID(deviceid)
        if not device?
            return null
        if device.states
            for state in device.states
                if state.service == service and state.variable == variable
                    foundState = state
                    break
        if not foundState? and bCreate
            newstate = {
                service: service
                variable: variable
                value: null
            }
            device.states.push(newstate)
            return newstate
        return foundState

    getStatus: (deviceid, service, variable) ->
        state = @getStatusObject(deviceid, service, variable)
        if state? then state.value else null

    getJobStatus: (jobid, cbfunc) -> @_upnpHelper.UPnPGetJobStatus(jobid, cbfunc)
    setStatus: (deviceid, service, variable, value, dynamic) ->
    evaluateConditions: (deviceid, devsubcat, conditions) ->
    refreshEngine: () ->
    loadUserData: (data) ->
    isUserDataCached: () ->
    saveEngine: () ->
    clearEngine: () ->
    loadEngine: () ->
    initDataEngine: () ->
    getBoxFullInfo: () ->
        ordered = {}
        for key, i in Object.keys(@_user_data).sort()
            val = @_user_data[key]
            if not $.isArray(val) and not $.isPlainObject(val)
                ordered[key] = val
        return ordered

    getBoxInfo: () -> {
        PK_AccessPoint: @_user_data.PK_AccessPoint
        BuildVersion: @_user_data.BuildVersion
        City_description: @_user_data.City_description
        Region_description: @_user_data.Region_description
        Country_description: @_user_data.Country_description
    }

    isUI5: () ->
        if not @_uniqID
            return UIManager.UI7Check() == false

        bi = @getBoxInfo()
        return (not bi.BuildVersion?) or (bi.BuildVersion.startsWith("*1.5."))

    getLuaStartup: () -> @_user_data.StartupCode or ""

    createDevice: (param, cbfunc) ->
        target = $.extend {
            descr: 'default title'
            dfile:''
            ifile:''
            roomnum:0
        }, param
        @_upnpHelper.createDevice(target.descr, 
                                  target.dfile, 
                                  target.ifile, 
                                  target.roomnum, 
                                  cbfunc)

    createRoom: (name, cbfunc) ->
        jqxhr = null
        if name and name.length > 0
            jqxhr = @httpGet "?"+$.params {id: "room", action:"create", name:name}, {}, (data, textStatus, jqXHR) ->
                if data? and data != "ERROR"
                    PageMessage.message(_T("Create Room succeeded for")+": "+name, 
                                        "success", 
                                        @isUI5())
                else
                    PageMessage.message(_T("Could not create Room")+": "+name, "warning")
                if $.isFunction cbfunc
                    cbfunc(data)
        return jqxhr

    deleteRoom: (id) ->
    renameRoom: (id,name) ->
    runScene: (id) ->

    osCommand: (cmd, cbfunc) ->
        jqxhr = @httpGet "?"+$.params {
            id: "lr_ALTUI_Handler"
            command: "oscommand"
            oscommand: cmd
        }, {}, (data, textStatus, jqXHR) ->
            if data? and data != "ERROR"
                PageMessage.message "Ran Scene #{id} successfully", "success"
            else
                PageMessage.message "Could not run Scene #{id}", "warning"
        return jqxhr

    runLua: (code, cbfunc) ->
    renameDevie: (device, newname, roomid) ->
    deleteDevice: (id) ->
    updateNeighbors: (deviceid) ->
    deleteSceneUserData: (id) ->
    deleteScene: (id) ->
    setStartupCode: (newlua) ->
    getCategoryTitle: (catnum) ->
    updateSceneUserData: (scene) ->
    editScene: (sceneid,scene,cbfunc) ->
    renameScene: (sceneid,newname) ->
    getDeviceStaticUI: (device) ->
    getDeviceBatteryLevel: (device) ->
    clearData: (name, npage, cbfunc) ->
    saveDataChunk: (name, npage, data, cbfunc) ->
    saveData: (name, data, cfunc) ->
    loadDeviceActions: (dt, cbfunc) ->
    getSceneHistory: (id, cbfunc) ->
    getDeviceVariableHistory: (device, varid, cbfun) ->
    getDeviceActions: (device, cbfunc) ->

    _xxxWatch: (cmd, w) ->
        # for thingspeak = a table of channelid, readkey, writekey, field, graphicurl
        url = "?"+$.params {
            id: 'lr_ALTUI_Handler'
            command: cmd
            service: w.service
            variable: w.variable
            device: w.deviceid
            scene: w.sceneid
            expression: w.luaexpr
            xml: w.xml
            provider: w.provider
            providerparams: JSON.stringify w.params
        }
        @_httpGet url, {}, (data, textStatus, jqXHR) ->
            if data? and data != "ERROR"
                # PageMessage
            else
                PageMessage.message(_T("Failure"), "warning")

    
    _delWatch: (w) -> _xxxWatch('delWatch', w)
    ## http://192.168.1.5/port_3480/data_request?id=lr_ALTUI_Handler&command=addRemoteWatch&device=42&variable=Status&service=urn:upnp-org:serviceId:SwitchPower1&data=192.168.1.16
    _addWatch: (w) -> _xxxWatch('addWatch', w)

    _getPushLineParams: (pushLine) ->
        key = ''
        fieldnum = 0
        params = pushLine.split('#')
        wparams = []
        for param in params[4..]
            wparams.push param
        return {
            service: params[0] or ""
            variable: params[1] or ""
            deviceid: params[2] or ""
            provider: params[3] or ""
            params: wparams
        }

    _getWatchLineParams: (watchLine) ->
        params = watchLine.split('#')
        # service,variable,deviceid,sceneid,lua_expr
        return {
            service: params[0]
            variable: params[1]
            deviceid: params[2]
            sceneid: params[3]
            luaexpr: params[4]
            xml: params[5] or ''
        }

    _setWatchLineParams: (watch) ->
        "#{watch.service}##{watch.variable}##{watch.deviceid}#" \
        "#{watch.sceneid}##{watch.luaexpr}##{watch.xml or ''}"

    _getWatches: (whichwatches, filterfunc) ->
        if whichwatches not in ['VariablesToWatch', 'VariablesToSend']
            return null
        if whichwatches == "VariablesToWatch"
            linefunc = _getWatchLineParams
        else
            linefunc = _getPushLineParams
        altuidevice = MultiBox.getDeviceByID(0, g_MyDeviceID)
        variable = MultiBox.getStatus(altuidevice, 
                                      "urn:upnp-org:serviceId:altui1", 
                                      whichwatches) or ""
        result = []
        for line, i in variable.split(':')
            w = linefunc(line)
            if $.isFunction filterfunc
                if filterfunc(w,i) then result.push(w)
            else
                result.push(w)
        return result

    _getDeviceDependants: (device) ->
        usedin_objects = []
        scenes = @getScenesSync()
        for scene, idx in scenes
            if scene.triggers
                for trigger, idx in scene.triggers
                    if trigger.device == device.id
                        usedin_objects.push {
                            type: 'trigger'
                            scene: scene.altuiid
                            name: scene.name
                            trigger: trigger
                        }
            if scene.groups
                for group, idx in scene.groups
                    for action, idx in group.actions
                        if action.device == device.id
                            usedin_objects.push {
                                type: 'action'
                                scene: scene.altuiid
                                name: scene.name
                                action: action
                            }
        return usedin_objects
    
    getDeviceEvents: (device) ->
        if device and device.id != 0
            ui_static_data = MultiBox.getDeviceStaticData(device)
            if not ui_static_data? or not ui_static_data.eventList2?
                return []
            return ui_static_data.eventList2
        return []

    isDeviceZwave: (device) ->
        if device and device.id_parent
            parent = @getDeviceByID device.id_parent
            return parent and parent.device_type == "urn:schemas-micasaverde-com:device:ZWaveNetwork:1"

    resetPollCounters: (cbfunc) ->
        @getDevices (luaid, device) ->
            id = device.id
            service = "urn:micasaverde-com:serviceId:ZWaveDevice1"
            PollNoReply = parseInt @getStatus id, service, "PollNoReply"
            PollOk = parseInt @getStatus id, service, "PollOk"
            if not isNaN PollNoReply
                @setStatus id, service, "PollNoReply", 0
            if not isNaN PollOk
                @setStatus id, service, "PollOk", 0
        , (device) -> (device.id_parent==1)
        , (device) -> if $.isFunction cbfunc then cbfunc()

    getUPnPHelper: () -> @_upnpHelper
    gerUrlHead: () -> @_upnpHelper.getUrlHead()
    getIpAddr: () -> @_upnpHelper.getIpAddr()

    getDataProviders: (cbfunc) ->
        # for thingspeak = a table of channelid, readkey, writekey, field, graphicurl
        url = "?"+$.params {id:"lr_ALTUI_Handler", command:"getDataProviders"}
        @_httpGet url, {}, (data, textStatus, jqXHR) ->
            if data? and data != "ERROR"
                cbfunc(JSON.parse(data))
            else
                PageMessage.message(_T("Failure"), "warning")
                cbfunc(null)

    getRoomsSync: () -> @_rooms
    getDevicesSync: () -> @_devices
    getScenesSync: () -> @_scenes
    getDeviceTypes: () -> @_devicetypes
    initEngine: (firstuserdata) ->
        @_loadEngine(firstuserdata)
        @_initDataEngine()









