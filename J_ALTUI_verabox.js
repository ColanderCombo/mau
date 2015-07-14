//# sourceURL=J_ALTUI_verabox.js
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

// Global for UI5 UI7 javascript compatibility
var jsonp={};
jsonp.ud={};
jsonp.ud.devices=[];
jsonp.ud.scenes=[];
jsonp.ud.rooms=[];
jsonp.ud.static_data=[];
var user_changes=0;

var UPnPHelper = (function(window,undefined) {
	//---------------------------------------------------------
	// private functions
	//---------------------------------------------------------	
	var XML_CHAR_MAP = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	'"': '&quot;',
	"'": '&apos;'
	};
 
	function escapeXml (s) {
		return s.replace(/[<>&"']/g, function (ch) {
			return XML_CHAR_MAP[ch];
		});
	}

	function _getUrlHead() {
		return window.location.pathname;
	}
	
	function _buildAttributeSetUrl( deviceID, attribute, value) {
		// TODO: investigate if we can use : http://192.168.1.16/port_3480/data_request?id=lu_variableset&DeviceNum=58&Variable=onDashboard&Value=0
		var urlHead ="data_request?id=lr_ALTUI_Handler&command=set_attribute&devid="+deviceID+"&attr="+encodeURIComponent(attribute)+"&value="+encodeURIComponent(value);
		return urlHead;
	}
	
	function _buildVariableSetUrl( deviceID, service, varName, varValue)
	{
		var urlHead = _getUrlHead()+'?id=variableset&DeviceNum='+deviceID+'&serviceId='+service+'&Variable='+varName+'&Value='+encodeURIComponent(varValue);
		return urlHead;
	}
	function _buildVariableGetUrl( deviceID, service, varName)
	{
		var urlHead = _getUrlHead()+'?id=variableget&DeviceNum='+deviceID+'&serviceId='+service+'&Variable='+varName;
		return urlHead;
	}
	function _buildSceneCreateUrl()
	{
		//http://ip_address:3480/data_request?id=scene&action=create&json=
		var urlHead = _getUrlHead()+'?id=scene&action=create';
		return urlHead;
	}	
	function _buildUPnPGetFileUrl( file )
	{
		var urlHead = window.location.pathname.replace("data_request","luvd/")+file;
		return urlHead;
	}
	function _buildUPnPUpdatePluginVersion( pluginid ,version )
	{
		var urlHead = _getUrlHead()+'?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=CreatePlugin&PluginNum={0}&Version={1}'.format(pluginid ,version);
		return urlHead;
	}		
	function _buildUPnPUpdatePlugin( pluginid )
	{
		var urlHead = _getUrlHead()+'?id=update_plugin&Plugin='+pluginid;
		return urlHead;
	}		
	function _buildUPnPActionUrl(deviceID,service,action,params)
	{
		var urlHead = _getUrlHead()+'?id=action&output_format=json&DeviceNum='+deviceID+'&serviceId='+service+'&action='+action;//'&newTargetValue=1';
		if (params != undefined) {
			$.each(params, function(index,value) {
				urlHead = urlHead+"&"+index+"="+value;
			});
		};
		return urlHead;
	};
	function _buildUPnPRunLua(code) {
	//http://192.168.1.5/port_3480/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&DeviceNum=81&Code=getMapUrl(81)
		var urlHead = _getUrlHead()+'?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&Code='+encodeURIComponent(code);
		return urlHead;	
	};
	
	function _buildHAGSoapUrl()
	{
		var url = window.location.protocol+'//'+window.location.hostname+"/port_49451/upnp/control/hag";
		return url;
	}
	
	function _exec(url,cbfunc,mimetype) {
		var options = {
			url: url,
			type: "GET"
		};
		if (mimetype != undefined) {
			// options.dataType = "xml text";		NOTHING works in FF
			options.beforeSend = function(xhr) { xhr.overrideMimeType(mimetype); };
		}
		else {
			options.dataType = "text";
			options.beforeSend = function(xhr) { xhr.overrideMimeType("text/plain"); }
		}
		var jqxhr = $.ajax( options )
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction( cbfunc )) {
				cbfunc(data,jqXHR);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction( cbfunc )) {
				cbfunc(null,jqXHR);
			}
			else
				PageMessage.message( formatAjaxErrorMessage(jqXHR, textStatus), "warning" ) ;				
		})
		.always(function() {
		});
	};

	function _UPnPSetAttr( deviceID, attribute, value, cbfunc)
	{
		// _exec( _buildAttributeSetUrl( deviceID, attribute, value) );
		var target = {};
		target.devices={};
		target.devices["devices_"+deviceID]={};
		target.devices["devices_"+deviceID][attribute]=value;
		// var target = {
			// "devices":{
				// "devices_5": {
					// "states": {},
					// "model": "test"
				// }
			// }
		// };
		_ModifyUserData( target, cbfunc );
	};
	
	function _UPnPSet( deviceID, service, varName, varValue )
	{
		_exec( _buildVariableSetUrl( deviceID, service, varName, varValue) );
	};

	function _UPnPAction( deviceID, service, action, params, cbfunc )
	{
		_exec( _buildUPnPActionUrl(deviceID,service,action,params) , cbfunc);
	};
	
	function _UPnPGetFile( devicefile, cbfunc )
	{
		var mimetype ;
		var lastfour = devicefile.slice(-4);
		if (lastfour==".xml")
			mimetype = "text/xml";
		
		_exec( _buildUPnPGetFileUrl( devicefile), function(data,jqXHR) {
			if (jqXHR.responseXML) {
				data = new XMLSerializer().serializeToString(jqXHR.responseXML);
				jqXHR.responseText=data;
			}
			(cbfunc)(data,jqXHR);
		}, mimetype);	
	};
	
	function _UPnPDeletePlugin( pluginid, cbfunc )
	{
		AltuiDebug.debug("_UPnPDeletePlugin( {0} )".format( pluginid));
		
		var xml = "";
		xml +="<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>";
		xml +="   <s:Body>";
			xml +="<u:DeletePlugin xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>";
				xml +="<PluginNum>{0}</PluginNum>";
			xml +="</u:DeletePlugin>";
		xml +="   </s:Body>";
		xml +="</s:Envelope>";

		var url = _buildHAGSoapUrl();
		$.ajax({
			url: url,
			type: "POST",
			dataType: "text",
			contentType: "text/xml;charset=UTF-8",
			processData: false,
			data:  xml.format( pluginid  ),
			headers: {
				"SOAPACTION":'"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#DeletePlugin"'
			},
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction( cbfunc ))
			{
				var re = /<OK>(.+)<\/OK>/; 
				var result = data.match(re);
				cbfunc( ( result != null) && (result.length>=2) ? result[1] : null );		// device ID in call back
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction( cbfunc ))
				cbfunc(null);
		})
		.always(function() {
		});
	};

	function _UPnPUpdatePluginVersion( pluginid, version, cbfunc )
	{
		_exec( _buildUPnPUpdatePluginVersion( pluginid,version), cbfunc );
	};
	
	function _UPnPUpdatePlugin( pluginid, cbfunc )
	{
		_exec( _buildUPnPUpdatePlugin( pluginid), cbfunc );
	};

	function _UPnPRunLua( code, cbfunc )
	{
		_exec( _buildUPnPRunLua( code), cbfunc );
	};

	function _reloadEngine(cbfunc)
	{
		// Resets the Luup engine with any new configuration settings.
		// Example: http://ip_address:3480/data_request?id=reload
		_exec( _getUrlHead()+'?id=reload' , cbfunc);
	};
	
	function _renameDevice( devid, newname, roomid )
	{
		var device = this.getDeviceByID(devid);
		var oldname = device.name;
		DialogManager.confirmDialog(_T("Are you sure you want to modify this device to:")+newname,function(result) {
			if (result==true) {
				device.name = newname;
				device.dirty = true;
				var url = _getUrlHead()+"?id=device&action=rename&device="+devid+"&name="+newname;
				if (roomid !=undefined)
					url = url+"&room="+roomid;
				_exec( url, function(result) {	
					if (result!="OK") 
						PageMessage.message( _T("Device modify failed!"), "warning" );
					else
						PageMessage.message( _T("Device modified!"), "success" );
				} );
			}
		});
	};
	
	function _createDevice( descr, dfile, ifile, roomnum, cbfunc )
	{
		AltuiDebug.debug("_createDevice( {0},{1},{2},{3} )".format( descr, dfile, ifile,roomnum));
		var xml = "";
		xml +="<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>";
		xml +="   <s:Body>";
			xml +="<u:CreateDevice xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>";
				xml +="<deviceType></deviceType>";
				xml +="<internalID></internalID>";
				xml +="<Description>{0}</Description>";
				xml +="<UpnpDevFilename>{1}</UpnpDevFilename>";
				xml +="<UpnpImplFilename>{2}</UpnpImplFilename>";
				xml +="<IpAddress></IpAddress>";
				xml +="<MacAddress></MacAddress>";
				xml +="<DeviceNumParent>0</DeviceNumParent>";
				xml +="<RoomNum>{3}</RoomNum>";
			xml +="</u:CreateDevice>";
		xml +="   </s:Body>";
		xml +="</s:Envelope>";

		var url = _buildHAGSoapUrl();
		$.ajax({
			url: url,
			type: "POST",
			dataType: "text",
			contentType: "text/xml;charset=UTF-8",
			processData: false,
			data:  xml.format( descr,dfile, ifile, roomnum  ),
			headers: {
				"SOAPACTION":'"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#CreateDevice"'
			},
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction( cbfunc ))
			{
				var re = /<DeviceNum>(\d+)<\/DeviceNum>/; 
				var result = data.match(re);
				cbfunc( ( result != null) && (result.length>=2) ? result[1] : null );		// device ID in call back
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction( cbfunc ))
				cbfunc(null);
		})
		.always(function() {
		});
	}
	
// http://192.168.1.5/port_49451/upnp/control/hag
// POST /port_49451/upnp/control/hag HTTP/1.1
// Host: 192.168.1.16
// Connection: keep-alive
// Content-Length: 17389
// Origin: http://192.168.1.16
// User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36
// Content-Type: text/xml;charset=UTF-8
// Accept: */*
// X-Requested-With: XMLHttpRequest
// SOAPACTION: "urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#ModifyUserData"
// MIME-Version: 1.0
// Referer: http://192.168.1.16/cmh/
// Accept-Encoding: gzip, deflate
// Accept-Language: fr,fr-FR;q=0.8,en;q=0.6,en-US;q=0.4
// <?xml version="1.0" encoding="UTF-8"?>
// <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
   // <s:Body>
      // <u:ModifyUserData xmlns:u="urn:schemas-micasaverde-org:service:HomeAutomationGateway:1">
         // <inUserData>
		 // {"devices":{},"scenes":{},"sections":{},"rooms":{},"StartupCode":"","InstalledPlugins":[],"PluginSettings":[{"plugin_id":1408,"AutoUpdate":1}],"users":{}}
		 // </inUserData>
         // <DataFormat>json</DataFormat>
      // </u:ModifyUserData>
   // </s:Body>
