//# sourceURL=J_ALTUI_verabox.js
// "use strict";
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

var VeraBox = ( function( uniq_id, ip_addr ) {

  //---------------------------------------------------------
  // private functions
  //---------------------------------------------------------
	var _uniqID = uniq_id;								// assigned by Multibox, unique, can be used for Settings & other things
	var _hagdevice = { id: 0, altuiid:"{0}-0".format(_uniqID) };							// special device for HAG, service=S_HomeAutomationGateway1.xml
	var _upnpHelper = new UPnPHelper(ip_addr,uniq_id);	// for common UPNP ajax
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
		var promise = _upnpHelper.ModifyUserData( _change_cached_user_data, function() {
			PageMessage.message("ModifyUserData called & returned, a restart will occur now","success");
			PageMessage.clearMessage(msgidx);
		});
		_change_cached_user_data={};
		user_changes=0;	//UI5 compat
		return promise;
	};
	
	function _updateChangeCache( target ) {
		$.extend(true, _change_cached_user_data, target);
		PageMessage.message("You need to save your changes","info", true );
		user_changes=1; //UI5 compat
	};
	
	function _initializeJsonp() {
		jsonp={};
		jsonp.ud=_user_data;
		// jsonp.ud.devices=[];
		// jsonp.ud.scenes=[];
		// jsonp.ud.rooms=[];
		// jsonp.ud.static_data=[];
		return jsonp;
	};
	
	function _httpGet(url,opts,cbfunc) {
		var options = $.extend( true, 
			{
				url:	_upnpHelper.proxify( _upnpHelper.getUrlHead()+url ),
				method:	"GET",
				type: "GET",
				dataType: "text",
				cache: 	false
			} , opts);

		var jqxhr = $.ajax( options)
				.done(function(data, textStatus, jqXHR) {
					_upnpHelper.unproxifyResult(data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
						if ($.isFunction(cbfunc))
							(cbfunc)(data, textStatus, jqXHR);
					});
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					PageMessage.message( _T("Controller {0} did not respond").format(_upnpHelper.getIpAddr()) , "warning");
					if ($.isFunction(cbfunc))
						(cbfunc)(null, textStatus, jqXHR);
				});
		return jqxhr;
	};
	
	function _triggerAltUIUpgrade(urlsuffix,newrev) {
		urlsuffix += "&TracRev="+newrev;
		return _httpGet(urlsuffix,{}).always( function() {
			PageMessage.message(_T("Upgrade Request succeeded, a Luup reload will happen"),"success");
		});
	};
	
	function _reboot()
	{
		return this.runLua("os.execute('reboot')", function(result) {
			if ( result == "Passed")
				PageMessage.message( "Reboot request succeeded", "success");
			else
				PageMessage.message( "Reboot request failed", "danger");
		});
	};
	function _reloadEngine()
	{
		return _upnpHelper.reloadEngine( function(data) {
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
		if (arr!=null) {
			if ($.isFunction(filterfunc))
				arr = $.grep( arr, filterfunc );
			if ($.isFunction( func ))
				$.each(arr,function(idx,obj){
					func(idx+1,obj);	// device id in LUA is idx+1
				});
		};
		if ( $.isFunction( endfunc ) )  {
			endfunc(arr);			
		}
		return arr;
	};

	function _getPower(cbfunc) {
		var jqxhr = _httpGet("?id=live_energy_usage",{dataType: "text"},cbfunc);
		// jqxhr= jqxhr.fail(function(jqXHR, textStatus) {
				// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
			// });
		return jqxhr;
	};
	
	function _getWeatherSettings()
	{
		var target = {tempFormat: "", weatherCountry: "", weatherCity: ""};
		$.extend(target, _user_data.weatherSettings);
		return target;
	}
	
	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getRooms( func , filterfunc, endfunc) {
		if (_rooms)
			_asyncResponse( _rooms.sort(altuiSortByName), func , filterfunc, endfunc)
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
	
	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getScenes( func , filterfunc, endfunc ) {
		if (_scenes != null )
			_asyncResponse( _scenes.sort(altuiSortByName), func , filterfunc, endfunc);
		return _scenes;
	};
	
	function _getUsers(func , filterfunc, endfunc ) {
		if (_user_data.users !=null )
			_asyncResponse( _user_data.users.sort(altuiSortByName2), func , filterfunc, endfunc);
		return _user_data.users;
	};
	function _getUsersSync() {
		return _user_data.users;
	};
	function _getUserByID(userid) {
		var user=null;
		if ( _user_data.users ) {
			$.each(_user_data.users, function( idx,usr) {
				if (usr.id==userid) {
					user = usr;
					return false;
				}
			});
		}
		return user;
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
			_asyncResponse( _devices.sort(altuiSortByName), func, filterfunc, endfunc )
		return _devices;
	};
	function _getCategories( cbfunc, filterfunc, endfunc )
	{
		//http://192.168.1.16:3480/data_request?id=sdata&output_format=json
		if (_categories==null) {
			var jqxhr = _httpGet("?id=sdata&output_format=json",{},function(data, textStatus, jqXHR) {
				if (data) {
					var arr = JSON.parse(data);
					_categories = arr.categories;
					if ( $.isFunction( cbfunc ) )  {
						_asyncResponse( _categories.sort(altuiSortByName), cbfunc, filterfunc, endfunc );
					}
				} else {
					_categories = null;
					// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
				}
			});
		} else {
			_asyncResponse( _categories.sort(altuiSortByName), cbfunc, filterfunc, endfunc );
		}
		return _categories;
	};
	
	function _getIconPath(name) {
		return "//{0}/cmh/skins/default/img/devices/device_states/{1}".format( (_uniqID==0)  ? window.location.hostname : _upnpHelper.getIpAddr(), name);
	};
	
	function _getIcon( imgpath , cbfunc ) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=image",{ data: { path: imgpath } },cbfunc);
		return jqxhr;
	};
	
	function _getHouseMode(cbfunc) {
		var jqxhr = _httpGet("?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode",{},cbfunc);
		return jqxhr;		
	};

	function _setHouseMode(newmode,cbfunc) {
		var promise = null;
		if ((newmode<=4) && (newmode>=1)) {
			promise = _upnpHelper.UPnPAction( 0, 'urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode:newmode },cbfunc );
		}
		return promise;
	};
	function _getHouseModeSwitchDelay() {
		if ( _isUI5() == true )	// UI5 or not ready
			return 12;
		return ( parseInt(_user_data.mode_change_delay || 9) +3);
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
		if (devid==0)
			return _hagdevice;
		
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
		
		var device = _getDeviceByID( deviceid );
		var states = device.states;
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

	function _getJobStatus( jobid , cbfunc ) 
	{
		return _upnpHelper.UPnPGetJobStatus(jobid, cbfunc );
	};

	function _setAttr(deviceid, attribute, value,cbfunc) {
		if (_isUI5() == true) {
			return _upnpHelper.UPnPSetAttr(deviceid, attribute, value,cbfunc);
		} else {
			return _upnpHelper.UPnPSetAttrUI7(deviceid, attribute, value,cbfunc);			
		}
	}

	// dynamic
	// undefined or -1 : ALTUI mode , triggers a UPNP http save
	// 0 : means not dynamic, will require a save
	// 1 : means dynamic, lost at the next restart if not save
	function _setStatus( deviceid, service, variable, value, dynamic ) {
		// update local cache
		var promise = null;
		var statusobj= _getStatusObject( deviceid, service, variable , true ) //bCreate==true

		if (dynamic >= 0 )  {
			statusobj.value=value;	// in memory but lost at next restart
			
			// if dynamic ==0 permits the user to save
			if (dynamic==0) {
				if (_isUI5() ) {	
					// on UI5 cache until the user presses SAVE button
					var target = {};
					target.devices={};
					target.devices["devices_"+deviceid]={};
					target.devices["devices_"+deviceid].states = {};
					target.devices["devices_"+deviceid].states["states_"+statusobj.id] = {
						"value": value
					};
					_updateChangeCache( target );
				} else {
					// on UI7, do it asynchronously
					promise =  _upnpHelper.UPnPSet( deviceid, service, variable, value );					
				}
			}
		}
		else {
			// update vera
			promise =  _upnpHelper.UPnPSet( deviceid, service, variable, value );
		}
		return promise;
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
					var val = _getStatus( deviceid, condition.service, condition.variable );
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
						_getStatus( deviceid, condition.service, condition.variable ),
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
		var bResult = eval(str) ;
		return (bResult==undefined) ? false : bResult ;
	};

	function _refreshEngine() {
		var jqxhr = _httpGet("?id=lu_status2&output_format=json&DataVersion="+_status_data_DataVersion+"&Timeout={0}&MinimumDelay=1500".format(
				(_uniqID==0 ? 60 : 5 )			// cannot afford to wait 60 sec in the LUA handler for Proxied units
			),
			{beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }},
			function(data, textStatus, jqXHR)
			{
				if ((data) && (data != "") && (data != "NO_CHANGES") && (data != "Exiting") )
				{
					if ($.isPlainObject( data ) ==false)
						data=JSON.parse(data);
					_status_data_DataVersion = data.DataVersion;
					_status_data_LoadTime = data.LoadTime;
					// console.log("controller #{0} received  lu_status2 with data.UserData_DataVersion={1} ".format(_uniqID,data.UserData_DataVersion));
					if (data.devices != undefined)
					{
						$.each(data.devices, function( idx, device) {
							var userdata_device_idx = _findDeviceIdxByID(device.id);
							if (userdata_device_idx!=-1) {								
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
									EventBus.publishEvent("on_ui_deviceStatusChanged",_user_data.devices[userdata_device_idx]);
								}
							}
						});
					}
					UIManager.refreshUI( false , false );	// partial and not first time
					EventBus.publishEvent("on_startup_luStatusLoaded_"+_uniqID,data);
					
					// if user_data has changed, reload it
					if (_user_data_DataVersion != data.UserData_DataVersion) {
						// console.log("controller #{0} received  lu_status2 with data.UserData_DataVersion={1} =>requesting new user data".format(_uniqID,data.UserData_DataVersion));
						_initDataEngine();
					}
					else {
						setTimeout( _refreshEngine, (_uniqID==0 ? 100 : 300 ) );
					}
				}
				else {
						// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
						setTimeout( _refreshEngine, 1000 );
				}
			}
		);
		return jqxhr;	
	}	
	
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
			
			if (data.devices)
				$.each(data.devices, function(idx,device) {
					device.altuiid = "{0}-{1}".format(_uniqID,device.id);
					device.favorite=Favorites.get('device',device.altuiid);
					// jsonp.ud.devices.push(device);
				});
			if (data.scenes)
				$.each(data.scenes, function(idx,scene) {
					scene.altuiid = "{0}-{1}".format(_uniqID,scene.id);
					scene.favorite=Favorites.get('scene',scene.altuiid);
					// jsonp.ud.scenes.push(scene);
				});
			if (data.rooms)
				$.each(data.rooms, function(idx,room) {
					room.altuiid = "{0}-{1}".format(_uniqID,room.id);
					// jsonp.ud.rooms.push(room);
				});
			if (data.InstalledPlugins2)
				$.each(data.InstalledPlugins2, function(idx,plugin) {
					plugin.altuiid = "{0}-{1}".format(_uniqID,plugin.id);
				});
			// update the static ui information for the future displays
			$.each(_user_data.static_data || [], function(idx,ui_static_data) {
				var dt = ui_static_data.device_type == undefined ? ui_static_data.DeviceType : ui_static_data.device_type;
				if (dt!=undefined) {
					MultiBox.updateDeviceTypeUIDB( _uniqID, dt, ui_static_data);				
				}
			});
			
			// update upnp information
			$.each(_user_data.devices || [], function(idx,device) {
				var dt = device.device_type;
				if (dt!=undefined)
					MultiBox.updateDeviceTypeUPnpDB( _uniqID, dt, device.device_file);	// pass device file so UPNP data can be read
				if (device!=null) {	
					device.dirty=true; 
					EventBus.publishEvent("on_ui_deviceStatusChanged",device);
				}
			});		
			if (bFirst)
				EventBus.publishEvent("on_ui_userDataFirstLoaded_"+_uniqID);
			EventBus.publishEvent("on_ui_userDataLoaded_"+_uniqID);
		}
	};

	function _isUserDataCached() {	return MyLocalStorage.get("VeraBox"+_uniqID)!=null; }
	
	function _saveEngine() {
		AltuiDebug.debug("_saveEngine()");
		var verabox = {
			_user_data : _user_data,
			// _user_data_DataVersion :  _user_data_DataVersion,
			// _user_data_LoadTime : _user_data_LoadTime
		};
		return MyLocalStorage.set("VeraBox"+_uniqID,verabox);
	};
	function _clearEngine() {
		return MyLocalStorage.clear("VeraBox"+_uniqID);
	};

	function _loadEngine( user_data ) {
		AltuiDebug.debug("_loadEngine()");
		if (user_data) {	// if received in parameter ( like pre-prepared by LUA module )
			_user_data	= user_data;
		} else {	// or try to get from cache
			var verabox = MyLocalStorage.get("VeraBox"+_uniqID);
			if (verabox) {
				// _user_data_LoadTime 	= verabox._user_data_LoadTime;
				// _user_data_DataVersion 	= verabox._user_data_DataVersion;
				_user_data				= verabox._user_data || {};
			}
		}
		_user_data_DataVersion 	= 1;
		_user_data_LoadTime 	= null;
		_user_data.BuildVersion = undefined;		// to keep the "waiting" message for the user			
		_loadUserData(_user_data);
	};
	
	function _initDataEngine() {
		_dataEngine = null;
		AltuiDebug.debug("_initDataEngine()");
		// console.log("controller #{0} is requesting user_data with _user_data_DataVersion={1}".format(_uniqID,_user_data_DataVersion));
		var jqxhr = _httpGet( "?id=user_data&output_format=json&DataVersion="+_user_data_DataVersion,
			{beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }},
			function(data, textStatus, jqXHR) {
				// console.log("controller #{0} received user_data _user_data_DataVersion={1}".format(_uniqID,_user_data_DataVersion));
				if (data!=null) {
					_dataEngine = null;
					_loadUserData(data);
					UIManager.refreshUI( true ,false  );	// full but not first time
					_dataEngine = setTimeout( _refreshEngine, 2000 );				
				}
				else {
					_dataEngine = setTimeout( _initDataEngine, 2000 );
					// PageMessage.message( _T("Controller {0} did not respond").format(_upnpHelper.getIpAddr() ) + ", textStatus: " + textStatus , "danger");
				}
			})
			.always(function() {
				AltuiDebug.debug("_initDataEngine() (user_data) returned.");
			});
		return jqxhr;
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
	function _isUI5() {
		if (_uniqID==0)
			return (UIManager.UI7Check()==false);
		
		var bi = _getBoxInfo()
		return (bi.BuildVersion==undefined) || (bi.BuildVersion.startsWith("*1.5."));
	};
	function _getLuaStartup() {
		return _user_data.StartupCode || "";
	};
	
	function _createDevice( param , cbfunc ) {
		var target = $.extend( {descr:'default title', dfile:'', ifile:'', roomnum:0 } , param );
		return _upnpHelper.createDevice( target.descr, target.dfile, target.ifile, target.roomnum , cbfunc );
	};
	
	function _createRoom(name,cbfunc)
	{		
		var jqxhr =null;
		if (name && (name.length>0)) {
			jqxhr = _httpGet( "?id=room&action=create&name="+name, {}, function(data, textStatus, jqXHR) {
				if ((data!=null) && (data!="ERROR")) 
					PageMessage.message(_T("Create Room succeeded for")+": "+name, "success", _isUI5() );	// need user_data reload on UI5
				else 
					PageMessage.message(_T("Could not create Room")+": "+name, "warning");
				if ($.isFunction(cbfunc)){
					(cbfunc)(data);
				};
			});
		}
		return jqxhr;
	};

	function _deleteRoom(id)
	{	
		var jqxhr = _httpGet( "?id=room&action=delete&room="+id, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) 
				PageMessage.message(_T("Deleted Room")+" "+id, "success", _isUI5());	// need user_data reload on UI5
			else 
				PageMessage.message(_T("Could not delete Room")+" "+id, "warning");
		});
		return jqxhr;
	};

	function _renameRoom(id,name) {
		//http://ip_address:3480/data_request?id=room&action=rename&room=5&name=Garage
		var jqxhr = _httpGet( "?id=room&action=rename&name="+name+"&room="+id, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) 
				PageMessage.message(_T("Renamed Room")+" "+id, "success", _isUI5());	// need user_data reload on UI5
			else 
				PageMessage.message(_T("Could not rename Room")+" "+id, "warning");
		});
		return jqxhr;
	};
	
	function _runScene(id)
	{
		if ( (id<=0) || ((this.getSceneByID(id) == null)) )
			return null;
		
		var jqxhr = _httpGet( "?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="+id, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) 
				PageMessage.message(_T("Ran Scene #{0} successfully").format(id), "success");
			else 
				PageMessage.message(_T("Could not run Scene #{0}").format(id), "warning");
		});
		return jqxhr;
	};

	function _osCommand(cmd,cbfunc) {
		var jqxhr = _httpGet( "?id=lr_ALTUI_Handler&command=oscommand&oscommand={0}".format( encodeURIComponent(cmd) ), {}, function(data, textStatus, jqXHR) {
			if (data!=null) {
				var success = (data[0]=="1");
				if (success)
					PageMessage.message(_T("Os Command execution succeeded"), "success");
				else
					PageMessage.message( _T("Os Command execution on vera failed.")+"({0})".format(data) , "danger");
				if ($.isFunction( cbfunc )) 
					cbfunc({success:success, result:data.substr(2)},jqXHR);
			}
			else {
				PageMessage.message( _T("Os Command execution request failed. (returned {0})").format(textStatus) , "danger");
				if ($.isFunction( cbfunc )) 
					cbfunc({success:false, result:null},jqXHR);
			}
		});
		return jqxhr;
	};
	
	function _runLua(code, cbfunc) {
		// used to be MCV facility , now replaced with ALTUI facility
		// return _upnpHelper.UPnPRunLua(code, function(result) {
			// var res = "Fail";
			// if ((result!=null ) && (result.indexOf("<OK>OK</OK>") !=-1))
				// res ="Passed";
			// if ($.isFunction( cbfunc )) 
				// cbfunc(res);
		// });
		// var jqxhr = _httpGet( "?id=lr_ALTUI_Handler&command=run_lua&lua={0}".format( encodeURIComponent(code) ), {}, function(data, textStatus, jqXHR) {
		var jqxhr = _httpGet( "?id=lr_ALTUI_LuaRunHandler&command=run_lua&lua={0}".format( encodeURIComponent(code) ), {}, function(data, textStatus, jqXHR) {
			if (data!=null) {
				var lines = data.split('||');
				var success = (lines[0]=="1");
				if (success)
					PageMessage.message(_T("Lua execution succeeded"), "success");
				else
					PageMessage.message( _T("Lua Command execution on vera failed.")+"({0})".format(data) , "danger");
				if ($.isFunction( cbfunc )) 
					cbfunc({success:success, result:lines[1], output:lines[2]},jqXHR);
			}
			else {
				PageMessage.message( _T("Lua Command execution request failed. (returned {0})").format(textStatus) , "danger");
				if ($.isFunction( cbfunc )) 
					cbfunc({success:false, result:"", output:""},jqXHR);
			}
		});
		return jqxhr;		
	};

	function _renameDevice(device, newname, roomid)
	{
		return _upnpHelper.renameDevice(device, newname, roomid);
	};
	
	function _deleteDevice(id)
	{
		var jqxhr = _httpGet( "?id=device&action=delete&device="+id, {}, function(data, textStatus, jqXHR) {
			if ( (data!=null) && (data!="ERROR") ) {
				PageMessage.message(_T("Deleted Device {0} successfully").format(id), "success");
				MultiBox.reloadEngine( _uniqID );
			}
			else {
				PageMessage.message(_T("Could not delete Device {0}").format(id), "warning");
			}
		});
		return jqxhr;
	};
	
	function _updateNeighbors(deviceid) {
		var zwavenet = this.getDeviceByType("urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
		if (zwavenet==null)
			return;
		
		var params={};
		params[ "Device" ] = deviceid;
		return upnpHelper.UPnPAction( zwavenet.id, "urn:micasaverde-com:serviceId:ZWaveNetwork1", "UpdateNeighbors", params, function(data) {
			if (data!=null) {
				PageMessage.message(_T("Update Neighbors succeeded"));
			}
			else {
				PageMessage.message(_T("Update Neighbors failed"));
			}
		});
	};
	
	function _deleteSceneUserData(id)
	{
		if (_user_data.scenes) {
			var _index = null;
			$.each(_user_data.scenes, function(index,s) {
				if (s.id == id) {
					_index = index;
					return false;
				}
			})			
			if (_index!=null )
				_user_data.scenes.splice(_index, 1);
		}
	}
	
	function _deleteScene(id)
	{
		_deleteSceneUserData(id);
		var jqxhr = _httpGet( "?id=scene&action=delete&scene="+id, {}, function(data, textStatus, jqXHR) {
			if ( (data!=null) && (data!="ERROR") ) {
				PageMessage.message(_T("Deleted Scene {0} successfully").format(id), "success");
			}
			else {
				PageMessage.message(_T("Could not delete Scene {0}").format(id), "warning");
			}
		});
		return jqxhr;
	};

	function _setStartupCode(newlua) 
	{
		return (newlua != undefined) ? _upnpHelper.ModifyUserData( { "StartupCode":newlua } ) : null;
	};

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
	
	function _updateSceneUserData(scene)
	{
		if (_user_data.scenes) {
			var bFound = false;
			$.each(_user_data.scenes, function(i,s) {
				if (s.id == scene.id) {
					_user_data.scenes[i] = scene;
					bFound = true;
					return false;
				}
			})			
			if (bFound==false) {
				_user_data.scenes.push(scene);
			}
		}
	}
	function _editScene(sceneid,scene,cbfunc)
	{
		show_loading();
		_updateSceneUserData( scene );
		return _upnpHelper.sceneAction(scene,function(data) {
			hide_loading();
			if ($.isFunction(cbfunc))
				(cbfunc)(data);
			else {
				if ( (data!=null) && (data!="ERROR") ) {
					PageMessage.message(_T("Edited Scene {0} successfully").format(sceneid), "success");
				}
				else {
					PageMessage.message(_T("Could not edit Scene {0}").format(sceneid), "warning");
				}
			}
		});
	};
	function _renameSceneUserData(sceneid,name)
	{
		if (_user_data.scenes) {
			var bFound = false;
			$.each(_user_data.scenes, function(i,s) {
				if (s.id == sceneid) {
					_user_data.scenes[i].name=name;
					bFound = true;
					return false;
				}
			})			
		}
	};
	function _renameScene(sceneid,newname)
	{
		//http://ip_address:3480/data_request?id=scene&action=rename&scene=5&name=Chandalier&room=Garage
		var jqxhr = _httpGet( "?id=scene&action=rename&name="+newname+"&scene="+sceneid, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) {
				_renameSceneUserData(sceneid,newname)
				PageMessage.message(_T("Renamed Scene")+" "+sceneid, "success", _isUI5());	// need user_data reload on UI5
			}
			else 
				PageMessage.message(_T("Could not rename Scene")+" "+sceneid, "warning");
		});
		return jqxhr;
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
		var batteryLevel=_getStatus( device.id, "urn:micasaverde-com:serviceId:HaDevice1", "BatteryLevel" );
		return batteryLevel; // Math.floor((Math.random() * 100) + 1);
	};
	
	function _clearData(name, npage, cbfunc) {
		if (_uniqID!=0)	// only supported on master controller
			return;
			
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
		if (_uniqID!=0)	// only supported on master controller
			return;

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
		if (_uniqID!=0)	{
			// only supported on master controller
			AltuiDebug.debug("_saveData must only be called on master controller #0");
			return;
		}	
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
					FileDB.getFileContent(_uniqID,service.SFilename , function( xmlstr ) {
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
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep \"Device_Variable::m_szValue_set device: {0}.*;1m{1}\"".format(device.id,state.variable);
		var cmd = "cat /var/log/cmh/LuaUPnP.log | grep '"+'\t'+"Scene::RunScene running {0} '".format(id);
		return _osCommand(cmd,function(str) {
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
			if ($.isFunction(cbfunc)) 
				(cbfunc)(result);
		});
	};
	
	function _getDeviceVariableHistory( device, varid, cbfunc) {
		var id = device.id;
		var state = MultiBox.getStateByID(device.altuiid,varid);
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep \"Device_Variable::m_szValue_set device: {0}.*;1m{1}\"".format(device.id,state.variable);
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep $'Device_Variable::m_szValue_set device: {0}.*\033\[35;1m{1}\033\[0m'".format(device.id,state.variable);
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep $'\033\[35;1m{1}\033\[0m'".format(device.id,state.variable);
		var cmd = "cat /var/log/cmh/LuaUPnP.log | grep 'Device_Variable::m_szValue_set device: {0}.*;1m{1}\x1B'".format(device.id,state.variable);

		return _osCommand(cmd,function(str) {
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
				result.lines.push({
					date:m[1], 
					oldv:m[2], 
					newv:m[3]
					});
			}
			if ($.isFunction(cbfunc))
				(cbfunc)(result);
		})
	};

	function _getDeviceActions(device,cbfunc) {
		if (device && device.id!=0) {
			var controller = MultiBox.controllerOf(device.altuiid).controller;
			var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);
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
						usedin_objects.push({type:'trigger', scene:scene.altuiid, name:scene.name, trigger:trigger});
					}
				});
			if (scene.groups)
				$.each(scene.groups, function(idx,group) {
					$.each(group.actions, function(idx,action) {
						if (action.device==device.id) {
							usedin_objects.push({type:'action', scene:scene.altuiid, name:scene.name, action:action});
						}
					});
				});
		});
		return usedin_objects;
	};
	
	function _getDeviceEvents(device) {
		if (device && device.id!=0) {
			var ui_static_data = MultiBox.getDeviceStaticData(device);
			if  ((ui_static_data == undefined) || (ui_static_data.eventList2==undefined))
				return [];
			return ui_static_data.eventList2;
		}
		return [];
	};
	
	function _isDeviceZwave(device) {
		if (device && device.id_parent) {
			var parent = _getDeviceByID( device.id_parent );
			if (parent) {
				if (parent.device_type == "urn:schemas-micasaverde-com:device:ZWaveNetwork:1")
					return true;
			}
		}
		return false;
	};
	
	function _resetPollCounters( cbfunc ) {
		return this.getDevices( 
			function(luaid,device) {
				var id = device.id;
				var service="urn:micasaverde-com:serviceId:ZWaveDevice1"
				var PollNoReply = parseInt(_getStatus(id,service,"PollNoReply"));
				var PollOk = parseInt(_getStatus(id,service,"PollOk"));
				if (! isNaN(PollNoReply) ) {
					_setStatus( id, service, "PollNoReply", 0   );
				}
				if (! isNaN(PollOk) ) {
					_setStatus( id, service, "PollOk", 0   );
				}
			}, 
			function(device) {
				return (device.id_parent==1);
			}, 
			function(devices) {
				if ($.isFunction(cbfunc))
					(cbfunc)();
			} 
		);		
	};
	function _getUPnPHelper()	{
		return _upnpHelper;
	};
	function _getUrlHead() {
		return _upnpHelper.getUrlHead();
	};
	function _getIpAddr() {
		return _upnpHelper.getIpAddr();
	};

  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getUPnPHelper	: _getUPnPHelper,
	getIpAddr		: _getIpAddr,
	getUrlHead		: _getUrlHead,
	triggerAltUIUpgrade : _triggerAltUIUpgrade,	// (suffix,newrev)  : newrev number in TRAC
	getIconPath		: _getIconPath,		// ( src )
	getIcon			: _getIcon, 		// workaround to get image from vera box
	getWeatherSettings : _getWeatherSettings,
	isUI5			: _isUI5,				
	getBoxInfo		: _getBoxInfo,		//()
	getLuaStartup 	: _getLuaStartup,
    getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
    getRoomsSync	: function() 		{ return _rooms; },
	getRoomByID		: _getRoomByID,		// roomid
	getDevices		: _getDevices,
    getDevicesSync	: function() 		{ return _devices; },
	getDeviceByType : _getDeviceByType,
	getDeviceByAltID : _getDeviceByAltID,
	getDeviceByID 	: _getDeviceByID, 
	getDeviceBatteryLevel : _getDeviceBatteryLevel,
	getDeviceStaticUI : _getDeviceStaticUI,
	getDeviceVariableHistory : _getDeviceVariableHistory,
	getDeviceActions: _getDeviceActions,
	getDeviceEvents : _getDeviceEvents,
	getDeviceDependants : _getDeviceDependants,
	isDeviceZwave	: _isDeviceZwave,	//(device)
	getScenes		: _getScenes,
	getSceneHistory : _getSceneHistory,
	getScenesSync	: function() 		{ return _scenes; },
	getSceneByID 	: _getSceneByID,
	getNewSceneID	: _getNewSceneID,
	getPlugins		: _getPlugins,
	getPluginByID 	: _getPluginByID, 
	getUsers		: _getUsers,
	getUsersSync	: _getUsersSync,
	getUserByID		: _getUserByID,
	getHouseMode	: _getHouseMode,
	setHouseMode	: _setHouseMode,
	getHouseModeSwitchDelay : _getHouseModeSwitchDelay,
	setAttr			: _setAttr, //function _setAttr(device, attribute, value,cbfunc) {
	setStatus		: _setStatus,
	getStatus		: _getStatus,
	getJobStatus	: _getJobStatus,	//(jobid, cbfunc) 
	getStates		: _getStates,
	evaluateConditions : _evaluateConditions,		// evaluate a device condition table ( AND between conditions )
	
	createDevice	: _createDevice,
	deleteDevice	: _deleteDevice,
	renameDevice	: _renameDevice,	// ( device, newname )
	updateNeighbors	: _updateNeighbors, // id=lu_action&action=UpdateNeighbors&Device=3&DeviceNum=1
	createRoom		: _createRoom,
	deleteRoom		: _deleteRoom,
	renameRoom		: _renameRoom,		// _renameRoom(id,name)
	runScene		: _runScene,
	editScene		: _editScene,			//(sceneid,scene);
	renameScene		: _renameScene,			//(sceneid,scene);
	deleteScene		: _deleteScene,
	reloadEngine	: _reloadEngine,	
	reboot			: _reboot,
	setStartupCode	: _setStartupCode,
	
	getCategoryTitle : _getCategoryTitle,
	getCategories	 : _getCategories,
	getDeviceTypes 	: function() 		{	return _devicetypes; },
	// isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },

	// energy
	getPower		: _getPower,
	
	// stats
	resetPollCounters : _resetPollCounters,
	
	// oscommand http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=oscommand&oscommand=df
	osCommand 		: _osCommand,	//(cmd,cbfunc)		
	runLua			: _runLua,
	
	// UI5 Compatibility mode: caching user data changes and saving them at user request
	updateChangeCache : _updateChangeCache,
	saveChangeCaches  : _saveChangeCaches,
	initializeJsonp	  : _initializeJsonp,

	// save page data into altui plugin device
	saveData		: _saveData,		//  name, data , cbfunc
	saveEngine 		: _saveEngine, 
	clearEngine		: _clearEngine,
	loadEngine 		: _loadEngine, 		// optional user_data
	isUserDataCached	: _isUserDataCached,
	initEngine		: function( firstuserdata ) 	{
						_loadEngine( firstuserdata );
						_initDataEngine();				// init the data collection engine
					},		
  };
});	// not invoked, object does not exists