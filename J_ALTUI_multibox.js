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
		{	ip:'' , urlHead:'' }
	];
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
		//http://192.168.1.16:3480/luvd/S_IPhone.xml
		//http://192.168.1.16:3480/data_request?id=device
		if (_devicetypesDB[devtype]==null) {
			_devicetypesDB[devtype]={};
		};
		
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
		VeraBox.initEngine();
		UIManager.refreshUI( true , true );	// full & first time full display
	};
	
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	
	//static info per device type
	initDB			 		: _initDB,	// (devicetypes)
	initEngine				: _initEngine,	
	getDeviceTypesDB 		: function() 	{ 	return _devicetypesDB; },
	addDeviceType 			: _addDeviceType,						// (devtype, obj)				update devitetype plugin function calls ( from LUA )
	updateDeviceTypeUPnpDB	: _updateDeviceTypeUPnpDB,	//( devtype, Dfilename )		update devicetype UPNP information ( from D_xx S_xx files )
	updateDeviceTypeUIDB 	: _updateDeviceTypeUIDB,		//(devtype, ui_definitions)		update devicetype UI static infos ( from user_data )
	// getDeviceTypes 	: function() 	{	return _devicetypes; },
	isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },
/*	
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
	getDeviceBatteryLevel : _deviceBatteryLevel,
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
	saveData			: _saveData,		//  name, data , cbfunc
	saveEngine 			: _saveEngine, 
	loadEngine 			: _loadEngine, 
	isUserDataCached	: _isUserDataCached,
	*/
  };
} )( window );