// </s:Envelope>	
	function _ModifyUserData( user_data, cbfunc )
	{
		
		var target = {
			"devices":{},
			"scenes":{},
			"sections":{},
			"rooms":{},
			"InstalledPlugins":[],
			"PluginSettings":[],
			"users":{}
		};
		
		var xml = "";
		xml +="<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>";
		xml +="   <s:Body>";
		xml +="      <u:ModifyUserData xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>";
		xml +="         <inUserData>";
		xml +="		 	{0}";
		xml +="		 	</inUserData>";
		xml +="         <DataFormat>json</DataFormat>";
		xml +="      </u:ModifyUserData>";
		xml +="   </s:Body>";
		xml +="</s:Envelope>";

		$.extend( target, user_data );
		var url = _buildHAGSoapUrl();
		$.ajax({
			url: url,
			type: "POST",
			dataType: "text",
			contentType: "text/xml;charset=UTF-8",
			processData: false,
			data:  xml.format( escapeXml(JSON.stringify(target)) ),
			headers: {
				"SOAPACTION":'"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#ModifyUserData"'
			},
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction( cbfunc ))
				cbfunc(data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction( cbfunc ))
				cbfunc(null);
		})
		.always(function() {
		});
	};
	
	function _sceneAction( sceneobj ) {
		if (0)  {
			//
			// DOES NOT WORK when the trigger has a LUA
			//
			var url= _buildSceneCreateUrl();
			var data = JSON.stringify(sceneobj); //escapeXml(JSON.stringify(sceneobj));
			url += "&json="+encodeURI(data);
			$.ajax({
				url: url,
				type: "GET",
				// processData: false,
				contentType: "text/xml;charset=UTF-8",
				// data:  {
					// json:data,
				// }
			})
			.done(function(data, textStatus, jqXHR) {
				if (data=="ERROR")
					PageMessage.message( "Scene action failed!", "warning" );
				else {	
					PageMessage.message( "Scene action succeeded! a LUUP reload will happen now, be patient", "success" );
					_reloadEngine();
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
			})
			.always(function() {
			});		
		}
		else {
			var id = sceneobj.id;	
			var target = {
				"devices":{},
				"scenes":{},
				"sections":{},
				"rooms":{},
				"InstalledPlugins":[],
				"PluginSettings":[],
				"users":{}
			};
			target.scenes["scenes_"+id]=sceneobj;
			// console.log( JSON.stringify(target));
			_ModifyUserData( target, function(result) {
				if (result==null) {
					PageMessage.message( "Scene action failed!", "warning" );				
				}
				else {
					PageMessage.message( "Scene action succeeded! a LUUP reload will happen now, be patient", "success" );			
				}
			});
		}
	};
	
	return {
		//---------------------------------------------------------
		// Public  functions
		//---------------------------------------------------------

		reloadEngine	: _reloadEngine,
		getUrlHead		: _getUrlHead,
		buildUPnPGetFileUrl : _buildUPnPGetFileUrl,
		UPnPSetAttr		: _UPnPSetAttr,	// ( deviceID, attribute, value, cbfunc)
		UPnPSet			: _UPnPSet,		// ( deviceID, service, varName, varValue )
		UPnPAction		: _UPnPAction,	// ( deviceID, service, action, params, cbfunc )
		UPnPGetFile		: _UPnPGetFile,
		UPnPUpdatePluginVersion : _UPnPUpdatePluginVersion,
		UPnPUpdatePlugin: _UPnPUpdatePlugin,
		UPnPDeletePlugin: _UPnPDeletePlugin,
		UPnPRunLua 		: _UPnPRunLua,
		ModifyUserData	: _ModifyUserData,
		renameDevice 	: _renameDevice,
		createDevice	: _createDevice,
		sceneAction 	: _sceneAction,			// (sceneobj)  will be transformed in json
		
		setOnOff		: function ( deviceID, onoff) {
			_UPnPAction( deviceID, 'urn:upnp-org:serviceId:SwitchPower1', 'SetTarget', {'newTargetValue':onoff} );
		},
		setArm			: function ( deviceID, armed) {
			_UPnPAction( deviceID, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'SetArmed', {'newArmedValue':armed} );
			// _UPnPSet( deviceID, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed', armed );
		},
		setDoorLock			: function ( deviceID, armed) {
			_UPnPAction( deviceID, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {'newTargetValue':armed} );
		},
	};
}) (window);


// url : http://192.168.1.16/port_49451/upnp/control/dev_1
// POST /port_49451/upnp/control/dev_1 HTTP/1.1
// Host: 192.168.1.16
// Connection: keep-alive
// Content-Length: 250
// Origin: http://192.168.1.16
// User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36
// Content-Type: text/xml;charset=UTF-8
// Accept: */*
// X-Requested-With: XMLHttpRequest
// SOAPACTION: "urn:schemas-micasaverde-org:service:ZWaveNetwork:1#BackupDongle"
// MIME-Version: 1.0
// Referer: http://192.168.1.16/cmh/
// Accept-Encoding: gzip, deflate
// Accept-Language: fr,fr-FR;q=0.8,en;q=0.6,en-US;q=0.4

// request payload
// <s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"
    // xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    // <s:Body>
        // <u:BackupDongle
            // xmlns:u="urn:schemas-micasaverde-org:service:ZWaveNetwork:1">
        // </u:BackupDongle>
    // </s:Body>
// </s:Envelope>

