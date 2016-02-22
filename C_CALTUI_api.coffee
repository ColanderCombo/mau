# ## sourceURL=J_ALTUI_api.js
# # "use strict"
# # http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
# # This program is free software: you can redistribute it and/or modify
# # it under the condition that it is for private or home useage and 
# # this whole comment is reproduced in the source code file.
# # Commercial utilisation is not authorized without the appropriate
# # written agreement from amg0 / alexis . mermet @ gmail . com
# # This program is distributed in the hope that it will be useful,
# # but WITHOUT ANY WARRANTY; without even the implied warranty of
# # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# # ======================================================================
# # Global for UI5 UI7 javascript compatibility
# # ======================================================================

# jsonp = {
#     ud: {
#         devices: []
#         scenes: []
#         rooms: []
#         static_data: []
#         users: []
#     }
# }

# sysinfoJson = {}
# user_changes = 0; # for PLEG

# data_request_url = window.location.pathname+'?'
# command_url = window.location.pathname.replace('/port_3480/data_request', '/port_49451')
# send_command_url = window.location.pathname.replace('/port_3480/data_request', '/port_3480')
# _JSAPI_ctx = {}

# set_JSAPI_context = (ctx) ->
#     _JSAPI_ctx = $.extend {
#         set_panel_html_callback: null
#         deviceid: 0
#         altuiid: NULL_DEVICE
#         controllerid: 0
#     }, ctx

#     # UI5 compatibility
#     jsonp = MultiBox.initializeJsonp(_JSAPI_ctx.controllerid)
#     sysinfoJson = MultiBox.initializeSysinfo(_JSAPI_ctx.controllerid)
#     application.userData = jsonp.ud

# xml_encode = (str) ->
#     if not str?
#         alert("error in xml_encode: input undefined")
#         return
#     str = trim(str.toString())

#     str = str.replace(new RegExp("[" + "&" + "]", "g"), "&amp;")
#     str = str.replace(new RegExp("[" + "<" + "]", "g"), "&lt;")
#     str = str.replace(new RegExp("[" + ">" + "]", "g"), "&gt;")
#     str = str.replace(new RegExp("[" + "\"" + "]", "g"), "&quot;")
#     str = str.replace(new RegExp("[" + "'" + "]", "g"), "&apos;")
#     str = str.replace(/%/gi,'&#37;')

#     return str

# xml_decode = (str) ->
#     if not str?
#         alert("error in xml_decode: input undefined")
#         return
#     str = trim(str.toString())

#     str = str.replace(new RegExp("&amp;", "g"), "&")
#     str = str.replace(new RegExp("&lt;", "g"), "<")
#     str = str.replace(new RegExp("&gt;", "g"), ">")
#     str = str.replace(new RegExp("&quot;", "g"), "\"")
#     str = str.replace(new RegExp("&apos;", "g"), "'")

#     return str

# set_panel_html = (html) ->
#     if $.isFunction _JSAPI_ctx.set_panel_html_callback
#         _JSAPI_ctx.set_panel_html_callback(html)

# log_message = (msg) ->
#     PageMessage.message(msg, "info")

# set_infobox = (str, mode) ->
#     PageMessage.message(str, if (mode=="success" || mode=="error") then mode else "info")

# has_changes = (msg) ->
#     PageMessage.message(msg, "info")

# #
# # some device like Wakeup Light uses this from ergy.js
# #
# trim = (stringToTrim) -> stringToTrim.replace(/^\s+|\s+$/g,"")

# get_node_obj = (nodeObj, nodeID) ->
#     for i in [0..nodeObj.length]
#         if nodeObj[i] and nodeObj[i].id == parseInt(nodeID)
#             return nodeObj[i]
#     return undefined

# get_node_index = (nodeObj, nodeID) ->
#     for i in [0..nodeObj.length]
#         if nodeObj[i] and nodeObj[i].id == nodeID
#             return i
#     return 0

# get_new_timer_id = (timersArray) ->
#     maxID = 0
#     for i in [0..timersArray.length]
#         if timersArray[i].id > maxID
#             maxID = timersArray[i].id
#     return maxID+1

# _spinDialog = null
# show_loading = (message) ->
#     _spinDialog = DialogManager.createSpinningDialog(message)
#     _spinDialog.modal('show')

# hide_loading = () ->
#     _spinDialog.modal('hide')

# #
# # PLEG uses this from cpanel
# #
# sortByName = (a,b) ->
#     x = a.name.toLowerCase()
#     y = b.name.toLowerCase()
#     if x < y then -1 else (if x > y then 1 else 0)

# altuiSortByName = sortByName
# altuiSortByName2 = (a,b) ->
#     x = a.Name.toLowerCase()
#     y = b.Name.toLowerCase()
#     if x < y then -1 else (if x > y then 1 else 0)

# get_device_index = (deviceID) ->
#     for i in [0..jsonp.ud.devices.length]
#         if jsonp.ud.devices[i] and jsonp.ud.devices[i].id == deviceID
#             return i
#     return null

# get_device_obj = (deviceID) ->
#     for i in [0..jsonp.ud.devices.length]
#         if jsonp.ud.devices[i] and jsonp.ud.devices[i].id == deviceID
#             return jsonp.ud.devices[i]
#     return null

# get_trigger_info = (sceneID, triggerIndex) ->
#     scene = MultiBox.getSceneByID(_JSAPI_ctx.controllerid, sceneID)
#     if not scene?
#         return null
#     if scene.triggers[triggerIndex]?
#         return scene.triggers[triggerIndex]
#     else
#         return null

# cloneObject = (obj) ->
#     if Object.prototype.toString.call(obj) == '[object Array]'
#         out = []
#         for x,i in obj
#             out[i] = arguments.callee(x)
#         return out
#     else
#         if typeof(obj) == 'object'
#             out = {}
#             for i in obj
#                 out[i] = arguments.callee(obj[i])
#         return out
#     return obj
    
