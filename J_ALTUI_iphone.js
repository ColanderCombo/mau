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
		return style;
	};


	function _drawAltUI(devid, device) {
		var debug = VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:altui1', 'Debug' ); 
		
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+devid, "Normal,Debug" , "pull-right");
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_IPhoneLocator.toggleDebug({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawIPhone(devid, device) {
		var dist = parseFloat(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Distance' )); 
		var unit = VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Unit' ); 
		var mute = VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted' ); 
		
		var html ="";
		html+=("<span class='altui-iphone' > "+dist+" </span>");
		html+=("<small > "+unit+" </small>");

		html += ALTUI_PluginDisplays.createOnOffButton( mute,"altui-onoffbtn-"+devid, "Unmuted,Muted" , "pull-right");
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_IPhoneLocator.toggleMute({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		
		return html;
	};
	
	function _drawCanalplus(devid, device) {
		var channel = VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:cplus1', 'CurrentChannel' ).split(','); 
		var present = VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:cplus1', 'Present' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( present,"altui-onoffbtn-"+devid, "OFF,ON", "pull-right" );
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

  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getStyle 	: _getStyle,
	drawIPhone 	: _drawIPhone,
	drawAltUI 	: _drawAltUI,
	drawCanalplus : _drawCanalplus,
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
