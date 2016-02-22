## sourceURL=J_ALTUI_plugins.js

# This program is free software: you can redistribute it and/or modify
# it under the condition that it is for private or home useage and 
# this whole comment is reproduced in the source code file.
# Commercial utilisation is not authorized without the appropriate
# written agreement from amg0 / alexis . mermet @ gmail . com
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 


# job_None=-1, // no icon
# job_WaitingToStart=0, // gray icon
# job_InProgress=1, // blue icon
# job_Error=2, // red icon
# job_Aborted=3, // red icon
# job_Done=4, // green icon
# job_WaitingForCallback=5 // blue icon - Special case used in certain derived classes

class ALTUI_PluginDisplays
    @getStyle: () -> """
.altui-watts, .altui-volts, .altui-dimmable, .altui-countdown  {font-size: 16px;}
.altui-temperature  {font-size: 16px;}
.altui-temperature-heater  {font-size: 12px;}
.altui-temperature-minor  {font-size: 8px;}
.altui-humidity, .altui-light  {font-size: 18px;}
.altui-motion {font-size: 22px;}
.altui-keypad-status {font-size: 14px;}
.altui-weather-text, .altui-lasttrip-text, .altui-vswitch-text {font-size: 11px;}
.altui-red , .btn.altui-red { color:red;}
.altui-blue, .btn.altui-blue { color:blue;}
.altui-orange { color:darkorange;}
.altui-magenta { color:magenta;}
.altui-multiswitch-container { position:absolute; left:58px; right:16px; } .altui-multiswitch-container .row { padding-top:1px; padding-bottom:1px; margin-left:0px; margin-right:0px;} .altui-multiswitch-container .col-xs-3 { padding-left:1px; padding-right:1px; }  .altui-multiswitch-open { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left:0px; padding-right:0px; margin-left:0px; margin-right:0px; width: 100%; max-width: 100% }
.altui-heater-container { position:absolute; left:71px; right:16px; } .altui-heater-container .row { padding-top:1px; padding-bottom:1px; margin-left:0px; margin-right:0px;} .altui-heater-container .col-xs-3 { padding-left:1px; padding-right:1px; text-align:center;}  .altui-heater-btn { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left:0px; padding-right:0px; margin-left:0px; margin-right:0px; width: 100%; max-width: 100% }
.altui-heater-container select.input-sm { height:22px; padding:0;} 
.altui-cyan { color:cyan;}
.altui-dimmable-slider { margin-left: 60px; margin-right: 70px;}    
.altui-colorpicker { margin-top: 2px; width:30px; margin-right: 15px; } 
.altui-infoviewer-log-btn,.altui-infoviewer-btn,.altui-window-btn,.altui-datamine-open { margin-top: 10px; }    
.altui-infoviewer-pattern { font-size: 14px; }  
div.altui-windowcover button.btn-sm { width: 4em; }
.altui-sonos-text, .altui-combsw-text, .altui-sysmon-text, .altui-veraalerts-text {font-size: 11px;}
.altui-multistring-text-div { margin-top: 2px; height: 48px; overflow: hidden; }"
.altui-multistring-text-some { font-size: 11px; }
.altui-multistring-text-all { font-size: 7px; }
.altui-multistring-text-1, .altui-multistring-text-2 { }
.altui-upnpproxy-text { font-size: 11px; margin-left: 2px; margin-top: 22px; }
.altui-plts-btn-div { margin-top: 4px; height: 48px; overflow:hidden; } .altui-plts-btn { width: 50px; font-size: 11px; line-height: 1.5; } .altui-plts-btn-on { color: white; background-color: #006C44; } .altui-plts-btn-on:hover, .altui-plts-btn-on:focus, .altui-plts-btn-on:active, .altui-plts-btn-on:active:focus, .altui-plts-btn-on.active:focus { color: white; background-color: #006C44; outline: 0 none; box-shadow: none; } .altui-plts-time-text-div { float: left; margin-left: 6px; margin-top: 5px; font-size: 9px; overflow: hidden; }
"""

    @_isBusySatus: (device) -> device.status? and device.status not in [-1,2,4]

    @createOnOffButton: (onoff, id, csvlabel, extracls) ->
        str =  csvlabel.split(',')
        css = ""
        onoff = onoff or 0
        if onoff > 0 then onoff = 1
        switch onoff
            when null or false  or "0" or 0 
                str = str[0]
                css = ""
            when true or "1" or 1
                str = str[1]
                css = "checked"
            else
                str = ""
                css = "spinner"

        return """
 <div class='altui-button-onoff #{extracls or ''}'>
 <div id='#{id}' class='onoffswitch'>
     <input type='checkbox' name='onoffswitch' class='onoffswitch-checkbox'  #{css}>
     <label class='onoffswitch-label' for='myonoffswitch'>
         <span class='onoffswitch-inner'></span>
         <span class='onoffswitch-switch'></span>
     </label>
 </div>
 <div class='altui-button-stateLabel'>#{str}</div>
 </div>
 """

    @_toggleButton: (altuiid, htmlselector, service, variable, cbfunc) ->
        device = MultiBox.getDeviceByAltuiID(altuiid)
        status = MultiBox.getStatus(device, service, variable)
        if $.isNumeric(status)
            status = parseInt(status)
            if status > 0 then status = 1 # special case of dimmer
            $(htmlselector).find("input").prop("checked", (status==0)) # invert
            cbfunc(device 1-status)

    @_drawCamera: (device) ->
        video = (MyLocalStorage.getSettings('ShowVideoThumbnail') or 0) == 1
        urlHead = MultiBox.getUrlHead(device.altuiid)
        if MultiBox.isRemoteAccess() or (video == false)
            img = $("<img class='altui-camera-picture'></img>")
                .attr('src', "#{urlHead}?"+$.params {
                                            id:'request_image'
                                            res:'low'
                                            cam:device.id
                                            t:new Date().getTime()
                                        })
                .height(50)
                .width(66)
            return img.wrap("<div></div>").parent().html()
        else
            streamurl = "url(http://#{device.ip}#{MultiBox.getStatus(device, 'urn:micasaverde-com:serviceId:Camera1', 'DirectStreamingURL')}"
            div = $("<div class='altui-camera-picture'></div>")
                .css({
                    "background-image": streamurl
                    "background-size": "cover"
                    "margin-left": 55
                    "margin-top": 1
                })
                .height(50)
                .width(50)
            return div.wrap("<div></div>").parent().html()

    @_drawVswitch: (device) ->
        status = parseInt(MultiBox.getStatus(device, 'urn:upnp-org:serviceId:VSwitch1', 'Status'))
        html = ALTUI_PluginDisplays.createOnOffButton(status, 
                                                      "altui-vswitch-#{device.altuiid}", 
                                                      _T("OFF","ON"), 
                                                      'pull-right')
        for v, i in ['Text1', 'Text2']
            dl1 = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:VSwitch1', v)
            if dl1?
                html += $("<div class='altui-vswitch-text'></div>")
                    .text(dl1)
                    .wrap("<div></div>")
                    .parent()
                    .html()
        html += """
<script type='text/javascript'>";
        $('div#altui-vswitch-#{device.altuiid}').on('click touchend', function() { 
                ALTUI_PluginDisplays.toggleVswitch('#{device.altuiid}',
                                                   'div#altui-vswitch-#{device.altuiid}'); 
        });
</script>";
"""
        return html

    @_drawTempSensor: (device) ->
        ws = MultiBox.getWeatherSettings()
        if not ws.tempFormat? then ws.tempFormat = ''

        status = parseFloat(MultiBox.getStatus(device,
                                                'urn:upnp-org:serviceId:TemperatureSensor1',
                                                'CurrentTemerature'))
        "<span class='altui-temperature'>#{status}&deg;#{ws.tempFormat}</span>"

    @_internaldrawZoneThermostat: (device, 
                                   userOperatingMode1Items,
                                   userHVACFanOperatingMode1Items,
                                   isHeader) ->
        _button = (altuiid, colorclass, glyph, service, action, name, value, incr) ->
            """<button type='button' 
                        style='width:50%;' 
                        class='altui-heater-btn altui-setpointcontrol-#{altuiid} #{colorclass} btn bt-default btn-xs'
                        data-service='#{service}'
                        data-action='#{action}'
                        data-name='#{name}'
                        data-value='#{value}'
                        data-incr='#{incr}'>#{glyph}</button>"""

        _temperature = (temp, format, deftxt) ->
            if temp? then parseFloat(curTemp).toFixed(1)+"&deg;"+ws.tempFormat else deftxt

        HVAC_INCREMENT = 0.5
        controller = MultiBox.controllerOf(device.altuiid).controller
        isUI5 = MultiBox.isUI5(controller)
        ws = MultiBox.getWeatherSettings()
        if not ws.tempFormat? then ws.tempFormat = ""

        modeStatus = MultiBox.getStatus(device, 
                                        'urn:upnp-org:serviceId:HVAC_UserOperatingMode1', 
                                        'ModeStatus')
        modeFan = MultiBox.getStatus(device, 
                                     'urn:upnp-org:serviceId:HVAC_FanOperatingMode1',
                                     'Mode')
        curTemp = MultiBox.getStatus(device, 
                                     'urn:upnp-org:serviceId:TemperatureSensor1',
                                     'CurrentTemperature') 
        allsetpoints = MultiBox.getStatus(device, 
                                          'urn:upnp-org:serviceId:TemperatureSetpoint1',
                                          'AllSetpoints')
        heatsetpoint_current = MultiBox.getStatus(device, 
                                                  'urn:upnp-org:serviceId:TemperatureSetpoint1_Heat',
                                                  'CurrentSetpoint')
        heatsetpoint_target = MultiBox.getStatus(device, 
                                                 'urn:upnp-org:serviceId:TemperatureSetpoint1_Heat',
                                                 'SetpointTarget')
        coldsetpoint_current = MultiBox.getStatus(device, 
                                                  'urn:upnp-org:serviceId:TemperatureSetpoint1_Cool',
                                                  'CurrentSetpoint')
        coldsetpoint_target = MultiBox.getStatus(device, 
                                                 'urn:upnp-org:serviceId:TemperatureSetpoint1_Cool',
                                                 'SetpointTarget')

        autosetpoint = null
        currentmodesetpoint = null
        currentmodesetpoint_target = null
        bNewControl = (isUI5==false) and (isNullOrEmpty(allsetpoints)==false)
        if bNewControl
            bNewControl = (MyLocalStorage.getSettings('UseUI7Heater')==1)

        if bNewControl
            AltuiDebug.debug("Using new form of heater as AllSetpoints is not empty: #{allsetpoints}")
            splits = allsetpoints.split(',')
            heatsetpoint_current = splits[0] or ""
            coldsetpoint_current = splits[1] or ""
            autosetpoint = splits[2] or ""
            currentmodesetpoint = 
                MultiBox.getStatus(device,
                                   'urn:upnp-org:serviceId:TemperatureSetpoint1', 
                                   'CurrentSetpoint')
            currentmodesetpoint_target = 
                MultiBox.getStatus(device, 
                                   'urn:upnp-org:serviceId:TemperatureSetpoint1', 
                                   'SetpointTarget')

        html = """
<div class='altui-heater-container pull-right'>
    <div class='row'>
        <div class='col-xs-3'>
            <span class='altui-temperature' >
                #{_temperature(curTemp, ws.tempFormat, '--')}
            </span>
        </div>
    <div class='col-xs-3'>
        """
        heatsetpoint = heatsetpoint_target or
            parseFloat($("#altui-heatsetpoint-#{device.altuiid}").text()) or
            heatsetpoint_current
        if heatsetpoint?
            html += """
            <span 
             class='altui-temperature-minor altui-red pull-left' 
             id='altui-heatsetpoint-current-#{device.altuiid}'>
                #{_temperature(heatsetpoint_current,ws.tempFormat, '')}
            </span>
            <span 
             class='altui-temperature-minor altui-red pull-right' 
             id='altui-heatsetpoint-target-#{device.altuiid}'>
                #{_temperature(heatsetpoint_target,ws.tempFormat, '')}
            </span>
            <span 
             class='altui-temperature-heater altui-red' 
             id='altui-heatsetpoint-#{device.altuiid}'>
                #{_temperature(heatsetpoint, ws.tempFormat, '')}
            </span>
        """
        html += """
        </div>
        <div class='col-xs-3'>
        """
        coldsetpoint = coldsetpoint_target or
            parseFloat($("#altui-coldsetpoint-#{device.altuiid}").text()) or
            coldsetpoint_current
        if not isHeater and coldsetpoint?
            html += """
            <span 
             class='altui-temperature-minor altui-blue pull-left' 
             id='altui-coldsetpoint-current-#{device.altuiid}'>
                #{_temperature(coldsetpoint_current,ws.tempFormat, '')}
            </span>
            <span 
             class='altui-temperature-minor altui-blue pull-right' 
             id='altui-coldsetpoint-target-#{device.altuiid}'>
                #{_temperature(coldsetpoint_target,ws.tempFormat, '')}
            </span>
            <span 
             class='altui-temperature-heater altui-blue' 
             id='altui-coldsetpoint-#{device.altuiid}'>
                #{_temperature(coldsetpoint, ws.tempFormat, '')}
            </span>
        """
        html += """
        </div>
        <div class='col-xs-3'>
        """
        if autosetpoint?
            html += """
            <span 
             class='altui-temperature-heater' 
             id='altui-autosetpoint-#{device.altuiid}'>
                #{_temperature(autosetpoint,ws.tempFormat,'')}
            </span>
        """

        html += """
        </div>
    </div>
    <div class='row'>
        <div class='col-xs-3'>
        """
        if userOperatingMode1Items.length > 0
            html += """
            <select 
             id='altui-heater-select-#{device.altuiid}' 
             class='altui-heater-select form-control input-sm'>
            """
            for item,idx in userOperatingMode1Items
                html += """
                <option 
                 data-service='#{item.service}' 
                 data-action='#{item.action}' 
                 data-name='#{item.name}' 
                 data-value='#{item.value}' 
                 #{if item.value == modeStatus then 'selected' else ''}>
                    #{item.label}
                </option>            
                """
            html += "</select>"
        html += """
        </div>
        <div class='col-xs-3'>
        """
        if not bNewControl # UI5
            html += _button(device.altuiid, 
                            "altui-red", 
                            upGlyph, 
                            "urn:upnp-org:serviceId:TemperatureSetpoint1_Heat",
                            "SetCurrentSetpoint",
                            "NewCurrentSetpoint",
                            "altui-heatsetpoint-#{device.altuiid}",
                            HVAC_INCREMENT)
            html += _button(device.altuiid, 
                            "altui-red", 
                            downGlyph, 
                            "urn:upnp-org:serviceId:TemperatureSetpoint1_Heat",
                            "SetCurrentSetpoint",
                            "NewCurrentSetpoint",
                            "altui-heatsetpoint-"+device.altuiid,
                            -HVAC_INCREMENT)
        else # UI7
            html += _button(device.altuiid, 
                            "", 
                            upGlyph, 
                            "urn:upnp-org:serviceId:TemperatureSetpoint1",
                            "SetCurrentSetpoint",
                            "NewCurrentSetpoint",
                            "altui-autosetpoint-#{device.altuiid}",
                            HVAC_INCREMENT)
        html += """
        </div>
        <div class='col-xs-3'>
        """
        if not bNewControl # UI5
            html += _button(device.altuiid, 
                            "altui-blue", 
                            upGlyph, 
                            "urn:upnp-org:serviceId:TemperatureSetpoint1_Cool",
                            "SetCurrentSetpoint",
                            "NewCurrentSetpoint",
                            "altui-coldsetpoint-#{device.altuiid}",
                            HVAC_INCREMENT)
            html += _button(device.altuiid, 
                            "altui-blue", 
                            downGlyph, 
                            "urn:upnp-org:serviceId:TemperatureSetpoint1_Cool",
                            "SetCurrentSetpoint",
                            "NewCurrentSetpoint",
                            "altui-coldsetpoint-"+device.altuiid,
                            -HVAC_INCREMENT)
        else # UI7
            html += _button(device.altuiid, 
                            "", 
                            downGlyph, 
                            "urn:upnp-org:serviceId:TemperatureSetpoint1",
                            "SetCurrentSetpoint",
                            "NewCurrentSetpoint",
                            "altui-autosetpoint-#{device.altuiid}",
                            -HVAC_INCREMENT)
        html += """
        </div>
        <div class='col-xs-3'>
        """
        if userHVACFanOperatingMode1Items.length > 0
            html += """
            <select 
             id='altui-heater-select-#{device.altuiid}' 
             class='altui-heater-select form-control input-sm'>
            """
            for item,idx in userHVACFanOperatingMode1Items
                html += """
                <option 
                 data-service='#{item.service}' 
                 data-action='#{item.action}' 
                 data-name='#{item.name}' 
                 data-value='#{item.value}' 
                 #{if item.value == modeFan then 'selected' else ''}>
                    #{item.label}
                 </option>       
                """
            html += """
            </select>
            """
        html += """
        </div>
    </div>
</div>
        """
        cls = "button.altui-setpointcontrol-#{device.altuiid}"

        $(".altui-mainpanel")
            .off('click',cls)
            .on 'click',cls,device.altuiid,(event) ->
                selected = $(this)
                service = $(selected).data('service')
                action = $(selected).data('action')
                name = $(selected).data('name')
                value = parseFloat($('#'+$(selected).data('value')).text())
                incr = $(selected).data('incr')
                $('#'+$(selected).data('value')).html( (value+incr).toFixed(1)+'&deg;')
                doItNow = (obj) ->
                    params = {}; params[obj.name]=obj.value
                    MultiBox.runActionByAltuiID(obj.altuiid, obj.service, obj.action, params)
                    console.log("timer doItNow() :" + JSON.stringify(obj))
                    $(obj.button).data("timer",null)
                timer = $(this).data("timer")
                if timer?
                    clearTimeout(timer);
                    console.log("clear Timeout(#{device.altuiid})".format(timer))
                timer = setTimeout doItNow, 1500, {
                        button: $(this),
                        altuiid: event.data,
                        name: name,
                        service: service,
                        action: action,
                        value: value+incr
                }
                console.log("set Timeout(#{timer})  params:#{value+incr}")
                $(this).data("timer",timer)
        html += """
<script type='text/javascript'>
    $('select#altui-heater-select-#{device.altuiid}').on('change', function() {
       var selected = $(this).find(':selected');                   
       var service = $(selected).data('service');                  
       var action = $(selected).data('action');                    
       var name = $(selected).data('name');                    
       var value = $(selected).data('value');                  
       var params = {}; params[name]=value;                
       MultiBox.runActionByAltuiID('#{device.altuiid}, service, action, params);
</script>
        """
        return html

    @_drawZoneThermostat: (device) ->
        S_UOM = "urn:upnp-org:serviceId:HVAC_UserOperatingMode1"
        userOperatingMode1Items = [
            {label:"Off", value:"Off", service:S_UOM, action:"SetModeTarget", name:"NewMode" },
            {label:"Auto", value:"AutoChangeOver", service:S_UOM, action:"SetModeTarget", name:"NewMode"},
            {label:"Cool", value:"CoolOn", service:S_UOM, action:"SetModeTarget", name:"NewMode"},
            {label:"Heat", value:"HeatOn", service:S_UOM, action:"SetModeTarget", name:"NewMode"}
        ]
        S_FOM = "urn:upnp-org:serviceId:HVAC_FanOperatingMode1"
        userHVACFanOperatingMode1Items = [
            {label:"Auto", value:"Auto", service:S_FOM, action:"SetMode" , name:"NewMode"},
            {label:"On", value:"ContinuousOn", service:S_FOM, action:"SetMode", name:"NewMode"},
            {label:"Cycle", value:"PeriodicOn", service:S_FOM, action:"SetMode", name:"NewMode"}
        ]
        return @_internaldrawZoneThermostat(device,
                                            userOperatingMode1Items,
                                            userHVACFanOperatingMode1Items,
                                            false)

    @_drawHeater: (device) ->
        S_UOM = "urn:upnp-org:serviceId:HVAC_UserOperatingMode1"
        userOperatingMode1Items = [
            {label:"Off", value:"Off", service:S_UOM, action:"SetModeTarget", name:"NewMode" },
            {label:"Heat", value:"HeatOn", service:S_UOM, action:"SetModeTarget", name:"NewMode"}
        ]
        userHVACFanOperatingMode1Items = [
        ]
        return @_internaldrawZoneThermostat(device,
                                            userOperatingMode1Items,
                                            userHVACFanOperatingMode1Items,
                                            false)

    @_drawHumidity: (device) ->
        value = parseInt(MultiBox.getStatus(device, 
                         'urn:micasaverde-com:serviceId:HumiditySensor1', 
                         'CurrentLevel'))
        """<span class='altui-humidity'>#{value}</span>"""

    @_drawLight: (device) ->
        value = parseInt(MultiBox.getStatus(device, 
                         'urn:micasaverde-com:serviceId:LightSensor1', 
                         'CurrentLevel'))
        """<span class='altui-light'>#{value} lux</span>"""

    @onClickWindowCoverButton: (e) ->
        # http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Up
        # http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Down
        # http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Stop
        altuiid = e.closest('.altui-device').data('altuiid')
        actionname = e.prop('id').substr("altui-window-".length)
        if actionname == "Stop"
            MultiBox.runActionByAltuiID(altuiid, 
                                        "urn:upnp-org:serviceId:WindowCovering1", 
                                        "Stop", 
                                        {})
        else   
            MultiBox.runActionByAltuiID(altuiid, 
                                        "urn:upnp-org:serviceId:Dimming1", 
                                        "SetLoadLevelTarget", 
                                        {newLoadlevelTarget: if actionname=="Up" then  100 else 0 
                                        })

    @_drawWindowCover: (device) ->
        # 0 - 100
        status = MultiBox.getStatus(device,
                                    "urn:upnp-org:serviceId:Dimming1",
                                    "LoadLevelStatus")
        """
<div class='pull-right'>
    <div 
     id='altui-wc-"+device.altuiid+"' 
     class='btn-group altui-windowcover' 
     role='group' 
     aria-label='...'>
        <button 
         id ='altui-window-Up' 
         type='button' 
         class='altui-window-btn btn btn-default btn-sm #{if status == 100 then 'active' else ''}'>
            #{_T("Up")}
        </button>
        <button 
         id ='altui-window-Stop' 
         type='button' 
         class='altui-window-btn btn btn-default btn-sm'>
            #{_T("Stop")}
        </button>"
        <button 
         id ='altui-window-Down' 
         type='button' 
         class='altui-window-btn btn btn-default btn-sm #{if status == 0 then 'active' else ''}>
            #{_T("Down")}
        </button>
    </div>
</div>
<script type='text/javascript'>
    $('div#altui-wc-#{device.altuiid} button').on('click touchend', function() { 
        ALTUI_PluginDisplays.onClickWindowCoverButton($(this)); 
    } );
</script>
        """

    @_onSliderChange: (event, ui) ->
        altuiid = $(ui.handle).closest(".altui-device").data("altuiid")
        MultiBox.runActionByAltuiID(altuiid, 
                                    "urn:upnp-org:serviceId:Dimming1", 
                                    "SetLoadLevelTarget", 
                                    {newLoadlevelTarget:ui.value})

    @_onColorPicker: (e, altuiid, color) ->
        device = MultiBox.getDeviceByAltuiID(altuiid)
        MultiBox.setColor(device,color.toHexString()) 
        currentColor = '0=0,1=0,2=#{parseInt(color._r)},3=#{parseInt(color._g)},4=#{parseInt(color._b)}'
        MultiBox.setStatus(device,'
                           urn:micasaverde-com:serviceId:Color1',
                           'CurrentColor',
                           currentColor)

    @_drawDimmable: (device, colorpicker) ->
        onebody = $(".altui-device-body:first")

        level = parseInt(MultiBox.getStatus(device, 
                                            'urn:upnp-org:serviceId:Dimming1', 
                                            'LoadLevelTarget'))
        if isNaN level
            level = parseInt(MultiBox.getStatus(device,
                                                'urn:upnp-org:serviceId:Dimming1', 
                                                'LoadLevelStatus'))

        html = """
<span id='slider-val-#{device.altuiid}' class='altui-dimmable'>
    #{level}%
</span>
        """

        # on off button
        status = parseInt(MultiBox.getStatus(device, 
                                            'urn:upnp-org:serviceId:SwitchPower1', 
                                            'Status' ))
        if _isBusyStatus(device)
            status = -1
      
        html += @createOnOffButton(status,
                                    "altui-onoffbtn-#{device.altuiid}",
                                    _T("OFF,ON"), 
                                    "pull-right")
        current = "#ffffff"
        if colorpicker
            # try Target then Current
            current = MultiBox.getStatus(device,
                                        'urn:micasaverde-com:serviceId:Color1',
                                        'TargetColor')
            if not current?
                current = MultiBox.getStatus(device,
                                             'urn:micasaverde-com:serviceId:Color1','
                                             CurrentColor')
            if current?
                parts = current.split(",") # 0=0,1=0,2=0,3=0,4=255
                current = rgbToHex(
                    parseInt(parts[2].substring(2)), 
                    parseInt(parts[3].substring(2)), 
                    parseInt(parts[4].substring(2))
                    )
            else
                current="#ffffff";
            html+= """
<div class='altui-colorpicker pull-right'>
    <input id='altui-colorpicker-#{device.altuiid}' value='#{current}'>
    </input>
</div>
            """

        # dimming
        html +=  """
 <div id='slider-#{device.altuiid}' class='altui-dimmable-slider'></div>
        """          
        
        # on off
        $('#altui-colorpicker-#{device.altuiid}').spectrum('destroy')
        html += """
<script type='text/javascript'>
    $('#altui-colorpicker-#{device.altuiid}').spectrum({
        color: '#{current}',
        preferredFormat: 'hex',
        replacerClassName: 'altui-colorpicker-replacer',
        show: function(color) {
            $(this).closest('.altui-device').toggleClass('altui-norefresh');
        },
        hide: function(color) { 
            $(this).closest('.altui-device').toggleClass('altui-norefresh');
        }
    });
    $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() { 
        ALTUI_PluginDisplays.toggleOnOffButton('#{device.altuiid}',
                                               'div#altui-onoffbtn-#{device.altuiid}'); 
    });
    $('div#slider-#{device.altuiid}.altui-dimmable-slider').slider({ 
        max:100,min:0,value:#{level},change:ALTUI_PluginDisplays.onSliderChange 
    });
        """
        if colorpicker # color picker 
            html += """
    $('div#slider-#{device.altuiid}.altui-dimmable-slider').css('margin-right','120px');
    $('input#altui-colorpicker-#{device.altuiid}').on('change', 
        function(e,color) {  
            ALTUI_PluginDisplays.onColorPicker(e,'#{device.altuiid}',color); });
        }
        """
        html += """
</script>
        """
        $(".altui-mainpanel")
            .off("slide","#slider-#{device.altuiid}")
            .on("slide","#slider-#{device.altuiid}", (event, ui) -> 
                $("#slider-val-#{device.altuiid}").text( ui.value+'%');
            )
        return html;      

    @_drawDimmableRGB: (device) -> @_drawDimmable(device, true)

    # return the html string inside the .panel-body of the .altui-device#id panel
    @_drawDoorLock: (device) ->
        status = MultiBox.getStatus(device, 
                                    'urn:micasaverde-com:serviceId:DoorLock1', 
                                    'Status')
        html = ""
        html += ALTUI_PluginDisplays.createOnOffButton(
                    status,
                    "altui-onoffbtn-#{device.altuiid}", 
                    _T("Unlock,Lock"), 
                    "pull-right")

        lasttrip = MultiBox.getStatus(device,
                                      'urn:micasaverde-com:serviceId:SecuritySensor1', 
                                      'LastTrip')
        if lasttrip?
            html += """
    <div class='altui-lasttrip-text text-muted'>
        #{timeGlyph} #{@_toIso(new Date(lasttrip*1000),' ')}
    </div>
            """
        html += """
    <script type='text/javascript'>
        $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() { 
            ALTUI_PluginDisplays.toggleDoorLock('#{device.altuiid}',
                                                'div#altui-onoffbtn-#{device.altuiid}'); 
        });
    </script>
        """
        return html

    @drawPLEG: (device) ->

    @drawDoorSensor: (device) -> @_drawMotion(device)
    @drawSmoke: (device) -> @_drawMotion(device)
    @drawFlood: (device) -> @_drawMotion(device)
    @drawGCal: (device) -> @_drawMotion(device)

    @drawCombinationSwitch: (device) ->
        S_COMBO = 'urn:futzle-com:serviceId:CombinationSwitch1'

        label = MultiBox.getStatus(device, S_COMBO, 'Label')

        html = """
<button 
 id='altui-pokebtn-#{device.altuiid}' 
 type='button' 
 class='pull-right altui-window-btn btn btn-default btn-sm '>
    #{_T("Poke")}
</button>
        """
        if label?
            html += """
<div class='altui-combsw-text text-muted'><br>Watched Items: #{label}</div>
            """
        html += """
<script type='text/javascript'>
    $('button#altui-pokebtn-#{device.altuiid}')
        .on('click', function() { 
            MultiBox.runActionByAltuiID('#{device.altuiid}', 
                                        '#{S_COMBO}', 
                                        'Trigger', 
                                        {}); 
        });
</script>";
        """
        return html

    @drawDayTime: (device) ->
        S_DAYTIME = 'urn:rts-services-com:serviceId:DayTime'

        status = parseInt(MultiBox.getStatus(device, S_DAYTIME, 'Status'))
    
        html = ""
        html += @createOnOffButton(status,
                                   "altui-onoffbtn-#{device.altuiid}", 
                                   _T("Night,Day") , 
                                   "pull-right")
        html += """"
<script type='text/javascript'>
    $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() { 
            ALTUI_PluginDisplays.toggleDayTimeButton(
                    '#{device.altuiid}',
                    'div#altui-onoffbtn-#{device.altuiid}'); 
    });
</script>
        """
        return html

    @drawSonos: (device) ->
        S_AVT = 'urn:upnp-org:serviceId:AVTransport'
        S_MNAV =  'urn:micasaverde-com:serviceId:MediaNavigation1'

        status = MultiBox.getStatus(device, S_AVT, 'TransportState')
        title = MultiBox.getStatus(device, S_AVT, 'CurrentTitle')

        playstatus = ""
        playtitle = ""
        playbtn = "Play"
        stopbtn = "Stop"
        playbtnstyle = ""
        stopbtnstyle = ""

        if title?
            switch status
                when "PLAYING"
                    playstatus = "Playing..."; playtitle = title; playbtn = "Pause"
                when "PAUSED_PLAYBACK"
                    playstatus = "<br>Paused...<br>Press Play to continue"
                when "STOPPED"
                    playstatus = "<br>Stopped"
                else
                    playstatus = ""

        html += """
<button 
 id='altui-Stopbtn-#{device.altuiid}' 
 type='button' 
 class='pull-right altui-window-btn btn btn-default btn-sm #{stopbtnstyle}'>
    #{_T(stopbtn)}
</button>
<button 
 id='altui-#{_T(playbtn)}btn-#{device.altuiid}' 
 type='button' 
 class='pull-right altui-window-btn btn btn-default btn-sm #{playbtnstyle}'>
    #{_T(playbtn)}
</button>
        """
        if title?
            html += """
<div class='altui-sonos-text text-muted' style='height: 48px; overflow: hidden'>
    #{playstatus}
    <br>#{playtitle}
</div>
            """
        html += """
<script type='text/javascript'>
    $('button#altui-Playbtn-#{device.altuiid}')
        .on('click', function() {
            MultiBox.runActionByAltuiID('#{device.altuiid}', 
                '#{S_MNAV}', 
                'Play', 
                {}); 
        } );
    $('button#altui-Pausebtn-#{device.altuiid}')
        .on('click', function() {
            MultiBox.runActionByAltuiID('#{device.altuiid}', 
                '#{S_MNAV}', 
                'Pause',
                 {});
            });
    $('button#altui-Stopbtn-#{device.altuiid}')
        .on('click', function() {
            MultiBox.runActionByAltuiID('#{device.altuiid}', 
                '#{S_MNAV}', 
                'Stop', 
                {}); 
        });
</script>
        """

    @drawSysMonitor: (device) ->
        S_MONITOR = 'urn:cd-jackson-com:serviceId:SystemMonitor'

        memoryavail = MultiBox.getStatus(device, S_MONITOR, 'memoryAvailable')
        cpuload = MultiBox.getStatus(device, S_MONITOR, 'cpuLoad5')
        if memoryavail? and cpuload?
            """
<div class='altui-sysmon-text text-muted'>
    <br>Memory Available: #{memoryavail}
    <br>CPU Load (5 minute): #{cpuload}
</div>
            """
        else
            ""

    @drawVeraAlerts: (device) ->
        S_ALERT = 'urn:richardgreen:serviceId:VeraAlert1'

        lastmsgsent = MultiBox.getStatus(device, S_ALERT, 'LastMsgSent')
        lastrecipient = MultiBox.getStatus(device, S_ALERT, 'LastRecipient')
        if lastmsgsent? and lastrecipient?
            """
<div class='altui-sysmon-text text-muted' style='padding-left: 52px'>
    <br>Last Msg Sent: #{lastmsgsent}
    <br>Profile Used: #{lastrecipient}
</div>
            """
        else
            ""

    @drawMultiString: (device) ->
        sAll = _T("All")
        sMore = _T("More")
        sLess = _T("Less")

        MLS_SETTING = "MULTISTRINGUISTATE#{device.altuiid}"
        S_VCONT = 'urn:upnp-org:serviceId:VContainer1'

        if not $("button#altui-morebtn-#{device.altuiid}").html()?
            MyLocalStorage.setSettings MLS_SETTING, { devicestate: 0 }
        state = MyLocalStorage.getSettings(MLS_SETTING)
        display = if state? then state['devicestate'] else 0

        html = ""
        html += """
     <div class='btn-group pull-right'>
        <button 
         id='altui-allbtn-#{device.altuiid}' 
         type='button' 
         class='altui-window-btn btn btn-default btn-xs'>
            #{sAll}
        </button>
        <button 
         id='altui-morebtn-#{device.altuiid}' 
         type='button' 
         class='altui-window-btn btn btn-default btn-xs'>
            #{if display != 2 then sMore else sLess}
        </button>
     </div>
     <div class='altui-multistring-text-div'>
        """
        for v in [1..5]
            label = MultiBox.getStatus(device, S_VCONT, "VariableName#{v}")
            value = MultiBox.getStatus(device, S_VCONT, "Variable#{v}")
            style = ""
            if display != 2
                textCls = 'altui-multistring-text-some'
            else
                textCls = 'altui-multistring-text-all'
            if v <= 3
                style = "class='#{textCls} altui-multistring-text-1 text-muted'"
            else
                style = "class='#{textCls} altui-multstring-text-2 text-muted'"
                if display != 2
                    style += " style='display: none;'"
            if label? and value?
                html += $("<div #{style}></div>")
                            .text("#{label}:#{value}")
                            .wrap("<div></div>")
                            .parent()
                            .html()
            html += """
    </div>
    <script type='text/javascript'>
        state = MyLocalStorage.getSettings('#{MLS_SETTING}');
        if (state['devicestate'] == 1) { 
            $('.altui-multistring-text-1').toggle(); 
            $('.altui-multistring-text-2').toggle(); 
        }
        $('button#altui-allbtn-#{device.altuiid}').on('click', function() { 
            $('.altui-multistring-text-some')
                .removeClass('altui-multistring-text-some')
                .addClass('altui-multistring-text-all')
                .show();
            $('#altui-morebtn-#{device.altuiid}').html('#{sLess}'); 
            state['devicestate'] = 2; 
            MyLocalStorage.setSettings('#{MLS_SETTING}', state); 
        });
        $('button#altui-morebtn-#{device.altuiid}')
            .on('click', function() { 
                if ($(this).html() == '#{sLess}') { 
                    $('.altui-multistring-text-all')
                        .removeClass('altui-multistring-text-all')
                        .addClass('altui-multistring-text-some'); 
                    $('.altui-multistring-text-2').hide(); 
                    $('#altui-morebtn-#{device.altuiid}').html('#{sMore}'); 
                    state['devicestate'] = 0; 
                    MyLocalStorage.setSettings('MULTISTRINGUISTATE#{device.altuiid}', state); 
                } else { 
                    $('.altui-multistring-text-1').toggle(); 
                    $('.altui-multistring-text-2').toggle(); 
                    state['devicestate'] = state['devicestate'] == 0 ? 1 : 0; 
                    MyLocalStorage.setSettings('#{MLS_SETTING}', state); 
                } });
    </script>
            """


    @drawPnPProxy: (device) ->
        status = MultiBox.getStatus(device, 
                                    'urn:futzle-com:serviceId:UPnPProxy1', 
                                    'StatusText')
        if status?
            "<div class='altui-upnpproxy-text text-muted'>Status: #{status}</div>"
        else
            ""

    @drawProgLogicTimerSwitch: (device) ->
        S_PLTS = 'urn:rts-services-com:serviceId:ProgramLogicTS'
        html = ""
        onoff = MultiBox.getStatus(device, S_PLTS, 'Status');
        armed = MultiBox.getStatus(device, S_PLTS, 'Armed');
        state = MultiBox.getStatus(device, S_PLTS, 'State');
        rtime = MultiBox.getStatus(device, S_PLTS, 'TimeRemaining');

        html += """
<div class='pull-right altui-plts-btn-div'>";
 <div class='btn-group'>";
  <button id='altui-armbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>#{playbtnstyle}</button>".format(device.altuiid, _T("Arm"), armed==1?'btn-info':'');
  <button id='altui-bypassbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>#{playbtnstyle}</button>".format(device.altuiid, _T("Bypass"), armed==0?'btn-info':'');
  <button id='altui-triggerbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs'>#{playbtnstyle}</button>".format(device.altuiid, _T("Trigger"));
  <button id='altui-restartbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs'>#{playbtnstyle}</button>".format(device.altuiid, _T("Restart"));
 </div><br>
 <div class='btn-group'>
  <button id='altui-onbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>#{playbtnstyle}</button>".format(device.altuiid, _T("On"), onoff==1?'btn-info':'');
  <button id='altui-offbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>#{playbtnstyle}</button>".format(device.altuiid, _T("Off"), onoff==0?'btn-info':'');
  <button id='altui-resetbtn-#{device.altuiid}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>#{playbtnstyle}</button>".format(device.altuiid, _T("Reset"), state==0?'btn-info':'');
        """    
        if state == 3 and rtime?
            h = '00' 
            m = '00'
            s = '00'
            hms = rtime.split(':')
            if hms.length == 3
                h = hms[0]; m = hms[1]; s = hms[2] 
            else if hms.length == 2
                m = hms[0]; s = hms[1]
            else 
                s = hms[0] 
            html += """
<div id='altui-plts-rtime' class='altui-plts-time-text-div text-muted'>
    #{h}:#{m}:#{s}
</div>
            """
        html += """
 </div>";
</div>";
<script type='text/javascript'>";
 function resizepltbtn() { var w = $('div.altui-device-body').width(); w=w<250?(w-50)/4:50; $('button.altui-plts-btn').css('width', w); $('#altui-plts-rtime').css('width', w-8).css('overflow', 'hidden'); }; resizepltbtn();";
 $(window).resize(function(){ resizepltbtn(); });"
 $('button#altui-restartbtn-#{device.altuiid}').on('click', function() { var device = MultiBox.getDeviceByAltuiID('#{device.altuiid}'); var state = MultiBox.getStatus(device, 'urn:rts-services-com:serviceId:ProgramLogicTS', 'State'); if (state==3) { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetState',{'newStateValue':'2'}); $('button#altui-restartbtn-#{device.altuiid}').addClass('btn-info'); } });".format(device.altuiid);
 $('button#altui-triggerbtn-#{device.altuiid}').on('click', function() { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetState',{'newStateValue':'1'}); $('button#altui-triggerbtn-#{device.altuiid}').addClass('btn-info'); });".format(device.altuiid);
 $('button#altui-bypassbtn-#{device.altuiid}').on('click', function() { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetArmed',{'newArmedValue':'0'}); $('button#altui-bypassbtn-#{device.altuiid}').addClass('btn-info'); $('button#altui-armbtn-#{device.altuiid}').removeClass('btn-info'); });".format(device.altuiid);
 $('button#altui-armbtn-#{device.altuiid}').on('click', function() { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetArmed',{'newArmedValue':'1'}); $('button#altui-armbtn-#{device.altuiid}').addClass('btn-info'); $('button#altui-bypassbtn-#{device.altuiid}').removeClass('btn-info'); });".format(device.altuiid);
 $('button#altui-resetbtn-#{device.altuiid}').on('click', function() { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetState',{'newStateValue':'0'}); $('button#altui-resetbtn-#{device.altuiid}').addClass('btn-info'); });".format(device.altuiid);
 $('button#altui-offbtn-#{device.altuiid}').on('click', function() { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetTarget',{'newTargetValue':'0'}); $('button#altui-offbtn-#{device.altuiid}').addClass('btn-info'); $('button#altui-onbtn-#{device.altuiid}').removeClass('btn-info'); });".format(device.altuiid);
 $('button#altui-onbtn-#{device.altuiid}').on('click', function() { MultiBox.runActionByAltuiID('#{device.altuiid}','urn:rts-services-com:serviceId:ProgramLogicTS','SetTarget',{'newTargetValue':'1'}); $('button#altui-onbtn-#{device.altuiid}').addClass('btn-info'); $('button#altui-offbtn-#{device.altuiid}').removeClass('btn-info'); });".format(device.altuiid);
</script>
        """
        return html



    @drawMySensors: (device) ->
        S_ARD = 'urn:upnp-arduino-cc:serviceId:arduino1'
        
        including = MultiBox.getStatus(device, S_ARD, 'InclusionMode')
        activeFlag = if including then 'active' else ''
        """
 <div class='text-muted'>
    Press Start to include
    <div class='pull-right'>
        <button 
         id='altui-arduino-include-start-#{device.altuiid}' 
         type='button' 
         class='altui-window-btn btn btn-default btn-sm #{activeFlag}'>
            #{_T("Start")}
        </button>
        <button 
         id='altui-arduino-include-stop-#{device.altuiid}'
         type='button' 
         class='altui-window-btn btn btn-default btn-sm #{activeFlag}'>
            #{_T("Stop")}
        </button>
    </div>
</div>
<script type='text/javascript'>
    $('button#altui-arduino-include-start-#{device.altuiid}').on('click', function() { 
        MultiBox.runActionByAltuiID('#{device.altuiid}', 
                                    '#{S_ARD}', 
                                    'StartInclusion', 
                                    {});
    });
    $('button#altui-arduino-include-stop-#{device.altuiid}').on ('click', function() { 
        MultiBox.runActionByAltuiID('#{device.altuiid}', 
                                    '#{S_ARD}', 
                                    'StopInclusion',
                                    {}); 
    });
</script>
        """ 

    @drawTempLeak: (device) ->
        S_SEC = 'urn:micasaverde-com:serviceId:SecuritySensor1'

        armed = parseInt(MultiBox.getStatus(device, S_SEC, 'Armed'))
        lasttrip = MultiBox.getStatus(device, S_SEC, 'LastTrip')

        html = ""
        html += @createOnOffButton(armed,
                           "altui-onoffbtn-#{device.altuiid}",
                           _T("Bypass,Arm"), 
                           "pull-right")
        if lasttrip?
            lasttripdate = @_toIso(new Date(lasttrip*1000),' ')
            html += """
<div class='altui-lasttrip-text text-muted'>
    #{timeGlyph} #{lasttripdate}
</div>
            """
        html += """
<script type='text/javascript'>";
    $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() {
        ALTUI_PluginDisplays.toggleArmed('#{device.altuiid}',
                                         'div#altui-onoffbtn-#{device.altuiid}'); 
    });
</script>";

        """
        return html;


    @drawMotion: (device) ->
        S_SEC = 'urn:micasaverde-com:serviceId:SecuritySensor1'

        armed = parseInt(MultiBox.getStatus(device, S_SEC, 'Armed'))
        lasttrip = MultiBox.getStatus(device, S_SEC, 'LastTrip')
        tripped = parseInt(MultiBox.getStatus(device, S_SEC, 'Tripped'))

        html = ""
        html += @createOnOffButton(armed,
                                   "altui-onoffbtn-#{device.altuiid}",
                                   _T("Bypass,Arm"), 
                                   "pull-right")
        if lasttrip?
            lasttripdate = @_toIso(new Date(lasttrip*1000),' ')
            html += """
<div class='altui-lasttrip-text text-muted'>
    #{timeGlyph} #{lasttripdate}
</div>
            """
        
        # armed, tripped
        html += """<span class='altui-motion' ></span>"""
        if tripped
            html += """
 <span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'>
 </span>
            """
        # armed
        html += """
<script type='text/javascript'>";
    $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() {
        ALTUI_PluginDisplays.toggleArmed('#{device.altuiid}',
                                         'div#altui-onoffbtn-#{device.altuiid}'); 
    });
</script>";

        """
        return html;


    @drawKeypad: (device) ->
        D_KEYPAD = 'urn:schemas-micasaverde-com:device:Keypad:1'
        status = parseInt(MultiBox.getStatus(device, D_KEYPAD, 'Status'))        
        sl_UserCode = MultiBox.getStatus(device, D_KEYPAD, 'sl_UserCode' )
        sl_PinFailed = MultiBox.getStatus(device, D_KEYPAD, 'sl_PinFailed' )

        html = ""
        html += @createOnOffButton(status,
                                   "altui-onoffbtn-#{device.altuiid}", 
                                   _T("Unlock,Lock") , 
                                   "pull-right")
        if sl_PinFailed
            html+= """
<div class='text-danger'>
    <span class='glyphicon glyphicon-warning-sign' aria-hidden='true'>
    </span> 
    Invalid PIN Entered
</div>
            """
        if sl_UserCode?
            re = /UserName="(.*)"/
            if (m = re.exec(sl_UserCode))?
                if m.index == re.lastIndex
                    re.lastIndex++
            # View your result using the m-variable.
            # eg m[0] etc.
            html += """
<div class='altui-keypad-status'>User #{m[1]} Entered</div>
            """
        html += """
<script type='text/javascript'>
    $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() { 
        ALTUI_PluginDisplays.toggleKeypad('#{device.altuiid}',
                                          'div#altui-onoffbtn-#{device.altuiid}'); 
    });
</script>
        """
        return html;


    @drawKeypadControlPanel: (device) ->
        $(domparent).append """
<div class=''>
    <span class='text-warn'>this panel is <mark>not functional</mark>, it requires a brave developper to finish it to manage pin codes etc using device UPNP actions</span>
    <table id='altui-cplus-keytbl'>
        <tbody>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='1'>1</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='2'>2</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='3'>3</button>
                </td>
            </tr>";
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='4'>4</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='5'>5</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='6'>6</button>
                </td>
            </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='7'>7</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='8'>8</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='9'>9</button>
                </td>
            </tr>
            <tr>
                <td colspan='3'>
                    <button class='altui-cplus-button btn btn-default' id='0'>0</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
        """
        $(".altui-cplus-button").click () ->
            id = $(this).prop('id')
            # MultiBox.runAction(device, 
            #                    'urn:upnp-org:serviceId:cplus1', 
            #                    'SendKey', 
            #                    {keyStream:id})


    @drawBinaryLight: (device) ->
        html = ""
        html += UIManager.defaultDeviceDrawWatts(device)
        status = parseInt(MultiBox.getStatus(device,
                          'urn:upnp-org:serviceId:SwitchPower1', 
                          'Status'))
        if @isBusyStatus(device)
            status = -1
        html += @_createOnOffButton(status,
                                    "altui-onoffbtn-#{device.altuiid}",
                                    _T("OFF","ON"),
                                    "pull-right")
        html += """
 <script type='text/javascript'>
    $('div#altui-onoffbtn-#{device.altuiid}').on('click touchend', function() { 
        ALTUI_PluginDisplays.toggleOnOffButton('#{device.altuiid}',
                                                'div#altui-onoffbtn-#{device.altuiid}'); 
        });
 </script>
        """
        return html

    @drawPowerMeter: (device) ->
            watts = parseFloat(MultiBox.getStatus(device, 
                               'urn:micasaverde-com:serviceId:EnergyMetering1', 
                               'Watts'))
            volts = parseFloat(MultiBox.getStatus(device, 
                               'urn:brultech-com:serviceId:PowerMeter1', 
                               'Volts'))
            html = ""
            if not isNaN watts
                html+= """
                        <div class='altui-watts '>
                            #{watts} <small>Watts</small>
                        </div>
                """
            if not isNaN volts
                html += """
                        <div class='altui-volts '>
                            #{volts} <small>Volts</small>
                        </div>
                """ 
            return html           

    @drawCountDown: (device) ->
        remaining = parseInt(MultiBox.getStatus( device, 
                             'urn:futzle-com:serviceId:CountdownTimer1', 
                             'Remaining' ));
        duration = parseInt(MultiBox.getStatus( device, 
                            'urn:futzle-com:serviceId:CountdownTimer1', 
                            'Duration' ));
        """
<div class='altui-countdown'>
    #{remaining} / #{duration}
</div>
        """

    @drawVacation: (device) ->
        status = parseInt(MultiBox.getStatus(device, 
                            'urn:upnp-org:serviceId:SwitchPower1', 
                            'Status'))
        expiryDate =  MultiBox.getStatus(device, 
                            'urn:futzle-com:serviceId:HolidayVirtualSwitch1', 
                            'OverrideExpiryDate')
        """
<div class='altui-watts '>
    #{if status==1 then _T("HOLIDAY") else _T("WORKING")}
</div>
<div class=''>
    #{expiryDate}
</div>
        """

    @drawWeather: (device) ->
        S_WEATHER = 'urn:upnp-micasaverde-com:serviceId:Weather1'

        condition = MultiBox.getStatus( device, S_WEATHER, 'Condition');
        wind = MultiBox.getStatus( device, S_WEATHER, 'WindCondition');
        """
<div class='altui-weather-text'>#{condition}</div>
<div class='altui-weather-text'>#{_T("Wind")}: #{wind}</div>
        """

    @drawWeatherIcon: (device) ->
        S_WEATHER = 'urn:upnp-micasaverde-com:serviceId:Weather1'
        conditionGroup = 
            MultiBox.getStatus(device, S_WEATHER, 'ConditionGroup')
        if conditionGroup?
            newsrc = "http://icons.wxug.com/i/c/i/#{conditionGroup}.gif"
        else
            newsrc = defaultIconSrc
        """
<img 
 class='altui-device-icon pull-left img-rounded' 
 src='#{newsrc}' 
 alt='#{conditionGroup}' 
 onerror='UIManager.onDeviceIconError("#{device.altuiid}")'>
</img>
        """

    @drawDataMine: (device) ->
        if MultiBox.isRemoteAccess()
            controller = MultiBox.controllerOf(device.altuuiid).controller
            isUI5 = MultiBox.isUI5(controller)
            if not isUI5
                main_url = window.location.href
                url_parts = main_url.split("?")
                url = url_parts[0]+"?id=lr_dmPage"
            else
                url = "https://#{hostname}/port_3480/data_request?id=lr_dmPage"
        else
            ipaddr = MultiBox.getIpAddr(device.altuiid)
            hostname = if (ipaddr=='') then window.location.hostname else ipaddr
            url = "http://#{hostname}/dm/index.html"
        """
<button 
 id='altui-datamine-#{device.altuiid}' 
 type='button' 
 class='pull-right altui-datamine-open btn btn-default btn-sm '>
    #{_T("Open")}
</button>
<script type='text/javascript'>
    $('button#altui-datamine-#{device.altuiid}.altui-datamine-open')
        .on('click', function() { 
            window.open('#{url}','_blank'); 
        });
</script>
        """


    @drawMultiswitch: (device) ->
        btnid = 0

        names = JSON.parse(MultiBox.getStatus(device,
                                   "urn:dcineco-com:serviceId:MSwitch1",
                                   "BtnNames") or "[]")
        html = ""
        html += """<div class='altui-multiswitch-container pull-right'>"""
        for line in [0..1]
            html += """<div class='row'>"""
            for col in [0..3]
                name = if names[btnid] then names[btnid] else ("Btn_"+btnid)
                status = parseInt(MultiBox.getStatus(device,
                                  "urn:dcineco-com:serviceId:MSwitch1",
                                  "Status"+(btnid+1)))
                html += """
        <div class='col-xs-3'>
            <button 
             id='#{btnid}' 
             type='button' 
             class='altui-multiswitch-open btn btn-default btn-xs #{if status then 'btn-info' else ''}' >
                #{name}
            </button>
        </div>
                """
                btnid++
            html += """</div>"""
        html += """
    </div>
    <script type='text/javascript'>
         $('button.altui-multiswitch-open').on('click', function() {
           var btnid = parseInt($(this).prop('id'))+1;
           var action = 'SetStatus'+btnid;
           var params = {}; params['newStatus'+btnid]=-1;
           MultiBox.runActionByAltuiID('#{device.altuiid}', 
                                       'urn:dcineco-com:serviceId:MSwitch1', 
                                       action, 
                                       params);
        });
    </script>
        """
        return html

    @drawInfoViewer: (device) ->
        pattern = MultiBox.getStatus(device, 
                                     'urn:a-lurker-com:serviceId:InfoViewer1', 
                                     'LuaPattern')
        urlhead = MultiBox.getUrlHead(device.altuiid)
        html = ""
        html += """
 <div class='btn-group pull-right'>
     <button 
      id='altui-infoviewer-#{device.altuiid}' 
      type='button' 
      class='altui-infoviewer-btn btn btn-default btn-sm pull-right'>
        #{_T("Open")}
    </button>
    <button 
     id='altui-infoviewer-log-#{device.altuiid}' 
     type='button' 
     class='altui-infoviewer-log-btn btn btn-default btn-sm pull-right'>
        #{_T("Logs")}
    </button>
 </div>
        """
        if pattern != ""
            html += """
<div class='altui-infoviewer-pattern'>Pattern:</div>
<div class='altui-infoviewer-pattern'>#{pattern.htmlEncode()}</div>
            """
        html += """
<script type='text/javascript'>
    $('button.altui-infoviewer-btn').on('click', function() { 
        window.open('#{urlhead}?id=lr_al_info','_blank'); 
    });
    $('button.altui-infoviewer-log-btn').on('click', function() { 
        window.open('#{urlhead}?id=lr_al_info&fnc=getLog&app=localapp','_blank'); 
    });
</script>
        """
        return html


    @drawBinLightControlPanel: (device, domparent) ->
        $(domparent).append """
Any thing can go here<hr>
<div class='btn-group btn-group-lg' role='group' aria-label='...'>
  <button type='button' class='btn btn-default'>Left</button>
  <button type='button' class='btn btn-default'>Middle</button>
  <button type='button' class='btn btn-default'>Right</button>
</div>
        """

    @toggleOnOffButton: (altuiid,htmlid) ->
        @_toggleButton altuiid, 
                        htmlid, 
                        'urn:upnp-org:serviceId:SwitchPower1', 
                        'Status', 
                        (id,newval) ->
                            MultiBox.setOnOff(altuiid, newval)

    @toggleKeypad: (altuiid,htmlid) ->
        ALTUI_PluginDisplays.toggleButton altuiid, 
                                          htmlid, 
                                          'urn:micasaverde-com:serviceId:DoorLock1', 
                                          'Status', 
                                          (id,newval) ->
            MultiBox.runActionByAltuiID(altuiid, 
                                        'urn:micasaverde-com:serviceId:DoorLock1', 
                                        'SetTarget', 
                                        {newTargetValue:newval})

    @toggleArmed: (altuiid,htmlid) ->
        @_toggleButton altuiid, 
                        htmlid,
                        'urn:micasaverde-com:serviceId:SecuritySensor1', 
                        'Armed', 
                        (id,newval) ->
                            MultiBox.setArm(altuiid, newval)

    @toggleDoorLock: (altuiid, htmlid) ->
        @_toggleButton altuiid, 
                        htmlid,
                        'urn:micasaverde-com:serviceId:DoorLock1', 
                        'Status', 
                        (id,newval) ->
                            MultiBox.setDoorLock( altuiid, newval)

    @togglePLEG: (altuiid, htmlid) ->
        @_toggleButton altuiid, 
            htmlid,
            'urn:rts-services-com:serviceId:ProgramLogicEG', 
            'Armed', 
            (id,newval) ->
                MultiBox.runActionByAltuiID(altuiid, 
                    'urn:rts-services-com:serviceId:ProgramLogicEG', 
                    'SetArmed', 
                    {'newArmedValue':newval})

    @toggleVswitch: (altuiid, htmlid) ->
        ALTUI_PluginDisplays.toggleButton altuiid, 
            htmlid, 
            'urn:upnp-org:serviceId:VSwitch1', 
            'Status', 
            (id,newval) ->
                MultiBox.runActionByAltuiID(altuiid, 
                    'urn:upnp-org:serviceId:VSwitch1', 
                    'SetTarget',
                    {newTargetValue:newval})

    @toggleDayTimeButton : (altuiid,htmlid) ->
        ALTUI_PluginDisplays.toggleButton(
            altuiid, 
            htmlid, 
            'urn:rts-services-com:serviceId:DayTime', 
            'Status', 
            (id,newval) ->
                MultiBox.runActionByAltuiID(altuiid, 
                    'urn:rts-services-com:serviceId:DayTime', 
                    'SetTarget', 
                    {newTargetValue:newval}))