# get_event_definition = (DeviceType) ->
#     for datum in jsonp.ud.static_data
#         if datum? and datum.DeviceType == DeviceType
#             return datum.eventList2

# new_scene_id = () -> MultiBox.getNewSceneID(_JSAPI_ctx.controllerid)

# get_device_state = (deviceId, serviceId, variable, dynamic) ->
#     device = MultiBox.getDeviceByID(_JSAPI_ctx.controllerid, deviceId)
#     result = MultiBox.getStatus(device, serviceId, variable)
#     return result

# set_device_state = (deviceId, serviceId, variable, value, dynamic) ->
#     # -1 : ALTUI mode , triggers a UPNP http save
#     # 0 : means not dynamic, will require a save
#     # 1 : means dynamic, lost at the next restart if not save
#     if not dynamic?
#         dynamic = 0
#     device = MultiBox.getDeviceByID(_JSAPI_ctx.controllerid,deviceId)
#     MultiBox.setStatus(device, serviceId, variable, value, dynamic)
#     return true

# commandSent = () ->

# req = {
#     sendCommand: (query, callback, param) ->
#         jQuery.ajax {
#             url: data_request_url+query,
#             success: (response, status, obj) ->
#                 if callback?
#                     callback(obj.responseText, param)
#         }
# }

# class Ajax
#     Response: (data, jqXHR) -> {
#             getHeader: (name) -> jqXHR.getResponseHeader(name) or null
#             headerJSON: null
#             responseText: data
#         }

#     Request: (url, opts) ->
#         ajaxopts = {}
#         options = $.extend({
#             method: "GET"
#             parameters: {}
#             onSuccess: null
#             onFailure: null
#             onComplete: null
#         }, opts)
        
#         urlHead = url
#         params = []
#         if $.isArray options.parameters
#             urlHead = urlHead + '?' + $.params(options.parameters)
#             ajaxopts = {
#                 url: urlHead
#                 type: options.method
#             }
#         else
#             ajaxopts = {
#                 url: urlHead
#                 type: options.method
#                 data: options.parameters
#             }

#         # if this is for a remove controller, we need to proxify the url 
#         # (and the result) so that controller 0 acts as a proxy for the web 
#         # request the hack is that vera only supports parameters with a 
#         # "GET" & on the url

#         controller = MultiBox.getControllers()[_JSAPI_ctx.controllerid]
#         upnphelper = controller.controller.getUPnPHelper()
#         if _JSAPI_ctx.controllerid > 0
#             querystring = $.param(ajaxopts.data)
#             ajaxopts.data= null
#             ajaxopts.url = 
#                 upnphelper.proxify("http://#{controller.ip}#{ajaxopts.url}?#{querystring}")
#         jqxhr = $.ajax(ajaxopts)
#             .done((data, textStatus, jqXHR) ->
#                 upnphelper.unproxifyResult(data, textStatus, jqXHR, (data,textStatus,jqXHR) ->
#                     if $.isFunction options.onSuccess
#                         response = new Response(data, jqXHR)
#                         options.onSuccess(response)
#                 )
#             ).fail( (jqXHR, textStatus, errorThrown) ->
#                 if $.isFunction options.onFailure
#                     options.onFailure(textStatus)
#             ).always( (data_jqXHR, textStatus, jqXHR_errorThrown) ->
#                 if $.isFunction options.onComplete
#                     options.onComplete("")
#             )

# class Utils
#     @logDebug: (message) ->
#         if $.isPlainObject window.AltuiDebug
#             AltuiDebug.debug(message)
#         else
#             console.info(message)

#     @logError: (s) ->
#         PageMessage.message(s, "error")
#         AltuiDebug.debug("Utils.logError: #{s}")

#     @isValidIp: (ip) ->
#         reg = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\\d{1,5})?$', 'i')
#         return reg.test(ip) 

#     # returned localized version of the string
#     @getLangString: (s1,s2) -> _T(s2)

#     @xmlEncode: (str) -> xml_encode(str)

# class Interface
#     @showMessagePopup: (msg,code) -> PageMessage.message(msg, "success")
#     @showMessagePopupError: (msg) -> PageMessage.message(msg, "error")
#     @showStartupModalLoading: () -> show_loading()
#     @showModalLoading: () -> show_loading()
#     @hideModalLoading: () -> hide_loading()

# myInterface = new Interface()

# class DomPurify
#     @sanitize: (str) -> str

# class application
#     constructor: () ->
#         @userData = null

#     sendCommandSaveUserData: (bSilent) ->
#     sendCommand: (params, va_RegisterResult, va_SendError, deviceID) ->
#     userDataRemove: (type, id) ->
#     luReload: () -> MultiBox.reloadEngine(_JSAPI_ctx.controllerid)
#     getSceneObject: (SceneID) -> MultiBox.getSceneByID(_JSAPI_ctx.controllerid, SceneID)

