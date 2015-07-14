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
		{ ip:'', urlHead:window.location.pathname, controller:null }		// no IP = primary box on which we opened the web page
		//http://192.168.1.16:3480/luvd/S_IPhone.xml
		//http://192.168.1.16:3480/data_request?id=device
	];
	
	function _controllerOf(devid) {
		return _controllers[0].controller;
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
	function _updateDeviceTypeUPnpDB( devtype, Dfilename )	{
		if (_devicetypesDB[devtype]==null) 
			_devicetypesDB[devtype]={};
		
		// only try to load if not loaded or in the process of loading it
		if (_devicetypesDB[devtype].Dfilename == undefined) {
			_devicetypesDB[devtype].Dfilename = Dfilename;
			
			// get it into the cache ( or get it from the cache )
			FileDB.getFileContent(Dfilename , function( xmlstr , jqXHR ) {
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
	function _updateDeviceTypeUIDB(devtype, ui_definitions)	{
		if (_devicetypesDB[devtype]==null) {
			_devicetypesDB[devtype]={};
		};
		_devicetypesDB[devtype].ui_static_data = ui_definitions;
	};
	
	function _initEngine() {
		$.each(_controllers, function(idx,box) {
			box.controller = new VeraBox(idx,box.ip);
			box.controller.initEngine();
		});
		// VeraBox.initEngine();
		UIManager.refreshUI( true , true );	// full & first time full display
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
		return _controllers[0].controller.getBoxInfo();
	};
	function _setHouseMode(newmode,cbfunc) {
		return _controllers[0].controller.setHouseMode(newmode,cbfunc);
	};
	function _getRooms( func , filterfunc) {
		return _controllers[0].controller.getRooms( func , filterfunc);
	};
	function _getRoomsSync() {
		return _controllers[0].controller.getRoomsSync();
	};
	function _getRoomByID( roomid ) {
		return _controllers[0].controller.getRoomByID( roomid );
	};
	function _deleteRoom(id) {
		return _controllers[0].controller.deleteRoom(id);
	};
	function _createRoom(name) {
		return _controllers[0].controller.createRoom(name);
	};
	function _createDevice( param , cbfunc ) {
		return _controllers[0].controller.createDevice( param , cbfunc );
	};
	function _renameDevice( deviceid, newname ) {
		return _controllers[0].controller.renameDevice( param , cbfunc );
	};
	function _deleteDevice(id) {
		return _controllers[0].controller.deleteDevice(id);
	};
	function _getDevices( func , filterfunc, endfunc ) {
		return _controllers[0].controller.getDevices( func , filterfunc, endfunc );
	};
	function _getDevicesSync() {
		return _controllers[0].controller.getDevicesSync();
	};
	function _getDeviceBatteryLevel(device) {
		return _controllers[0].controller.getDeviceBatteryLevel(device);
	};
	function _getDeviceByID( devid ) {
		return _controllers[0].controller.getDeviceByID( devid );
	};
	function _getDeviceByAltID( parentdevid , altid ) {
		return _controllers[0].controller.getDeviceByAltID( parentdevid , altid );
	};
	function _getDeviceByType(str) {
		return _controllers[0].controller.getDeviceByType(str);
	};
	function _getDeviceActions(device,cbfunc) {
		return _controllers[0].controller.getDeviceActions(device,cbfunc);
	};
	function _getDeviceEvents(device) {
		return _controllers[0].controller.getDeviceEvents(device);
	};
	function _getDeviceDependants(device) {
		return _controllers[0].controller.getDeviceDependants(device);
	};
	function _getDeviceVariableHistory( device, varidx, cbfunc) {
		return _controllers[0].controller.getDeviceVariableHistory( device, varidx, cbfunc);
	};
	function _getStates( deviceid  ) {
		return _controllers[0].controller.getStates( deviceid  );
	};
	function _getStatus( deviceid, service, variable ) {
		return _controllers[0].controller.getStatus( deviceid, service, variable );
	};
	function _setStatus( deviceid, service, variable, value, dynamic ) {
		return _controllers[0].controller.setStatus( deviceid, service, variable, value, dynamic );
	};
	function _runAction(deviceid, service, action, params) {
		return _controllers[0].controller.getUPnPHelper().UPnPAction(deviceid, service, action, params);
	};
	function _setAttr(deviceid, attribute, value,cbfunc) {
		return _controllers[0].controller.getUPnPHelper().UPnPSetAttr(deviceid, attribute, value,cbfunc);
	};
	function _isDeviceZwave(id) {
		return _controllers[0].controller.isDeviceZwave(id);
	};
	function _updateNeighbors(deviceid) {
		return _controllers[0].controller.updateNeighbors(deviceid);
	};
	function _getCategories( cbfunc, filterfunc, endfunc ) {
		return _controllers[0].controller.getCategories( cbfunc, filterfunc, endfunc );
	};
	function _getCategoryTitle(catnum) {
		return _controllers[0].controller.getCategoryTitle(catnum);
	};
	function _evaluateConditions(deviceid,devsubcat,conditions) {
		return _controllers[0].controller.evaluateConditions(deviceid,devsubcat,conditions);
	};
	function _getWeatherSettings() {
		return _controllers[0].controller.getWeatherSettings();
	};
	function _reloadEngine() {
		return _controllers[0].controller.reloadEngine();
	};
	function _reboot() {
		return _controllers[0].controller.reboot();
	};
	function _deleteScene(id) {
		return _controllers[0].controller.deleteScene(id);
	};
	function _getNewSceneID() {
		return _controllers[0].controller.getNewSceneID();
	};
	function _getScenes( func , filterfunc, endfunc ) {
		return _controllers[0].controller.getScenes( func , filterfunc, endfunc );
	};
	function _getScenesSync() {
		return _controllers[0].controller.getScenesSync();
	};	
	function _getSceneByID(sceneid) {
		return _controllers[0].controller.getSceneByID(sceneid)
	};
	function _getSceneHistory( id, cbfunc) {
		return _controllers[0].controller.getSceneHistory( id, cbfunc);
	};
	function _editScene(sceneid,scenejson) {
		return _controllers[0].controller.editScene(sceneid,scenejson);
	};
	function _runScene(id) {
		return _controllers[0].controller.runScene(id);
	};
	function _runLua(code, cbfunc) {
		return _controllers[0].controller.runLua(code, cbfunc);
	};
	function _getLuaStartup() {
		return _controllers[0].controller.getLuaStartup();
	};
	function _setStartupCode(code) {
		return _controllers[0].controller.setStartupCode(code);
	};
	function _saveChangeCaches( msgidx ) {
		return _controllers[0].controller.saveChangeCaches( msgidx );
	};
	function _updateChangeCache( target ) {
		return _controllers[0].controller.updateChangeCache( target );
	};
	function _getPlugins( func , endfunc ) {
		return _controllers[0].controller.getPlugins( func , endfunc );
	};
	function _deletePlugin( id, cbfunc) {
		return _controllers[0].controller.getUPnPHelper().UPnPDeletePlugin(id,cbfunc);
	};
	function _updatePlugin( id, cbfunc) {
		return _controllers[0].controller.getUPnPHelper().UPnPUpdatePlugin(id,cbfunc);
	};
	function _updatePluginVersion( id, ver, cbfunc) {
		return _controllers[0].controller.getUPnPHelper().UPnPUpdatePluginVersion(id,ver,cbfunc);
	};
	function _getFileContent(filename , cbfunc) {
		return _controllers[0].controller.getUPnPHelper().UPnPGetFile( filename, cbfunc);
	};
	function _osCommand(cmd,cbfunc) {
		return _controllers[0].controller.osCommand(cmd,cbfunc);
	};
	function _getPower(cbfunc) {
		return _controllers[0].controller.getPower(cbfunc);
	};
	function _resetPollCounters() {
		return _controllers[0].controller.resetPollCounters();
	};
	function _isUserDataCached() {
		return _controllers[0].controller.isUserDataCached();
	};
	function _getIcon( imgpath , cbfunc ) {
		return _controllers[0].controller.getIcon( imgpath , cbfunc );
	};
	function _triggerAltUIUpgrade(urlsuffix) {
		_controllers[0].controller.triggerAltUIUpgrade(urlsuffix);
	};
	function _buildUPnPGetFileUrl(name) {
		return _controllers[0].controller.getUPnPHelper().buildUPnPGetFileUrl(name);
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
	updateDeviceTypeUPnpDB	: _updateDeviceTypeUPnpDB,	//( devtype, Dfilename )		update devicetype UPNP information ( from D_xx S_xx files )
	updateDeviceTypeUIDB 	: _updateDeviceTypeUIDB,	//(devtype, ui_definitions)		update devicetype UI static infos ( from user_data )
	
	// Access & Modes
	isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },
	getBoxInfo		: function() 	{	return _controllers[0].controller.getBoxInfo(); },
	getHouseMode	: function(cb) 	{	return _controllers[0].controller.getHouseMode(cb); },		// (cbfunc)
	setHouseMode	: _setHouseMode,		// (newmode,cbfunc)

	// Rooms
	getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
	getRoomsSync	: _getRoomsSync,	//()
	deleteRoom		: _deleteRoom,		//(id)
	createRoom		: _createRoom,		//(name)
	getRoomByID		: _getRoomByID,		//( roomid )
		
	// Devices
	createDevice			: _createDevice,			// ( param , cbfunc )
	deleteDevice			: _deleteDevice,			// id
	renameDevice			: _renameDevice,			// (devid, newname )
	getDevices				: _getDevices, 				// ( func , filterfunc, endfunc )
	getDevicesSync			: _getDevicesSync,			// ()
	getDeviceByID			: _getDeviceByID,			// ( devid ) 
	getDeviceByType			: _getDeviceByType,			// ( str )
	getDeviceByAltID		: _getDeviceByAltID,		// ( parentdevid , altid )
	getDeviceActions		: _getDeviceActions,		// (device,cbfunc) 
	getDeviceEvents			: _getDeviceEvents,			// (device)	
	getDeviceDependants		: _getDeviceDependants,		// (device)
	getDeviceBatteryLevel 	: _getDeviceBatteryLevel,	// ( device )
	getDeviceVariableHistory : _getDeviceVariableHistory,//( device, varidx, cbfunc) 
	evaluateConditions 		: _evaluateConditions,		// ( deviceid,devsubcat,conditions ) evaluate a device condition table ( AND between conditions )
	getStates				: _getStates,
	getStatus				: _getStatus,				// ( deviceid, service, variable ) 
	setStatus				: _setStatus,				// ( deviceid, service, variable, value, dynamic )				
	setAttr					: _setAttr,					// ( deviceID, attribute, value,function(result) )
	runAction				: _runAction,				// (deviceid, service, action, params);
	isDeviceZwave			: _isDeviceZwave,			// (id)
	updateNeighbors			: _updateNeighbors,			// (deviceid)
	
	//Alias
	setOnOff				: function ( deviceID, onoff) {
								this.runAction( deviceID, 'urn:upnp-org:serviceId:SwitchPower1', 'SetTarget', {'newTargetValue':onoff} );
							},
	setArm					: function ( deviceID, armed) {
								this.runAction( deviceID, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'SetArmed', {'newArmedValue':armed} );
							},
	setDoorLock				: function ( deviceID, armed) {
								this.runAction( deviceID, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {'newTargetValue':armed} );
							},
		
	// Categories
	getCategoryTitle : _getCategoryTitle,		// ( catnum )
	getCategories	 : _getCategories,			// ( cbfunc, filterfunc, endfunc )
	
	// Scenes
	deleteScene			: _deleteScene,		//id	
	getNewSceneID		: _getNewSceneID,	//()
	getScenes			: _getScenes,		//( func , filterfunc, endfunc ) {
	getSceneByID		: _getSceneByID,	//(sceneid) {	
	getSceneHistory		: _getSceneHistory,	//( id, cbfunc) {
	getScenesSync		: _getScenesSync,	//()
	editScene			: _editScene,		//(sceneid,scenejson)		
	runScene			: _runScene,		//(id)
	
	// Plugins
	getPlugins			: _getPlugins,			//( func , endfunc ) 
	deletePlugin		: _deletePlugin,		//(id,function(result)
	updatePlugin		: _updatePlugin,		//(id,function(result)
	updatePluginVersion	: _updatePluginVersion,	//(id,ver,function(result)

	// Misc
	getWeatherSettings 	: _getWeatherSettings,	// ()
	runLua				: _runLua,				//(code, cbfunc) 
	getLuaStartup		: _getLuaStartup,		//()
	setStartupCode		: _setStartupCode,		//(code)	
	saveChangeCaches	: _saveChangeCaches,	//( msgidx ) 
	updateChangeCache	: _updateChangeCache,	//( target ) 

	getFileContent		: _getFileContent,		//(Dfilename , function( xmlstr , jqXHR ) 
	osCommand			: _osCommand,			//(cmd,cbfunc) 
	getPower			: _getPower,			//(cbfunc)
	resetPollCounters	: _resetPollCounters,	//()
	isUserDataCached	: _isUserDataCached,	//()
	getIcon				: _getIcon,				//( imgpath , cbfunc )
	buildUPnPGetFileUrl : _buildUPnPGetFileUrl,	// (name)
	
	// Upgrade
	triggerAltUIUpgrade	: _triggerAltUIUpgrade,		//(url suffix)
	
  };
} )( window );
