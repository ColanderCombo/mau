## sourceURL=J_ALTUI_multibox.js
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

class MultiBox
    @devicetypesDB: {
        0: {}
    }

    @controllers: [
        { 
            ip:''
            controller: null
        }
    ]

    @_exec: (device, f) ->
        if not device?
            return null
        elems = device.altuiid.split('-')
        if not @controllers[elems[0]]?
            null
        else
            f(@controllers[elems[0]].controller)
    
    @_execWithId: (device, f) ->
        if not device?
            return null
        elems = device.altuiid.split('-')
        if not @controllers[elems[0]]?
            null
        else
            f(@controllers[elems[0]].controller, elems[1])

    @_union: (f) ->
        arr = []
        for c, i in @controllers
            arr = arr.concat f(c)

    @_unionSorted: (f) -> @_union(f).sort(altuiSortByName)


    @controllerOf: (altuiid) ->
        elems = altuiid.split("-")
        return {
            controller: parseInt(elems[0])
            id: elems[1]
        }

    @makeAltuiid: (ctrlid, devid) -> "#{ctrlid}-#{devid}"

    @getControllers: () ->
        $.map @controllers, (c) -> {
            ip: c.ip
            box_info:c.controller.getBoxFullInfo()
            controller: c.controller
        }

    @initDB: (devicetypes) ->
        # data received initially comes from ctrl 0
        $.extend(true, @devicetypesDB[0],devicetypes)
        return @

    @getALTUITypesDB: () -> @devicetypesDB[0]
    
    @getDeviceTypesDB: (controllerid) -> @devicetypesDB[controllerid or 0]

    @addDeviceType: (controllerid, devtype, obj) ->
        id = controllerid or 0
        if not @devicetypesDB[id][devtype]?
            @devicetypesDB[id][devtype] = {}
        return $.extend(true, @devicetypesDB[id][devtype],obj)

    @updateDeviceTypeUPnpDB: (controllerid, devtype, Dfilename) ->
        if not @devicetypesDB[id][devtype].Dfilename?
            @devicetypesDB[id][devtype].Dfilename = Dfilename

            # only try to load if not loaded or in the process of loading it
            if not @devicetypesDB[id][devtype].Dfilename?
                @devicetypesDB[id][devtype].Dfilename = Ffilename

                # get it into the cache ( or get it from the cache )
                FileDB.getFileContent id, Dfilename, (xmlstr, jqXHR) ->
                    try
                        if jqXHR
                            if jqXHR.responseXML?
                                doc = jqXHR.responseXML
                            else
                                doc = $.parseXML(xmlstr)
                        else
                            doc = $.parseXML(xmlstr)
                        
                        xml = $(doc)
                        imp = xml.find("implementationFile")
                        @devicetypesDB[id][devtype].Ifilename = imp.text()
                        @devicetypesDB[id][devtype].Services = []
                        serviceIDs = xml.find("serviceId")
                        Sfilenames = xml.find("SCPDURL")
                        xml.find("serviceId").each (index, value) ->
                            # get all services files name, but do not get 
                            # content, will be fetched on demand
                            @devicetypesDB[id][devtype].Services.push {
                                ServiceId: $(value).text()
                                SFilename: $(Sfilenames[index]).text()
                                Actions: []
                            }
                    catch e
                        console.log "error in xml parsing, Dfile: #{Dfilename}"
                        console.log "xmlstr #{xmlstr}"

    @updateDeviceTypeUIDB: (controllerid, devtype, ui_definitions) ->
        if not @devicetypesDB[controllerid]?
            @devicetypesDB[controllerid] = {}
        if not @devicetypesDB[controllerid][devtype]?
            @devicetypesDB[controllerid][devtype] = {}
        json = ui_definitions.device_json or 'nil'
        if not @devicetypesDB[controllerid][devtype][json]?
            @devicetypesDB[controllerid][devtype][json] = {}
        @devicetypesDB[controllerid][devtype][json].ui_static_data = ui_definitions

    @getDeviceStaticData: (device) ->
        if not device? or not device.device_type?
            return null
        elems = device.altuiid.split('-')
        json = device.device_json or 'nil' # fallback as on UI5 device_json is not defined
        if not @devicetypesDB[elems[0]][device.device_type][json]?
            # try with nil and use this if ok
            if @devicetypesDB[elems[0]][device.device_type]['nil']?
                return @devicetypesDB[elems[0]][device.device_type]['nil'].ui_static_data
            # really not there
            AltuiDebug.debug "_getDeviceStaticData(#{device.altuiid}) does not find static data"
            AltuiDebug.debug "_devicetypesDB[#{elems[0]}][#{device.device_type}]="+JSON.stringify(_devicetypesDB[elems[0]][device.device_type])
            return null

        return @devicetypesDB[elems[0]][device.device_type][json].ui_static_data

    @getAllEvents: (name) ->
        $.map @controllers, (o,i) -> "${name}_${i}"

    @initEngine: (extraController, firstuserdata) ->
        _AllLoaded = (eventname) ->
            switch eventname
                when "on_ui_userDataLoaded"
                    UIManager.refreshUI true, true # full & first time full display
                when "on_ui_userDataFirstLoaded"
                    null

            EventBus.publishEvent eventname

        EventBus.waitForAll "on_ui_userDataFirstLoaded", 
                            @getAllEvents("on_ui_userDataFirstLoaded"),
                            @,
                            @AllLoaded
        EventBus.waitForAll "on_ui_userDataLoaded", 
                            @getAllEvents("on_ui_userDataLoaded"),
                            @,
                            @AllLoaded
        # initialize controller 0 right away, no need to wait
        @controllers[0].controller = new VeraBox(0,'') # create the main controller
        @controllers[0].controller.initEngine(firstuserdata)

        # add the extra controllers
        if extraController.trim().length > 0
            for ipaddr, idx in extraController.split(',')
                @controllers.push {ip: ipaddr.trim(), controller: null }

            # initialize controllers that are not yet initialized
            for box,idx in @controllers
                # init device type DB for that controller
                if not @devicetypesDB[idx]?
                    @devicetypesDB[idx] = {}
                if not box.controller?
                    box.controller = new VeraBox(idx, box.ip)
                    # will raise("on_ui_userDataFirstLoaded_"+_uniqID) ("on_ui_userDataLoaded_"+_uniqID)
                    box.controller.initEngine()


    @saveEngine: () ->
        for box in @controllers
            box.controller.saveEngine()

    @clearEngine: () ->
        for box in @controllers
            box.controller.clearEngine()

    @getUrlHead: (altuiid) ->
        @_exec altuiid, (c) -> c.getUrlHead()

    @getIpAddr: (altuiid) ->
        @_exec altuiid, (c) -> c.getIpAddr()

    @isUI5: (controller) ->
        if not controller?
            return @devicetypesDB[0]['info'].ui7Check == false
        return @controllers[controller].controller.isUI5()

    @getDataProviders: (cbfunc) ->
        @controllers[0].controller.getDataProviders(cbfunc)

    @initializeJsonp: (controller) ->
        @controllers[controller].controller.initializeJsonp()

    @initializeSysinfo: (controller) ->
        @controllers[controller].controller.initializeSysinfo()

    @setHouseMode: (newmode, cbfunc) ->
        @controllers[0].controller.setHouseMode(newmode, cbfunc)

    @getHouseModeSwitchDelay: () ->
        @controllers[0].controller.getHouseModeSwitchDelay()

    @getRooms: (func, filterfunc, endfunc) ->
        dfd = $.Deferred()
        arr = []
        answers = 0
        for c, i in @controllers
            c.controller.getRooms (idx, room) ->
                index = arr.length
                arr.push(room)
                if $.isFunction(func)
                    func(index,room)
            , filterfunc, (rooms) ->
                answers++
                if answers == @controllers.length
                    result = arr.sort(altuiSortByName)
                    if $.isFunction endfunc
                        endfunc(result)
                    dfd.resolve(result)

        return dfd.promise()

    @getRoomsSync: () -> 
        @_unionSorted (c) -> c.getRoomsSync()

    @getRoomByID: (controllerid, roomid) ->
        @controllers[controllerid].controller.getRoomByID(roomid)

    @getRoomByAltuiID: (altuiid) ->
        @_execWithId altuiid, (c,id) -> c.getRoomByID(id)

    @getUsers: (func, filterfunc, endfunc) ->
        arr = []
        answers = 0
        for c, i in @controllers
            c.controller.getUsers (idx, room) ->
                index = arr.length
                arr.push(room)
                if $.isFunction(func)
                    func(index,user)
            , filterfunc, (users) ->
                answers++
                if answers == @controllers.length
                    if $.isFunction endfunc
                        endfunc(arr.sort(altuiSortByName2))
        @getUsersSync()

    @getUsersSync: (controllerid) ->
        arr = []
        if controllerid?
            arr = arr.concat @controllers[controllerid].controller.getUsersSync()
        else
            for c, i in @controllers
                arr = arr.concat c.controller.getUsersSync()
        return arr.sort(altuiSortByName2)

    @getUserByID: (controllerid, userid) ->
        @controllers[controllerid].controller.getUserByID(user)

    @getMainUser: () ->
        usrs = @controllers[0].controller.getUsersSync()
        if usrs? and users.length >= 1
            return usrs[0]
        return null

    @deleteRoom: (room) -> 
        @_execWithId room, (c,id) -> c.deleteRoom(id)

    @createRoom: (controllerid, name, cbfunc) ->
        @controllers[controllerid].controller.createRoom(name, cbfunc)

    @renameRoom: (room, name) ->
        @_execWithId room, (c,id) -> c.renameRoom(id, name)

    @createDevice: (controllerid, param, cbfunc) ->
        id = controllerid or 0
        @controllers[i].controller.createDevice param, (newid) ->
            cbfunc("#{id}-#{newid}")

    @renameDevice: (device, newname, roomid) ->
        @_exec device, (c) -> c.renameDevice(device, newname, roomid)

    @deleteDevice: (device) ->
        # delete watches
        for whichwatch, idx in ["VariablesToSend", "VariablesToWatch"]
            for watch in MultiBox.getWatches(whichwatch, (w) -> w.deviceid == device.altuiid)
                MultiBox.delWatch(watch)
        @_execWithId device, (c,id) -> c.deleteDevice(id)

    @getDevices: (func, filterfunc, endfunc) ->
        arr = []
        answers = 0
        for c, i in @controllers
            c.controller.getDevices func, filterfunc, (devices) ->
                arr = arr.concat(devices)
                answers++
                if answers == @controllers.length and $.isFunction endfunc
                    endfunc(arr)
        return arr

    @getDevicesSync: () ->
        @_union (c) -> c.getDevicesSync()


    @getDeviceBatteryLevel: (device) ->
        @_exec device, (c) -> c.getDeviceBatteryLevel(device)

    @getDeviceByAltuiID: (devid) ->
        @_execWithId devid, (c,id) -> getDeviceByID(id) 

    @getDeviceByID: (controllerid, devid) ->
        if not @controllers[controllerid]?
            null
        else
            @controllers[controllerid].controller.getDeviceByID(devid)

    @getDeviceByAltID: (controllerid, parentdevid, altid) ->
        id = controllerid or 0
        @controllers[id].controller.getDeviceByAltID(parentdevid, altid)

    @getDeviceByType: (str) ->
        @controllers[0].controller.getDeviceByType(str)

    @getDeviceActions: (device, cbfunc) ->
        if not device?
            cbfunc([])
            return []
        else
            return @_exec device, (c) -> c.getDeviceActions(device, cbfunc)

    @getDeviceEvents: (device) ->
        @_exec device, (c) -> c.getDeviceEvents(device)

    @getDeviceDependants: (device) ->
        @_exec device, (c) -> c.getDeviceDependants(device)

    @getDeviceVariableHistory: (device, varidx, cbfunc) ->
        @_exec device, (c) -> c.getDeviceVariableHistory(device, varidx, cbfunc)

    @delWatch: (w) ->
        w = $.extend {
                scene:-1
                expression:'true'
                xml: ''
                provider: ''
            }, w
        @controllers['0'].controller.delWatch(w)

    @addWatch: (w) ->
        w = $.extend {
                scene:-1
                expression:'true'
                xml: ''
                provider: ''
            }, w
        @controllers['0'].controller.addWatch(w)

    @getWatches: (whichwatches, filterfunc) ->
        if whichwatches not in ["VariablesToWatch", "VariablesToSend"]
            return null
        @controllers['0'].controller.getWatches(whichwatches, filterfunc)

    @getStatesByAltuiID: (altuiid) ->
        @_execWithId altuiid, (c,id) -> c.getStates(id)

    @getStateByID: (altuiid, id) ->
        id = parseInt(id)
        states =  @getStatesByAltuiID(altuiid)
        for state, idx in states
            if state.id == id
                return state
        return null

    @getStates: (device) ->
        @_execWithId device, (c,id) -> c.getStates(id)

    @getStatus: (device, service, variable) ->
        @_execWithId device, (c,id) -> c.getStatus(id, service, variable)

    @setStatus: (device, service, variable, value, dynamic) ->
        @_execWithId device, (c,id) -> c.setStatus(id, service, variable, value, dynamic)

    @getJobStatus: (controllerid, jobid, cbfunc) ->
        if not @controllers[controllerid]?
            @controllers[controllerid].controller.getJobStatus(jobid, cbfunc)

    @runAction: (device, service, action, params, cbfunc) ->
        @_execWithId device, (c,id) -> c.getUPnPHelper().UPnPAction(id, service, action, params, cbfunc)

    @runActionByAltuiID: (altuiid, service, action, params, cbfunc) ->
        @_execWithId altuiid, (c,id) -> c.getUPnPHelper().UPnPAction(id, service, action, params, cbfunc)

    @setAttr: (device, attribute, value, cbfunc) ->
        @_execWithId device, (c,id) -> c.setAttr(id, attribute, value, cbfunc)

    @isDeviceZwave: (device) ->
        @_exec device, (c) -> c.isDeviceZwave(device)

    @updateNeighbors: (device) ->
        @_execWithId device, (c,id) -> c.updateNeighbors(id)

    @setColor: (device, hex) ->
        @_execWithId device, (c,id) -> c.setColor(id,hex)

    @getCategories: (cbfunc, filterfunc, endfunc) ->
        dfd = $.Deferred()
        arr = []
        answers = 0
        for c, idx in @controllers
            index = idx
            c.controller.getCategories (idx, cat) ->
                index = arr.length
                if $.inArray(cat.name, $.map(arr, ((e) -> e.name)) == -1)
                    arr.push(cat)
            , filterfunc
            , (categories) ->
                answers++
                if answers == @controllers.length
                    arr2 = arr.sort(altuiSortByName)
                    if $.isFunction cbfunc
                        $.each(arr2, cbfunc)

                    if $.isFunction endfunc
                        endfunc(arr2)

                    dfd.resolve(categories)

        return dfd.promise()

    @getCategoryTitle: (catnum) ->
        # returns (found !=undefined) ? found : '';
        @controllers[0].controller.getCategoryTitle(catnum)

    @evaluateConditions: (device, devsubcat, conditions) ->
        @_execWithId device, (c,id) -> c.evaluateConditions(id,devsubcat,conditions)

        
    @getWeatherSettings: () ->
        @controllers[0].controller.getWeatherSettings()

    @reloadEngine: (controllerid) ->
        id = controllerid or 0
        @controllers[id].controller.reloadEngine()

    @reboot: (controllerid) ->
        id = controllerid or 0
        @controllers[id].controller.reboot()

    @deleteScene: (scene) ->
        elems = scene.altuiid.split('-')
        # delete watches
        for watch in MultiBox.getWatches("VariablesToWatch", 
                                        ((w) -> elems[0]==0 and w.sceneid == elems[1]))
            MultiBox.delWatch(watch)
        @_execWithId scene, (c,id) -> c.deleteScene(id)

    @getNewSceneID: (controllerid) ->
        id = controllerid or 0
        newid = @controllers[i].controller.getNewSceneID()
        return {
            id: newid
            altuiid: "#{controllerid}-#{newid}"
        }

    @getScenes: (func, filterfunc, endfunc) ->
        arr = []
        answers = 0
        for c,i in @controllers
            c.controller.getScene func, filterFunc, (scenes) ->
                arr = arr.concat(scenes)
                answers++
                if answers == @controllers.length and $.isFunction endfunc
                    endfunc(arr)
        return arr

    @getScenesSync: () ->
        @_union (c) -> c.getScenesSync()

    @getSceneByID: (controllerid, sceneid) ->
        if not @controllers[controllerid]?
            return null
        else
            @controllers[controllerid].controller.getSceneByID(sceneid)

    @getSceneByAltuiID: (altuiid) ->
        @_execWithId altuiid, (c,id) -> c.getSceneByID(id)

    @getSceneHistory: (scene, cbfunc) ->
        @_execWithId scene, (c,id) -> c.getSceneHistory(id, cbfunc)

    @editScene: (altuiid, scenejson, cbfunc) ->
        @_execWithId altuiid, (c,id) -> c.editScene(id, scenejson, cbfunc)

    @renameScene: (scene, newname) ->
        @_execWithId scene, (c,id) -> c.renameScene(id, newname)

    @runScene: (scene) ->
        @_execWithId scene, (c,id) -> c.runScene(id)

    @runSceneByAltuiID: (altuiid) -> @runScene(altuiid)

    @runLua: (controllerid, code, cbfunc) ->
        id = controllerid or 0
        @controllers[id].controller.runLua(code, cbfunc)

    @getLuaStartup: (controllerid) ->
        id = controllerid or 0
        @controllers[id].controller.getLuaStartup()

    @setStartupCode: (controllerid, code) ->
        id = controllerid or 0
        if id == 0
            return @controllers[id].controller.setStartupCode(code)
        else
            dfd = $.Deferred()
            dfd.reject()
            return dfd.promise()

    @saveChangeCaches: (controllerid, msgidx) ->
        id = controllerid or 0
        @controllers[id].controller.saveChangeCaches(msgidx)

    @updateChangeCache: (controllerid, target) ->
        id = controllerid or 0
        @controllers[id].controller.saveChangeCaches(msgidx)

    @saveData: (name, data, cbfunc) ->
        @controllers[0].controller.saveData(name, data, cbfunc)

    @getPlugins: (func, endfunc) ->
        arr = @_union (c) -> c.getPlugins(func, null)
        if $.isFunction(endfunc)
            endfunc(arr)
        return arr

    @deletePlugin: (altuiid, cbfunc) ->
        @_execWithId altuiid, (c, id) -> 
            c.getUPnPHelper().UPnPDeletePlugin(id, cbfunc)

    @updatePlugin: (altuiid, cbfunc) ->
        @_execWitId altuiid, (c,id) ->
            c.getUPnPHelper().UPnPUpdatePlugin(id, cbfunc)

    @updatePluginVersion: (altuiid, ver, cbfunc) ->
        @_execWithId aluiid, (c, id) ->
            c.getUPnPHelper().UPnPUpdatePluginVersion(id, ver, cbfunc)

    @getFileContent: (controllerid, filename, cbfunc) ->
        id = controllerid or 0
        @controllers[id].controller.getUPnPHelper().UPnPGetFile(filename, cbfunc)

    @osCommand: (controllerid, cmd, cbfunc) ->
        id = controllerid or 0
        @controllers[id].controller.osCommand(cmd, cbfunc)

    @getPower: (cbfunc) ->
        lines = []
        todo = @controllers.length
        for c, idx in @controllers
            c.controller.getPower (data) ->
                if data != "No devices"
                    for line, i in data.split('\n')
                        if line.length > 0
                            lines.push("#{idx}-#{line}")
                todo--
                if todo == 0 and $.isFunction(cbfunc)
                    cbfunc(lines.join('\n'))

    @resetPollCounters: () ->
        dfd = $.Deferred()
        todo = @controllers.length
        for c, i in @controllers
            c.controller.resetPollCounters () ->
                todo--
                if todo == 0
                    dfd.resolve()

        dfd.promise()

    @isUserDataCaches: (controllerid) ->
        id = controllerid or 0
        @controllers[id].controller.isUserDataCached()

    @getIconPath: (controllerid, iconname) ->
        id = controller or 0
        @controllers[id].controller.getIconPath(iconname)

    @getIcon: (controllerid, imgpath, cbfunc) ->
        id = controllerid or 0
        @controllers[id].controller.getIcon(imgpath, cbfunc)

    @triggerAltUIUpgrade: (urlsuffix, newrev) ->
        @controllers[0].controller.triggerAltUIUpgrade(urlsuffix, newrev)

    @buildUPnPGetFileUrl: (altuiid, name) ->
        @_exec altuiid, (c) -> c.getUPnPHelper().buildUPnPGetFileUrl(name)

    @isRemoteAccess: () -> window.location.href.indexOf("mios.com")!= -1
    @getBoxInfo: () -> @controllers[0].controller.getBoxInfo()
    @getBoxFullInfo: () -> @controllers[0].controller.getBoxFullInfo()
    @getHouseMode: (cb) -> @controllers[0].controller.getHouseMode(cb)

    @setOnOff: (altuiid, onoff) ->
        MultiBox.runActionByAltuiID(altuiid, 
                                    'urn:upnp-org:serviceId:SwitchPower1', 
                                    'SetTarget', 
                                    {'newTargetValue':onoff})
    
    @setArm: (altuiid, armed) ->
        @runActionByAltuiID(altuiid,
                            'urn:micasaverde-com:serviceId:SecuritySensor1', 
                            'SetArmed', 
                            {'newArmedValue':armed})

    @setDoorLock: (altuiid, armed) ->
        @runActionByAltuiID(altuiid,
                            'urn:micasaverde-com:serviceId:DoorLock1', 
                            'SetTarget', 
                            {'newTargerValue':armed})

        
































    


            