# DEVICETYPE_HOME_AUTO_GATEWAY = "urn:schemas-micasaverde-com:device:HomeAutomationGateway:1"
# DEVICETYPE_BINARY_LIGHT = "urn:schemas-upnp-org:device:BinaryLight:1"
# DEVICETYPE_DIMMABLE_LIGHT = "urn:schemas-upnp-org:device:DimmableLight:1"
# DEVICETYPE_THERMOSTAT = "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1"
# DEVICETYPE_HUMIDITY_SENSOR = "urn:schemas-micasaverde-com:device:HumiditySensor:1"
# DEVICETYPE_MULTI_IO = "urn:schemas-micasaverde-com:device:MultiIO:1"
# DEVICETYPE_DOOR_LOCK = "urn:schemas-micasaverde-com:device:DoorLock:1"
# DEVICETYPE_DOOR_SENSOR = "urn:schemas-micasaverde-com:device:DoorSensor:1"
# DEVICETYPE_ZWAVE_NETWORK = "urn:schemas-micasaverde-com:device:ZWaveNetwork:1"
# DEVICETYPE_INSTEON_NETWORK = "urn:schemas-micasaverde-com:device:InsteonNetwork:1"
# DEVICETYPE_USB_UIRT = "urn:schemas-micasaverde-com:device:USBUIRT:1"
# DEVICETYPE_TEMPERATURE_SENSOR = "urn:schemas-micasaverde-com:device:TemperatureSensor:1"
# DEVICETYPE_POWER_METER = "urn:schemas-micasaverde-com:device:PowerMeter:1"
# DEVICETYPE_MOTION_SENSOR = "urn:schemas-micasaverde-com:device:MotionSensor:1"
# DEVICETYPE_SMOKE_SENSOR = "urn:schemas-micasaverde-com:device:SmokeSensor:1"
# DEVICETYPE_LIGHT_SENSOR = "urn:schemas-micasaverde-com:device:LightSensor:1"
# DEVICETYPE_IR_TRANSMITTER = "urn:schemas-micasaverde-com:device:IrTransmitter:1"
# DEVICETYPE_WINDOW_COVERING = "urn:schemas-micasaverde-com:device:WindowCovering:1"
# DEVICETYPE_GENERIC_IO = "urn:schemas-micasaverde-com:device:GenericIO:1"
# DEVICETYPE_REMOTE_CONTROL = "urn:schemas-micasaverde-com:device:RemoteControl:1"
# DEVICETYPE_COMBO_DEVICE = "urn:schemas-micasaverde-com:device:ComboDevice:1"
# DEVICETYPE_CAMERA = "urn:schemas-upnp-org:device:DigitalSecurityCamera:1"
# DEVICETYPE_CAMERA2 = "urn:schemas-upnp-org:device:DigitalSecurityCamera:2"
# DEVICETYPE_SERIALPORT = "urn:micasaverde-org:device:SerialPort:1"
# DEVICETYPE_SCENE_CONTROLLER = "urn:schemas-micasaverde-com:device:SceneController:1"
# DEVICETYPE_SCENE_CONTR_LED = "urn:schemas-micasaverde-com:device:SceneControllerLED:1"
# DEVICETYPE_ENERGY_CALCULATOR = "urn:schemas-micasaverde-com:device:EnergyCalculator:1"
# DEVICETYPE_TEMP_LEAK_SENSOR = "urn:schemas-micasaverde-com:device:TemperatureLeakSensor:1"
# DEVICETYPE_SCENE = "urn:schemas-micasaverde-com:device:Scene:1"
# DEVICETYPE_TV = "urn:schemas-micasaverde-com:device:tv:1"
# DEVICETYPE_CABLE = "urn:schemas-micasaverde-com:device:cable:1"
# DEVICETYPE_SATELLITE = "urn:schemas-micasaverde-com:device:satellite:1"
# DEVICETYPE_VIDEO_ACCESSORY = "urn:schemas-micasaverde-com:device:videoaccessory:1"
# DEVICETYPE_VCR_DVR = "urn:schemas-micasaverde-com:device:vcrdvd:1"
# DEVICETYPE_DVD_BLURAY = "urn:schemas-micasaverde-com:device:dvdbluray:1"
# DEVICETYPE_RECEIVER = "urn:schemas-micasaverde-com:device:receiver:1"
# DEVICETYPE_AMP = "urn:schemas-micasaverde-com:device:amp:1"
# DEVICETYPE_CD = "urn:schemas-micasaverde-com:device:cd:1"
# DEVICETYPE_MISC_HOME_CONTROL = "urn:schemas-micasaverde-com:device:mischomecontrol:1"
# DEVICETYPE_AV_MISC = "urn:schemas-micasaverde-com:device:avmisc:1"
# DEVICETYPE_VIRTUAL_DEVICE = "urn:schemas-micasaverde-com:device:VirtualDevice:1"
# DEVICEFILE_BINARY_LIGHT = "D_BinaryLight1.xml"
# DEVICEFILE_DIMMABLE_LIGHT = "D_DimmableLight1.xml"
# DEVICEFILE_THERMOSTAT = "D_HVAC_ZoneThermostat1.xml"
# DEVICEFILE_HUMIDITY_SENSOR = "D_HumiditySensor1.xml"
# DEVICEFILE_MULTI_IO = "D_GC100.xml"
# DEVICEFILE_DOOR_LOCK = "D_DoorLock1.xml"
# DEVICEFILE_DOOR_SENSOR = "D_DoorSensor1.xml"
# DEVICEFILE_ZWAVE_NETWORK = "D_ZWaveNetwork.xml"
# DEVICEFILE_INSTEON_NETWORK = "D_InsteonNetwork.xml"
# DEVICEFILE_USB_UIRT = "D_USB_UIRT.xml"
# DEVICEFILE_TEMPERATURE_SENSOR = "D_TemperatureSensor1.xml"
# DEVICEFILE_POWER_METER = "D_PowerMeter1.xml"
# DEVICEFILE_MOTION_SENSOR = "D_MotionSensor1.xml"
# DEVICEFILE_SMOKE_SENSOR = "D_SmokeSensor1.xml"
# DEVICEFILE_LIGHT_SENSOR = "D_LightSensor1.xml"
# DEVICEFILE_IR_TRANSMITTER = "D_IrTransmitter1.xml"
# DEVICEFILE_WINDOW_COVERING = "D_WindowCovering1.xml"
# DEVICEFILE_GENERIC_IO = "D_GenericIO1.xml"
# DEVICEFILE_REMOTE_CONTROL = "D_RemoteControl1.xml"
# DEVICEFILE_COMBO_DEVICE = "D_ComboDevice1.xml"
# DEVICEFILE_CAMERA = "D_DigitalSecurityCamera1.xml"
# DEVICEFILE_SCENE_CONTROLLER = "D_SceneController1.xml"
# DEVICEFILE_SCENE_CONTR_LED = "D_SceneControllerLED1.xml"
# DEVICEFILE_ENERGY_CALCULATOR = "D_EnergyCalculator1.xml"
# DEVICEFILE_AV_MISC = "D_AvMisc1.xml"
# DEVICEFILE_TEMP_LEAK_SENSOR = "D_TemperatureLeakSensor1.xml"
# DEVICEFILE_AV_SCENE = "D_Scene1.xml"
# TEMPORARY_UPNP_ARGUMENT = "TEMPORARY_UPNP_ARGUMENT"
# HAGEVICE_FILE = "S_HomeAutomationGateway1.xml"
# HAGEVICE_SID = "urn:micasaverde-com:serviceId:HomeAutomationGateway1"
# HAGEVICE_STYPE = "urn:schemas-micasaverde-org:service:HomeAutomationGateway:1"
# HAG_ACTIVE_SCENES = "ActiveScenes"
# HAG_DATAVERSION_USERDATA = "DataVersionUserData"
# HAG_DATAVERSION_STATUS = "DataVersionStatus"
# HAG_ENERGY_DOW = "EnergyDOW"
# HAG_ENERGY_TIME_OF_DAY = "GetUserData"
# HAG_NUM_LIGHTS = "GetUserData"
# HAG_THERMOSTAT_ON = "GetUserData"
# HAG_ENERGY_DOW = "GetUserData"
# HAG_GET_USER_DATA = "GetUserData"
# HAG_MODIFY_USER_DATA = "ModifyUserData"
# HAG_MODIFY_GET_VARIABLE = "GetVariable"
# HAG_MODIFY_SET_VARIABLE = "SetVariable"
# HAG_MODIFY_GET_STATUS = "GetStatus"
# HAG_MODIFY_GET_ACTIONS = "GetActions"
# HAG_MODIFY_CREATE_DEVICE = "CreateDevice"
# HAG_MODIFY_DELETE_DEVICE = "DeleteDevice"
# HAG_MODIFY_CREATE_PLUGIN = "CreatePlugin"
# HAG_MODIFY_DELETE_PLUGIN = "DeletePlugin"
# HAG_MODIFY_CREATE_PLUGIN_DEVICE = "CreatePluginDevice"
# HAG_IMPORT_UPNP_DEVICE = "ImportUpnpDevice"
# HAG_PROCESS_CHILD = "ProcessChildDevices"
# HAG_RELOAD = "Reload"
# HAG_RUN_SCENE = "RunScene"
# HAG_RUN_LUA = "RunLua"
# HAG_LOG_IP_REQUEST = "LogIpRequest"
# HADEVICE_FILE = "S_HaDevice1.xml"
# HADEVICE_SID = "urn:micasaverde-com:serviceId:HaDevice1"
# HADEVICE_STYPE = "urn:schemas-micasaverde-com:service:HaDevice:1"
# HAD_ENERGY_LOG = "EnergyLog"
# HAD_IOPORT_DEVICE = "IODevice"
# HAD_IOPORT_DEVICE_XREF = "IODeviceXRef"
# HAD_IOPORT_MAX_TIME = "MaxTime"
# HAD_IOPORT_PORT = "IOPort"
# HAD_IGNORE_ROOM = "IgnoreRoom"
# HAD_COMM_FAILURE = "CommFailure"
# HAD_POLLING_ENABLED = "PollingEnabled"
# HAD_POLL_MIN_DELAY = "PollMinDelay"
# HAD_CONFIGURED = "Configured"
# HAD_JOBID = "JobID"
# HAD_REVERSE = "ReverseOnOff"
# HAD_LAST_UPDATE = "LastUpdate"
# HAD_AUTO_CONFIGURE = "AutoConfigure"
# HAD_LAST_TIME_CHECK = "LastTimeCheck"
# HAD_LAST_TIME_OFFSET = "LastTimeOffset"
# HAD_FIRST_CONFIGURED = "FirstConfigured"
# HAD_BATTERY_LEVEL = "BatteryLevel"
# HAD_BATTERY_DATE = "BatteryDate"
# HAD_BATTERY_ALARM = "BatteryAlarm"
# HAD_DOCUMENTATION = "Documentation"
# HAD_RECONFIGURE = "Reconfigure"
# HAD_REMOVE = "Remove"
# HAD_POLL = "Poll"
# HAD_SET_POLL_FREQUENCY = "SetPollFrequency"
# HAD_STRESS_TEST = "StressTest"
# HAD_TOGGLE_STATE = "ToggleState"
# ZWN_FILE = "S_ZWaveNetwork1.xml"
# ZWN_SID = "urn:micasaverde-com:serviceId:ZWaveNetwork1"
# ZWN_STYPE = "urn:schemas-micasaverde-org:service:ZWaveNetwork:1"
# ZWN_RESET_NETWORK = "ResetNetwork"
# ZWN_UPDATE_NETWORK = "UpdateNetwork"
# ZWN_UPDATE_NEIGHBORS = "UpdateNeighbors"
# ZWN_RECONFIGURE_ALL = "ReconfigureAllNodes"
# ZWN_REMOVE_NODES = "RemoveNodes"
# ZWN_ADD_NODES = "AddNodes"
# ZWN_DOWNLOAD = "DownloadNetwork"
# ZWN_PUT_BYTE = "PutByte"
# ZWN_HEAL_NETWORK = "HealNetwork"
# ZWN_SET_POLLING = "SetPolling"
# ZWN_SEND_DATA = "SendData"
# ZWN_POLL_ALL_NODES = "PollAllNodes"
# ZWN_SOFT_RESET = "SoftReset"
# ZWN_BACKUP_DONGLE = "BackupDongle"
# ZWN_SCENE_IDS = "SceneIDs"
# ZWN_LAST_UPDATE = "LastUpdate"
# ZWN_LAST_DONGLE_BACKUP = "LastDongleBackup"
# ZWN_NET_STATUS_ID = "NetStatusID"
# ZWN_NET_STATUS_TEXT = "NetStatusText"
# ZWN_USE_45 = "Use45"
# ZWN_USE_MR = "UseMR"
# ZWN_LIMIT_NEIGHBORS = "LimitNeighbors"
# ZWN_COM_PORT = "ComPort"
# ZWN_LOCK_COM_PORT = "LockComPort"
# ZWN_NODE_ID = "NodeID"
# ZWN_VERSION_INFO = "VersionInfo"
# ZWN_HOME_ID = "HomeID"
# ZWN_ROLE = "Role"
# ZWN_RESET_MODE = "ResetMode"
# ZWN_INCLUSION_MODE = "InclusionMode"
# ZWN_NODETYPE = "NodeType"
# ZWN_TIMEOUT = "Timeout"
# ZWN_MULTIPLE = "Multiple"
# ZWN_SIMULATE_INCOMING = "SimulateIncomingData"
# ZWN_POLL_ENABLED = "PollingEnabled"
# ZWN_POLL_DELAY_INITIAL = "PollDelayInitial"
# ZWN_POLL_DELAY_DEADTIME = "PollDelayDeadTime"
# ZWN_POLL_MINDELAY = "PollMinDelay"
# ZWN_POLL_FREQUENCY = "PollFrequency"
# ZWN_LAST_ERROR = "LastError"
# ZWN_DELAY_PROCESSING = "DelayProcessing"
# ZWDEVICE_FILE = "S_ZWaveDevice1.xml"
# ZWDEVICE_SID = "urn:micasaverde-com:serviceId:ZWaveDevice1"
# ZWDEVICE_STYPE = "urn:schemas-micasaverde-com:service:ZWaveDevice:1"
# ZWD_POLL_SETTINGS = "PollSettings"
# ZWD_MULTCH_ENDPOINT = "MultiChEndpoint"
# ZWD_MULTCH_CAPABIL = "MultiChCapabilities"
# ZWD_NEIGHBORS = "Neighbors"
# ZWD_CAPABILITIES = "Capabilities"
# ZWD_CONFIG = "Configuration"
# ZWD_LAST_RESET = "LastReset"
# ZWD_SCENES_AS_EVENTS = "ScenesAsEvents"
# ZWD_SCENES_TIMESTAMPS = "ScenesTimestamp"
# ZWD_WAKEUP_INTERVAL = "WakeupInterval"
# ZWD_LAST_WAKEUP = "LastWakeup"
# ZWD_LAST_ROUTE_UPD = "LastRouteUpdate"
# ZWD_VARIABLES_GET = "VariablesGet"
# ZWD_VARIABLES_SET = "VariablesSet"
# ZWD_ASSOCIATION_GET = "AssociationGet"
# ZWD_ASSOCIATION_SET = "AssociationSet"
# ZWD_ASSOCIATION_NUM = "AssociationNum"
# ZWD_NONCE_ACK = "NonceACK"
# ZWD_MANUF_INFO = "ManufacturerInfo"
# ZWD_VERSION_INFO = "VersionInfo"
# ZWD_NODE_INFO = "NodeInfo"
# ZWD_INITIAL_NAME = "InitialName"
# ZWD_CONFIGURED_NAME = "ConfiguredName"
# ZWD_CONFIGURED_VARIABLE = "ConfiguredVariable"
# ZWD_CONFIGURED_ASSOC = "ConfiguredAssoc"
# ZWD_SPECIAL_CONFIG_DONE = "SpecialConfigDone"
# ZWD_SPECIAL_ASSOC_DONE = "SpecialAssocDone"
# ZWD_DOCUMENTATION = "Documentation"
# ZWD_MANUAL_ROUTE = "ManualRoute"
# INN_FILE = "S_InsteonNetwork1.xml"
# INN_SID = "urn:micasaverde-com:serviceId:InsteonNetwork1"
# INN_STYPE = "urn:schemas-micasaverde-org:service:InsteonNetwork:1"
# INN_RESET_NETWORK = "ResetNetwork"
# INN_REMOVE_NODES = "RemoveNodes"
# INN_ADD_NODES = "AddNodes"
# INN_STOP_ADDREM_NODES = "StopAddRemoveNodes"
# INN_SEND_DATA = "SendData"
# INN_COM_PORT = "ComPort"
# INN_LOCK_COM_PORT = "LockComPort"
# INN_LAST_ERROR = "LastError"
# INN_LAST_UPDATE = "LastUpdate"
# INN_NET_STATUS_ID = "NetStatusID"
# INN_NET_STATUS_TEXT = "NetStatusText"
# INN_POLL_ENABLED = "PollingEnabled"
# INN_POLL_DELAY_INITIAL = "PollDelayInitial"
# INN_POLL_DELAY_DEADTIME = "PollDelayDeadTime"
# INN_POLL_MINDELAY = "PollMinDelay"
# INN_POLL_FREQUENCY = "PollFrequency"
# INN_NODE_ID = "NodeID"
# INN_SL_X10_CODE = "sl_X10Code"
# INN_VERSION_INFO = "VersionInfo"
# INN_HOME_ID = "HomeID"
# INN_ROLE = "Role"
# INN_RESET_MODE = "ResetMode"
# INN_INCLUSION_MODE = "InclusionMode"
# INN_NODETYPE = "NodeType"
# INN_TIMEOUT = "Timeout"
# INN_MULTIPLE = "Multiple"
# INN_SIMULATE_INCOMING = "SimulateIncomingData"
# INDEVICE_FILE = "S_InsteonDevice1.xml"
# INDEVICE_SID = "urn:micasaverde-com:serviceId:InsteonDevice1"
# INDEVICE_STYPE = "urn:schemas-micasaverde-com:service:InsteonDevice:1"
# IND_POLL_SETTINGS = "PollSettings"
# IND_MULTCH_ENDPOINT = "MultiChEndpoint"
# IND_MULTCH_CAPABIL = "MultiChCapabilities"
# IND_NEIGHBORS = "Neighbors"
# IND_CAPABILITIES = "Capabilities"
# IND_CONFIG = "Configuration"
# IND_LAST_RESET = "LastReset"
# IND_SCENES_AS_EVENTS = "ScenesAsEvents"
# IND_WAKEUP_INTERVAL = "WakeupInterval"
# IND_LAST_WAKEUP = "LastWakeup"
# IND_LAST_ROUTE_UPD = "LastRouteUpdate"
# IND_VARIABLES_GET = "VariablesGet"
# IND_VARIABLES_SET = "VariablesSet"
# IND_ASSOCIATION_GET = "AssociationGet"
# IND_ASSOCIATION_SET = "AssociationSet"
# IND_MANUF_INFO = "ManufacturerInfo"
# IND_VERSION_INFO = "VersionInfo"
# IND_UPDATED_NAME = "UpdatedName"
# UIRT_FILE = "S_USBUIRT.xml"
# UIRT_SID = "urn:micasaverde-com:serviceId:USBUIRT1"
# UIRT_TYPE = "urn:schemas-micasaverde-com:service:USBUIRT:1"
# UIRT_COM_PORT = "ComPort"
# CAMDEVICE_FILE = "S_Camera1.xml"
# CAMDEVICE_SID = "urn:micasaverde-com:serviceId:Camera1"
# CAMDEVICE_STYPE = "urn:schemas-micasaverde-com:service:Camera:1"
# CAM_USERNAME = "Username"
# CAM_PASSWORD = "Password"
# CAM_RELATED_SENSORS = "RelatedSensors"
# CAM_SENSOR_ARCHIVE_SEC = "SensorArchiveSeconds"
# CAM_RELATED_LIGHTS = "RelatedLights"
# CAM_LIGHT_OPTIONS = "LightOptions"
# CAM_AUTO_ARCH_SEC = "AutoArchiveSeconds"
# CAM_AUTO_PRES_DAYS = "AutoArchivePreserveDays"
# CAM_URL = "URL"
# CAM_DIRECT_URL = "DirectStreamingURL"
# PTZ_FILE = "S_PanTiltZoom1.xml"
# PTZ_SID = "urn:micasaverde-com:serviceId:PanTiltZoom1"
# PTZ_STYPE = "urn:schemas-micasaverde-com:service:PanTiltZoom:1"
# PTZ_LEFT = "MoveLeft"
# PTZ_RIGHT = "MoveRight"
# PTZ_UP = "MoveUp"
# PTZ_DOWN = "MoveDown"
# PTZ_IN = "ZoomIn"
# PTZ_OUT = "ZoomOut"
# SWP_SID = "urn:upnp-org:serviceId:SwitchPower1"
# SWP_SET_TARGET = "SetTarget"
# SWP_STATUS = "Status"
# SWP_TARGET = "Target"
# WC_SID = "urn:upnp-org:serviceId:WindowCovering1"
# WC_UP = "Up"
# WC_DOWN = "Down"
# WC_STOP = "Stop"
# WC_STATUS = "Status"
# WC_TARGET = "Target"
# SWD_SID = "urn:upnp-org:serviceId:Dimming1"
# SWD_SET_LOAD_LEVEL = "SetLoadLevelTarget"
# SWD_LOAD_LEVEL_STATUS = "LoadLevelStatus"
# SWD_LOAD_LEVEL_TARGET = "LoadLevelTarget"
# DL_SID = "urn:micasaverde-com:serviceId:DoorLock1"
# DL_SET_TARGET = "SetTarget"
# DL_SET_PIN = "SetPin"
# DL_CLEAR_PIN = "ClearPin"
# DL_SET_PIN_DATE = "SetPinValidityDate"
# DL_SET_PIN_WEEK = "SetPinValidityWeekly"
# DL_CLEAR_PIN_VALID = "ClearPinValidity"
# DL_STATUS = "Status"
# DL_TARGET = "Target"
# DL_SL_USER_CODE = "sl_UserCode"
# DL_SL_PIN_FAILED = "sl_PinFailed"
# DL_SL_LOCK_BUTTON = "sl_LockButton"
# DL_SL_LOCK_FAILURE = "sl_LockFailure"
# DL_SL_UNAUTH_USER = "sl_UnauthUser"
# DL_SL_LOW_BATTERY = "sl_LowBattery"
# DL_SL_VERY_LOW_BATTERY = "sl_VeryLowBattery"
# DL_PIN_CODES = "PinCodes"
# DL_NUM_SCHEDULES = "NumSchedules"
# HVACO_SID = "urn:upnp-org:serviceId:HVAC_UserOperatingMode1"
# HVACO_SET_MODE = "SetModeTarget"
# HVACO_STATUS = "ModeStatus"
# HVACS_SID = "urn:micasaverde-com:serviceId:HVAC_OperatingState1"
# HVACS_STATE = "ModeState"
# HVACF_SID = "urn:upnp-org:serviceId:HVAC_FanOperatingMode1"
# HVACF_SET_MODE = "SetMode"
# HVACF_STATUS = "Mode"
# HVACHEAT_SID = "urn:upnp-org:serviceId:TemperatureSetpoint1_Heat"
# HVACCOOL_SID = "urn:upnp-org:serviceId:TemperatureSetpoint1_Cool"
# HVACHC_SETPOINT = "SetCurrentSetpoint"
# HVACHC_CURRENTSP = "CurrentSetpoint"
# TEMP_SID = "urn:upnp-org:serviceId:TemperatureSensor1"
# TEMP_CURRENT = "CurrentTemperature"
# LIGHT_SID = "urn:micasaverde-com:serviceId:LightSensor1"
# LIGHT_CURRENT = "CurrentLevel"
# HUM_SID = "urn:micasaverde-com:serviceId:HumiditySensor1"
# HUM_CURRENT = "CurrentLevel"
# SES_SID = "urn:micasaverde-com:serviceId:SecuritySensor1"
# SES_ARMED = "Armed"
# SES_TRIPPED = "Tripped"
# SES_SET_ARMED = "SetArmed"
# ENE_SID = "urn:micasaverde-com:serviceId:EnergyMetering1"
# ENE_KWH = "KWH"
# ENE_WATTS = "Watts"
# ENE_ACTUAL = "ActualUsage"
# ENE_USER_SUPPLIED = "UserSuppliedWattage"
# IRT_SID = "urn:micasaverde-com:serviceId:IrTransmitter1"
# IRT_SENDPRONTO = "SendProntoCode"
# SPT_SID = "urn:micasaverde-org:serviceId:SerialPort1"
# SPT_PATH = "path"
# SPT_BAUD = "baud"
# SPT_VENDOR = "vendor"
# SPT_PRODUCT = "product"
# SCR_SID = "urn:micasaverde-com:serviceId:SceneController1"
# SCR_SL_SCENE_ACTIVATED = "sl_SceneActivated"
# SCR_SL_SCENE_DEACTIVATED = "sl_SceneDeactivated"
# SCR_SCENES = "Scenes"
# SCR_LAST_SCENE_ID = "LastSceneID"
# SCR_LAST_SCENE_TIME = "LastSceneTime"
# SCR_MANAGE_LEDS = "ManageLeds"
# SCR_NUM_BUTTONS = "NumButtons"
# SCR_FIRES_OFF_EVENTS = "FiresOffEvents"
# SCR_SCENE_SHORTCUTS = "SceneShortcuts"
# SCL_SID = "urn:micasaverde-com:serviceId:SceneControllerLED1"
# SCL_SET_LIGHT = "SetLight"
# SCL_LIGHT_SETTINGS = "LightSettings"
# GIO_SID = "urn:micasaverde-com:serviceId:GenericIO"
# GIO_IS_INPUT = "IsInput"
# GIO_DEFAULT_STATE = "DefaultState"
# ZWN_LAST_HEAL = "LastHeal"
# ZWD_HEALTH = "Health"
# ZWD_NEIGHBORS_INVERSE = "NeighborsInverse"
# IR_SID = "urn:micasaverde-com:serviceId:IrDevice1"
# IR_PROPRIETARY = "ProprietaryCodeset"

