//# sourceURL=J_ALTUI_plugins.js
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 


// job_None=-1, // no icon
// job_WaitingToStart=0, // gray icon
// job_InProgress=1, // blue icon
// job_Error=2, // red icon
// job_Aborted=3, // red icon
// job_Done=4, // green icon
// job_WaitingForCallback=5 // blue icon - Special case used in certain derived classes

var ALTUI_PluginDisplays= ( function( window, undefined ) {  

	// return styles needed by this plugin module
	function _getStyle() {
		var style="";
		style += ".altui-watts {font-size: 16px;}";
		style += ".altui-volts {font-size: 16px;}";
		style += ".altui-temperature {font-size: 18px;}";
		style += ".altui-humidity {font-size: 18px;}";
		style += ".altui-dimmable {font-size: 16px;}";
		style += ".altui-motion {font-size: 22px;}";
		style += ".altui-windowcover {}";
		style += ".altui-dimmable-slider { margin-left: 50px; }";	
		style += ".altui-infoviewer-log { margin-top: 10px; }";	
		style += "div.altui-windowcover button.btn-sm { width: 4em; }";
		return style;
	};

	function _isBusyStatus(device)
	{
		return ( (device.status!=undefined) && (device.status!=-1) && (device.status!=4) && (device.status!=2) );
	};
	
	// onoff : 0, 1 or -1 for spinner
	// csvlabel = "OFF,ON"
	function _createOnOffButton( onoff , id , csvlabel, extracls)
	{
		var str=csvlabel.split(',');		
		if (true/*UIManager.UI7Check()*/ /*&& (window.location.origin.indexOf("mios.com")==-1)*/)
		{
			var onoffbuttonTemplate = "";
			onoffbuttonTemplate += "<div class='altui-button-onoff "+(extracls || '')+"'>";
			onoffbuttonTemplate += "<div id='{2}' class='" + (extracls || '') +" on-off-device {0}' ></div>";
			onoffbuttonTemplate += "<div class='altui-button-stateLabel'>{1}</div>";
			onoffbuttonTemplate += "</div>";
			var css="";
			onoff = onoff || 0;
			if (onoff>0)
				onoff=1;
			switch (onoff) {
				case null:
				case false:
				case "0":
				case 0:
					str=str[0];
					css="off";
					break;
				case true:
				case "1":
				case 1:
					str=str[1];
					css="on";
					break;
				default:
					str="";
					css="spinner";
			}
			return onoffbuttonTemplate.format(css,str,id);
		}
		else {
			var onoffbuttonTemplate = "<div id='"+id+"' class='" + (extracls || '') +" btn-group' data-toggle='buttons'>";
			$.each(str, function(idx,val) {
				onoffbuttonTemplate+=("<label class='btn btn-default btn-sm {0}'> <input type='radio' name='options' autocomplete='off'>{1}</label>").format((parseInt(onoff)==idx)?'active':'',val);
			});
			onoffbuttonTemplate+="</div>";
			return onoffbuttonTemplate;
		}
	}
	//---------------------------------------------------------
	// PRIVATE functions
	//---------------------------------------------------------
	function _toggleButton(devid, htmlselector, service, variable, cbfunc) {
		//'#altui-onoffbtn-'+devid
		var status = VeraBox.getStatus( devid, service, variable );
		if (status!=null)
		{
			if (status>0)		// special case of dimmer
				status=1;
			$(htmlselector).removeClass("on").addClass("spinner");
			cbfunc(devid, 1-status);
		}
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawCamera(devid, device) {
		var img = $("<img class='altui-camera-picture'></img>")
			.attr('src',"data_request?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
			.height(50)
			.width(66);

		return img.wrap( "<div></div>" ).parent().html();

		/*
		var streamurl = "url(http://{0}{1})".format(
			device.ip,	//ip
			VeraBox.getStatus( device.id, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" )	//DirectStreamingURL
		);
		var div = $("<div class='altui-camera-picture'></div>")
			.css({
				"background-image": streamurl,
				"background-size": "contain",
				"margin-left": 55,
				"margin-top": 1
				})
			// .css("background-size","contain")
			.height(50)
			.width(50);
		return div.wrap( "<div></div>" ).parent().html();
		*/
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawTempSensor(devid, device) {
		var html = "";
		var ws = VeraBox.getWeatherSettings();
		if (ws.tempFormat==undefined)
			ws.tempFormat="";
		
		var status = parseFloat(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' )); 
		html += ("<span class='altui-temperature' >"+status+"&deg;"+ws.tempFormat+"</span>");
		return html;
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawHumidity(devid, device) {
		var html = "";
		var status = parseInt(VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:HumiditySensor1', 'CurrentLevel' )); 
		html += ("<span class='altui-humidity' >"+status+" % </span>");
		return html;
	};
	
	function _drawLight(devid, device) {
		var html = "";
		var status = parseInt(VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:LightSensor1', 'CurrentLevel' )); 
		html += ("<span class='altui-humidity' >"+status+" % </span>");
		return html;
	};

	function _onClickWindowCoverButton(e)
	{
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Up
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Down
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Stop
		var actionname = e.prop('id').substr("altui-window-".length);
		var deviceid = e.parent().prop('id').substr("altui-wc-".length);
		UPnPHelper.UPnPAction( deviceid, "urn:upnp-org:serviceId:WindowCovering1", actionname, {} );
	};

	function _drawWindowCover(devid, device) {
		var status = VeraBox.getStatus(device.id,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus");	// 0 - 100

		var html = "";
		html += "<div class='pull-right'><div id='altui-wc-"+device.id+"' class='btn-group altui-windowcover' role='group' aria-label='...'>";
		html += "  <button id ='altui-window-Up' type='button' class='btn btn-default btn-sm {0}'>Up</button>".format( (status==100) ? 'active' : '' );
		html += "  <button id ='altui-window-Stop' type='button' class='btn btn-default btn-sm'>Stop</button>";
		html += "  <button id ='altui-window-Down' type='button' class='btn btn-default btn-sm {0}'>Down</button>".format( (status==0) ? 'active' : '' );
		html += "</div>";
		html += "</div>";
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-wc-{0} button').on('click touchend', function() { ALTUI_PluginDisplays.onClickWindowCoverButton($(this)); } );".format(devid);
		html += "</script>";
		
		return html;
	};

	function _onSliderChange(event,ui) {
		var deviceid = $(ui.handle).parents(".altui-device").prop("id");
		UPnPHelper.UPnPAction( deviceid, "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget:ui.value} );
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDimmable(devid, device) {

		var html = "";
		var onebody = $(".altui-device-body");
		var sliderwidth = (onebody.length>=1) ? onebody.first().width()-50-70  : 95;
		var bodywidth=$(".altui-device-body").first().width();
		
		// load level
		var level = parseInt(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelTarget' )); 
		if (isNaN(level)==true) 
			level = parseInt(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelStatus' )); 
		
		html += ("<span id='slider-val-"+devid+"' class='altui-dimmable' >"+level+"% </span>");

		// on off button
		var status = parseInt(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( (device.status==1) || (device.status==5) )  {  
		// if ( level != status )  {  
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
		if (_isBusyStatus(device))  {  
			status = -1;
		}
		html += _createOnOffButton( status,"altui-onoffbtn-"+devid , "OFF,ON" , "pull-right");
		
		// dimming
		html+=("<div id='slider-{0}' class='altui-dimmable-slider' style='width: "+sliderwidth+"px;' ></div>").format(devid);
		
		// on off 
		html += "<script type='text/javascript'>";
		html += "$('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleOnOffButton({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		// html += "$('div.altui-dimmable-slider#slider-{0}').slider();".format(devid,level);
		html += "$('div.altui-dimmable-slider#slider-{0}').slider({ max:100,min:0,value:{1},change:ALTUI_PluginDisplays.onSliderChange });".format(devid,level);
		html += "</script>";
		
		$(".altui-mainpanel").off("slide","#slider-"+devid);
		$(".altui-mainpanel").on("slide","#slider-"+devid,function( event, ui ){ 
			// console.log(ui.value);
			// console.log(devid);
			$("#slider-val-"+devid).text( ui.value+'%');
		});
		
		return html;
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDoorLock(devid, device) {
		var status = VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:DoorLock1', 'Status' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( status,"altui-onoffbtn-"+devid, "Unlock,Lock" , "pull-right");

		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleDoorLock({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDoorSensor(devid, device) {
		return _drawMotion(devid, device);
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawMotion(devid, device) {
		var html = "";
		
		// armed, tripped
		var tripped = parseInt(VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Tripped' )); 
		html += ("<span class='altui-motion' >{0}</span>".format( (tripped==true) ? "<span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'></span>" : ""));

		// armed button
		// var status = parseInt(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
			// status = -1;
		// }
		var armed = parseInt(VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed' )); 
		html += _createOnOffButton( armed,"altui-onoffbtn-"+devid, "Bypass,Arm", "pull-right" );
		
		// armed
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleArmed({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	
	function _drawBinaryLight(devid, device) {
		var wattTemplate = "<span class='altui-watts '>{0} <small>Watts</small></span>";
		var html ="";
		
		var watts = parseInt(VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 
		if (isNaN(watts)==false) 
			html += wattTemplate.format(watts);
		
		var status = parseInt(VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
		// if ( (device.status==1) || (device.status==5))  {  
		if ( _isBusyStatus(device) )  {  
			status = -1;
		}
		html += _createOnOffButton( status,"altui-onoffbtn-"+devid, "OFF,ON" , "pull-right");
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleOnOffButton({0},'div#altui-onoffbtn-{0}'); } );".format(devid);
		html += "</script>";
		return html;
	};

	function _drawPowerMeter(devid, device) {
		var html ="";
		var wattTemplate = "<div class='altui-watts '>{0} <small>Watts</small></div>";		
		var watts = parseFloat(VeraBox.getStatus( devid, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 
		if (isNaN(watts)==false) 
			html += wattTemplate.format(watts);
		var voltTemplate = "<div class='altui-volts '>{0} <small>Volts</small></div>";
		var volts = parseFloat(VeraBox.getStatus( devid, 'urn:brultech-com:serviceId:PowerMeter1', 'Volts' ));
		if (isNaN(volts)==false) 
			html += voltTemplate .format(volts);
		return html;
	};
	
	function _drawVacation(devid, device) {
		var html ="";
		var status = parseInt( VeraBox.getStatus( devid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status') );
		var expiryDate =  VeraBox.getStatus( devid, 'urn:futzle-com:serviceId:HolidayVirtualSwitch1', 'OverrideExpiryDate');
		html+= "<div class='altui-watts '>{0}</div>".format( (status==1) ? "Holiday" : "Working" );
		html+= "<div class=''>{0}</div>".format( expiryDate );
		return html;
	};

	function _drawWeather(devid, device) {
		var html ="";
		var condition = VeraBox.getStatus( devid, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'Condition');
		var wind = VeraBox.getStatus( devid, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'WindCondition');
		html+= "<div class=''>Condition: {0}</div>".format( condition );
		html+= "<div class=''>Wind: {0}</div>".format( wind );
		return html;
	};
	
	function _drawInfoViewer(devid, device) {
		var html ="";
		var pattern = VeraBox.getStatus( devid, 'urn:a-lurker-com:serviceId:InfoViewer1', 'LuaPattern');
		if (pattern!="")
			html+= "<span class=''>Pattern: {0}</span>".format( pattern.htmlEncode() );
		html+="<button type='button' class='pull-right altui-infoviewer-log btn btn-default btn-sm '>Open</button>" ;
		html += "<script type='text/javascript'>";
		html += " $('div.altui-device#{0} button.altui-infoviewer-log').on('click', function() { window.open('data_request?id=lr_al_info','_blank'); } );".format(devid);
		html += "</script>";
		return html;
	};	
	
	function _drawBinLightControlPanel(devid, device, domparent) {

		var html = "Any thing can go here<hr>";
		html += "<div class='btn-group btn-group-lg' role='group' aria-label='...'>";
		html += "  <button type='button' class='btn btn-default'>Left</button>";
		html += "  <button type='button' class='btn btn-default'>Middle</button>";
		html += "  <button type='button' class='btn btn-default'>Right</button>";
		html += "</div>";

		$(domparent).append(html);
	};
	
  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getStyle : _getStyle,
	onClickWindowCoverButton : _onClickWindowCoverButton,
	createOnOffButton : _createOnOffButton,
	drawBinaryLight : _drawBinaryLight,
	drawBinLightControlPanel : _drawBinLightControlPanel,
	drawTempSensor : _drawTempSensor,
	drawCamera     : _drawCamera,
	onSliderChange : _onSliderChange,
	drawDoorSensor : _drawDoorSensor,
	drawDoorLock   : _drawDoorLock,
	drawDimmable   : _drawDimmable,
	drawMotion 	   : _drawMotion,
	drawHumidity   : _drawHumidity,
	drawLight   	: _drawLight,
	drawWindowCover : _drawWindowCover,
	drawPowerMeter : _drawPowerMeter,
	drawVacation     : _drawVacation,
	drawWeather     : _drawWeather,
	drawInfoViewer     : _drawInfoViewer,
	toggleButton   : _toggleButton,
	toggleOnOffButton : function (devid,htmlid) {
		_toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status', function(id,newval) {
			UPnPHelper.setOnOff( devid, newval);
		});
	},
	toggleArmed : function (devid,htmlid) {
		_toggleButton(devid, htmlid,'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed', function(id,newval) {
			UPnPHelper.setArm( devid, newval);
		});
	},
	toggleDoorLock : function (devid, htmlid) {
		_toggleButton(devid, htmlid,'urn:micasaverde-com:serviceId:DoorLock1', 'Status', function(id,newval) {
			UPnPHelper.setDoorLock( devid, newval);
		});
	}
  };
})( window );