var VeraBox = ( function( ip_addr ) {
  //---------------------------------------------------------
  // private functions
  //---------------------------------------------------------
	var _dataEngine = null;
	var _rooms = null;
	var _scenes = null;
	var _devices = null;
	var _categories = null;
	var _devicetypes = {};
	var _user_data = {};
	var _change_cached_user_data = {};
	var _user_data_DataVersion = 1;
	var _user_data_LoadTime = null;
	var _status_data_DataVersion = 1;
	var _status_data_LoadTime = null;
	
	// setters to set the data in the cache, cb functions because asynchronous
	function _setRooms(arr) 		{	_rooms = arr;		};
	function _setScenes(arr) 		{	_scenes = arr;		};
	function _setCategories(arr)	{	_categories = arr;	};
	function _setDevices(arr) 		{	_devices = arr;		};
	
	function _saveChangeCaches( msgidx ) {
		UPnPHelper.ModifyUserData( _change_cached_user_data, function() {
			PageMessage.message("ModifyUserData called & returned, a restart will occur now","success");
			PageMessage.clearMessage(msgidx);
		});
		_change_cached_user_data={};
		user_changes=0;	//UI5 compat
	};
	
	function _updateChangeCache( target ) {
		$.extend(true, _change_cached_user_data, target);
		PageMessage.message("You need to save your changes","info", true );
		user_changes=1; //UI5 compat
	};
	
	function _reboot()
	{
		VeraBox.runLua("os.execute('reboot')", function(result) {
			if ( result == "Passed")
				PageMessage.message( "Reboot request succeeded", "success");
			else
				PageMessage.message( "Reboot request failed", "danger");
		});
	};
	function _reloadEngine()
	{
		UPnPHelper.reloadEngine( function(data) {
			if (data!=null) {
				// reload worked,  reset all cache
				_rooms = null;
				_devices = null;
				_scenes = null;
				_devicetypes = [];
				_change_cached_user_data={};
				user_changes=0;	//UI5 compat
			}
		});
	};
	
	// process the async response function
	function _asyncResponse( arr, func , filterfunc, endfunc ) {
		if ( $.isFunction( func ) && (arr!=null) ) 
		{
			$.each( arr , function( idx, obj ) {				
				if (( ($.isFunction( filterfunc )==false) || (filterfunc(obj)==true) ) && (obj!=null)) {
					func(idx+1,obj);	// device id in LUA is idx+1
				}
			});
		} 
			
		if ( $.isFunction( endfunc ) )  {
			endfunc(arr);			
		}
	};

	function _getPower(cbfunc) {
		var url = "data_request?id=live_energy_usage";
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			dataType: "text",
			cache: false
		})
		.done(function(data) {
			if ( $.isFunction( cbfunc ) )  {
				(cbfunc)(data);
			}
		})
		.fail(function(jqXHR, textStatus) {
			PageMessage.message( _T("VERA is busy, be patient. (returned {0})").format(textStatus) , "warning");
		})
		.always(function() {
		});
	};
	
	function _getWeatherSettings()
	{
		var target = {tempFormat: "", weatherCountry: "", weatherCity: ""};
		$.extend(target, _user_data.weatherSettings);
		return target;
	}
	
	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getRooms( func , filterfunc) {
		if (_rooms)
			_asyncResponse( _rooms.sort(_sortByName), func , filterfunc)
		return _rooms;
	};
	
	function _getRoomByID( roomid ) {
		var room=null;
		if ( _rooms ) {
			$.each(_rooms, function( idx,r) {
				if (r.id==roomid) {
					room = r;
					return false;
				}
			});
		}
		return room;
	};
	
	function _sortByName(a,b)
	{
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	};

	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getScenes( func , filterfunc, endfunc ) {
		if (_scenes != null )
			_asyncResponse( _scenes.sort(_sortByName), func , filterfunc, endfunc);
		return _scenes;
	};

	function _getPlugins( func , endfunc ) {
		if (_user_data.InstalledPlugins2)
			_asyncResponse( _user_data.InstalledPlugins2, func , null, endfunc);
		return _user_data.InstalledPlugins2;
	};
	
	function _getPluginByID	(id) {
		var plugin = null;
		$.each(_user_data.InstalledPlugins2,function(idx,p) {
			if (p.id==id) {
				plugin = p;
				return false;
			}
		});
		return plugin;
	};
	
	function _getDevices( func , filterfunc, endfunc ) {
		if (_devices !=null)
			_asyncResponse( _devices.sort(_sortByName), func, filterfunc, endfunc )
		return _devices;
	};
	function _getCategories( cbfunc, filterfunc, endfunc )
	{
		//http://192.168.1.16:3480/data_request?id=sdata&output_format=json
		if (_categories==null) {
			var url = "data_request?id=sdata&output_format=json";
			var jqxhr = $.ajax( {
				url: url,
				type: "GET",
				dataType: "text",
				cache: false
			})
			.done(function(data) {
				var arr = JSON.parse(data);
				_categories = arr.categories;
				if ( $.isFunction( cbfunc ) )  {
					_asyncResponse( _categories.sort(_sortByName), cbfunc, filterfunc, endfunc );
				}
			})
			.fail(function(jqXHR, textStatus) {
				_categories = null;
				PageMessage.message( _T("VERA is busy, be patient. (returned {0})").format(textStatus) , "warning");
			})
			.always(function() {
			});
		} else {
			_asyncResponse( _categories.sort(_sortByName), cbfunc, filterfunc, endfunc );
		}
		return _categories;
	};
	function _getIcon( imgpath , cbfunc ) {
		var url = "data_request?id=lr_ALTUI_Handler&command=image";
		var result = "";
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			//dataType: "text",
			data: {
				path: imgpath
			}
		})
		.done(function(data) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(data);			
			}
		})
		.fail(function(jqXHR, textStatus) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc("");			
			}
		})
		.always(function() {
		});
		return result;
	};
	
	function _getHouseMode(cbfunc) {
		var url = "data_request?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode";

		$.ajax({
			url:url,
		})
		.done(function(data) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(data);			
			}
		})
		.fail(function(jqXHR, textStatus) {
			PageMessage.message( _T("VERA is busy, be patient. (returned {0})").format(textStatus) , "warning");
			if ( $.isFunction( cbfunc ) )  {
				cbfunc( null );			
			}
		})
		.always(function() {
		});
	};

	function _setHouseMode(newmode,cbfunc) {
		if ((newmode<=4) && (newmode>=1)) {
			UPnPHelper.UPnPAction( 0, 'urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode:newmode },cbfunc );
		}
	};
	
	function _findDeviceIdxByID(devid)
	{
		var idx=-1;
		$.each(_user_data.devices, function(i,device) {
			if (device.id==devid) {
				idx = i;
				return false;
			}
		});
		return idx;
	};

	function _getDeviceByType( device_type ) {
		var idx=-1;
		$.each(_user_data.devices, function(i,device) {
			if (device.device_type==device_type)  {
				idx = i;
				return false;
			}
		});
		return (idx == -1) ? null : _user_data.devices[idx];
	};

	function _getDeviceByAltID( parentdevid , altid ) {
		var idx=-1;
		$.each(_user_data.devices, function(i,device) {
			if ( (device.id_parent==parentdevid) && (device.altid==altid) ) {
				idx = i;
				return false;
			}
		});
		return (idx == -1) ? null : _user_data.devices[idx];
	};
	
	function _getDeviceByID( devid ) {
		var idx = _findDeviceIdxByID(devid);
		if (idx!=-1) {
			return _user_data.devices[idx];
		}
		return null;
	};

	function _getSceneByID(sceneid) {
		var found=null;
		$.each(_user_data.scenes, function( i,scene) {
			if (scene.id == sceneid) {
				found = scene;
				return false;
			}
		});
		return found;
	};
	
	function _getNewSceneID() {
		var max = 0;
		$.each(_user_data.scenes, function( i,scene) {
			max = Math.max( scene.id, max );
		});
		return max+1;
	};
	
	function _getStates( deviceid  )
	{
		var arr = $.grep(_user_data.devices, function( device,idx) {
			return (device.id == deviceid);
		});
		if (arr.length==0)
			return null;
		
		return arr[0].states;
	};	
		
	function _getStatusObject( deviceid, service, variable, bCreate ) {
		if (deviceid==0)
			return null;
		
		var states = _getStates( deviceid  );
		if (states==null)
			return null;
		
		var found = $.grep( states , function( state,idx) {
			return ( state.service == service ) && (state.variable == variable);
		});
		
		if (found.length==0) {
			if (bCreate != true)
				return null;
			var newstate = {
				service: service,
				variable: variable,
				value: null
			};
			states.push( newstate );
			return newstate;
		}
		
		return found[0];
	};
	
	function _getStatus( deviceid, service, variable )
	{
		var state = _getStatusObject( deviceid, service, variable )
		if (state==null)
			return null;
		return state.value;
	};
	
	// dynamic
	// undefined or -1 : ALTUI mode , triggers a UPNP http save
	// 0 : means not dynamic, will require a save
	// 1 : means dynamic, lost at the next restart if not save
	function _setStatus( deviceid, service, variable, value, dynamic ) {
		// update local cache
		var statusobj= _getStatusObject( deviceid, service, variable , true ) //bCreate==true

		if (dynamic >= 0 )  {
			statusobj.value=value;	// in memory but lost at next restart
			
			// if dynamic ==0 permits the user to save
			if (dynamic==0) {
				var target = {};
				target.devices={};
				target.devices["devices_"+deviceid]={};
				target.devices["devices_"+deviceid].states = {};
				target.devices["devices_"+deviceid].states["states_"+statusobj.id] = {
					"value": value
				};
				_updateChangeCache( target );
			}
		}
		else {
			// update vera
			UPnPHelper.UPnPSet( deviceid, service, variable, value );
		}
	};
	
	function _evaluateConditions(deviceid,devsubcat,conditions) {
		var bResult = false;
		var expressions=[];
		$.each(conditions, function(i,condition){
			// strange device JSON sometime ... ex zWave repeater, condition is not defined
			if ( (condition.service!=undefined) && (condition.variable!=undefined) &&
				 ( (condition.subcategory_num==undefined) || (condition.subcategory_num==0) || (devsubcat==-1) || (condition.subcategory_num==devsubcat) ) )
			{
				var str = "";
				if (isInteger( condition.value )) {
					var val = MultiBox.controllerOf(deviceid).getStatus( deviceid, condition.service, condition.variable );
					if (val=="")
						AltuiDebug.debug( "devid:{0} service:{1} variable:{2} devsubcat:{3} value:'{4}' should not be null".format( 
							deviceid,
							condition.service, 
							condition.variable,
							devsubcat,
							val));
					val = val || 0;
					str = "({0} {1} {2})".format(
						val,
						condition.operator, 
						condition.value 
					);
				}
				else {
					str = "('{0}' {1} '{2}')".format(
						MultiBox.controllerOf(deviceid).getStatus( deviceid, condition.service, condition.variable ),
						condition.operator, 
						condition.value 
					);
				}
				expressions.push(str);
			}
			else {
				AltuiDebug.debug("Invalid State Icon condition definition for deviceid:"+deviceid);
			}
		});
		var str = expressions.join(" && ");
		AltuiDebug.debug("_evaluateConditions(deviceid:{0} devsubcat:{1} str:{2} conditions:{3})".format(deviceid,devsubcat,str,JSON.stringify(conditions)));
		var bResult = eval(str);
		return bResult;
	};
	
	function _refreshEngine() {
		var url = "data_request?id=lu_status2&output_format=json&DataVersion="+_status_data_DataVersion;
		url += "&Timeout=60&MinimumDelay=1500";
		AltuiDebug.debug("_refreshEngine() : url="+url);
		$.ajax({
			url:url,
			// dataType:'text json'
			beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }
		})
		.done(function(data) {
			if ((data) && (data != "NO_CHANGES") && (data != "Exiting") )
			{
				if ($.isPlainObject( data ) ==false)
					data=JSON.parse(data);
				_status_data_DataVersion = data.DataVersion;
				_status_data_LoadTime = data.LoadTime;
				if (data.devices != undefined)
				{
					$.each(data.devices, function( idx, device) {
						userdata_device_idx = _findDeviceIdxByID(device.id);
						_user_data.devices[userdata_device_idx].status = device.status;
						_user_data.devices[userdata_device_idx].Jobs = device.Jobs;
						_user_data.devices[userdata_device_idx].dirty = true;

						if (device.states !=null) {
							$.each(device.states, function( idx, state) {
								$.each( _user_data.devices[userdata_device_idx].states , function( idx, userdata_state)
								{
									if ((userdata_state.service == state.service) && (userdata_state.variable == state.variable))
									{
										_user_data.devices[userdata_device_idx].states[idx].value = state.value;
										return false; // break from the $.each()
									}
								});
							});
							EventBus.publishEvent("on_ui_deviceStatusChanged",device);
						}
					});
				}
				UIManager.refreshUI( false , false );	// partial and not first time
				EventBus.publishEvent("on_startup_luStatusLoaded",data);
				
				// if user_data has changed, reload it
				if (_user_data_DataVersion != data.UserData_DataVersion) {
					_initDataEngine();
				}
				else {
					setTimeout( _refreshEngine, 10 );
				}
			}
			else {
					setTimeout( _refreshEngine, 10 );
			}
		})
		.fail(function(jqXHR, textStatus) {
			setTimeout( _refreshEngine, 1000 );
			PageMessage.message( _T("VERA is busy, be patient. (returned {0})").format(textStatus) , "warning");
		})
		.always(function() {
		});
	};
	
	
	function _loadUserData(data) {
		if ((data) && (data != "NO_CHANGES") && (data != "Exiting") )
		{
			var bFirst = (_user_data_DataVersion==1);
			if ($.isPlainObject( data )==false)
				data = JSON.parse(data);
			$.extend(_user_data, data);
			_user_data_DataVersion = data.DataVersion;
			_user_data_LoadTime = data.LoadTime;
			_rooms = data.rooms;
			_scenes = data.scenes;
			_devices = data.devices;
			
			// UI5 compatibility
			jsonp.ud.devices=[];
			jsonp.ud.scenes=[];
			jsonp.ud.rooms=[];
			jsonp.ud.static_data=data.static_data;
			if (data.devices)
				$.each(data.devices, function(idx,device) {
					device.favorite=Favorites.get('device',device.id);
					jsonp.ud.devices.push(device);
				});
			if (data.scenes)
				$.each(data.scenes, function(idx,scene) {
					scene.favorite=Favorites.get('scene',scene.id);
					jsonp.ud.scenes.push(scene);
				});
			if (data.rooms)
				$.each(data.rooms, function(idx,room) {
					jsonp.ud.rooms.push(room);
				});
			
			// update the static ui information for the future displays
			$.each(_user_data.static_data || [], function(idx,ui_static_data) {
				var dt = ui_static_data.device_type == undefined ? ui_static_data.DeviceType : ui_static_data.device_type;
				if (dt!=undefined) {
					MultiBox.updateDeviceTypeUIDB( dt, ui_static_data);				
				}
			});
			
			// update upnp information
			$.each(_user_data.devices || [], function(idx,device) {
				var dt = device.device_type;
				if (dt!=undefined)
					MultiBox.updateDeviceTypeUPnpDB( dt, device.device_file);	// pass device file so UPNP data can be read
				if (device!=null) {	
					device.dirty=true; 
					EventBus.publishEvent("on_ui_deviceStatusChanged",device);
				}
			});		
			if (bFirst)
				EventBus.publishEvent("on_ui_userDataFirstLoaded");
			EventBus.publishEvent("on_ui_userDataLoaded");
		}
	};

	function _isUserDataCached() {	return MyLocalStorage.get("VeraBox")!=null; }
	
	function _saveEngine() {
		AltuiDebug.debug("_saveEngine()");
		var verabox = {
			_user_data : _user_data,
			// _user_data_DataVersion :  _user_data_DataVersion,
			// _user_data_LoadTime : _user_data_LoadTime
		};
		
		MyLocalStorage.set("VeraBox",verabox);
	};

	function _loadEngine() {
		AltuiDebug.debug("_loadEngine()");
		var verabox = MyLocalStorage.get("VeraBox");
		if (verabox)
		{
			// _user_data_LoadTime 	= verabox._user_data_LoadTime;
			// _user_data_DataVersion 	= verabox._user_data_DataVersion;
			_user_data_DataVersion 	= 1;
			_user_data_LoadTime 	= null;
			_user_data				= verabox._user_data || {};
			_user_data.BuildVersion = undefined;		// to keep the "waiting" message for the user
			_loadUserData(_user_data);
		}
	};
	
	function _initDataEngine() {
		_dataEngine = null;
		var url = "data_request?id=user_data&output_format=json&DataVersion="+_user_data_DataVersion;
		AltuiDebug.debug("_initDataEngine() : url="+url);
		$.ajax({
			url:url,
			// dataType: "text json",
			beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }
		})
		.done(function(data) {
			_dataEngine = null;
			_loadUserData(data);
			UIManager.refreshUI( true ,false  );	// full but not first time
			_dataEngine = setTimeout( _refreshEngine, 2000 );
		})
		.fail(function(jqXHR, textStatus) {
			_dataEngine = setTimeout( _initDataEngine, 1000 );
			PageMessage.message( _T("VERA did not respond") + ": " + textStatus , "danger");
		})
		.always(function() {
			AltuiDebug.debug("_initDataEngine() (user_data) returned.");
		});
	};
	
	function _getBoxInfo() {
		return {
			PK_AccessPoint: _user_data.PK_AccessPoint,
			BuildVersion: _user_data.BuildVersion,
			City_description: _user_data.City_description,
			Region_description: _user_data.Region_description,
			Country_description: _user_data.Country_description
		};
	};
	
	function _getLuaStartup() {
		return _user_data.StartupCode;
	};
	
	function _createDevice( param , cbfunc ) {
		var target = $.extend( {descr:'default title', dfile:'', ifile:'', roomnum:0 } , param );
		UPnPHelper.createDevice( target.descr, target.dfile, target.ifile, target.roomnum , cbfunc );
	};
	
	function _createRoom(name)
	{	
		var url = "data_request?id=room&action=create&name="+name;
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			dataType: "text"
		})
		  .done(function(data) {
			if (data!="ERROR") {
				PageMessage.message(_T("Create Room succeeded for")+": "+name, "success", true);
			}
			else {
				PageMessage.message(_T("Could not create Room")+": "+name, "warning");
			}
		  })
		  .fail(function(jqXHR, textStatus) {
			PageMessage.message( _T("Create Room failed")+": " + textStatus , "danger");
		  })
		  .always(function() {
		  });
	};

	function _deleteRoom(id)
	{	
		DialogManager.confirmDialog(_T("Are you sure you want to delete room")+" ("+id+")",function(result) {
			if (result==true) {
				var url = "data_request?id=room&action=delete&room="+id;
				var jqxhr = $.ajax( {
					url: url,
					type: "GET",
					dataType: "text"
				})
				  .done(function(data) {
					if (data!="ERROR") {
						PageMessage.message(_T("Deleted Room")+" "+id, "success", true);
					}
					else {
						PageMessage.message(_T("Could not delete Room")+" "+id, "warning");
					}
				  })
				  .fail(function(jqXHR, textStatus) {
					PageMessage.message( _T("Delete Room failed")+ ": " + textStatus , "danger");
				  })
				  .always(function() {
				  });
			}
		});
	};

	function _runScene(id)
	{
		if ( (id>0) && (this.getSceneByID(id) != null) ) {			
			var url = "data_request?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="+id;
			var jqxhr = $.ajax( {
				url: url,
				type: "GET",
				dataType: "text"
			})
			.done(function() {
				PageMessage.message(_T("Ran Scene #{0} successfully").format(id), "success");
			})
			.fail(function(jqXHR, textStatus) {
				PageMessage.message( _T("VERA is busy, be patient. (returned {0})").format(textStatus) , "warning");
			})
			.always(function() {
			});
		}
	};

	function _osCommand(cmd,cbfunc) {
		var url = "data_request?id=lr_ALTUI_Handler&command=oscommand&oscommand={0}".format( encodeURIComponent(cmd) );
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			dataType: "text"
		})
		.done(function(data, textStatus, jqXHR) {
			var success = (data[0]=="1");
			if (success)
				PageMessage.message(_T("Os Command execution succeeded"), "success");
			else
				PageMessage.message( _T("Os Command execution on vera failed.") , "danger");
			if ($.isFunction( cbfunc )) 
				cbfunc({success:success, result:data.substr(2)},jqXHR);
		})
		.fail(function(jqXHR, textStatus) {
			PageMessage.message( _T("Os Command execution request failed. (returned {0})").format(textStatus) , "danger");
			if ($.isFunction( cbfunc )) 
				cbfunc({success:false, result:null},jqXHR);
		})
		.always(function() {
		});
	};
	
	function _runLua(code, cbfunc) {
		UPnPHelper.UPnPRunLua(code, function(result) {
			var res = "Fail";
			if (result.indexOf("<OK>OK</OK>") !=-1)
				res ="Passed";
			if ($.isFunction( cbfunc )) 
				cbfunc(res);
		});
	};

	function _deleteDevice(id)
	{
		DialogManager.confirmDialog(_T("Are you sure you want to delete device ({0})").format(id),function(result) {
			if (result==true) {
				var url = "data_request?id=device&action=delete&device="+id;
				var jqxhr = $.ajax( {
					url: url,
					type: "GET",
					dataType: "text"
				})
				.done(function(data) {
					if (data!="ERROR") {
						PageMessage.message(_T("Deleted Device {0} successfully ").format(id), "success", true);
					}
					else {
						PageMessage.message(_T("Could not delete Device {0}").format(id), "warning");
					}
				})
				.fail(function(jqXHR, textStatus) {
					PageMessage.message( _T("Delete Device failed")+": " + textStatus , "danger");
				})
				.always(function() {
				});
			}
		});
	};
	
	function _updateNeighbors(deviceid) {
		var zwavenet = VeraBox.getDeviceByType("urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
		if (zwavenet==null)
			return;
		
		var params={};
		params[ "Device" ] = deviceid;
		UPnPHelper.UPnPAction( zwavenet.id, "urn:micasaverde-com:serviceId:ZWaveNetwork1", "UpdateNeighbors", params, function(data) {
			if (data!=null) {
				PageMessage.message(_T("Update Neighbors succeeded"));
			}
			else {
				PageMessage.message(_T("Update Neighbors failed"));
			}
		});
	};
	
	function _deleteScene(id)
	{
		DialogManager.confirmDialog(_T("Are you sure you want to delete scene ({0})").format(id),function(result) {
			if (result==true) {
				var url = "data_request?id=scene&action=delete&scene="+id;
				var jqxhr = $.ajax( {
					url: url,
					type: "GET",
					dataType: "text"
				})
				.done(function(data) {
					if (data!="ERROR") {
						PageMessage.message(_T("Deleted Scene {0} successfully ").format(id), "success", true);
					}
					else {
						PageMessage.message(_T("Could not delete Scene {0}").format(id), "warning");
					}
				})
				.fail(function(jqXHR, textStatus) {
					PageMessage.message( _T("Delete Scene failed")+": " + textStatus , "danger");
				})
				.always(function() {
				});
			}
		});
	};

	function _setStartupCode(newlua) 
	{
		return (newlua != undefined) ?
				UPnPHelper.ModifyUserData( { "StartupCode":newlua } ) :
				null;
	};
/*    "categories": [
        {
            "name": "Dimmable Switch",
            "id": 2
        },
        {
            "name": "On/Off Switch",
            "id": 3
        },
*/	
	function _getCategoryTitle(catnum)
	{
		if (catnum==undefined)
			return '';
		
		var found=undefined;
		$.each(_user_data.category_filter, function(idx,catline) {
			if ($.inArray(catnum.toString() , catline.categories) !=-1)
			{
				found = catline.Label.text;
				return false; //break the loop
			}
		});
		return (found !=undefined) ? found : '';
	};
	
	function _editScene(sceneid,scenejson)
	{
		UPnPHelper.sceneAction(scenejson);
	};


	function _getDeviceStaticUI(device) {
		var staticroot=null;		
		if (device!=null) {
			var devicetype = device.device_type;
			$.each(_user_data.static_data, function(idx,value) {
				if ((value.device_type==devicetype) || (value.DeviceType==devicetype)) {
					staticroot=value;
					return false;
				}
			});			
		}
		return staticroot;
	};
	
	function _getDeviceBatteryLevel(device) {
		var batteryLevel=null;
		$.each(device.states, function(idx,state) {
			if ( (state.variable=="BatteryLevel") && (state.service=="urn:micasaverde-com:serviceId:HaDevice1") )
			{
				batteryLevel = state.value;
				return false;	// exit the loop
			}
		});
		return batteryLevel; // Math.floor((Math.random() * 100) + 1);
	};
	
	function _clearData(name, npage, cbfunc) {
		AltuiDebug.debug("_clearData( {0}, page:{1} )".format(name,npage));
		var result = "";
		var url = "data_request?id=lr_ALTUI_Handler&command=clear_data";//&pages="+encodeURIComponent(JSON.stringify(pages));
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			//dataType: "text",
			data: {
				name: name,
				npage: npage
			}
		})
		.done(function(data) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(data);			
			}
		})
		.fail(function(jqXHR, textStatus) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc("");			
			}
		})
		.always(function() {
		});
	};
	
	function _saveDataChunk(name, npage, data, cbfunc) {
		AltuiDebug.debug("_saveDataChunk( {0}, page:{1}, data:{2} chars  )".format(name,npage,data.length));
		var result = "";
		var url = "data_request?id=lr_ALTUI_Handler&command=save_data";//&pages="+encodeURIComponent(JSON.stringify(pages));
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			//dataType: "text",
			data: {
				name: name,
				npage: npage,
				data: encodeURIComponent(data)
			}
		})
		.done(function(data, textStatus, jqXHR) {
			AltuiDebug.debug("_saveDataChunk( {0}, page:{1}, data:{2} chars  ) => Res:{3}".format(name,npage,data.length,JSON.stringify(data)));
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(data);			
			}
		})
		.fail(function(jqXHR, textStatus) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc("");			
			}
		})
		.always(function() {
		});
	};

	function _saveData( name, data , cbfunc) {
		AltuiDebug.debug("_saveData( {0}, {1} chars )".format(name,data.length));

		// we need a workaround to pass data via a POST but for now, all we have is a Get
		// we know that 5400 char is ok, above it fails
		var result="ok";
		var maxchar = 2400;
		var todo = data.length;
		var done = 0;
		var npage = 0;

		function _doPart() {
			var len = Math.min( maxchar , data.length - done ) ;
			if (len>0) {
				var part = data.substring( done, done+len);
				_saveDataChunk(name, npage, part,  function(data) {
					if (data=="")
						cbfunc("");	// error
					else {
						done += len;
						npage++;
						_doPart();
					}
				});
			}
			else {
				// no more data to send but we need to clean up Vera to remove extra variable
				_clearData(name, npage, function(data) {
					// now it is finished
					cbfunc("ok");
				});
			}
		};	
		
		// start and result is asynchronous
		_doPart();
	};

	// load actions from S files
	function _loadDeviceActions(dt,cbfunc) {
		function __findAction(actions,name) {
			var bfound = null;
			$.each(actions,function(i,o) {
				if (o.name==name) {
					bfound = o;
					return false;
				}
			});
			return bfound;
		}
		if (dt.Services) {
			var todo = dt.Services.length;
			$.each(dt.Services, function (idx,service) {
				// warning, async call, so result comes later. we need to wait until completion
				var that = service.Actions;
				// if (that.length==0) 	// if actions are not already loaded
				// {
					FileDB.getFileContent(service.SFilename , function( xmlstr ) {
						var xml = $( $.parseXML( xmlstr ) );
						$.each(xml.find("action"), function( idx,action) {
							var name = $(action).find("name").first().text();	// action name is the first one
							if (__findAction(that,name)==null)
							{
								var input=[];
								var output=[];
								$.each( $(action).find("argument"), function( idx,argument) {
									var direction = $(argument).find("direction").text();
									var name = $(argument).find("name").text();
									if (direction == "in")
										input.push( name );
									else
										output.push( name );
								});
								that.push( {
									name : name,
									input : input,
									output : output
								} );
							}
						});
						todo--;
						if (todo==0)
							cbfunc(dt.Services);
					});
				// } 
				// else		// actions were already loaded
				// {
					// cbfunc(dt.Services);
				// }
			});
			return;
		}
		AltuiDebug.debug("_loadDeviceActions() : no services");	
		return;
	};
		
	function _getSceneHistory( id, cbfunc) {
		if ($.isFunction(cbfunc)) {
			// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep \"Device_Variable::m_szValue_set device: {0}.*;1m{1}\"".format(device.id,state.variable);
			var cmd = "cat /var/log/cmh/LuaUPnP.log | grep 'Scene::RunScene running {0}'".format(id);
			_osCommand(cmd,function(str) {
				var result = {
					lines:[],
					result:str
				};
				var re = /\d*\t(\d*\/\d*\/\d*\s\d*:\d*:\d*.\d*).*Scene::RunScene running \d+ (.*) <.*/g; 
				var m;
				while ((m = re.exec(str.result)) !== null) {
					if (m.index === re.lastIndex) {
						re.lastIndex++;
					}
					// View your result using the m-variable.
					// eg m[0] etc.
					result.lines.push({date:m[1], name:m[2]});
				}
				(cbfunc)(result);
			})
		}
	};
	
	function _getDeviceVariableHistory( device, varidx, cbfunc) {
		var id = device.id;
		var state = device.states[varidx];
		if ($.isFunction(cbfunc)) {
			// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep \"Device_Variable::m_szValue_set device: {0}.*;1m{1}\"".format(device.id,state.variable);
			var cmd = "cat /var/log/cmh/LuaUPnP.log | grep 'Device_Variable::m_szValue_set device: {0}.*;1m{1}\033'".format(device.id,state.variable);
			// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep $'Device_Variable::m_szValue_set device: {0}.*\033\[35;1m{1}\033\[0m'".format(device.id,state.variable);
			// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep $'\033\[35;1m{1}\033\[0m'".format(device.id,state.variable);

			_osCommand(cmd,function(str) {
				var result = {
					lines:[],
					result:str
				};
				var re = /\d*\t(\d*\/\d*\/\d*\s\d*:\d*:\d*.\d*).*was: (.*) now: (.*) #.*/g; 
				var m;
				while ((m = re.exec(str.result)) !== null) {
					if (m.index === re.lastIndex) {
						re.lastIndex++;
					}
					// View your result using the m-variable.
					// eg m[0] etc.
					result.lines.push({date:m[1], old:m[2], new:m[3]});
				}
				(cbfunc)(result);
			})
		}
		return;
	};

	function _getDeviceActions(device,cbfunc) {
		if (device) {
			var _devicetypesDB = MultiBox.getDeviceTypesDB();
			var dt = _devicetypesDB[device.device_type];
			_loadDeviceActions(dt,cbfunc);
		}
		else {
			AltuiDebug.debug("_getDeviceActions(null) : null device");
			cbfunc([]);
		}
	};
	
	function _getDeviceDependants(device) {
		var usedin_objects =[];
		var scenes = this.getScenesSync();
		$.each(scenes,function( idx,scene) {
			if (scene.triggers)
				$.each(scene.triggers, function(idx,trigger) {
					if (trigger.device == device.id) {
						usedin_objects.push({type:'trigger', scene:scene.id, name:scene.name, trigger:trigger});
					}
				});
			if (scene.groups)
				$.each(scene.groups, function(idx,group) {
					$.each(group.actions, function(idx,action) {
						if (action.device==device.id) {
							usedin_objects.push({type:'action', scene:scene.id, name:scene.name, action:action});
						}
					});
				});
		});
		return usedin_objects;
	};
	
	function _getDeviceEvents(device) {
		if (device) {
			var _devicetypesDB = MultiBox.getDeviceTypesDB();
			var dt = _devicetypesDB[device.device_type];
			if  ((dt.ui_static_data == undefined) || (dt.ui_static_data.eventList2==undefined))
				return [];
			return dt.ui_static_data.eventList2;
		}
		return [];
	};
	
	function _isDeviceZwave(id) {
		var device = this.getDeviceByID(id);
		if (device && device.id_parent) {
			var parent = this.getDeviceByID( device.id_parent );
			if (parent) {
				if (parent.device_type == "urn:schemas-micasaverde-com:device:ZWaveNetwork:1")
					return true;
			}
		}
		return false;
	};
	
	function _resetPollCounters() {
		this.getDevices( 
			function(luaid,device) {
				var id = device.id;
				var service="urn:micasaverde-com:serviceId:ZWaveDevice1"
				var PollNoReply = parseInt(MultiBox.controllerOf(id).getStatus(id,service,"PollNoReply"));
				var PollOk = parseInt(MultiBox.controllerOf(id).getStatus(id,service,"PollOk"));
				if (! isNaN(PollNoReply) ) {
					MultiBox.controllerOf(id).setStatus( id, service, "PollNoReply", 0   );
				}
				if (! isNaN(PollOk) ) {
					MultiBox.controllerOf(id).setStatus( id, service, "PollOk", 0   );
				}
			}, 
			function(device) {
				return (device.id_parent==1);
			}, 
			null 
		);		
	};
	
  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getIcon			: _getIcon, 		// workaround to get image from vera box
	getWeatherSettings : _getWeatherSettings,
	getBoxInfo		: _getBoxInfo,
	getLuaStartup 	: _getLuaStartup,
    getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
    getRoomsSync	: function() { return _rooms; },
	getRoomByID		: _getRoomByID,		// roomid
	getDevices		: _getDevices,
    getDevicesSync	: function() { return _devices; },
	getDeviceByType : _getDeviceByType,
	getDeviceByAltID : _getDeviceByAltID,
	getDeviceByID 	: _getDeviceByID, 
	getDeviceBatteryLevel : _getDeviceBatteryLevel,
	getDeviceStaticUI : _getDeviceStaticUI,
	getDeviceVariableHistory : _getDeviceVariableHistory,
	getDeviceActions: _getDeviceActions,
	getDeviceEvents : _getDeviceEvents,
	getDeviceDependants : _getDeviceDependants,
	isDeviceZwave	: _isDeviceZwave,
	getScenes		: _getScenes,
	getSceneHistory : _getSceneHistory,
	getScenesSync	: function() { return _scenes; },
	getSceneByID 	: _getSceneByID,
	getNewSceneID	: _getNewSceneID,
	getPlugins		: _getPlugins,
	getPluginByID 	: _getPluginByID, 
	getHouseMode	: _getHouseMode,
	setHouseMode	: _setHouseMode,
	setStatus		: _setStatus,
	getStatus		: _getStatus,
	getStates		: _getStates,
	evaluateConditions : _evaluateConditions,		// evaluate a device condition table ( AND between conditions )
	
	createDevice	: _createDevice,
	deleteDevice	: _deleteDevice,
	updateNeighbors	: _updateNeighbors, // id=lu_action&action=UpdateNeighbors&Device=3&DeviceNum=1
	createRoom		: _createRoom,
	deleteRoom		: _deleteRoom,
	runScene		: _runScene,
	editScene		: _editScene,			//(sceneid,scene);
	deleteScene		: _deleteScene,
	reloadEngine	: _reloadEngine,	
	reboot			: _reboot,
	setStartupCode	: _setStartupCode,
	
	getCategoryTitle : _getCategoryTitle,
	getCategories	 : _getCategories,
	getDeviceTypes 	: function() 	{	return _devicetypes; },
	// isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },

	// energy
	getPower		: _getPower,
	
	// stats
	resetPollCounters : _resetPollCounters,
	
	// oscommand http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=oscommand&oscommand=df
	osCommand 		: _osCommand,	//(cmd,cbfunc)		
	runLua			: _runLua,
	
	// caching user data changes and saving them at user request
	updateChangeCache :_updateChangeCache,
	saveChangeCaches  :_saveChangeCaches,
	
	// save page data into altui plugin device
	saveData		: _saveData,		//  name, data , cbfunc
	saveEngine 		: _saveEngine, 
	loadEngine 		: _loadEngine, 
	isUserDataCached	: _isUserDataCached,
	initEngine		: function() 	{
						_loadEngine();
						_initDataEngine();				// init the data collection engine
					},		
  };
});	// not invoked, object does not exists

