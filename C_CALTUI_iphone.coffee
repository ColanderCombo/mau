## sourceURL=J_ALTUI_iphone.js
# This program is free software: you can redistribute it and/or modify
# it under the condition that it is for private or home useage and 
# this whole comment is reproduced in the source code file.
# Commercial utilisation is not authorized without the appropriate
# written agreement from amg0 / alexis . mermet @ gmail . com
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

class CALTUI_IPhoneLocator

    # return styles needed by this plugin module
    getStyle: () ->
        """
.altui-iphone {
    font-size: 16px;
}
.altui-canalplus {
    font-size: 12px;    
}
#altui-cplus-keytbl td {
    text-align:center;
    vertical-align:middle;
}
.altui-cplus-button { 
    width: 70px;
    font-size:12px;
}
.altui-ipx {
    margin-top: 10px;
}  
        """

    drawAltUI: (device) ->
        debug = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:altui1', 'Debug')

        """
#{ALTUI_PluginDisplays.createOnOffButton(debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right")}
<script type='text/javascript'>
    $('div#altui-onoffbtn-#{device.altuiid}')
        .on('click touchend', function() { 
            ALTUI_IPhoneLocator.toggleDebug('#{device.altuiid}','div#altui-onoffbtn-#{device.altuiid}'); 
        });
</script>
        """

    drawIPX: (device) ->
        if not device.ip
            return ""
        else
            """
<button 
 id='altui-ipx-#{device.altuiid}' 
 type='button' 
 class='pull-right altui-ipx btn btn-default btn-sm '>
    #{_T("Open")}
</button>
<script type='text/javascript'>
 $('button#altui-ipx-#{device.altuiid}')
    .on('click', function() { 
        window.open('http://#{device.ip}','_blank'); 
    });
</script>
            """
    # return the html string inside the .panel-body of the .altui-device#id panel
    drawIPhone: (device) ->
        dist = parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Distance' )); 
        unit = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Unit' ); 
        mute = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted' ); 
        
        """
<span class='altui-iphone' > #{dist} </span>
<small> #{unit} </small>
#{ALTUI_PluginDisplays.createOnOffButton( mute,"altui-onoffbtn-"+device.altuiid, _T("Unmuted,Muted") , "pull-right")}
<script type='text/javascript'>
 $('div#altui-onoffbtn-#{device.altuiid}')
    .on('click touchend', function() { 
        ALTUI_IPhoneLocator.toggleMute('#{device.altuiid}',
                                        'div#altui-onoffbtn-#{device.altuiid}'); 
    });
</script>"
        """        

    drawCanalplus: (device) ->
        channel = MultiBox.getStatus(device, 
                                     'urn:upnp-org:serviceId:cplus1', 
                                     'CurrentChannel').split(',')
        present = Multibox.getStatus(device,
                                     'urn:upnp-org:serviceId:cplus1',
                                     'Present')
        html = ""
        html += ALTUI_PluginDisplays.createOnOffButton(present,
                                                       "altui-onoffbtn-#{device.altuiid}",
                                                       _T("OFF","ON"),
                                                       "pull-right")
        if channel.length >= 2
            html += """
<div class='altui-canalplus' >
    #{channel[1]}
</div>
<span>
    <small>
        #{channel[0]}
    </small>
</span>
            """
        html += """
<script type='text/javascript'>
 $('div#altui-onoffbtn-#{device.altuiid}')
    .on('click touchend', function() { 
        ALTUI_IPhoneLocator.toggleCplusOnOff('#{device.altuiid}',
                                             'div#altui-onoffbtn-#{device.altuiid}'); 
    });
</script>
        """    
        return html


    drawCanaplusControlPanel: (device, domparent) ->
        html = """
<div class=''>
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
            </tr>
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
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Rewind'>Rewind</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Play'>Play</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Forward'>Forward</button>
                </td>
            </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Stop'>Stop</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Pause'>Pause</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Rec'>Rec</button>
                </td>
            </tr>
            <tr>
                <td colspan='3'>-</td>
            </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Menu'>Menu</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Haut'>Haut</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Guide'>Guide</button>
                </td>
            </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Gauche'>Gauche</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Ok'>Ok</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Droite'>Droite</button>
                </td>
            </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Retour'>Retour</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Bas'>Bas</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Sortie'>Sortie</button>
                </td>
            </tr>
            <tr>
                <td colspan='3'>-</td>
            </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='VOL+'>VOL+</button>
                </td>
                <td>
                        <button class='altui-cplus-button btn btn-default' id='Mute'>Mute</button>
                    </td>
                    <td>
                        <button class='altui-cplus-button btn btn-default' id='P+'>P+</button>
                    </td>
                    </tr>
            <tr>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='VOL-'>VOL-</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='Info'>Info</button>
                </td>
                <td>
                    <button class='altui-cplus-button btn btn-default' id='P-'>P-</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>
        """
        $(domparent).append(html)

        $(".altui-cplus-button").click () ->
            id = $(this).prop('id')
            MultiBox.runAction(device,
                               'urn:upnp-org:serviceId:cplus1',
                               'SendKey', 
                               {keyStream:id})

    toggleDebug: (devid, htmlid) ->
        ALTUI_PluginDisplays.toggleButton devid, 
                                          htmlid, 
                                          'urn:upnp-org:serviceId:altui1', 
                                          'Debug', (id,newval) ->
            MultiBox.runActionByAltuiID(devid,
                                        'urn:upnp-org:serviceId:altui1', 
                                        'SetDebug', 
                                        {newDebugMode:newval})

    toggleMute: (devid, htmlid) ->
        ALTUI_PluginDisplays.toggleButton devid,
                                          htmlid, 
                                          'urn:upnp-org:serviceId:IPhoneLocator1', 
                                          'Muted', (id,newval) ->
            MultiBox.runActionByAltuiID(devid,
                                        'urn:upnp-org:serviceId:IPhoneLocator1', 
                                        'SetMute', 
                                        {newMuteStatus:newval})

    toggleCplusOnOff: (devid, htmlid) ->
        ALTUI_PluginDisplays.toggleButton devid, 
                                          htmlid, 
                                          'urn:upnp-org:serviceId:cplus1', 
                                          'Present', (id,newval) ->
            MultiBox.runActionByAltuiID(devid, 
                                        'urn:upnp-org:serviceId:cplus1', 
                                        'SetPower', 
                                        {newPowerState:newval})
 
    

    

