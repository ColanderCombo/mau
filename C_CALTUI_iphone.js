// Generated by CoffeeScript 1.10.0
(function() {
  var CALTUI_IPhoneLocator;

  CALTUI_IPhoneLocator = (function() {
    function CALTUI_IPhoneLocator() {}

    CALTUI_IPhoneLocator.prototype.getStyle = function() {
      return ".altui-iphone {\n    font-size: 16px;\n}\n.altui-canalplus {\n    font-size: 12px;    \n}\n#altui-cplus-keytbl td {\n    text-align:center;\n    vertical-align:middle;\n}\n.altui-cplus-button { \n    width: 70px;\n    font-size:12px;\n}\n.altui-ipx {\n    margin-top: 10px;\n}  ";
    };

    CALTUI_IPhoneLocator.prototype.drawAltUI = function(device) {
      var debug;
      debug = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:altui1', 'Debug');
      return (ALTUI_PluginDisplays.createOnOffButton(debug, "altui-onoffbtn-" + device.altuiid, _T("Normal,Debug"), "pull-right")) + "\n<script type='text/javascript'>\n    $('div#altui-onoffbtn-" + device.altuiid + "')\n        .on('click touchend', function() { \n            ALTUI_IPhoneLocator.toggleDebug('" + device.altuiid + "','div#altui-onoffbtn-" + device.altuiid + "'); \n        });\n</script>";
    };

    CALTUI_IPhoneLocator.prototype.drawIPX = function(device) {
      if (!device.ip) {
        return "";
      } else {
        return "<button \n id='altui-ipx-" + device.altuiid + "' \n type='button' \n class='pull-right altui-ipx btn btn-default btn-sm '>\n    " + (_T("Open")) + "\n</button>\n<script type='text/javascript'>\n $('button#altui-ipx-" + device.altuiid + "')\n    .on('click', function() { \n        window.open('http://" + device.ip + "','_blank'); \n    });\n</script>";
      }
    };

    CALTUI_IPhoneLocator.prototype.drawIPhone = function(device) {
      var dist, mute, unit;
      dist = parseFloat(MultiBox.getStatus(device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Distance'));
      unit = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Unit');
      mute = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted');
      return "<span class='altui-iphone' > " + dist + " </span>\n<small> " + unit + " </small>\n" + (ALTUI_PluginDisplays.createOnOffButton(mute, "altui-onoffbtn-" + device.altuiid, _T("Unmuted,Muted"), "pull-right")) + "\n<script type='text/javascript'>\n $('div#altui-onoffbtn-" + device.altuiid + "')\n    .on('click touchend', function() { \n        ALTUI_IPhoneLocator.toggleMute('" + device.altuiid + "',\n                                        'div#altui-onoffbtn-" + device.altuiid + "'); \n    });\n</script>\"";
    };

    CALTUI_IPhoneLocator.prototype.drawCanalplus = function(device) {
      var channel, html, present;
      channel = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:cplus1', 'CurrentChannel').split(',');
      present = Multibox.getStatus(device, 'urn:upnp-org:serviceId:cplus1', 'Present');
      html = "";
      html += ALTUI_PluginDisplays.createOnOffButton(present, "altui-onoffbtn-" + device.altuiid, _T("OFF", "ON"), "pull-right");
      if (channel.length >= 2) {
        html += "<div class='altui-canalplus' >\n    " + channel[1] + "\n</div>\n<span>\n    <small>\n        " + channel[0] + "\n    </small>\n</span>";
      }
      html += "<script type='text/javascript'>\n $('div#altui-onoffbtn-" + device.altuiid + "')\n    .on('click touchend', function() { \n        ALTUI_IPhoneLocator.toggleCplusOnOff('" + device.altuiid + "',\n                                             'div#altui-onoffbtn-" + device.altuiid + "'); \n    });\n</script>";
      return html;
    };

    CALTUI_IPhoneLocator.prototype.drawCanaplusControlPanel = function(device, domparent) {
      var html;
      html = "<div class=''>\n    <table id='altui-cplus-keytbl'>\n        <tbody>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='1'>1</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='2'>2</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='3'>3</button>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='4'>4</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='5'>5</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='6'>6</button>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='7'>7</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='8'>8</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='9'>9</button>\n                </td>\n            </tr>\n            <tr>\n                <td colspan='3'>\n                    <button class='altui-cplus-button btn btn-default' id='0'>0</button>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Rewind'>Rewind</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Play'>Play</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Forward'>Forward</button>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Stop'>Stop</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Pause'>Pause</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Rec'>Rec</button>\n                </td>\n            </tr>\n            <tr>\n                <td colspan='3'>-</td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Menu'>Menu</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Haut'>Haut</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Guide'>Guide</button>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Gauche'>Gauche</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Ok'>Ok</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Droite'>Droite</button>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Retour'>Retour</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Bas'>Bas</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Sortie'>Sortie</button>\n                </td>\n            </tr>\n            <tr>\n                <td colspan='3'>-</td>\n            </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='VOL+'>VOL+</button>\n                </td>\n                <td>\n                        <button class='altui-cplus-button btn btn-default' id='Mute'>Mute</button>\n                    </td>\n                    <td>\n                        <button class='altui-cplus-button btn btn-default' id='P+'>P+</button>\n                    </td>\n                    </tr>\n            <tr>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='VOL-'>VOL-</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='Info'>Info</button>\n                </td>\n                <td>\n                    <button class='altui-cplus-button btn btn-default' id='P-'>P-</button>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</div>";
      $(domparent).append(html);
      return $(".altui-cplus-button").click(function() {
        var id;
        id = $(this).prop('id');
        return MultiBox.runAction(device, 'urn:upnp-org:serviceId:cplus1', 'SendKey', {
          keyStream: id
        });
      });
    };

    CALTUI_IPhoneLocator.prototype.toggleDebug = function(devid, htmlid) {
      ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:altui1', 'Debug', function(id, newval) {});
      return MultiBox.runActionByAltuiID(devid, 'urn:upnp-org:serviceId:altui1', 'SetDebug', {
        newDebugMode: newval
      });
    };

    CALTUI_IPhoneLocator.prototype.toggleMute = function(devid, htmlid) {
      ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted', function(id, newval) {});
      return MultiBox.runActionByAltuiID(devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'SetMute', {
        newMuteStatus: newval
      });
    };

    CALTUI_IPhoneLocator.prototype.toggleCplusOnOff = function(devid, htmlid) {
      ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:cplus1', 'Present', function(id, newval) {});
      return MultiBox.runActionByAltuiID(devid, 'urn:upnp-org:serviceId:cplus1', 'SetPower', {
        newPowerState: newval
      });
    };

    return CALTUI_IPhoneLocator;

  })();

}).call(this);