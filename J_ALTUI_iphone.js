//# sourceURL=J_ALTUI_iphone.js
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

var ALTUI_IPhoneLocator= ( function( window, undefined ) {  
	
	// return styles needed by this plugin module
	function _getStyle() {
		var style="";
		style += ".altui-iphone 	{	font-size: 16px;	}";
		style += ".altui-canalplus 	{	font-size: 12px;	}";
		style += "#altui-cplus-keytbl td {text-align:center;     vertical-align:middle;}";
		style += ".altui-cplus-button { width: 70px; font-size:12px;}";
		return style;
	};


	function _drawAltUI(devid, device) {
		var debug = MultiBox.getStatus( devid, 'urn:upnp-org:serviceId:altui1', 'Debug' ); 
		
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+devid, _T("Normal,Debug") , "pull-right");
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_IPhoneLocator.toggleDebug({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawIPhone(devid, device) {
		var dist = parseFloat(MultiBox.getStatus( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Distance' )); 
		var unit = MultiBox.getStatus( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Unit' ); 
		var mute = MultiBox.getStatus( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted' ); 
		
		var html ="";
		html+=("<span class='altui-iphone' > "+dist+" </span>");
		html+=("<small > "+unit+" </small>");

		html += ALTUI_PluginDisplays.createOnOffButton( mute,"altui-onoffbtn-"+devid, _T("Unmuted,Muted") , "pull-right");
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_IPhoneLocator.toggleMute({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		
		return html;
	};
	
	function _drawCanalplus(devid, device) {
		var channel = MultiBox.getStatus( devid, 'urn:upnp-org:serviceId:cplus1', 'CurrentChannel' ).split(','); 
		var present = MultiBox.getStatus( devid, 'urn:upnp-org:serviceId:cplus1', 'Present' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( present,"altui-onoffbtn-"+devid, _T("OFF,ON"), "pull-right" );
		if (channel.length>=2)
			html+=("<div class='altui-canalplus' >{0}</div><span><small>{1}</small></span>".format(channel[1],channel[0]));

		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_IPhoneLocator.toggleCplusOnOff({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		return html;
	};
	
	// function _drawControlPanel(devid, device, domparent) {
		// $(domparent).append("Hello I am alive, and I am in a custom drawing function!");
	// };

	function _drawCanaplusControlPanel(devid, device, domparent) {
		var html="";
		html +="<div class=''>";
		html += "<table id='altui-cplus-keytbl'>";
		html += "<tbody>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='1'>1</button></td><td><button class='altui-cplus-button btn btn-default' id='2'>2</button></td><td><button class='altui-cplus-button btn btn-default' id='3'>3</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='4'>4</button></td><td><button class='altui-cplus-button btn btn-default' id='5'>5</button></td><td><button class='altui-cplus-button btn btn-default' id='6'>6</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='7'>7</button></td><td><button class='altui-cplus-button btn btn-default' id='8'>8</button></td><td><button class='altui-cplus-button btn btn-default' id='9'>9</button></td></tr>";
html+="<tr><td colspan='3'><button class='altui-cplus-button btn btn-default' id='0'>0</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='Rewind'>Rewind</button></td><td><button class='altui-cplus-button btn btn-default' id='Play'>Play</button></td><td><button class='altui-cplus-button btn btn-default' id='Forward'>Forward</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='Stop'>Stop</button></td><td><button class='altui-cplus-button btn btn-default' id='Pause'>Pause</button></td><td><button class='altui-cplus-button btn btn-default' id='Rec'>Rec</button></td></tr>";
html+="<tr><td colspan='3'>-</td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='Menu'>Menu</button></td><td><button class='altui-cplus-button btn btn-default' id='Haut'>Haut</button></td><td><button class='altui-cplus-button btn btn-default' id='Guide'>Guide</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='Gauche'>Gauche</button></td><td><button class='altui-cplus-button btn btn-default' id='Ok'>Ok</button></td><td><button class='altui-cplus-button btn btn-default' id='Droite'>Droite</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='Retour'>Retour</button></td><td><button class='altui-cplus-button btn btn-default' id='Bas'>Bas</button></td><td><button class='altui-cplus-button btn btn-default' id='Sortie'>Sortie</button></td></tr>";
html+="<tr><td colspan='3'>-</td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='VOL+'>VOL+</button></td><td><button class='altui-cplus-button btn btn-default' id='Mute'>Mute</button></td><td><button class='altui-cplus-button btn btn-default' id='P+'>P+</button></td></tr>";
html+="<tr><td><button class='altui-cplus-button btn btn-default' id='VOL-'>VOL-</button></td><td><button class='altui-cplus-button btn btn-default' id='Info'>Info</button></td><td><button class='altui-cplus-button btn btn-default' id='P-'>P-</button></td></tr>";
		html += "</tbody>";
		html += "</table>";
		html +="</div>";
		// html +="<div id='altui-cplus-divcontainer' class='pull-left'>";
		// html +="</div>";
		$(domparent).append(html);
		
		// also display the default
		// UIManager.defaultDeviceDrawControlPanel(devid, device, domparent.find("div#altui-cplus-divcontainer").width(400));
		
		$(".altui-cplus-button").click( function() {
			var id = $(this).prop('id');
			UPnPHelper.UPnPAction( devid, 'urn:upnp-org:serviceId:cplus1', 'SendKey', {keyStream:id} );
		});
	};	
	
  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getStyle 	: _getStyle,
	drawIPhone 	: _drawIPhone,
	drawAltUI 	: _drawAltUI,
	drawCanalplus : _drawCanalplus,
	drawCanaplusControlPanel : _drawCanaplusControlPanel,
	
	// drawControlPanel : _drawControlPanel,
	toggleDebug : function (devid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:altui1', 'Debug', function(id,newval) {
			UPnPHelper.UPnPAction( devid, 'urn:upnp-org:serviceId:altui1', 'SetDebug', {newDebugMode:newval} );
		});
	},
	toggleMute : function (devid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted', function(id,newval) {
			UPnPHelper.UPnPAction( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'SetMute', {newMuteStatus:newval} );
		});
	},
	toggleCplusOnOff : function (devid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:cplus1', 'Present', function(id,newval) {
			UPnPHelper.UPnPAction( devid, 'urn:upnp-org:serviceId:cplus1', 'SetPower', {newPowerState:newval} );
		});
	},
	};
})( window );
