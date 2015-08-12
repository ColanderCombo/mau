//# sourceURL=J_ALTUI_plugins.js
"use strict";

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
		style += ".altui-watts, .altui-volts, .altui-dimmable, .altui-countdown  {font-size: 16px;}";
		style += ".altui-temperature, .altui-humidity, .altui-light  {font-size: 18px;}";
		style += ".altui-motion {font-size: 22px;}";
		style += ".altui-weather-text, .altui-lasttrip-text {font-size: 11px;}";
		style += ".altui-red { color:red;}";
		style += ".altui-blue { color:blue;}";
		style += ".altui-orange { color:darkorange;}";
		style += ".altui-magenta { color:magenta;}";
		style += ".altui-multiswitch-container { position:absolute; left:58px; right:16px; } .altui-multiswitch-container .row { padding-top:1px; padding-bottom:1px; margin-left:0px; margin-right:0px;} .altui-multiswitch-container .col-xs-3 { padding-left:1px; padding-right:1px; }  .altui-multiswitch-open { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left:0px; padding-right:0px; margin-left:0px; margin-right:0px; width: 100%; max-width: 100% }";
		style += ".altui-cyan { color:cyan;}";
		style += ".altui-dimmable-slider { margin-left: 60px; }";	
		style += ".altui-infoviewer-log,.altui-window-btn,.altui-datamine-open { margin-top: 10px; }";	
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
	function _toggleButton(altuiid, htmlselector, service, variable, cbfunc) {
		//'#altui-onoffbtn-'+devid
		var device = MultiBox.getDeviceByAltuiID(altuiid);
		var status = MultiBox.getStatus( device, service, variable );
		if ($.isNumeric(status))
		{
			status = parseInt( status );
			if (status>0)		// special case of dimmer
				status=1;
			$(htmlselector).removeClass("on").addClass("spinner");
			cbfunc(device, 1-status);
		}
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawCamera( device ) {
		var video = MyLocalStorage.getSettings('ShowVideoThumbnail') || "";
		var urlHead = MultiBox.getUrlHead(device.altuiid) 
		if ( MultiBox.isRemoteAccess() || (video==false) ) {
			var img = $("<img class='altui-camera-picture'></img>")
				.attr('src',urlHead+"?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
				.height(50)
				.width(66);

			return img.wrap( "<div></div>" ).parent().html();
		} else {
			var streamurl = "url(http://{0}{1})".format(
				device.ip,	//ip
				MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" )	//DirectStreamingURL
			);
			var div = $("<div class='altui-camera-picture'></div>")
				.css({
					"background-image": streamurl,
					"background-size": "cover",
					"margin-left": 55,
					"margin-top": 1
					})
				// .css("background-size","contain")
				.height(50)
				.width(50);
			return div.wrap( "<div></div>" ).parent().html();
		}
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawTempSensor( device) {
		var html = "";
		var ws = MultiBox.getWeatherSettings();
		if (ws.tempFormat==undefined)
			ws.tempFormat="";
		
		var status = parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' )); 
		html += ("<span class='altui-temperature' >"+status+"&deg;"+ws.tempFormat+"</span>");
		return html;
	}
	
	function _drawHeater( device) {
		var html = "";
		var ws = MultiBox.getWeatherSettings();
		if (ws.tempFormat==undefined)
			ws.tempFormat="";
		
		var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' ); 
		var allsetpoints = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1', 'AllSetpoints' ); 
		var heatsetpoint=null, coldsetpoint=null, autosetpoint=null;
		if (allsetpoints==null) {
			heatsetpoint = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1_Heat', 'CurrentSetpoint' ); 
			coldsetpoint = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1_Cool', 'CurrentSetpoint' ); 
		}
		else {
			var splits = allsetpoints.split(",");
			heatsetpoint = splits[0] || "";
			coldsetpoint = splits[1] || "";
			autosetpoint = splits[2] || "";
		}

		html += ("<span class='altui-temperature' >"+((status!=null) ? (parseFloat(status).toFixed(1)+"&deg;"+ws.tempFormat) : "--") +"</span>");
		if (heatsetpoint!=null) {
			html += ("<span class='altui-temperature altui-red' > / "+parseFloat(heatsetpoint).toFixed(1)+"&deg;"+ws.tempFormat+"</span>");
		}
		if (coldsetpoint!=null) {
			html += ("<span class='altui-temperature altui-blue' > / "+parseFloat(coldsetpoint).toFixed(1)+"&deg;"+ws.tempFormat+"</span>");
		}
		if (autosetpoint!=null) {
			html += ("<span class='altui-temperature' > / "+parseFloat(autosetpoint).toFixed(1)+"&deg;"+ws.tempFormat+"</span>");
		}
		return html;
	}

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawHumidity( device) {
		var html = "";
		var status = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:HumiditySensor1', 'CurrentLevel' )); 
		html += ("<span class='altui-humidity' >"+status+" % </span>");
		return html;
	};
	
	function _drawLight( device) {
		var html = "";
		var status = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:LightSensor1', 'CurrentLevel' )); 
		var unit = (status>100) ? "lux" : "% or lux";
		html += ("<span class='altui-light' >{0} {1}</span>".format(status,unit));
		return html;
	};

	function _onClickWindowCoverButton(e)
	{
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Up
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Down
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Stop
		var altuiid = e.closest(".altui-device").data("altuiid");
		var actionname = e.prop('id').substr("altui-window-".length);
		if (actionname=="Stop") 
			MultiBox.runActionByAltuiID( altuiid, "urn:upnp-org:serviceId:WindowCovering1", "Stop", {} );
		else
			MultiBox.runActionByAltuiID( altuiid, "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget: ((actionname=="Up") ? 100 : 0) } );
	};

	function _drawWindowCover( device) {
		var status = MultiBox.getStatus(device,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus");	// 0 - 100

		var html = "";
		html += "<div class='pull-right'><div id='altui-wc-"+device.altuiid+"' class='btn-group altui-windowcover' role='group' aria-label='...'>";
		html += ("  <button id ='altui-window-Up' type='button' class='altui-window-btn btn btn-default btn-sm {0}'>"+_T("Up")+"</button>").format( (status==100) ? 'active' : '' );
		html += ("  <button id ='altui-window-Stop' type='button' class='altui-window-btn btn btn-default btn-sm'>"+_T("Stop")+"</button>");
		html += ("  <button id ='altui-window-Down' type='button' class='altui-window-btn btn btn-default btn-sm {0}'>"+_T("Down")+"</button>").format( (status==0) ? 'active' : '' );
		html += "</div>";
		html += "</div>";
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-wc-{0} button').on('click touchend', function() { ALTUI_PluginDisplays.onClickWindowCoverButton($(this)); } );".format(device.altuiid);
		html += "</script>";
		
		return html;
	};

	function _onSliderChange(event,ui) {
		var altuiid = $(ui.handle).closest(".altui-device").data("altuiid");
		MultiBox.runActionByAltuiID ( altuiid, "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget:ui.value} );
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDimmable( device) {

		var html = "";
		var onebody = $(".altui-device-body");
		var sliderwidth = (onebody.length>=1) ? onebody.first().width()-65-70  : 95;
		var bodywidth=$(".altui-device-body").first().width();
		
		// load level
		var level = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelTarget' )); 
		if (isNaN(level)==true) 
			level = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelStatus' )); 
		
		html += ("<span id='slider-val-"+device.altuiid+"' class='altui-dimmable' >"+level+"% </span>");

		// on off button
		var status = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( (device.status==1) || (device.status==5) )  {  
		// if ( level != status )  {  
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
		if (_isBusyStatus(device))  {  
			status = -1;
		}
		html += _createOnOffButton( status,"altui-onoffbtn-"+device.altuiid , _T("OFF,ON") , "pull-right");
		
		// dimming
		html+=("<div id='slider-{0}' class='altui-dimmable-slider' style='width: "+sliderwidth+"px;' ></div>").format(device.altuiid);
		
		// on off 
		html += "<script type='text/javascript'>";
		html += "$('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleOnOffButton('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "$('div#slider-{0}.altui-dimmable-slider').slider({ max:100,min:0,value:{1},change:ALTUI_PluginDisplays.onSliderChange });".format(device.altuiid,level);
		html += "</script>";
		
		$(".altui-mainpanel").off("slide","#slider-"+device.altuiid);
		$(".altui-mainpanel").on("slide","#slider-"+device.altuiid,function( event, ui ){ 
			$("#slider-val-"+device.altuiid).text( ui.value+'%');
		});
		
		return html;
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDoorLock( device) { 
		var status = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:DoorLock1', 'Status' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("Unlock,Lock") , "pull-right");
		
		var lasttrip = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'LastTrip' );
		if (lasttrip != null) {
			var lasttripdate = _toIso(new Date(lasttrip*1000),' ');
			html+= "<div class='altui-lasttrip-text text-muted'>{0} {1}</div>".format( timeGlyph,lasttripdate );
		}
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleDoorLock('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDoorSensor( device) {
		return _drawMotion( device);
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawSmoke( device) {
		return _drawMotion( device);
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawMotion( device) {
		var html = "";
		
		// armed button
		// var status = parseInt(MultiBox.oldgetStatus( devid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
			// status = -1;
		// }
		var armed = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed' )); 
		html += _createOnOffButton( armed,"altui-onoffbtn-"+device.altuiid, _T("Bypass,Arm"), "pull-right" );
		
		var lasttrip = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'LastTrip' );
		if (lasttrip != null) {
			var lasttripdate = _toIso(new Date(lasttrip*1000),' ');
			html+= "<div class='altui-lasttrip-text text-muted'>{0} {1}</div>".format( timeGlyph,lasttripdate );
		}

		// armed, tripped
		var tripped = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Tripped' )); 
		html += ("<span class='altui-motion' >{0}</span>".format( (tripped==true) ? "<span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'></span>" : ""));

		// armed
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleArmed('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	
	function _drawBinaryLight( device) {
		var html ="";
		html += UIManager.defaultDeviceDrawWatts( device);

		var status = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
		// if ( (device.status==1) || (device.status==5))  {  
		if ( _isBusyStatus(device) )  {  
			status = -1;
		}
		html += _createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("OFF,ON") , "pull-right");
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleOnOffButton('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};

	function _drawPowerMeter( device) {
		var html ="";
		var wattTemplate = "<div class='altui-watts '>{0} <small>Watts</small></div>";		
		var watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 
		if (isNaN(watts)==false) 
			html += wattTemplate.format(watts);
		var voltTemplate = "<div class='altui-volts '>{0} <small>Volts</small></div>";
		var volts = parseFloat(MultiBox.getStatus( device, 'urn:brultech-com:serviceId:PowerMeter1', 'Volts' ));
		if (isNaN(volts)==false) 
			html += voltTemplate .format(volts);
		return html;
	};
	
	function _drawCountDown( device) {
		var html ="";
		var remaining = parseInt(MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CountdownTimer1', 'Remaining' ));
		var duration = parseInt(MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CountdownTimer1', 'Duration' ));
		html+= "<div class='altui-countdown'>{0} / {1}</div>".format( remaining , duration );
		return html;
	};

	function _drawVacation( device) {
		var html ="";
		var status = parseInt( MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status') );
		var expiryDate =  MultiBox.getStatus( device, 'urn:futzle-com:serviceId:HolidayVirtualSwitch1', 'OverrideExpiryDate');
		html+= "<div class='altui-watts '>{0}</div>".format( (status==1) ? _T("Holiday") : _T("Working") );
		html+= "<div class=''>{0}</div>".format( expiryDate );
		return html;
	};

	function _drawWeather( device) {
		var html ="";
		var condition = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'Condition');
		var wind = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'WindCondition');
		html+= "<div class='altui-weather-text'>{0}</div>".format( condition );
		html+= ("<div class='altui-weather-text'>"+_T("Wind")+": {0}</div>").format( wind );
		return html;
	};
	
	function _drawWeatherIcon( device) {
		var html ="";
		var conditionGroup = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'ConditionGroup');
		var newsrc = (conditionGroup!=null) ? "http://icons.wxug.com/i/c/i/"+conditionGroup+".gif" : defaultIconSrc;
		return "<img class='altui-device-icon pull-left img-rounded' src='"+newsrc+"' alt='"+conditionGroup+"' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
	};

	function _drawDataMine( device) {
		var html ="";
		var ipaddr = MultiBox.getIpAddr(device.altuiid);
		var hostname = (ipaddr=='') ? window.location.hostname : ipaddr;
		var url = window.location.protocol+'//'+hostname+"/dm/index.html";
		html+= ("<button id='altui-datamine-{0}' type='button' class='pull-right altui-datamine-open btn btn-default btn-sm ' >{1}</button>" .format( device.altuiid,_T("Open") )) ;
		html += "<script type='text/javascript'>";
		html += " $('button#altui-datamine-{0}.altui-datamine-open').on('click', function() { window.open('{1}','_blank'); } );".format(device.altuiid,url);
		html += "</script>";
		return html;
	};	
	
	function _drawMultiswitch(device) {
		var btnid = 0;
		var html ="";

		var names = MultiBox.getStatus(device,"urn:dcineco-com:serviceId:MSwitch1","BtnNames") || "[]";
		names = JSON.parse(names);

		html += "<div class='altui-multiswitch-container pull-right'>";
		for (var line=0; line<2 ; line++) {
			html += "<div class='row'>";
			for (var col=0; col<4; col ++) {
				var name = names[btnid] ? names[btnid] : ("Btn_"+btnid);
				var status = parseInt(MultiBox.getStatus(device,"urn:dcineco-com:serviceId:MSwitch1","Status"+(btnid+1)));

				html += "<div class='col-xs-3'>";
				html+= ("<button id='{0}' type='button' class='altui-multiswitch-open btn btn-default btn-xs {2}' >{1}</button>".format( 
					btnid ,
					name  ,
					(status==1) ? 'btn-info' : ''
					)) ;
				// html+= "x";
				html += "</div>";
				
				btnid ++;
			}
			html += "</div>";
		}
		html += "</div>";
		html += "<script type='text/javascript'>";
		html += " $('button.altui-multiswitch-open').on('click', function() { 	";
		html += " 	var btnid = parseInt($(this).prop('id'))+1;					";
		html += "   var action = 'SetStatus'+btnid; 							";
		html += "   var params = {}; params['newStatus'+btnid]=-1;				";
		html += "	MultiBox.runActionByAltuiID('{0}', 'urn:dcineco-com:serviceId:MSwitch1', action, params);".format(device.altuiid);
		html += "});"
		html += "</script>";
		return html;
	};
	
	function _drawInfoViewer( device) {
		var html ="";
		var pattern = MultiBox.getStatus( device, 'urn:a-lurker-com:serviceId:InfoViewer1', 'LuaPattern');
		var urlhead = MultiBox.getUrlHead(device.altuiid);
		if (pattern!="")
			html+= "<span class=''>Pattern: {0}</span>".format( pattern.htmlEncode() );
		html+= ("<button id='altui-infoviewer-{0}' type='button' class='pull-right altui-infoviewer-log btn btn-default btn-sm '>{1}</button>" .format( device.altuiid,_T("Open") )) ;
		html += "<script type='text/javascript'>";
		html += " $('button.altui-infoviewer-log').on('click', function() { window.open('{1}?id=lr_al_info','_blank'); } );".format(device.altuiid,urlhead);
		html += "</script>";
		return html;
	};	
	
	function _drawBinLightControlPanel(device, domparent) {

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
	drawHeater	   : _drawHeater,
	drawCamera     : _drawCamera,
	onSliderChange : _onSliderChange,
	drawDoorSensor : _drawDoorSensor,
	drawDoorLock   : _drawDoorLock,
	drawDimmable   : _drawDimmable,
	drawMotion 	   : _drawMotion,
	drawSmoke 	   : _drawSmoke,
	drawHumidity   : _drawHumidity,
	drawLight   	: _drawLight,
	drawWindowCover : _drawWindowCover,
	drawPowerMeter  : _drawPowerMeter,
	drawVacation    : _drawVacation,
	drawCountDown    : _drawCountDown,
	drawWeather     : _drawWeather,
	drawWeatherIcon : _drawWeatherIcon,
	drawInfoViewer  : _drawInfoViewer,
	drawDataMine 	: _drawDataMine,
	drawMultiswitch : _drawMultiswitch,		// warning, hardcoded display direction from UIMANAGER on this one due to changing device type
	toggleButton    : _toggleButton,
	toggleOnOffButton : function (altuiid,htmlid) {
		_toggleButton(altuiid, htmlid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status', function(id,newval) {
			MultiBox.setOnOff( altuiid, newval);
		});
	},
	toggleArmed : function (altuiid,htmlid) {
		_toggleButton(altuiid, htmlid,'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed', function(id,newval) {
			MultiBox.setArm( altuiid, newval);
		});
	},
	toggleDoorLock : function (altuiid, htmlid) {
		_toggleButton(altuiid, htmlid,'urn:micasaverde-com:serviceId:DoorLock1', 'Status', function(id,newval) {
			MultiBox.setDoorLock( altuiid, newval);
		});
	}
  };
})( window );