var PageManager = (function() {
	var _pages = null;
			// var pages = [
			// { id:1, name:'test' },
			// { id:2, name:'page2' },
		// ];

	function _init(pages) {
		if (_pages==null)	// otherwise, already initialized 
		{
			AltuiDebug.debug("PageManager.init(), pages="+JSON.stringify(pages));
			_pages = [];
			$.each( pages, function(idx,page) {
				_pages.push( $.extend( true, {id:0, name:'', background:''}, page) );
			});
		}
	};
	
	function _recoverFromStorage() {
		_pages = MyLocalStorage.get("Pages");
	};
	function _clearStorage() {
		MyLocalStorage.clear("Pages");
	};
	
	function _savePages() {
		AltuiDebug.debug("PageManager.savePages(), pages="+JSON.stringify(_pages));
		MyLocalStorage.set("Pages",_pages);
		var names = $.map( _pages, function(page,idx) {	return page.name;	} );
		VeraBox.saveData( "CustomPages", JSON.stringify(names), function(data) {
			if (data!="")
				PageMessage.message("Save Pages success", "success");
			else
				PageMessage.message("Save Pages failure", "danger");
		});
		
		$.each(_pages, function(idx,page) {
			VeraBox.saveData( page.name, JSON.stringify(page), function(data) {
			if (data!="")
				PageMessage.message("Save for "+page.name+" succeeded.", "success");
			else
				PageMessage.message( "Save for "+page.name+" did not succeed." , "danger");
			});
		});
	};

	function _addPage() {
		var id = 0;
		$.each(_pages, function(idx,page) {
			id = Math.max(id, page.id );
		});
		id++;
		_pages.push({ 
			id:id, 
			name:'page'+id,
			background: 'rgb(232, 231, 231)'
		});
		return _pages;
	};

	function _deletePage(name) {
		$.each( _pages, function( idx,page) {
			if ( page.name==name) {
				_pages.splice(idx,1);
				return false;
			}
		});
		return _pages;
	};
		
	function _getPageFromName( name ) {
		var result = null;
		if (name)
			$.each( _pages, function( idx,page) {
				if ( page.name==name) {
					result = page;
					return false;
				}
			});
		return result;
	};
	
	function _updateChildrenInPage( page, widgetid, position , size )
	{
		if (page.children)
			$.each(page.children, function(idx,child) {
				if (child.id == widgetid) {
					if (position)
						child.position = jQuery.extend(true, {}, position);
					if (size)
						child.size = jQuery.extend(true, {}, size);
				}
			});
	};		

	function _insertChildrenInPage( page, tool, position )
	{
		var id = 0;
		if (page !=null) {
			if (page.children == undefined) 
				page.children = new Array();
			$.each(page.children, function(idx,child) {
				id = Math.max(id, child.id );
			});
			id++;
			page.children.push( {
					id: id,
					cls: tool.cls,
					position: jQuery.extend(true, {}, position),
					properties : jQuery.extend(true, {}, tool.properties),	// default values
			});				
		}
		return id;	//0 if error
	};
		
	function _removeChildrenInPage( page, widgetid )
	{
		var widget = null;
		$.each(page.children, function(idx,child) {
			if (child.id==widgetid)
			{
				widget = child;
				page.children.splice(idx,1);
				return false;	// break loop
			}
		});
		return widget;
	};
		
	function _getWidgetByID( page, widgetid ) {
		var widget=null;
		$.each(page.children, function(idx,child) {
			if (child.id == widgetid) {
				widget = child;
				return false;
			}
		});
		return widget;
	};
	
	function _forEachPage( func ) {
		$.each(_pages, func);
	};
	
	return {
		init :_init,
		recoverFromStorage : _recoverFromStorage,
		clearStorage : _clearStorage,
		forEachPage: _forEachPage,
		getPageFromName: _getPageFromName,
		savePages: _savePages,
		addPage: _addPage,
		deletePage: _deletePage,
		updateChildrenInPage: _updateChildrenInPage,
		insertChildrenInPage: _insertChildrenInPage,
		removeChildrenInPage: _removeChildrenInPage,
		getWidgetByID: _getWidgetByID
	};
})();