# ZWD_SCENES = "Scenes"
# CAM_PRE_ROLL_BUFFER = "PreRollBuffer"

# # ************** end variables imported **********************

# DEVICE_CATEGORY_INTERFACE = 1
# DEVICE_CATEGORY_DIMMABLE_LIGHT = 2
# DEVICE_CATEGORY_SWITCH = 3
# DEVICE_CATEGORY_SECURITY_SENSOR = 4
# DEVICE_CATEGORY_HVAC =  5
# DEVICE_CATEGORY_CAMERA = 6
# DEVICE_CATEGORY_DOOR_LOCK = 7
# DEVICE_CATEGORY_WINDOW_COV = 8
# DEVICE_CATEGORY_REMOTE_CONTROL = 9
# DEVICE_CATEGORY_IR_TX = 10
# DEVICE_CATEGORY_GENERIC_IO = 11
# DEVICE_CATEGORY_GENERIC_SENSOR=12
# DEVICE_CATEGORY_SERIAL_PORT = 13
# DEVICE_CATEGORY_SCENE_CONTROLLER=14
# DEVICE_CATEGORY_AV = 15
# DEVICE_CATEGORY_HUMIDITY = 16
# DEVICE_CATEGORY_TEMPERATURE = 17
# DEVICE_CATEGORY_LIGHT = 18
# DEVICE_CATEGORY_ZWAVE_INT = 19
# DEVICE_CATEGORY_INSTEON_INT = 20
# DEVICE_CATEGORY_POWER_METER = 21
# DEVICE_CATEGORY_ALARM_PANEL = 22
# DEVICE_CATEGORY_ALARM_PARTITION = 23;

