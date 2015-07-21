//# sourceURL=J_ALTUI_multibox.js
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 


var MultiBox = ( function( window, undefined ) {
	var _devicetypesDB = {};
	var _controllers = [
		{ ip:''			  ,  controller:null },		// no IP = primary box on which we opened the web page
		// { ip:'192.168.1.5',  controller:null }		// no IP = primary box on which we opened the web page
		//http://192.168.1.16:3480/luvd/S_IPhone.xml
		//http://192.168.1.16:3480/data_request?id=device
		//http://192.168.1.16/port_3480/data_request?id=action&output_format=json&DeviceNum=162&serviceId=urn:upnp-org:serviceId:altui1&action=ProxyGet&newUrl=http://192.168.1.5/port_3480/data_request?id=lu_status2&output_format=json&DataVersion=1&Timeout=60&MinimumDelay=1500&resultName=alexis
		//http://192.168.1.5/port_3480/data_request?id=lu_status2&output_format=json&DataVersion=1&Timeout=60&MinimumDelay=1500
	];
	
	function _controllerOf(altui) {
		var elems = altui.split("-");
		return { controller:elems[0] , id:elems[1] };
	};
	
	function _initDB(devicetypes) {
		$.extend(true,_devicetypesDB,devicetypes); 
		return _devicetypesDB; 
	};
	function _addDeviceType(devtype, obj) {
		if (_devicetypesDB[devtype]==null) {
			_devicetypesDB[devtype]={};
		};
		$.extend(true,_devicetypesDB[devtype],obj);
	};
	function _updateDeviceTypeUPnpDB( controllerid, devtype, Dfilename )	{
		if (_devicetypesDB[devtype]==null) 
			_devicetypesDB[devtype]={};
		
		// only try to load if not loaded or in the process of loading it
		if (_devicetypesDB[devtype].Dfilename == undefined) {
			_devicetypesDB[devtype].Dfilename = Dfilename;
			
			// get it into the cache ( or get it from the cache )
			FileDB.getFileContent(controllerid, Dfilename , function( xmlstr , jqXHR ) {
				try {
					var doc = jqXHR ? ((jqXHR.responseXML != undefined) ? jqXHR.responseXML : $.parseXML( xmlstr )) : $.parseXML( xmlstr );
					
					var xml = $( doc );
					var imp = xml.find("implementationFile");
					_devicetypesDB[devtype].Ifilename= imp.text();
					_devicetypesDB[devtype].Services = [];
					var serviceIDs = xml.find("serviceId");
					var Sfilenames = xml.find("SCPDURL");
					xml.find("serviceId").each( function (index,value) {
						// get all services files name, but do not get content, will be fetched on demand
						_devicetypesDB[devtype].Services.push({
							ServiceId : $(value).text(),
							SFilename : $(Sfilenames[index]).text(),
							Actions : []
						});
					});
				}
				catch(e) {
					console.log("error in xml parsing, Dfile:"+Dfilename);
					console.log("xmlstr"+xmlstr);
				}
			}  );
		}
	};
	function _updateDeviceTypeUIDB(controllerid, devtype, ui_definitions)	{
		if (_devicetypesDB[devtype]==null) {
			_devicetypesDB[devtype]={};
		};
		_devicetypesDB[devtype].ui_static_data = ui_definitions;
	};

	function  _getAllEvents(name) {
		return $.map( _controllers , function(o,i) {return name+"_"+i } );
	};
	
	function _initEngine(extraController) {
		function _AllLoaded(eventname) {
			switch(eventname) {
				case "on_ui_userDataLoaded":
						UIManager.refreshUI( true , true );	// full & first time full display
						break;
				case "on_ui_userDataFirstLoaded":
					break;
			}
			// console.log(eventname);
			EventBus.publishEvent(eventname);
		};
		EventBus.waitForAll( "on_ui_userDataFirstLoaded", _getAllEvents("on_ui_userDataFirstLoaded"), this, _AllLoaded );
		EventBus.waitForAll("on_ui_userDataLoaded", _getAllEvents("on_ui_userDataLoaded"), this, _AllLoaded );
							
		// initialize controller 0 right away, no need to wait					
		_controllers[0].controller = new VeraBox(0,'');		// create the main controller
		_controllers[0].controller.initEngine();
		
		// add the extra controllers
		if (extraController.trim().length>0)
			$.each(extraController.split(','), function(idx,ipaddr) {
				_controllers.push({ ip:ipaddr, controller:null });
			});
		
		// initialize controllers that are not yet initialized
		$.each(_controllers, function(idx,box) {
			if (box.controller == null) {
				box.controller = new VeraBox(idx,box.ip);
				box.controller.initEngine();		// will raise("on_ui_userDataFirstLoaded_"+_uniqID) ("on_ui_userDataLoaded_"+_uniqID)
			}
		});
	};
	function _saveEngine() {
		$.each(_controllers, function(idx,box) {
			box.controller.saveEngine();
		});
		return;
	};
	function _clearEngine() {
		$.each(_controllers, function(idx,box) {
			box.controller.clearEngine();
		});
		return;
	};
	function _getBoxInfo() {
		var arr=[];
		$.each(_controllers, function(i,c) {
			arr.push( c.controller.getBoxInfo() );
		});
		return arr;
	};
	function _getUrlHead(altuiid) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUrlHead();
	};
	function _getIpAddr(altuiid) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getIpAddr();
	};	
	function _isUI5(controller) {
		if (controller==0)
			return (_devicetypesDB["info"].ui7Check == "false" );
		
		var info = _controllers[controller].controller.getBoxInfo();
		return (info.BuildVersion == undefined);
	};
	function _initializeJsonp(controller) {
		return _controllers[controller].controller.initializeJsonp();
	};
	function _setHouseMode(newmode,cbfunc) {
		return _controllers[0].controller.setHouseMode(newmode,cbfunc);
	};
	function _getRooms( func , filterfunc, endfunc) {
		var arr=[];
		var answers=0;
		$.each(_controllers, function( i,c) {
			c.controller.getRooms( 
				function( idx, room) {
					var index = arr.length;
					arr.push(room);
					if ($.isFunction(func))
						(func)(index,room);
				} ,
				filterfunc,
				function(rooms) {
					answers++;
					if (answers == _controllers.length) {
						if ($.isFunction(endfunc))
							(endfunc)(arr.sort(altuiSortByName));
					}
				}
			);
		});		
		return _getRoomsSync();
	};
	function _getRoomsSync() {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getRoomsSync( ));
		});		
		return arr.sort(altuiSortByName);
	};
	function _getRoomByID( controllerid, roomid ) {
		return _controllers[controllerid].controller.getRoomByID( roomid );
	};
	function _getRoomByAltuiID( altuiid ) {
		var elems = altuiid.split("-");
		return _controllers[ elems[0] ].controller.getRoomByID( elems[1] );
	};
	function _deleteRoom(room) {
		var elems = room.altuiid.split("-");
		return _controllers[elems[0]].controller.deleteRoom(elems[1]);
	};
	function _createRoom(controllerid, name) {
		return _controllers[controllerid].controller.createRoom(name);
	};
	function _createDevice( controllerid, param , cbfunc ) {
		var id = controllerid || 0;
		return _controllers[id].controller.createDevice( param , function(newid) {
			(cbfunc)("{0}-{1}".format(id,newid));
		});
	};
	function _renameDevice( device, newname, roomid ) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.renameDevice( device, newname, roomid);
	};
	function _deleteDevice(device) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.deleteDevice(elems[1]);
	};
	function _getDevices( func , filterfunc, endfunc ) {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getDevices( func , filterfunc, null ));
		});
		if ($.isFunction(endfunc))
			(endfunc)( arr );
		// return _controllers[0].controller.getDevices( func , filterfunc, endfunc );
	};
	function _getDevicesSync() {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getDevicesSync());
		});
		return arr;
	};
	function _getDeviceBatteryLevel(device) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getDeviceBatteryLevel(device);
	};
	function _getDeviceByAltuiID( devid ) {
		var elems = devid.split("-");
		return _controllers[ elems[0] ].controller.getDeviceByID( elems[1] );
	};
	function _getDeviceByID( controllerid , devid ) {
		return _controllers[controllerid].controller.getDeviceByID( devid );
	};
	function _getDeviceByAltID( controllerid, parentdevid , altid ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getDeviceByAltID( parentdevid , altid );
	};
	function _getDeviceByType(str) {
		return _controllers[0].controller.getDeviceByType(str);
	};
	function _getDeviceActions(device,cbfunc) {
		if (device==null) 
			cbfunc([]);
		else {
			var elems = device.altuiid.split("-");
			return _controllers[elems[0]].controller.getDeviceActions(device,cbfunc);
		}
		return [];
	};
	function _getDeviceEvents(device) {
		if (device==null) return [];
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getDeviceEvents(device);
	};
	function _getDeviceDependants(device) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getDeviceDependants(device);
	};
	function _getDeviceVariableHistory( device, varidx, cbfunc) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getDeviceVariableHistory( device, varidx, cbfunc);
	};
	function _getStatesByAltuiID(altuiid) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getStates( elems[1]  );
	};
	function _getStates( device ) {
		if (device==null) return null;
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getStates( elems[1]  );
	};
	function _getStatus( device, service, variable ) {
		if (device==null) return null;
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getStatus( elems[1], service, variable );
	};
	function _setStatus( device, service, variable, value, dynamic ) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.setStatus( elems[1], service, variable, value, dynamic );
	};
	function _getJobStatus( controllerid, jobid , cbfunc )
	{
		return _controllers[controllerid].controller.getJobStatus( jobid, cbfunc );
	};
	function _runAction(device, service, action, params,cbfunc) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().UPnPAction(elems[1], service, action, params,cbfunc);
	};
	function _runActionByAltuiID(altuiid, service, action, params,cbfunc) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().UPnPAction(elems[1], service, action, params,cbfunc);
	};
	function _setAttr(device, attribute, value,cbfunc) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().UPnPSetAttr(elems[1], attribute, value,cbfunc);
	};
	function _isDeviceZwave(device) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.isDeviceZwave(device);
	};
	function _updateNeighbors(device) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.updateNeighbors(elems[1]);
	};
	function _getCategories( cbfunc, filterfunc, endfunc ) {
		var arr=[];
		var answers = 0;
		$.each(_controllers, function( idx,c) {
			var index = idx;
			c.controller.getCategories(
				function (idx,cat) {
					var index = arr.length;
					arr.push(cat);
					if ($.isFunction(cbfunc))
						(cbfunc)(index,cat);
				},
				filterfunc,
				function (categories) {
					answers++;
					if (answers == _controllers.length) {
						if ($.isFunction(endfunc))
							(endfunc)(arr.sort(altuiSortByName));
					}
				} );
		});
		return arr;
	};
	function _getCategoryTitle(catnum) {
		return _controllers[0].controller.getCategoryTitle(catnum);	//returns (found !=undefined) ? found : '';
	};
	function _evaluateConditions(device,devsubcat,conditions) {
		var elems = device.altuiid.split("-");
		return _controllers[elems[0]].controller.evaluateConditions(elems[1],devsubcat,conditions);
	};
	function _getWeatherSettings() {
		return _controllers[0].controller.getWeatherSettings();
	};
	function _reloadEngine(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.reloadEngine();
	};
	function _reboot(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.reboot();
	};
	function _deleteScene(scene) {
		var elems = scene.altuiid.split("-");
		return _controllers[elems[0]].controller.deleteScene(elems[1]);
	};
	function _getNewSceneID(controllerid) {
		var id = controllerid || 0;
		var newid= _controllers[id].controller.getNewSceneID();
		return {
			id:  		newid,
			altuiid: 	"{0}-{1}".format(controllerid,newid)
		};
	};
	function _getScenes( func , filterfunc, endfunc ) {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getScenes( func , filterfunc, null ));
		});
		if ($.isFunction(endfunc))
			(endfunc)( arr );		
		return arr;
	};
	function _getScenesSync() {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getScenesSync());
		});	
		return arr;
	};	
	function _getSceneByID(controllerid,sceneid) {
		return _controllers[controllerid].controller.getSceneByID(sceneid)
	};
	function _getSceneByAltuiID(altuiid) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getSceneByID(elems[1])
	};
	function _getSceneHistory( scene, cbfunc) {
		var elems = scene.altuiid.split("-");
		return _controllers[elems[0]].controller.getSceneHistory( elems[1], cbfunc);
	};
	function _editScene(altuiid,scenejson,cbfunc) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.editScene(elems[1],scenejson,cbfunc);
	};
	function _runScene(scene) {
		var elems = scene.altuiid.split("-");
		return _controllers[elems[0]].controller.runScene(elems[1]);
	};
	function _runSceneByAltuiID(altuiid) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.runScene(elems[1]);
	};
	function _runLua(controllerid, code, cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.runLua(code, cbfunc);
	};
	function _getLuaStartup(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.getLuaStartup();
	};
	function _setStartupCode(controllerid,code) {
		var id = controllerid || 0;
		return _controllers[id].controller.setStartupCode(code);
	};
	function _saveChangeCaches( controllerid,msgidx ) {
		var id = controllerid || 0;
		return _controllers[id].controller.saveChangeCaches( msgidx );
	};
	function _updateChangeCache( controllerid,target ) {
		var id = controllerid || 0;
		return _controllers[id].controller.updateChangeCache( target );
	};
	function _saveData( name, data , cbfunc) {
		return _controllers[0].controller.saveData( name, data , cbfunc );
	};	
	function _getPlugins( func , endfunc ) {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getPlugins( func , null ));
		});
		if ($.isFunction(endfunc))
			(endfunc)( arr );		
		return arr;
	};
	function _deletePlugin( altuiid, cbfunc) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().UPnPDeletePlugin(elems[1],cbfunc);
	};
	function _updatePlugin( altuiid, cbfunc) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().UPnPUpdatePlugin(elems[1],cbfunc);
	};
	function _updatePluginVersion( altuiid, ver, cbfunc) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().UPnPUpdatePluginVersion(elems[1],ver,cbfunc);
	};
	function _getFileContent(controllerid, filename , cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.getUPnPHelper().UPnPGetFile( filename, cbfunc);
	};
	function _osCommand(controllerid, cmd,cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.osCommand(cmd,cbfunc);
	};
	function _getPower(controllerid,cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.getPower(cbfunc);
	};
	function _resetPollCounters() {
		$.each(_controllers, function(i,c) {
			c.controller.resetPollCounters();
		});
	};
	function _isUserDataCached(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.isUserDataCached();
	};
	function _getIconPath( controllerid, iconname ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getIconPath( iconname );
	};
	function _getIcon( controllerid, imgpath , cbfunc ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getIcon( imgpath , cbfunc );
	};
	function _triggerAltUIUpgrade(urlsuffix) {
		_controllers[0].controller.triggerAltUIUpgrade(urlsuffix);
	};
	function _buildUPnPGetFileUrl(altuiid,name) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUPnPHelper().buildUPnPGetFileUrl(name);
	};
	
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------

	//static info per device type
	initDB			 		: _initDB,	// (devicetypes)
	initEngine				: _initEngine,	
	reloadEngine			: _reloadEngine,	
	reboot					: _reboot,
	saveEngine				: _saveEngine,	//()
	clearEngine				: _clearEngine,	//()
	
	// controller selection
	controllerOf : _controllerOf,	//(deviceid)
	
	// Device Type DB
	getDeviceTypesDB 		: function() 	{ 	return _devicetypesDB; },
	addDeviceType 			: _addDeviceType,			// (devtype, obj)				update devitetype plugin function calls ( from LUA )
	updateDeviceTypeUPnpDB	: _updateDeviceTypeUPnpDB,	//( controllerid, devtype, Dfilename )		update devicetype UPNP information ( from D_xx S_xx files )
	updateDeviceTypeUIDB 	: _updateDeviceTypeUIDB,	//( controllerid, devtype, ui_definitions)		update devicetype UI static infos ( from user_data )
	
	// Access & Modes
	isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },
	getBoxInfo		: function() 	{	return _controllers[0].controller.getBoxInfo(); },
	getHouseMode	: function(cb) 	{	return _controllers[0].controller.getHouseMode(cb); },		// (cbfunc)
	setHouseMode	: _setHouseMode,		// (newmode,cbfunc)

	// Rooms
	getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
	getRoomsSync	: _getRoomsSync,	//()
	deleteRoom		: _deleteRoom,		//(room)
	createRoom		: _createRoom,		//(controllerid, name)
	getRoomByID		: _getRoomByID,		//( roomid )
	getRoomByAltuiID:_getRoomByAltuiID,	//(altuiid)	
	// Devices
	createDevice			: _createDevice,			// ( param , cbfunc )
	deleteDevice			: _deleteDevice,			// id
	renameDevice			: _renameDevice,			// (device, newname )
	getDevices				: _getDevices, 				// ( func , filterfunc, endfunc )
	getDevicesSync			: _getDevicesSync,			// ()
	getDeviceByAltuiID		: _getDeviceByAltuiID,		// ( devid ) 
	getDeviceByType			: _getDeviceByType,			// ( str )
	getDeviceByID			: _getDeviceByID,			// ( controller, devid ) 
	getDeviceByAltID		: _getDeviceByAltID,		// ( parentdevid , altid )
	getDeviceActions		: _getDeviceActions,		// (device,cbfunc) 
	getDeviceEvents			: _getDeviceEvents,			// (device)	
	getDeviceDependants		: _getDeviceDependants,		// (device)
	getDeviceBatteryLevel 	: _getDeviceBatteryLevel,	// ( device )
	getDeviceVariableHistory : _getDeviceVariableHistory,//( device, varidx, cbfunc) 
	evaluateConditions 		: _evaluateConditions,		// ( device,devsubcat,conditions ) evaluate a device condition table ( AND between conditions )
	getStates				: _getStates,				// ( device )
	getStatesByAltuiID		: _getStatesByAltuiID,		// (altuiid)
	getStatus				: _getStatus,				// ( device, service, variable ) 
	setStatus				: _setStatus,				// ( device, service, variable, value, dynamic )				
	getJobStatus			: _getJobStatus,			// (  jobid , cbfunc )
	setAttr					: _setAttr,					// ( device, attribute, value,function(result) )
	runAction				: _runAction,				// (device, service, action, params,cbfunc);
	runActionByAltuiID		: _runActionByAltuiID,		// (altuiid, service, action, params,cbfunc) 
	isDeviceZwave			: _isDeviceZwave,			// (device)
	updateNeighbors			: _updateNeighbors,			// (device)
	
	//Alias
	setOnOff				: function ( altuiid, onoff) {
								MultiBox.runActionByAltuiID( altuiid, 'urn:upnp-org:serviceId:SwitchPower1', 'SetTarget', {'newTargetValue':onoff} );
							},
	setArm					: function ( altuiid, armed) {
								this.runActionByAltuiID( altuiid, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'SetArmed', {'newArmedValue':armed} );
							},
	setDoorLock				: function ( altuiid, armed) {
								this.runActionByAltuiID( altuiid, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {'newTargetValue':armed} );
							},
		
	// Categories
	getCategoryTitle : _getCategoryTitle,		// ( catnum )
	getCategories	 : _getCategories,			// ( cbfunc, filterfunc, endfunc )
	
	// Scenes
	deleteScene			: _deleteScene,		//id	
	getNewSceneID		: _getNewSceneID,	//()
	getScenes			: _getScenes,		//( func , filterfunc, endfunc ) {
	getSceneByID		: _getSceneByID,	//(sceneid) {	
	getSceneByAltuiID	: _getSceneByAltuiID, // (altuiid)
	getSceneHistory		: _getSceneHistory,	//( id, cbfunc) {
	getScenesSync		: _getScenesSync,	//()
	editScene			: _editScene,		//(altuiid,scenejson, function(result)	
	runScene			: _runScene,		//(id)
	runSceneByAltuiID	: _runSceneByAltuiID,
	
	// Plugins
	getPlugins			: _getPlugins,			//( func , endfunc ) 
	deletePlugin		: _deletePlugin,		//(id,function(result)
	updatePlugin		: _updatePlugin,		//(id,function(result)
	updatePluginVersion	: _updatePluginVersion,	//(id,ver,function(result)

	// Misc
	getBoxInfo			: _getBoxInfo,			// ()
	getUrlHead			: _getUrlHead,			// ()
	getIpAddr			: _getIpAddr,			// ()
	isUI5				: _isUI5,				// (controller)
	initializeJsonp		: _initializeJsonp,		// (controller)
	getWeatherSettings 	: _getWeatherSettings,	// ()
	runLua				: _runLua,				//(code, cbfunc) 
	getLuaStartup		: _getLuaStartup,		//()
	setStartupCode		: _setStartupCode,		//(code)	
	saveChangeCaches	: _saveChangeCaches,	//( msgidx ) 
	updateChangeCache	: _updateChangeCache,	//( target ) 
	saveData			: _saveData,			//( name, data , cbfunc)
	getFileContent		: _getFileContent,		//(Dfilename , function( xmlstr , jqXHR ) 
	osCommand			: _osCommand,			//(cmd,cbfunc) 
	getPower			: _getPower,			//(cbfunc)
	resetPollCounters	: _resetPollCounters,	//()
	isUserDataCached	: _isUserDataCached,	//()
	getIconPath			: _getIconPath,			// (device,str)
	getIcon				: _getIcon,				// ( controllerid, imgpath , cbfunc )
	buildUPnPGetFileUrl : _buildUPnPGetFileUrl,	// (name)
	
	// Upgrade
	triggerAltUIUpgrade	: _triggerAltUIUpgrade,		//(url suffix)
	
  };
} )( window );