var IconDB = ( function (window, undefined) {
	var _dbIcon = null;
	
	function _getIconContent( name , cbfunc ) {
		if (_dbIcon == null) {
			_dbIcon = MyLocalStorage.get("IconDB");
			if (_dbIcon==null)
				_dbIcon={}
		}

		// do not load http based sources from the VERA itself
		if (name.startsWith("http"))
			return name;
		
		// if undefined and not yet started to fetch, then go fetch it
		if (_dbIcon[name]==undefined) {
			_dbIcon[name]="pending"
			VeraBox.getIcon( name, function(data) {
				
				// store in cache and call callback
				_dbIcon[name]=data;
				if ($.isFunction(cbfunc))
					cbfunc(data);
				
			});
		}
		
		// if not yet there, or still pending , return nothing - it will arrive later in a callback
		return ((_dbIcon[name]!=undefined) && (_dbIcon[name]!="pending"))  ? _dbIcon[name] : "" ;
	};
	
	return {
		getIconContent  : _getIconContent,
		isDB			: function()	{ 	return MyLocalStorage.get("IconDB")!=null;			},
		saveDB			: function() 	{	MyLocalStorage.set("IconDB", _dbIcon);	  	},
		resetDB			: function() 	{	MyLocalStorage.clear("IconDB"); _dbIcon = {}; }
	}
} )( window );

var FileDB = ( function (window, undefined) {
	var _dbFile = null;
	
	function _getFileContent( name, cbfunc ) {
		AltuiDebug.debug("_getFileContent( {0} )".format(name));
		if (_dbFile == null) {
			_dbFile = MyLocalStorage.get("FileDB");
			if (_dbFile==null)
				_dbFile={}
		}
		
		if ($.isFunction(cbfunc)==false)
			return null;
		
		if (_dbFile[name]!=undefined)
			if (_dbFile[name]=="pending")
			{
				AltuiDebug.debug("_getFileContent( {0} ) ==> not yet here, defered in 200ms".format(name));
				setTimeout( FileDB.getFileContent, 200, name,cbfunc );
			}
			else {
				AltuiDebug.debug("_getFileContent( {0} ) ==> returning content from cache".format(name));
				cbfunc(_dbFile[name]); 
			}
		else {
			_dbFile[name]="pending";
			// console.log("getting file "+name);
			AltuiDebug.debug("_getFileContent( {0} ) ==> asking content to Vera".format(name));
			UPnPHelper.UPnPGetFile( name, function(data,jqXHR) {
				AltuiDebug.debug("_getFileContent( {0} ) ==> returning async content from Vera".format(name));
				_dbFile[name] = data;
				cbfunc(data,jqXHR);
			});
		}
		return 0;
	};
	
	return {
		getFileContent  : _getFileContent,
		isDB			: function()	{ 	return MyLocalStorage.get("FileDB")!=null;			},
		saveDB			: function(db) 	{	MyLocalStorage.set("FileDB", _dbFile);	  	},
		resetDB			: function(db) 	{	MyLocalStorage.clear("FileDB"); _dbFile = {}; }
	}
} )( window );


// ======================================================================
// Global for UI5 UI7 javascript compatibility
// ======================================================================

var data_request_url = UPnPHelper.getUrlHead()+'?';
var command_url = UPnPHelper.getUrlHead().replace('/data_request','');
function get_device_state(deviceId, serviceId, variable, dynamic) {
	return MultiBox.getStatus( deviceId, serviceId, variable );
};

function set_device_state (deviceId, serviceId, variable, value, dynamic) {
	// -1 : ALTUI mode , triggers a UPNP http save
	// 0 : means not dynamic, will require a save
	// 1 : means dynamic, lost at the next restart if not save
	if (dynamic==undefined)
		dynamic = 0;
	MultiBox.setStatus( deviceId, serviceId, variable, value  , dynamic );
	return true;
};

var _JSAPI_ctx={};
function set_JSAPI_context(ctx) {
	_JSAPI_ctx = $.extend( {
			set_panel_html_callback: null,
			deviceid: 0
		}, 
		ctx
	);
};

// function set_set_panel_html_callback(cb) {
	// if ($.isFunction(cb))
		// set_panel_html_cb =cb;
// };

function set_panel_html(html) {
	if ($.isFunction(_JSAPI_ctx.set_panel_html_callback))
		(_JSAPI_ctx.set_panel_html_callback)(html);
};

function log_message(msg) {
	PageMessage.message( msg, "info");
};

function set_infobox(str,mode){
	PageMessage.message( str, (mode=="success") || (mode=="error") ? mode : "info" );
};

function has_changes(msg) {
	PageMessage.message( msg, "info");
};

//
// some device like Wakeup Light uses this from ergy.js
//
function trim(stringToTrim)
{
    return stringToTrim.replace(/^\s+|\s+$/g,"");
}
function get_node_obj(nodeObj,nodeID)
{
    var itemsCount=nodeObj.length;
    for(var i=0;i<itemsCount;i++){
        if(nodeObj[i] && nodeObj[i].id==parseInt(nodeID)){
            return nodeObj[i];
        }
    }
    return undefined;
}
function get_node_index(nodeObj,nodeID){
    var itemsCount=nodeObj.length;
    for(var i=0;i<itemsCount;i++){
        if(nodeObj[i] && nodeObj[i].id==nodeID){
            return i;
        }
    }
    return 0;
}