# # need to be specified in constants.h
# SERVICE_TYPE_IR_TRANSMITTER='urn:schemas-micasaverde-com:service:IrTransmitter:1'
# SID_ALARM_PARTITION = 'urn:micasaverde-com:serviceId:AlarmPartition2'
# WC_STYPE='urn:schemas-upnp-org:service:WindowCovering:1'
# DEVICETYPE_ALARM_PARTITION='urn:schemas-micasaverde-com:device:AlarmPartition:1'
# ALARM_PARTITION_SID='urn:micasaverde-com:serviceId:AlarmPartition1'
# ALARM_PARTITION_ARMED='Armed'
# ALARM_PARTITION_STAYARMED='StayArmed'
# ALARM_PARTITION_DISARMED='Disarmed'
# ALARM_PARTITION_BREACH='Breach'

# class api
#     @version: "UI7"

#     @ui: {
#         updateDevice: (deviceId, value, txt) ->
#             if txt and txt.length >=2
#                 device = MultiBox.getDeviceByID( _JSAPI_ctx.controllerid, 
#                                                 deviceId)
#                 name = txt.substring(txt.lastIndexOf('.')+1)
#                 MultiBox.setAttr(device, "ip", value, null)           

#         startupShowModalLoading: () -> show_loading()
#     }

