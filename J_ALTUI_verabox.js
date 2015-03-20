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
	function _buildVariableSetUrl( deviceID, service, varName, varValue)
	{
		var urlHead = _getUrlHead()+'?id=variableset&DeviceNum='+deviceID+'&serviceId='+service+'&Variable='+varName+'&Value='+varValue;
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
	
	function _exec(url,cbfunc) {
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			dataType: "text"
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction( cbfunc )) {
				cbfunc(data);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction( cbfunc )) {
				cbfunc(null);
			}
			else
				UIManager.pageMessage( formatAjaxErrorMessage(jqXHR, textStatus), "warning" );				
		})
		.always(function() {
		});
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
		_exec( _buildUPnPGetFileUrl( devicefile), cbfunc );
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
		if (confirm("Are you sure you want to modify this device to:"+newname)) {
			var url = _getUrlHead()+"?id=device&action=rename&device="+devid+"&name="+newname;
			if (roomid !=undefined)
				url = url+"&room="+roomid;
			_exec( url, function(result) {	
				if (result!="OK") 
					UIManager.pageMessage( "Device modify failed!", "warning" );
				else
					UIManager.pageMessage( "Device modified!", "success" );
			} );
		}
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
					UIManager.pageMessage( "Scene action failed!", "warning" );
				else {	
					UIManager.pageMessage( "Scene action succeeded! a LUUP reload will happen now, be patient", "success" );
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
					UIManager.pageMessage( "Scene action failed!", "warning" );				
				}
				else {
					UIManager.pageMessage( "Scene action succeeded! a LUUP reload will happen now, be patient", "success" );			
				}
			});
		}
	};
	
	return {
		//---------------------------------------------------------
		// Public  functions
		//---------------------------------------------------------

		reloadEngine	: _reloadEngine,
		UPnPSet			: _UPnPSet,		// ( deviceID, service, varName, varValue )
		UPnPAction		: _UPnPAction,	// ( deviceID, service, action, params, cbfunc )
		UPnPGetFile		: _UPnPGetFile,
		UPnPUpdatePlugin: _UPnPUpdatePlugin,
		UPnPRunLua 		: _UPnPRunLua,
		ModifyUserData	: _ModifyUserData,
		renameDevice 	: _renameDevice,
		createDevice	: _createDevice,
		sceneAction 	: _sceneAction,			// (sceneobj)  will be transformed in json
		
		setOnOff		: function ( deviceID, onoff) {
			_UPnPAction( deviceID, 'urn:upnp-org:serviceId:SwitchPower1', 'SetTarget', {'newTargetValue':onoff} );
		},
		setArm			: function ( deviceID, armed) {
			_UPnPSet( deviceID, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed', armed );
		},
		setDoorLock			: function ( deviceID, armed) {
			_UPnPAction( deviceID, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {'newTargetValue':armed} );
		},
	};
}) (window);