function get_new_timer_id(timersArray){
    var timersNo = timersArray.length;
    var maxID=0;
    for(var i=0;i<timersNo;i++){
        if(timersArray[i].id>maxID){
            maxID = timersArray[i].id;
        }
    }
    return maxID+1;
}

var _spinDialog = null;
function show_loading() {
	_spinDialog = DialogManager.createSpinningDialog();
	_spinDialog.modal('show');
};

function hide_loading() {
	_spinDialog.modal('hide');
};


//
// PLEG uses this from cpanel
//
function sortByName(a, b) {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
};

function get_device_obj(deviceID){

    var devicesCount=jsonp.ud.devices.length;
    for(var i=0;i<devicesCount;i++){
        if(jsonp.ud.devices[i] && jsonp.ud.devices[i].id==deviceID){
            return jsonp.ud.devices[i];
        }
    }
};

function cloneObject(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
};

function get_event_definition(DeviceType){
    var itemsCount=jsonp.ud.static_data.length;
    for(var i=0;i<itemsCount;i++){
        if(jsonp.ud.static_data[i] && jsonp.ud.static_data[i].DeviceType==DeviceType){
            return jsonp.ud.static_data[i].eventList2;
        }
    }
}

function new_scene_id(){
	return VeraBox.getNewSceneID();
    // var sceneIDs=[];
    // var indexNo=jsonp.ud.scenes.length;
    // if(indexNo==0){
        // return offset_id+1;
    // }
    // for(var i=0;i<indexNo;i++){
        // sceneIDs[sceneIDs.length]=jsonp.ud.scenes[i].id;
    // }
    // var sceneID=sceneIDs.max()+1;
    // sceneID=(sceneID<offset_id)?(parseInt(sceneID)+offset_id):sceneID;

    // return sceneID;
}