#     @cloneObject: (obj) -> cloneObject(obj)
#     @getCommandURL: () -> command_url
#     @getSendCommandURL: () -> send_command_url
#     @getDataRequestURL: () -> data_request_url
#     @getCpanelContent: () -> ""
#     @getListOfDevices: () -> jsonp.ud.devices
#     @getCPanelDeviceId: () -> _JSAPI_ctx.deviceid
#     @getCurrentHouseMode: (onSuccess, onFailure, context) ->
#         MultiBox.getHouseMode (mode) ->
#             if not mode
#                 if onFailure
#                     (onFailure).call(context)
#             else
#                 if onSuccess
#                     (onSuccess).call(context,mode)
    
#     @setCurrentHouseMode: (modeValue, onSuccess, onFailure, context) ->
#         MultiBox.setHouseMode modeValue, (mode) ->
#             if not mode
#                 if onFailure
#                     (onFailure).call(context)
#             else
#                 if onSuccess
#                     (onSuccess).call(context,mode)
    
#     @getDeviceIndex: (deviceid) ->
#         for elem, idx in jsonp.ud.devices
#             if elem.id == deviceid
#                 return idx
#         return null

#     @getDeviceObject: (deviceid) ->
#         for elem, idx in jsonp.ud.devicesy
#             if elem.id == deviceid
#                 return elem
#         return null