var VeraBox = ( function( window, undefined ) {
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
	var _user_data_DataVersion = 1;
	var _user_data_LoadTime = null;
	var _status_data_DataVersion = 1;
	var _status_data_LoadTime = null;
	
	// setters to set the data in the cache, cb functions because asynchronous
	function _setRooms(arr) 		{	_rooms = arr;		};
	function _setScenes(arr) 		{	_scenes = arr;		};
	function _setCategories(arr)	{	_categories = arr;	};
	function _setDevices(arr) 		{
		_devices = arr;
		// $.each( arr , function( idx, obj ) {
			// if ( (obj!=null) && (obj.DeviceType !=null) )  {
				// UIManager.addDeviceType( obj.DeviceType  , {
					// category_num: obj.category_num
				// });
			// }
		// });
	};
	
	function _reloadEngine()
	{
		$("#altui-pagemessage").empty();
		UPnPHelper.reloadEngine( function(data) {
			if (data!=null) {
				// reload worked,  reset all cache
				_rooms = null;
				_devices = null;
				_scenes = null;
				_devicetypes = [];
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
	
	// call VERA, gets data back, process the async response, call the setter to initialize the cache
	// function _getData( url, func, setterfunc, filterfunc , endfunc) {
		// var jqxhr = $.ajax( {
			// url: url,
			// type: "GET",
			// dataType: "text",
			// cache: false
		// })
		// .done(function(data) {
			// var arr = JSON.parse(data);
			// if ( $.isFunction( setterfunc ) )  {
				// setterfunc(arr);			
			// }
		// })
		// .fail(function(jqXHR, textStatus) {
			// UIManager.pageMessage( "VERA did not respond: " + textStatus , "danger");
		// })
		// .always(function() {
		// });
	// };

	function _getWeatherSettings()
	{
		var target = {tempFormat: "", weatherCountry: "", weatherCity: ""};
		$.extend(target, _user_data.weatherSettings);
		return target;
	}
	
	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getRooms( func , filterfunc) {
		_asyncResponse( _rooms.sort(_sortByName), func , filterfunc)
		return _rooms;
	};
	
	function _sortByName(a,b)
	{
		if (a.name < b.name)
			return -1;
		if (a.name > b.name)
			return 1;
		return 0;
	}
	
	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getScenes( func , filterfunc, endfunc ) {
		if (_scenes)
			_asyncResponse( _scenes.sort(_sortByName), func , filterfunc, endfunc);
		return _scenes;
	};

	function _getPlugins( func , endfunc ) {
		if (_user_data.InstalledPlugins2)
			_asyncResponse( _user_data.InstalledPlugins2, func , null, endfunc);
		return _user_data.InstalledPlugins2;
	};
		
	function _getDevices( func , filterfunc, endfunc ) {
		//no data yet, fetch it, otherwise just process the async response
		// if (_devices==null) {
			// var url = "data_request?id=lr_ALTUI_Handler&command=devices";
			// _getData( url, func, _setDevices, filterfunc, endfunc );

		// } else {
			// _asyncResponse( _devices, func, filterfunc, endfunc );
		// }
		if (_devices !=null)
			_asyncResponse( _devices.sort(_sortByName), func, filterfunc, endfunc );
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
				UIManager.pageMessage( "VERA did not respond: " + textStatus , "danger");
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
			UIManager.pageMessage( "VERA did not respond: " + textStatus , "danger");
		})
		.always(function() {
		});
	};

	function _setHouseMode(newmode) {
		if ((newmode<=4) && (newmode>=1)) {
			UPnPHelper.UPnPAction( 0, 'urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode:newmode } );
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
	
	function _getStates( deviceid  )
	{
		var arr = $.grep(_user_data.devices, function( device,idx) {
			return (device.id == deviceid);
		});
		if (arr.length==0)
			return null;
		
		return arr[0].states;
	};	
	
	function _setStatus( deviceid, service, variable, value ) {
		UPnPHelper.UPnPSet( deviceid, service, variable, value );
	};
	
	function _getStatus( deviceid, service, variable )
	{
		if (deviceid==0)
			return null;
		
		var states = _getStates( deviceid  );
		if (states==null)
			return null;
		
		var state = $.grep( states , function( state,idx) {
			return ( state.service == service ) && (state.variable == variable);
		});
		if (state.length==0)
			return null;
		
		return state[0].value;
	};

	function _evaluateConditions(deviceid,conditions) {
		var bResult = false;
		var expressions=[];
		$.each(conditions, function(i,condition){
			var str = "";
			if (isInteger( condition.value )) {
				var val = VeraBox.getStatus( deviceid, condition.service, condition.variable );
				if (val=="")
					AltuiDebug.debug( "devid:{0} service:{1} variable:{2} value:'{3}' should not be null".format( 
						deviceid,
						condition.service, 
						condition.variable,
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
					VeraBox.getStatus( deviceid, condition.service, condition.variable ),
					condition.operator, 
					condition.value 
				);
			}
			expressions.push(str);
		});
		var str = expressions.join(" && ");
		var bResult = eval(str);
		return bResult;
	};
	
	function _refreshEngine() {
		var url = "data_request?id=lu_status2&output_format=json&DataVersion="+_status_data_DataVersion;
		url += "&Timeout=60&MinimumDelay=1000";
		AltuiDebug.debug("_refreshEngine() : url="+url);
		$.ajax({
			url:url,
		})
		.done(function(data) {
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
					}
				});
			}
			UIManager.refreshUI( false , false );	// partial and not first time
			
			// if user_data has changed, reload it
			if (_user_data_DataVersion != data.UserData_DataVersion) {
				//console.log( "{0}:Full Refresh".format(Date.now()));
				_initDataEngine();
			}
			else {
				setTimeout( _refreshEngine, 10 );
			}
		})
		.fail(function(jqXHR, textStatus) {
			setTimeout( _refreshEngine, 1000 );
			UIManager.pageMessage( "VERA did not respond: " + textStatus , "danger");
		})
		.always(function() {
		});
	};
	
	
	function _loadUserData(data) {
		if ((data) && (data != "NO_CHANGES"))
		{
			if ($.isPlainObject( data )==false)
				data = JSON.parse(data);
			$.extend(_user_data, data);
			_user_data_DataVersion = data.DataVersion;
			_user_data_LoadTime = data.LoadTime;
			_rooms = data.rooms;
			_scenes = data.scenes;
			_devices = data.devices;
			
			// update the static ui information for the future displays
			$.each(_user_data.static_data || [], function(idx,ui_static_data) {
				var dt = ui_static_data.device_type == undefined ? ui_static_data.DeviceType : ui_static_data.device_type;
				if (dt!=undefined)
					UIManager.updateDeviceTypeUIDB( dt, ui_static_data);
			});
			
			// update upnp information
			$.each(_user_data.devices || [], function(idx,device) {
				var dt = device.device_type;
				if (dt!=undefined)
					UIManager.updateDeviceTypeUPnpDB( dt, device.device_file);	// pass device file so UPNP data can be read
				if (device!=null) {	
					device.dirty=true; 
				}
			});		
		}
	};
	
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
		})
		.done(function(data) {
			_dataEngine = null;
			_loadUserData(data);
			UIManager.refreshUI( true ,false  );	// full but not first time
			_dataEngine = setTimeout( _refreshEngine, 2000 );
		})
		.fail(function(jqXHR, textStatus) {
			_dataEngine = setTimeout( _initDataEngine, 1000 );
			UIManager.pageMessage( "VERA did not respond: " + textStatus , "danger");
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
				UIManager.pageMessage("Create Room succeeded for "+name, "success", true);
			}
			else {
				UIManager.pageMessage("Could not create Room "+name, "warning");
			}
		  })
		  .fail(function(jqXHR, textStatus) {
			UIManager.pageMessage( "Create Room failed: " + textStatus , "danger");
		  })
		  .always(function() {
		  });
	};

	function _deleteRoom(id)
	{	
		if (confirm("Are you sure you want to delete room ("+id+")")) {
			var url = "data_request?id=room&action=delete&room="+id;
			var jqxhr = $.ajax( {
				url: url,
				type: "GET",
				dataType: "text"
			})
			  .done(function(data) {
				if (data!="ERROR") {
					UIManager.pageMessage("Deleted Room "+id, "success", true);
				}
				else {
					UIManager.pageMessage("Could not delete Room "+id, "warning");
				}
			  })
			  .fail(function(jqXHR, textStatus) {
				UIManager.pageMessage( "Delete Room failed: " + textStatus , "danger");
			  })
			  .always(function() {
			  });
		}
	};

	function _runScene(id)
	{
		if (id>0) {
			var url = "data_request?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="+id;
			$("#altui-pagemessage").empty();
			var jqxhr = $.ajax( {
				url: url,
				type: "GET",
				dataType: "text"
			})
			.done(function() {
				UIManager.pageMessage("Ran Scene "+id+" successfully", "success");
			})
			.fail(function(jqXHR, textStatus) {
				UIManager.pageMessage( "VERA did not respond: " + textStatus , "danger");
			})
			.always(function() {
			});
		}
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

	function _deleteScene(id)
	{
		if (confirm("Are you sure you want to delete scene ("+id+")")) {
			var url = "data_request?id=scene&action=delete&scene="+id;
			var jqxhr = $.ajax( {
				url: url,
				type: "GET",
				dataType: "text"
			})
			.done(function(data) {
				if (data!="ERROR") {
					UIManager.pageMessage("Deleted Scene "+id+" successfully, please ", "success", true);
				}
				else {
					UIManager.pageMessage("Could not delete Scene "+id, "warning");
				}
			})
			.fail(function(jqXHR, textStatus) {
				UIManager.pageMessage( "Delete Scene failed: " + textStatus , "danger");
			})
			.always(function() {
			});
		}
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
	
	function _deviceBatteryLevel(device) {
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

	function _saveData( name, data , cbfunc) {
		AltuiDebug.debug("_saveData( {0}, {1} )".format(name,data));

		// we need a workaround to pass data via a POST but for now, all we have is a Get
		// we know that 5400 char is ok, above it fails
		var result="ok";
		var maxchar = 3000;
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
		function __findAction(actions,name)
		{
			var bfound = null;
			$.each(actions,function(i,o) {
				if (o.name==name) {
					bfound = o;
					return false;
				}
			});
			return bfound;
		}
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
	};
		
	function _getDeviceActions(device,cbfunc) {
		if (device) {
			var _devicetypesDB = UIManager.getDeviceTypesDB();
			var dt = _devicetypesDB[device.device_type];
			_loadDeviceActions(dt,cbfunc);
		}
		else {
			cbfunc([]);
		}
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
	getDevices		: _getDevices,
	getDeviceByID 	: _getDeviceByID, 
	getDeviceBatteryLevel : _deviceBatteryLevel,
	getDeviceStaticUI : _getDeviceStaticUI,
	getDeviceActions: _getDeviceActions,
	getScenes		: _getScenes,
	getSceneByID 	: _getSceneByID,
	getPlugins		: _getPlugins,
	getHouseMode	: _getHouseMode,
	setHouseMode	: _setHouseMode,
	setStatus		: _setStatus,
	getStatus		: _getStatus,
	getStates		: _getStates,
	evaluateConditions : _evaluateConditions,		// evaluate a device condition table ( AND between conditions )
	
	createDevice	: _createDevice,
	createRoom		: _createRoom,
	deleteRoom		: _deleteRoom,
	runLua			: _runLua,
	runScene		: _runScene,
	editScene		: _editScene,			//(sceneid,scene);
	deleteScene		: _deleteScene,
	reloadEngine	: _reloadEngine,	
	setStartupCode	: _setStartupCode,
	
	getCategoryTitle : _getCategoryTitle,
	getCategories	 : _getCategories,
	getDeviceTypes 	: function() 	{	return _devicetypes; },
	isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },

	saveData		: _saveData,		//  name, data , cbfunc
	saveEngine 		: _saveEngine, 
	loadEngine 		: _loadEngine, 
	initEngine		: function() 	{
							_loadEngine();
							_initDataEngine();				// init the data collection engine
							UIManager.refreshUI( true , true );	// full & first time full display
						},		
  };
} )( window );

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
			// _pages = pages;
		}
	};
	
	function _savePages() {
		AltuiDebug.debug("PageManager.savePages(), pages="+JSON.stringify(_pages));
		var names = $.map( _pages, function(page,idx) {	return page.name;	} );
		VeraBox.saveData( "CustomPages", JSON.stringify(names), function(data) {
			if (data!="")
				UIManager.pageMessage("Save Pages success", "success");
			else
				UIManager.pageMessage("Save Pages failure", "danger");
		});
		
		$.each(_pages, function(idx,page) {
			VeraBox.saveData( page.name, JSON.stringify(page), function(data) {
			if (data!="")
				UIManager.pageMessage("Save for "+page.name+" succeeded.", "success");
			else
				UIManager.pageMessage( "Save for "+page.name+" did not succeed." , "danger");
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
		saveDB			: function() 	{	MyLocalStorage.set("IconDB", _dbIcon);	  },
		resetDB			: function() 	{	MyLocalStorage.clear("IconDB"); _dbIcon = {}; }
	}
} )( window );

var FileDB = ( function (window, undefined) {
	var _dbFile = null;
	
	function _getFileContent( name, cbfunc ) {
		if (_dbFile == null) {
			_dbFile = MyLocalStorage.get("FileDB");
			if (_dbFile==null)
				_dbFile={}
		}
		
		if ($.isFunction(cbfunc)==false)
			return null;
		
		if (_dbFile[name]!=undefined)
			if (_dbFile[name]=="pending")
				setTimeout( FileDB.getFileContent, 200, name,cbfunc );
			else
				cbfunc(_dbFile[name]); 
		else {
			_dbFile[name]="pending";
			//console.log("getting file "+name);
			UPnPHelper.UPnPGetFile( name, function(data) {
				_dbFile[name] = data;
				cbfunc(data);
			});
		}
		return 0;
	};
	
	return {
		getFileContent  : _getFileContent,
		saveDB			: function(db) 	{	MyLocalStorage.set("FileDB", _dbFile);	  },
		resetDB			: function(db) 	{	MyLocalStorage.clear("FileDB"); _dbFile = {}; }
	}
} )( window );