var Ajax = (function(window,undefined) {
	return {
		Request: function (url,opts) {
			
			var options = $.extend({
				method:"GET",
				parameters: {},
				onSuccess : null,
				onFailure : null,
				onComplete : null,
			}, opts);
			
			var urlHead = url;
			var params = [];
			$.each(options.parameters, function(index,value) {
				params.push( index+"="+value );	// we assume nothing requires uri encoding here
			});
			if (params.length>0) {
				urlHead = urlHead + "?" + params.join('&');
			}
			var jqxhr = $.ajax( {
				url: urlHead,
				type: options.method,
				// data: options.parameters,
				// processData : false,			
				// dataType: "text"
			})
			.done(function(data, textStatus, jqXHR) {
				if ($.isFunction( options.onSuccess )) {
					(options.onSuccess)(data);
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				if ($.isFunction( options.onFailure )) {
					(options.onFailure)(textStatus);
				}
			})
			.always(function() {
				if ($.isFunction( options.onComplete )) {
					(options.onComplete)("");
				}
			});
		}
	};
})();

// extract from constant.js
var DEVICETYPE_HOME_AUTO_GATEWAY = "urn:schemas-micasaverde-com:device:HomeAutomationGateway:1";
var DEVICETYPE_BINARY_LIGHT = "urn:schemas-upnp-org:device:BinaryLight:1";
var DEVICETYPE_DIMMABLE_LIGHT = "urn:schemas-upnp-org:device:DimmableLight:1";
var DEVICETYPE_THERMOSTAT = "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1";
var DEVICETYPE_HUMIDITY_SENSOR = "urn:schemas-micasaverde-com:device:HumiditySensor:1";
var DEVICETYPE_MULTI_IO = "urn:schemas-micasaverde-com:device:MultiIO:1";
var DEVICETYPE_DOOR_LOCK = "urn:schemas-micasaverde-com:device:DoorLock:1";
var DEVICETYPE_DOOR_SENSOR = "urn:schemas-micasaverde-com:device:DoorSensor:1";
var DEVICETYPE_ZWAVE_NETWORK = "urn:schemas-micasaverde-com:device:ZWaveNetwork:1";
var DEVICETYPE_INSTEON_NETWORK = "urn:schemas-micasaverde-com:device:InsteonNetwork:1";
var DEVICETYPE_USB_UIRT = "urn:schemas-micasaverde-com:device:USBUIRT:1";
var DEVICETYPE_TEMPERATURE_SENSOR = "urn:schemas-micasaverde-com:device:TemperatureSensor:1";
var DEVICETYPE_POWER_METER = "urn:schemas-micasaverde-com:device:PowerMeter:1";
var DEVICETYPE_MOTION_SENSOR = "urn:schemas-micasaverde-com:device:MotionSensor:1";
var DEVICETYPE_SMOKE_SENSOR = "urn:schemas-micasaverde-com:device:SmokeSensor:1";
var DEVICETYPE_LIGHT_SENSOR = "urn:schemas-micasaverde-com:device:LightSensor:1";
var DEVICETYPE_IR_TRANSMITTER = "urn:schemas-micasaverde-com:device:IrTransmitter:1";
var DEVICETYPE_WINDOW_COVERING = "urn:schemas-micasaverde-com:device:WindowCovering:1";
var DEVICETYPE_GENERIC_IO = "urn:schemas-micasaverde-com:device:GenericIO:1";
var DEVICETYPE_REMOTE_CONTROL = "urn:schemas-micasaverde-com:device:RemoteControl:1";
var DEVICETYPE_COMBO_DEVICE = "urn:schemas-micasaverde-com:device:ComboDevice:1";
var DEVICETYPE_CAMERA = "urn:schemas-upnp-org:device:DigitalSecurityCamera:1";
var DEVICETYPE_CAMERA2 = "urn:schemas-upnp-org:device:DigitalSecurityCamera:2";
var DEVICETYPE_SERIALPORT = "urn:micasaverde-org:device:SerialPort:1";
var DEVICETYPE_SCENE_CONTROLLER = "urn:schemas-micasaverde-com:device:SceneController:1";
var DEVICETYPE_SCENE_CONTR_LED = "urn:schemas-micasaverde-com:device:SceneControllerLED:1";
var DEVICETYPE_ENERGY_CALCULATOR = "urn:schemas-micasaverde-com:device:EnergyCalculator:1";
var DEVICETYPE_TEMP_LEAK_SENSOR = "urn:schemas-micasaverde-com:device:TemperatureLeakSensor:1";
var DEVICETYPE_SCENE = "urn:schemas-micasaverde-com:device:Scene:1";
var DEVICETYPE_TV = "urn:schemas-micasaverde-com:device:tv:1";
var DEVICETYPE_CABLE = "urn:schemas-micasaverde-com:device:cable:1";
var DEVICETYPE_SATELLITE = "urn:schemas-micasaverde-com:device:satellite:1";
var DEVICETYPE_VIDEO_ACCESSORY = "urn:schemas-micasaverde-com:device:videoaccessory:1";
var DEVICETYPE_VCR_DVR = "urn:schemas-micasaverde-com:device:vcrdvd:1";
var DEVICETYPE_DVD_BLURAY = "urn:schemas-micasaverde-com:device:dvdbluray:1";
var DEVICETYPE_RECEIVER = "urn:schemas-micasaverde-com:device:receiver:1";
var DEVICETYPE_AMP = "urn:schemas-micasaverde-com:device:amp:1";
var DEVICETYPE_CD = "urn:schemas-micasaverde-com:device:cd:1";
var DEVICETYPE_MISC_HOME_CONTROL = "urn:schemas-micasaverde-com:device:mischomecontrol:1";
var DEVICETYPE_AV_MISC = "urn:schemas-micasaverde-com:device:avmisc:1";
var DEVICETYPE_VIRTUAL_DEVICE = "urn:schemas-micasaverde-com:device:VirtualDevice:1";
var DEVICEFILE_BINARY_LIGHT = "D_BinaryLight1.xml";
var DEVICEFILE_DIMMABLE_LIGHT = "D_DimmableLight1.xml";
var DEVICEFILE_THERMOSTAT = "D_HVAC_ZoneThermostat1.xml";
var DEVICEFILE_HUMIDITY_SENSOR = "D_HumiditySensor1.xml";
var DEVICEFILE_MULTI_IO = "D_GC100.xml";
var DEVICEFILE_DOOR_LOCK = "D_DoorLock1.xml";
var DEVICEFILE_DOOR_SENSOR = "D_DoorSensor1.xml";
var DEVICEFILE_ZWAVE_NETWORK = "D_ZWaveNetwork.xml";
var DEVICEFILE_INSTEON_NETWORK = "D_InsteonNetwork.xml";
var DEVICEFILE_USB_UIRT = "D_USB_UIRT.xml";
var DEVICEFILE_TEMPERATURE_SENSOR = "D_TemperatureSensor1.xml";
var DEVICEFILE_POWER_METER = "D_PowerMeter1.xml";
var DEVICEFILE_MOTION_SENSOR = "D_MotionSensor1.xml";
var DEVICEFILE_SMOKE_SENSOR = "D_SmokeSensor1.xml";
var DEVICEFILE_LIGHT_SENSOR = "D_LightSensor1.xml";
var DEVICEFILE_IR_TRANSMITTER = "D_IrTransmitter1.xml";
var DEVICEFILE_WINDOW_COVERING = "D_WindowCovering1.xml";
var DEVICEFILE_GENERIC_IO = "D_GenericIO1.xml";
var DEVICEFILE_REMOTE_CONTROL = "D_RemoteControl1.xml";
var DEVICEFILE_COMBO_DEVICE = "D_ComboDevice1.xml";
var DEVICEFILE_CAMERA = "D_DigitalSecurityCamera1.xml";
var DEVICEFILE_SCENE_CONTROLLER = "D_SceneController1.xml";
var DEVICEFILE_SCENE_CONTR_LED = "D_SceneControllerLED1.xml";
var DEVICEFILE_ENERGY_CALCULATOR = "D_EnergyCalculator1.xml";
var DEVICEFILE_AV_MISC = "D_AvMisc1.xml";
var DEVICEFILE_TEMP_LEAK_SENSOR = "D_TemperatureLeakSensor1.xml";
var DEVICEFILE_AV_SCENE = "D_Scene1.xml";
var TEMPORARY_UPNP_ARGUMENT = "TEMPORARY_UPNP_ARGUMENT";
var HAGEVICE_FILE = "S_HomeAutomationGateway1.xml";
var HAGEVICE_SID = "urn:micasaverde-com:serviceId:HomeAutomationGateway1";
var HAGEVICE_STYPE = "urn:schemas-micasaverde-org:service:HomeAutomationGateway:1";
var HAG_ACTIVE_SCENES = "ActiveScenes";
var HAG_DATAVERSION_USERDATA = "DataVersionUserData";
var HAG_DATAVERSION_STATUS = "DataVersionStatus";
var HAG_ENERGY_DOW = "EnergyDOW";
var HAG_ENERGY_TIME_OF_DAY = "GetUserData";
var HAG_NUM_LIGHTS = "GetUserData";
var HAG_THERMOSTAT_ON = "GetUserData";
var HAG_ENERGY_DOW = "GetUserData";
var HAG_GET_USER_DATA = "GetUserData";
var HAG_MODIFY_USER_DATA = "ModifyUserData";
var HAG_MODIFY_GET_VARIABLE = "GetVariable";
var HAG_MODIFY_SET_VARIABLE = "SetVariable";
var HAG_MODIFY_GET_STATUS = "GetStatus";
var HAG_MODIFY_GET_ACTIONS = "GetActions";
var HAG_MODIFY_CREATE_DEVICE = "CreateDevice";
var HAG_MODIFY_DELETE_DEVICE = "DeleteDevice";
var HAG_MODIFY_CREATE_PLUGIN = "CreatePlugin";
var HAG_MODIFY_DELETE_PLUGIN = "DeletePlugin";
var HAG_MODIFY_CREATE_PLUGIN_DEVICE = "CreatePluginDevice";
var HAG_IMPORT_UPNP_DEVICE = "ImportUpnpDevice";
var HAG_PROCESS_CHILD = "ProcessChildDevices";
var HAG_RELOAD = "Reload";
var HAG_RUN_SCENE = "RunScene";
var HAG_RUN_LUA = "RunLua";
var HAG_LOG_IP_REQUEST = "LogIpRequest";
var HADEVICE_FILE = "S_HaDevice1.xml";
var HADEVICE_SID = "urn:micasaverde-com:serviceId:HaDevice1";
var HADEVICE_STYPE = "urn:schemas-micasaverde-com:service:HaDevice:1";
var HAD_ENERGY_LOG = "EnergyLog";
var HAD_IOPORT_DEVICE = "IODevice";
var HAD_IOPORT_DEVICE_XREF = "IODeviceXRef";
var HAD_IOPORT_MAX_TIME = "MaxTime";
var HAD_IOPORT_PORT = "IOPort";
var HAD_IGNORE_ROOM = "IgnoreRoom";
var HAD_COMM_FAILURE = "CommFailure";
var HAD_POLLING_ENABLED = "PollingEnabled";
var HAD_POLL_MIN_DELAY = "PollMinDelay";
var HAD_CONFIGURED = "Configured";
var HAD_JOBID = "JobID";
var HAD_REVERSE = "ReverseOnOff";
var HAD_LAST_UPDATE = "LastUpdate";
var HAD_AUTO_CONFIGURE = "AutoConfigure";
var HAD_LAST_TIME_CHECK = "LastTimeCheck";
var HAD_LAST_TIME_OFFSET = "LastTimeOffset";
var HAD_FIRST_CONFIGURED = "FirstConfigured";
var HAD_BATTERY_LEVEL = "BatteryLevel";
var HAD_BATTERY_DATE = "BatteryDate";
var HAD_BATTERY_ALARM = "BatteryAlarm";
var HAD_DOCUMENTATION = "Documentation";
var HAD_RECONFIGURE = "Reconfigure";
var HAD_REMOVE = "Remove";
var HAD_POLL = "Poll";
var HAD_SET_POLL_FREQUENCY = "SetPollFrequency";
var HAD_STRESS_TEST = "StressTest";
var HAD_TOGGLE_STATE = "ToggleState";
var ZWN_FILE = "S_ZWaveNetwork1.xml";
var ZWN_SID = "urn:micasaverde-com:serviceId:ZWaveNetwork1";
var ZWN_STYPE = "urn:schemas-micasaverde-org:service:ZWaveNetwork:1";
var ZWN_RESET_NETWORK = "ResetNetwork";
var ZWN_UPDATE_NETWORK = "UpdateNetwork"
var ZWN_UPDATE_NEIGHBORS = "UpdateNeighbors";
var ZWN_RECONFIGURE_ALL = "ReconfigureAllNodes";
var ZWN_REMOVE_NODES = "RemoveNodes";
var ZWN_ADD_NODES = "AddNodes";
var ZWN_DOWNLOAD = "DownloadNetwork";
var ZWN_PUT_BYTE = "PutByte";
var ZWN_HEAL_NETWORK = "HealNetwork";
var ZWN_SET_POLLING = "SetPolling";
var ZWN_SEND_DATA = "SendData";
var ZWN_POLL_ALL_NODES = "PollAllNodes";
var ZWN_SOFT_RESET = "SoftReset";
var ZWN_BACKUP_DONGLE = "BackupDongle";
var ZWN_SCENE_IDS = "SceneIDs";
var ZWN_LAST_UPDATE = "LastUpdate";
var ZWN_LAST_DONGLE_BACKUP = "LastDongleBackup";
var ZWN_NET_STATUS_ID = "NetStatusID";
var ZWN_NET_STATUS_TEXT = "NetStatusText";
var ZWN_USE_45 = "Use45";
var ZWN_USE_MR = "UseMR";
var ZWN_LIMIT_NEIGHBORS = "LimitNeighbors";
var ZWN_COM_PORT = "ComPort";
var ZWN_LOCK_COM_PORT = "LockComPort";
var ZWN_NODE_ID = "NodeID";
var ZWN_VERSION_INFO = "VersionInfo";
var ZWN_HOME_ID = "HomeID";
var ZWN_ROLE = "Role";
var ZWN_RESET_MODE = "ResetMode";
var ZWN_INCLUSION_MODE = "InclusionMode";
var ZWN_NODETYPE = "NodeType";
var ZWN_TIMEOUT = "Timeout";
var ZWN_MULTIPLE = "Multiple";
var ZWN_SIMULATE_INCOMING = "SimulateIncomingData";
var ZWN_POLL_ENABLED = "PollingEnabled";
var ZWN_POLL_DELAY_INITIAL = "PollDelayInitial";
var ZWN_POLL_DELAY_DEADTIME = "PollDelayDeadTime";
var ZWN_POLL_MINDELAY = "PollMinDelay";
var ZWN_POLL_FREQUENCY = "PollFrequency";
var ZWN_LAST_ERROR = "LastError";
var ZWN_DELAY_PROCESSING = "DelayProcessing";
var ZWDEVICE_FILE = "S_ZWaveDevice1.xml";
var ZWDEVICE_SID = "urn:micasaverde-com:serviceId:ZWaveDevice1";
var ZWDEVICE_STYPE = "urn:schemas-micasaverde-com:service:ZWaveDevice:1";
var ZWD_POLL_SETTINGS = "PollSettings";
var ZWD_MULTCH_ENDPOINT = "MultiChEndpoint";
var ZWD_MULTCH_CAPABIL = "MultiChCapabilities";
var ZWD_NEIGHBORS = "Neighbors";
var ZWD_CAPABILITIES = "Capabilities";
var ZWD_CONFIG = "Configuration";
var ZWD_LAST_RESET = "LastReset";
var ZWD_SCENES_AS_EVENTS = "ScenesAsEvents";
var ZWD_SCENES_TIMESTAMPS = "ScenesTimestamp";
var ZWD_WAKEUP_INTERVAL = "WakeupInterval";
var ZWD_LAST_WAKEUP = "LastWakeup";
var ZWD_LAST_ROUTE_UPD = "LastRouteUpdate";
var ZWD_VARIABLES_GET = "VariablesGet";
var ZWD_VARIABLES_SET = "VariablesSet";
var ZWD_ASSOCIATION_GET = "AssociationGet";
var ZWD_ASSOCIATION_SET = "AssociationSet";
var ZWD_ASSOCIATION_NUM = "AssociationNum";
var ZWD_NONCE_ACK = "NonceACK";
var ZWD_MANUF_INFO = "ManufacturerInfo";
var ZWD_VERSION_INFO = "VersionInfo";
var ZWD_NODE_INFO = "NodeInfo";
var ZWD_INITIAL_NAME = "InitialName";
var ZWD_CONFIGURED_NAME = "ConfiguredName";
var ZWD_CONFIGURED_VARIABLE = "ConfiguredVariable";
var ZWD_CONFIGURED_ASSOC = "ConfiguredAssoc";
var ZWD_SPECIAL_CONFIG_DONE = "SpecialConfigDone";
var ZWD_SPECIAL_ASSOC_DONE = "SpecialAssocDone";
var ZWD_DOCUMENTATION = "Documentation";
var ZWD_MANUAL_ROUTE = "ManualRoute";
var INN_FILE = "S_InsteonNetwork1.xml";
var INN_SID = "urn:micasaverde-com:serviceId:InsteonNetwork1";
var INN_STYPE = "urn:schemas-micasaverde-org:service:InsteonNetwork:1";
var INN_RESET_NETWORK = "ResetNetwork";
var INN_REMOVE_NODES = "RemoveNodes";
var INN_ADD_NODES = "AddNodes";
var INN_STOP_ADDREM_NODES = "StopAddRemoveNodes";
var INN_SEND_DATA = "SendData";
var INN_COM_PORT = "ComPort";
var INN_LOCK_COM_PORT = "LockComPort";
var INN_LAST_ERROR = "LastError";
var INN_LAST_UPDATE = "LastUpdate";
var INN_NET_STATUS_ID = "NetStatusID";
var INN_NET_STATUS_TEXT = "NetStatusText";
var INN_POLL_ENABLED = "PollingEnabled";
var INN_POLL_DELAY_INITIAL = "PollDelayInitial";
var INN_POLL_DELAY_DEADTIME = "PollDelayDeadTime";
var INN_POLL_MINDELAY = "PollMinDelay";
var INN_POLL_FREQUENCY = "PollFrequency";
var INN_NODE_ID = "NodeID";
var INN_SL_X10_CODE = "sl_X10Code";
var INN_VERSION_INFO = "VersionInfo";
var INN_HOME_ID = "HomeID";
var INN_ROLE = "Role";
var INN_RESET_MODE = "ResetMode";
var INN_INCLUSION_MODE = "InclusionMode";
var INN_NODETYPE = "NodeType";
var INN_TIMEOUT = "Timeout";
var INN_MULTIPLE = "Multiple";
var INN_SIMULATE_INCOMING = "SimulateIncomingData";
var INDEVICE_FILE = "S_InsteonDevice1.xml";
var INDEVICE_SID = "urn:micasaverde-com:serviceId:InsteonDevice1";
var INDEVICE_STYPE = "urn:schemas-micasaverde-com:service:InsteonDevice:1";
var IND_POLL_SETTINGS = "PollSettings";
var IND_MULTCH_ENDPOINT = "MultiChEndpoint";
var IND_MULTCH_CAPABIL = "MultiChCapabilities";
var IND_NEIGHBORS = "Neighbors";
var IND_CAPABILITIES = "Capabilities";
var IND_CONFIG = "Configuration";
var IND_LAST_RESET = "LastReset";
var IND_SCENES_AS_EVENTS = "ScenesAsEvents";
var IND_WAKEUP_INTERVAL = "WakeupInterval";
var IND_LAST_WAKEUP = "LastWakeup";
var IND_LAST_ROUTE_UPD = "LastRouteUpdate";
var IND_VARIABLES_GET = "VariablesGet";
var IND_VARIABLES_SET = "VariablesSet";
var IND_ASSOCIATION_GET = "AssociationGet";
var IND_ASSOCIATION_SET = "AssociationSet";
var IND_MANUF_INFO = "ManufacturerInfo";
var IND_VERSION_INFO = "VersionInfo";
var IND_UPDATED_NAME = "UpdatedName";
var UIRT_FILE = "S_USBUIRT.xml";
var UIRT_SID = "urn:micasaverde-com:serviceId:USBUIRT1";
var UIRT_TYPE = "urn:schemas-micasaverde-com:service:USBUIRT:1";
var UIRT_COM_PORT = "ComPort";
var CAMDEVICE_FILE = "S_Camera1.xml";
var CAMDEVICE_SID = "urn:micasaverde-com:serviceId:Camera1";
var CAMDEVICE_STYPE = "urn:schemas-micasaverde-com:service:Camera:1";
var CAM_USERNAME = "Username";
var CAM_PASSWORD = "Password";
var CAM_RELATED_SENSORS = "RelatedSensors";
var CAM_SENSOR_ARCHIVE_SEC = "SensorArchiveSeconds";
var CAM_RELATED_LIGHTS = "RelatedLights";
var CAM_LIGHT_OPTIONS = "LightOptions";
var CAM_AUTO_ARCH_SEC = "AutoArchiveSeconds";
var CAM_AUTO_PRES_DAYS = "AutoArchivePreserveDays";
var CAM_URL = "URL";
var CAM_DIRECT_URL = "DirectStreamingURL";
var PTZ_FILE = "S_PanTiltZoom1.xml";
var PTZ_SID = "urn:micasaverde-com:serviceId:PanTiltZoom1";
var PTZ_STYPE = "urn:schemas-micasaverde-com:service:PanTiltZoom:1";
var PTZ_LEFT = "MoveLeft";
var PTZ_RIGHT = "MoveRight";
var PTZ_UP = "MoveUp";
var PTZ_DOWN = "MoveDown";
var PTZ_IN = "ZoomIn";
var PTZ_OUT = "ZoomOut";
var SWP_SID = "urn:upnp-org:serviceId:SwitchPower1";
var SWP_SET_TARGET = "SetTarget";
var SWP_STATUS = "Status";
var SWP_TARGET = "Target";
var WC_SID = "urn:upnp-org:serviceId:WindowCovering1";
var WC_UP = "Up";
var WC_DOWN = "Down";
var WC_STOP = "Stop";
var WC_STATUS = "Status";
var WC_TARGET = "Target";
var SWD_SID = "urn:upnp-org:serviceId:Dimming1";
var SWD_SET_LOAD_LEVEL = "SetLoadLevelTarget";
var SWD_LOAD_LEVEL_STATUS = "LoadLevelStatus";
var SWD_LOAD_LEVEL_TARGET = "LoadLevelTarget";
var DL_SID = "urn:micasaverde-com:serviceId:DoorLock1";
var DL_SET_TARGET = "SetTarget";
var DL_SET_PIN = "SetPin";
var DL_CLEAR_PIN = "ClearPin";
var DL_SET_PIN_DATE = "SetPinValidityDate";
var DL_SET_PIN_WEEK = "SetPinValidityWeekly";
var DL_CLEAR_PIN_VALID = "ClearPinValidity";
var DL_STATUS = "Status";
var DL_TARGET = "Target";
var DL_SL_USER_CODE = "sl_UserCode";
var DL_SL_PIN_FAILED = "sl_PinFailed";
var DL_SL_LOCK_BUTTON = "sl_LockButton";
var DL_SL_LOCK_FAILURE = "sl_LockFailure";
var DL_SL_UNAUTH_USER = "sl_UnauthUser";
var DL_SL_LOW_BATTERY = "sl_LowBattery";
var DL_SL_VERY_LOW_BATTERY = "sl_VeryLowBattery";
var DL_PIN_CODES = "PinCodes";
var DL_NUM_SCHEDULES = "NumSchedules";
var HVACO_SID = "urn:upnp-org:serviceId:HVAC_UserOperatingMode1";
var HVACO_SET_MODE = "SetModeTarget";
var HVACO_STATUS = "ModeStatus";
var HVACS_SID = "urn:micasaverde-com:serviceId:HVAC_OperatingState1";
var HVACS_STATE = "ModeState";
var HVACF_SID = "urn:upnp-org:serviceId:HVAC_FanOperatingMode1";
var HVACF_SET_MODE = "SetMode";
var HVACF_STATUS = "Mode";
var HVACHEAT_SID = "urn:upnp-org:serviceId:TemperatureSetpoint1_Heat";
var HVACCOOL_SID = "urn:upnp-org:serviceId:TemperatureSetpoint1_Cool";
var HVACHC_SETPOINT = "SetCurrentSetpoint";
var HVACHC_CURRENTSP = "CurrentSetpoint";
var TEMP_SID = "urn:upnp-org:serviceId:TemperatureSensor1";
var TEMP_CURRENT = "CurrentTemperature";
var LIGHT_SID = "urn:micasaverde-com:serviceId:LightSensor1";
var LIGHT_CURRENT = "CurrentLevel";
var HUM_SID = "urn:micasaverde-com:serviceId:HumiditySensor1";
var HUM_CURRENT = "CurrentLevel";
var SES_SID = "urn:micasaverde-com:serviceId:SecuritySensor1";
var SES_ARMED = "Armed";
var SES_TRIPPED = "Tripped";
var SES_SET_ARMED = "SetArmed";
var ENE_SID = "urn:micasaverde-com:serviceId:EnergyMetering1";
var ENE_KWH = "KWH";
var ENE_WATTS = "Watts";
var ENE_ACTUAL = "ActualUsage";
var ENE_USER_SUPPLIED = "UserSuppliedWattage";
var IRT_SID = "urn:micasaverde-com:serviceId:IrTransmitter1";
var IRT_SENDPRONTO = "SendProntoCode";
var SPT_SID = "urn:micasaverde-org:serviceId:SerialPort1";
var SPT_PATH = "path";
var SPT_BAUD = "baud";
var SPT_VENDOR = "vendor";
var SPT_PRODUCT = "product";
var SCR_SID = "urn:micasaverde-com:serviceId:SceneController1";
var SCR_SL_SCENE_ACTIVATED = "sl_SceneActivated";
var SCR_SL_SCENE_DEACTIVATED = "sl_SceneDeactivated";
var SCR_SCENES = "Scenes";
var SCR_LAST_SCENE_ID = "LastSceneID";
var SCR_LAST_SCENE_TIME = "LastSceneTime";
var SCR_MANAGE_LEDS = "ManageLeds";
var SCR_NUM_BUTTONS = "NumButtons";
var SCR_FIRES_OFF_EVENTS = "FiresOffEvents";
var SCR_SCENE_SHORTCUTS = "SceneShortcuts";
var SCL_SID = "urn:micasaverde-com:serviceId:SceneControllerLED1";
var SCL_SET_LIGHT = "SetLight";
var SCL_LIGHT_SETTINGS = "LightSettings";
var GIO_SID = "urn:micasaverde-com:serviceId:GenericIO";
var GIO_IS_INPUT = "IsInput";
var GIO_DEFAULT_STATE = "DefaultState";
var ZWN_LAST_HEAL = "LastHeal";
var ZWD_HEALTH = "Health";
var ZWD_NEIGHBORS_INVERSE = "NeighborsInverse";
var IR_SID = "urn:micasaverde-com:serviceId:IrDevice1";
var IR_PROPRIETARY = "ProprietaryCodeset";

var ZWD_SCENES = "Scenes";
var CAM_PRE_ROLL_BUFFER = "PreRollBuffer";

// ************** end variables imported **********************

var DEVICE_CATEGORY_INTERFACE = 1;
var DEVICE_CATEGORY_DIMMABLE_LIGHT = 2;
var DEVICE_CATEGORY_SWITCH = 3;
var DEVICE_CATEGORY_SECURITY_SENSOR = 4;
var DEVICE_CATEGORY_HVAC =  5;
var DEVICE_CATEGORY_CAMERA = 6;
var DEVICE_CATEGORY_DOOR_LOCK = 7;
var DEVICE_CATEGORY_WINDOW_COV = 8;
var DEVICE_CATEGORY_REMOTE_CONTROL = 9;
var DEVICE_CATEGORY_IR_TX = 10;
var DEVICE_CATEGORY_GENERIC_IO = 11;
var DEVICE_CATEGORY_GENERIC_SENSOR=12;
var DEVICE_CATEGORY_SERIAL_PORT = 13;
var DEVICE_CATEGORY_SCENE_CONTROLLER=14;
var DEVICE_CATEGORY_AV = 15;
var DEVICE_CATEGORY_HUMIDITY = 16;
var DEVICE_CATEGORY_TEMPERATURE = 17;
var DEVICE_CATEGORY_LIGHT = 18;
var DEVICE_CATEGORY_ZWAVE_INT = 19;
var DEVICE_CATEGORY_INSTEON_INT = 20;
var DEVICE_CATEGORY_POWER_METER = 21;
var DEVICE_CATEGORY_ALARM_PANEL = 22;
var DEVICE_CATEGORY_ALARM_PARTITION = 23;

// need to be specified in constants.h
var SERVICE_TYPE_IR_TRANSMITTER='urn:schemas-micasaverde-com:service:IrTransmitter:1';
var SID_ALARM_PARTITION = 'urn:micasaverde-com:serviceId:AlarmPartition2';
var WC_STYPE='urn:schemas-upnp-org:service:WindowCovering:1';
var DEVICETYPE_ALARM_PARTITION='urn:schemas-micasaverde-com:device:AlarmPartition:1';
var ALARM_PARTITION_SID='urn:micasaverde-com:serviceId:AlarmPartition1';
var ALARM_PARTITION_ARMED='Armed';
var ALARM_PARTITION_STAYARMED='StayArmed';
var ALARM_PARTITION_DISARMED='Disarmed';
var ALARM_PARTITION_BREACH='Breach';
var api = {
	version: "UI7",
	cloneObject: function (obj) {
		return cloneObject(obj);
	},
	getCommandURL: function() {
		return command_url;
	},
	getDataRequestURL: function() {
		return data_request_url;
	},
	getCpanelContent: function() {
		return "";
	},
	getListOfDevices: function () {
		return jsonp.ud.devices;
	},
	getCpanelDeviceId: function () {
		return _JSAPI_ctx.deviceid;
	},
	getCurrentHouseMode: function(onSuccess, onFailure, context) {
		MultiBox.getHouseMode( function (mode) {
			if (mode==null) {
				if (onFailure)
					(onFailure).call(context);
			}else {
				if (onSuccess)
					(onSuccess).call(context,mode);
			}
		});
	},
	setCurrentHouseMode: function(modeValue, onSuccess, onFailure, context) {
		MultiBox.setHouseMode(modeValue,function(mode) {
			if (mode==null) {
				if (onFailure)
					(onFailure).call(context);
			}else {
				if (onSuccess)
					(onSuccess).call(context,mode);
			}
		});
	},
	getDeviceIndex: function(deviceid) {
		var index  = null;
		$.each(jsonp.ud.devices, function(idx,elem) {
			if (elem.id==deviceid) {
				index = idx;
				return false;
			}
		});
		return index;
	},
	getDeviceObject: function(deviceid) {
		var obj   = null;
		$.each(jsonp.ud.devices, function(idx,elem) {
			if (elem.id==deviceid) {
				obj = elem;
				return false;
			}
		});
		return obj;
	},
	setCpanelContent: function (html) {
		set_panel_html(html);
	},
	getDeviceStateVariable: function (deviceId, service, variable, options) {
		return get_device_state(deviceId, service, variable, (options.dynamic === true ? 1: 0));
	},
	getDeviceState: function (deviceId, service, variable, options) {
		return this.getDeviceStateVariable(deviceId, service, variable, options);
	},
	getDeviceTemplate: function(deviceId) {
		return false;
	},
	getDisplayedDeviceName: function(deviceId) {
		var device = this.getDeviceObject(deviceId);
		if (device)
			return device.name;
		return 'unnamed device';
	},
	getEventDefinition: function(deviceType) {
		var _devicetypesDB = MultiBox.getDeviceTypesDB();
		var dt = _devicetypesDB[deviceType];
		if  ((dt.ui_static_data == undefined) || (dt.ui_static_data.eventList2==undefined))
			return [];
		return dt.ui_static_data.eventList2;
	},
	setDeviceStateVariable: function (deviceId, service, variable, value, options) {
		set_device_state(deviceId, service, variable, value, (options.dynamic === true ? 1: 0));
	},
	setDeviceState:function(deviceId, service, variable, value, options) {
		return this.setDeviceStateVariable(deviceId, service, variable, value, options);
	},
	setDeviceStateVariablePersistent: function (deviceId, service, variable, value, options) {
		set_device_state(deviceId, service, variable, value, -1);
	},	
	setDeviceStatePersistent:function(deviceId, service, variable, value, options) {
		return this.setDeviceStateVariablePersistent(deviceId, service, variable, value, options);
	},
	getListOfSupportedEvents: function() {
		return [];
	},
	getLuSdata: function(onSuccess, onFailure, context) {
		var url = "data_request?id=sdata&output_format=json";
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			dataType: "text",
			cache: false
		})
		.done(function(data) {
			var arr = JSON.parse(data);
			if ( $.isFunction( onSuccess ) )  {
				(onSuccess).call(context, arr);
			}
		})
		.fail(function(jqXHR, textStatus) {
			if ( $.isFunction( onFailure ) )  {
				(onFailure).call(context, textStatus);
			}
		})
		.always(function() {
		});
	},
	getRoomObject: function(roomId) {
		return VeraBox.getRoomByID(roomId);
	},
	getSceneDescription: function(sceneId, options) {
		var scene = this.getSceneByID(sceneId);
		return JSON.stringify(scene);
	},
	registerEventHandler: function(eventName, object, functionName) {
		EventBus.registerEventHandler(eventName, window, function( /*args*/ ) {
			//in API7 the parameters to the callback do not include the eventname
			//while in ALTUI the first parameter is the eventname. so here we have to remove it
			var theArgs = arguments;
			theArgs = [].slice.call(theArgs, 1);	// remove first argument which is eventname
			var func = object[functionName];
			func.apply( object , theArgs );
		});
	},
	performActionOnDevice: function(deviceId, service, action, options) {
		options = $.extend({ 
			actionArguments:{},
			onFailure:null,
			onSuccess:null,
			context:null
		},options);
		return UPnPHelper.UPnPAction( deviceId, service, action, options.actionArguments, function(data,jqXHR){
			if (data==null) {
				if (options.onFailure)
					(options.onFailure).call(options.context,{
						responseText: jqXHR.responseText,
						status: jqXHR.status
					});
			}
			else {
				if (options.onSuccess)
					(options.onSuccess).call(options.context,{
						responseText: jqXHR.responseText,
						status: jqXHR.status
					});
			}
		});
	},
	performLuActionOnDevice: function(deviceId, service, action, options) {
		return this.performActionOnDevice(deviceId, service, action, options);
	},
	runUpnpCode: function(code, options, onSuccess, onFailure, context) {
		return UPnPHelper.UPnPRunLua(code, function(data) {
			if (data==null) {
				if (onFailure)
					(onFailure).call(context,null);
			} else {
				if (onSuccess)
					(onSuccess).call(context,data);
			};
		});
	},
};