#     @setCpanelContent: (html) -> set_panel_html(html)
#     @getDeviceStateVariable: (deviceId, service, variable, options) ->
#         get_device_state(deviceId, 
#                          service, 
#                          variable,
#                          options and options.dynamic)

#     @getDeviceState: (deviceId, service, variable, options) ->
#         @getDeviceStateVariable(deviceId, service, variable, options)

#     @getDeviceTemplate: (deviceId) -> false
    
#     @getDisplayedDeviceName: (deviceId) ->
#         device = @getDeviceObject(deviceId)
#         if device? and device.id != 0
#             return device.name
#         return 'unnamed device'

#     @getEventDefinition: (deviceType) ->
#         _devicetypesDB = MultiBox.getDeviceTypesDB(_JSAPI_ctx.controllerid)
#         # is an associative array indexed by json name
#         dt = _devicetypesDB[deviceType]
#         # UI7 api seems flawed as it assumes only one JSON file per device type
#         # ALTUI will return a union of all
#         eventList2 = {}
#         for ui_static_data in dt
#             if ui_static_data.eventList2?
#                 eventList2 = $.extend(true, 
#                                       eventList2, 
#                                       ui_static_data.eventList2)
#         return eventList2

#     @setDeviceStateVariable: (deviceId, service, variable, value, options) ->
#         set_device_state(deviceId, service, variable, value, options and options.dynamic)

#     @setDeviceAttribute: (deviceId, attributeName, attributeBalue, options) ->
#         device = MultiBox.getDeviceByID(_JSAPI_ctx.controllerid, deviceId)
#         MultiBox.setAttr device, attributeName, attributeValue, (result) ->
#             if options and $.isFunction options.callback
#                 options.callback()

#     @setDeviceState: (deviceId, service, variable, value, options) ->
#         @setDeviceStateVariable(deviceId, service, variable, value, options)

#     @setDeviceStateVariablePersistent: (deviceId, service, variable, value, options) ->
#         set_device_state(deviceId, service, variable, value, -1)

#     @setDeviceStatePersistent: (deviceId, service, variable, value, options) ->
#         @setDeviceStateVariablePersistent(deviceId, service, variable, value, options)

#     @getListOfSupportedEvents: () -> EventBus.getEventSupported()

#     @getLuSdata: (onSuccess, onFailure, context) ->
#         url = "data_request?id=sdata&output_format=json"
#         jqxhr = $.ajax({
#             url: url
#             type: "GET"
#             dataType: "text"
#             cache: false
#         })
#         .done( (data, textStatus, jqXHR) ->
#             if $.isFunction onSuccess
#                 # jqXHR.status and jqXHR.responseText should exist and be populated
#                 # since the dataType is set to "text"
#                 successData = {
#                     responseText: jqXHR.responseText
#                     status: jqXHR.status
#                 }
#                 (onSuccess).call(context, successData)
#         )
#         .fail( (jqXHR, textStatus, errorThrown) ->
#             if $.isFunction onFailure
#                 errorData = {
#                     responseText: jqXHR.responseText
#                     status: jqXHR.status
#                 }
#                 (onFailure).call(context, errorData)
#         )
#         .always(() ->)

#     @getSceneDescription: (sceneId, options) ->
#         scene = @getSceneByID(sceneId)
#         clone = cloneObject(scene)
#         if options
#             if options.hideTriggers then delete clone['triggers']
#             if options.hideSchedules then delete clone['timers']
#             if options.hideActions then delete clone['groups']
#         return JSON.stringify(clone)

#     @registerEventHandler: (eventName, object, functionName) ->
#         EventBus.registerEventHandler eventName, window, () ->
#             # in API7 the parameters to the callback do not include the 
#             # eventname while in ALTUI the first parameter is the eventname. 
#             # so here we have to remove it
#             theArgs = arguments
#             theArgs = [].slice.call(theArgs, 1) # remove first argument which
#                                                 # is eventname
#             func = object[functionName]
#             func.apply(object, theArgs)

#     @performActionOnDevice: (deviceId, service, action, options) ->
#         options = $.extend {
#             actionArguments: {}
#             onFailure: null
#             onSuccess: null
#             context: null
#         }, options

#         #return _upnpHelper.UPnPAction( deviceId, service, action, options.actionArguments, function(data, textStatus, jqXHR){
#         device = MultiBox.getDeviceByID(_JSAPI_ctx.controllerid, deviceId)
#         MultiBox.runAction device, 
#                            service, 
#                            action, 
#                            options.actionArguments,
#                             (data, textStatus, jqXHR) ->
#                                 if not data?
#                                     if options.onFailure
#                                         (options.onFailure).call(options.context, {
#                                             responseText: jqXHR.responseText
#                                             status: jqXHR.status
#                                         })
#                                 else
#                                     if options.onSuccess
#                                         (options.onSuccess).call(options.context, {
#                                             responseText: data
#                                             status: jqXHR.status
#                                         })
           
#     @performLuActionOnDevice: (deviceId, service, action, options) ->
#         @performActionOnDevice(deviceId, service, action, options)

#     @runUpnpCode: (code, options, onSuccess, onFailure, context) ->
#         MultiBox.runLua _JSAPI_ctx.controllerid, code, (data) ->
#             if not data?
#                 if onFailure
#                     (onFailure).call(context, null)
#             else
#                 if onSuccess
#                     (onSuccess).call(context, data)



