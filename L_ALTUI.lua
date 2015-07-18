-- // This program is free software: you can redistribute it and/or modify
-- // it under the condition that it is for private or home useage and 
-- // this whole comment is reproduced in the source code file.
-- // Commercial utilisation is not authorized without the appropriate
-- // written agreement from amg0 / alexis . mermet @ gmail . com
-- // This program is distributed in the hope that it will be useful,
-- // but WITHOUT ANY WARRANTY; without even the implied warranty of
-- // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
local MSG_CLASS = "ALTUI"
local service = "urn:upnp-org:serviceId:altui1"
local devicetype = "urn:schemas-upnp-org:device:altui:1"
local DEBUG_MODE = false
local version = "v0.60"
local UI7_JSON_FILE= "D_ALTUI_UI7.json"
local json = require("L_ALTUIjson")
local mime = require("mime")
local http = require("socket.http")
local ltn12 = require("ltn12")
local tmpprefix = "/tmp/altui_"		-- prefix for tmp files
hostname = ""

--calling a function from HTTP in the device context
--http://192.168.1.5/port_3480/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&DeviceNum=81&Code=getMapUrl(81)

------------------------------------------------
-- XPATH Stuff --
------------------------------------------------

------------------------------------------------
-- Debug --
------------------------------------------------
local function log(text, level)
	luup.log(string.format("%s: %s", MSG_CLASS, text), (level or 50))
end

local function debug(text)
	if (DEBUG_MODE) then
		log("debug: " .. text)
	end
end

local function warning(stuff)
	log("warning: " .. stuff, 2)
end

local function error(stuff)
	log("erreur: " .. stuff, 1)
end

local function dumpString(str)
	for i=1,str:len() do
		debug(string.format("i:%d c:%d char:%s",i,str:byte(i),str:sub(i,i) ))
	end
end

function file_exists(name)
   local f=io.open(name,"r")
   if f~=nil then io.close(f) return true else return false end
end

function proxyGet(lul_device,newUrl,resultName)
	debug(string.format("proxyGet lul_device:%d",lul_device))	
	local httpcode,data = luup.inet.wget(newUrl,10)
	if (httpcode~=0) then
		error(string.format("failed to connect to url:%s, http.request returned %d", newUrl,httpcode))
		return 0,"";
	end
	debug(string.format("success httpcode:%s",httpcode))	
	debug(string.format("data:%s",data))	
	return 1,data
end

function setDebugMode(lul_device,newDebugMode)
	lul_device = tonumber(lul_device)
	newDebugMode = tonumber(newDebugMode) or 0
	log(string.format("setDebugMode(%d,%d)",lul_device,newDebugMode))
	luup.variable_set(service, "Debug", newDebugMode, lul_device)
	if (newDebugMode==1) then
		DEBUG_MODE=true
	else
		DEBUG_MODE=false
	end
end


---code from lolodomo DNLA plugin
local function xml_decode(val)
      return val:gsub("&#38;", '&')
                :gsub("&#60;", '<')
                :gsub("&#62;", '>')
                :gsub("&#34;", '"')
                :gsub("&#39;", "'")
                :gsub("&lt;", "<")
                :gsub("&gt;", ">")
                :gsub("&quot;", '"')
                :gsub("&apos;", "'")
                :gsub("&amp;", "&")
end

---code from lolodomo DNLA plugin
local function xml_encode(val)
      return val:gsub("&", "&amp;")
                :gsub("<", "&lt;")
                :gsub(">", "&gt;")
                :gsub('"', "&quot;")
                :gsub("'", "&apos;")
end

function url_decode(str)
  str = string.gsub (str, "+", " ")
  str = string.gsub (str, "%%(%x%x)",
      function(h) return string.char(tonumber(h,16)) end)
  str = string.gsub (str, "\r\n", "\n")
  return str
end

--
-- code from lolodomo in DNLA plugin
--
local function table2XML(value)
	--debug(string.format("table2XML(%s)",json.encode(value)))
	local result = ""
	if (value == nil) then
		return result
	end
	--
	-- Convert all the Number, Boolean and Table objects, and escape all the string
	-- values in the XML output stream
	--
	-- If value table has an entry OrderedArgs, we consider that all the values
	-- are set in this special entry and we bypass all the other values of the value table.
	-- In this particular case, this entry itself is a table of strings, each element of
	-- the table following the format "parameter=value"
	--
	for e, v in pairs(value) do
		if (v == nil) then
			result = result .. string.format("<%s />", e)
		elseif (type(v) == "table") then
			result = result .. table2XML(v)
		elseif (type(v) == "number") then
			result = result .. string.format("<%s>%.0f</%s>", e, v, e)
		elseif (type(v) == "boolean") then
			result = result .. string.format("<%s>%s</%s>", e, (v and "1" or "0"), e)
		else
			result = result .. string.format("<%s>%s</%s>", e, xml_encode(v), e)
		end
	end
	return result
end


------------------------------------------------
-- Check UI7
------------------------------------------------
local function checkVersion(lul_device)
	local ui7Check = luup.variable_get(service, "UI7Check", lul_device) or ""
	if ui7Check == "" then
		luup.variable_set(service, "UI7Check", "false", lul_device)
		ui7Check = "false"
	end
	if( luup.version_branch == 1 and luup.version_major == 7 and ui7Check == "false") then
		luup.variable_set(service, "UI7Check", "true", lul_device)
		luup.attr_set("device_json", UI7_JSON_FILE, lul_device)
		luup.reload()
	end
end

local function getIP()
	local stdout = io.popen("GetNetworkState.sh ip_wan")
	local ip = stdout:read("*a")
	stdout:close()
	return ip
end

local function getSysinfo(ip)
	--http://192.168.1.5/cgi-bin/cmh/sysinfo.sh
	log(string.format("getSysinfo(%s)",ip))
	local url=string.format("http://%s/cgi-bin/cmh/sysinfo.sh",ip)
	local timeout = 30
	local httpcode,content = luup.inet.wget(url,timeout)
	if (httpcode==0) then
		local obj = json.decode(content)
		debug("sysinfo="..content)
		return obj
	end
	return nil
end

------------------------------------------------
-- Tasks
------------------------------------------------
local taskHandle = -1
local TASK_ERROR = 2
local TASK_ERROR_PERM = -2
local TASK_SUCCESS = 4
local TASK_BUSY = 1

--
-- Has to be "non-local" in order for MiOS to call it :(
--
local function task(text, mode)
	if (mode == TASK_ERROR_PERM)
	then
		error(text)
	elseif (mode ~= TASK_SUCCESS)
	then
		warning(text)
	else
		log(text)
	end
	if (mode == TASK_ERROR_PERM)
	then
		taskHandle = luup.task(text, TASK_ERROR, MSG_CLASS, taskHandle)
	else
		taskHandle = luup.task(text, mode, MSG_CLASS, taskHandle)

		-- Clear the previous error, since they're all transient
		if (mode ~= TASK_SUCCESS)
		then
			luup.call_delay("clearTask", 15, "", false)
		end
	end
end

function clearTask()
	task("Clearing...", TASK_SUCCESS)
end

function UserMessage(text, mode)
	mode = (mode or TASK_ERROR)
	task(text,mode)
end

------------------------------------------------
-- LUA Utils
------------------------------------------------
function string:split(sep) -- from http://lua-users.org/wiki/SplitJoin
	local sep, fields = sep or ":", {}
	local pattern = string.format("([^%s]+)", sep)
	self:gsub(pattern, function(c) fields[#fields+1] = c end)
	return fields
end

function string:template(variables)
	return (self:gsub('@(.-)@', 
		function (key) 
			return tostring(variables[key] or '') 
		end))
end

function string:trim()
  return self:match "^%s*(.-)%s*$"
end

------------------------------------------------
-- VERA Device Utils
------------------------------------------------

-- example: iterateTbl( t , luup.log )
local function forEach( tbl, func, param )
	for k,v in pairs(tbl) do
		func(k,v,param)
	end
end

function tablelength(T)
  local count = 0
  for _ in pairs(T) do count = count + 1 end
  return count
end

local function getParent(lul_device)
	return luup.devices[lul_device].device_num_parent
end

local function getAltID(lul_device)
	return luup.devices[lul_device].id
end

-----------------------------------
-- from a altid, find a child device
-- returns 2 values
-- a) the index === the device ID
-- b) the device itself luup.devices[id]
-----------------------------------
local function findChild( lul_parent, altid )
	debug(string.format("findChild(%s,%s)",lul_parent,altid))
	for k,v in pairs(luup.devices) do
		if( getParent(k)==lul_parent) then
			if( v.id==altid) then
				return k,v
			end
		end
	end
	return nil,nil
end

local function forEachChildren(parent, func, param )
	--debug(string.format("forEachChildren(%s,func,%s)",parent,param))
	for k,v in pairs(luup.devices) do
		if( getParent(k)==parent) then
			func(k, param)
		end
	end
end

local function getForEachChildren(parent, func, param )
	--debug(string.format("forEachChildren(%s,func,%s)",parent,param))
	local result = {}
	for k,v in pairs(luup.devices) do
		if( getParent(k)==parent) then
			result[#result+1] = func(k, param)
		end
	end
	return result
end

------------------------------------------------
-- Device Properties Utils
------------------------------------------------

local function getSetVariable(serviceId, name, deviceId, default)
	local curValue = luup.variable_get(serviceId, name, deviceId)
	if (curValue == nil) then
		curValue = default
		luup.variable_set(serviceId, name, curValue, deviceId)
	end
	return curValue
end

local function getSetVariableIfEmpty(serviceId, name, deviceId, default)
	local curValue = luup.variable_get(serviceId, name, deviceId)
	if (curValue == nil) or (curValue:trim() == "") then
		curValue = default
		luup.variable_set(serviceId, name, curValue, deviceId)
	end
	return curValue
end

local function setVariableIfChanged(serviceId, name, value, deviceId)
	debug(string.format("setVariableIfChanged(%s,%s,%s,%s)",serviceId, name, value, deviceId))
	local curValue = luup.variable_get(serviceId, name, deviceId) or ""
	value = value or ""
	if (tostring(curValue)~=tostring(value)) then
		luup.variable_set(serviceId, name, value, deviceId)
	end
end

local function setAttrIfChanged(name, value, deviceId)
	debug(string.format("setAttrIfChanged(%s,%s,%s)",name, value, deviceId))
	local curValue = luup.attr_get(name, deviceId)
	if ((value ~= curValue) or (curValue == nil)) then
		luup.attr_set(name, value, deviceId)
		return true
	end
	return value
end

------------------------------------------------
-- HOUSE MODE
------------------------------------------------
-- 1 = Home
-- 2 = Away
-- 3 = Night
-- 4 = Vacation
local HModes = { "Home", "Away", "Night", "Vacation" ,"Unknown" }

local function setHouseMode( newmode ) 
	log(string.format("HouseMode, setHouseMode( %s )",newmode))
	newmode = tonumber(newmode)
	if (newmode>=1) and (newmode<=4) then
		debug("SetHouseMode to "..newmode)
		luup.call_action('urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode=newmode }, 0)
	end
end

local function getMode() 
	log("HouseMode, getMode()")
	-- local url_req = "http://" .. getIP() .. ":3480/data_request?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode"
	local url_req = "http://127.0.0.1:3480/data_request?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode"
	local req_status, req_result = luup.inet.wget(url_req)
	-- ISSUE WITH THIS CODE=> ONLY WORKS WITHIN GLOBAL SCOPE LUA, not in PLUGIN context
	-- debug("calling getMode()...")
	-- local req_result =  luup.attr_get("Mode")
	-- debug("getMode() = "..req_result)
	req_result = tonumber( req_result or (#HModes+1) )
	log(string.format("HouseMode, getMode() returns: %s, %s",req_result or "", HModes[req_result]))
	return req_result , HModes[req_result]
end

------------------------------------------------
-- Get File ( uncompress & return content )
------------------------------------------------

local function getScriptContent( filename )
	log("getScriptContent("..filename..")")
	local url_req = "http://127.0.0.1:3480/"..filename
	local req_status, req_result = luup.inet.wget(url_req)
	-- debug(string.format("getScriptContent(%s) returns: %s",filename,req_result))
	if (req_status~=0) then
		debug(string.format("getScriptContent(%s) failed, returns: %s",filename,req_status))
		return ""
	end
	return req_result
end

local function getDataFor( deviceID,name )
	debug("getDataFor("..name..")")
	local name = "Data_"..name
	
	local num = 0
	local var = nil
	local result = ""
	
	-- search for all "Data_xxx_nnn" variables and concatenate them
	var = luup.variable_get(service, name.."_"..num, deviceID)
	while( var ~= nil) do
		num = num+1
		result = result .. var
		var = luup.variable_get(service, name.."_"..num, deviceID)
	end
	
	if (result=="") then
		return nil
	end
	return result
end

------------------------------------------------------------------------------------------------
-- Http handlers : Communication FROM ALTUI
-- http://192.168.1.5:3480/data_request?id=lr_ALTUI_Handler&command=xxx
-- recommended settings in ALTUI: PATH = /data_request?id=lr_ALTUI_Handler&mac=$M&deviceID=114
------------------------------------------------------------------------------------------------
function switch( command, actiontable)
	-- check if it is in the table, otherwise call default
	if ( actiontable[command]~=nil ) then
		return actiontable[command]
	end
	log("ALTUI_Handler:Unknown command received:"..command.." was called. Default function")
	return actiontable["default"]
end

local htmlLocalScripts = [[
    <script src="@localcdn@/jquery.min.js"></script>
	<script src="@localcdn@/bootstrap.min.js"></script>
    <script src="@localcdn@/jquery-ui.min.js"></script> 
    <script src="@localcdn@/jquery.bootgrid.min.js"></script> 	
    <script src="@localcdn@/jsapi.js"></script> 	
]]
    -- <script src="@localcdn@/d3.min.js"></script> 	

local htmlScripts = [[
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.2.0/jquery.bootgrid.min.js"></script> 	
	<script type="text/javascript" 
	  src='https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["gauge","table"]}]}' >
	</script>
]]
    -- <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script> 	

local htmlStyle = [[
	<style>
	body { padding-top: 70px; }
	</style>
]]

local htmlLocalCSSlinks = [[
	<link rel="stylesheet" href="@localcdn@/jquery-ui.css">
	<link rel="stylesheet" href="@localcdn@/bootstrap.min.css">
	<link rel="stylesheet" href="@localcdn@/jquery.bootgrid.min.css">
]]

local htmlCSSlinks = [[
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.2.0/jquery.bootgrid.min.css">
]]

local htmlLayout = [[
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- Latest compiled and minified CSS -->

	@csslinks@
	@style@
    <title>VERA AltUI</title>
</head>

<body role="document">

	
    <!-- Bootstrap core JavaScript    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	<!-- Latest compiled and minified JavaScript -->
	
	@mandatory_scripts@
	
	<script src="J_ALTUI_jquery.ui.touch-punch.min.js"></script>
	<script src="J_ALTUI_utils.js" ></script>
	@optional_scripts@
	<script src="J_ALTUI_verabox.js" ></script>
	<script src="J_ALTUI_multibox.js" ></script>
	<script type='text/javascript' >
		google.setOnLoadCallback(drawVisualization);
		function drawVisualization() {
			console.log('google loaded');
		};
		var g_DeviceTypes =  JSON.parse('@devicetypes@');
		var g_CustomPages = @custompages@;
		var g_CustomTheme = '@ThemeCSS@';
		var g_MyDeviceID = @mydeviceid@;
	</script>
	<script src="J_ALTUI_uimgr.js" defer ></script>
	<hr>
	<footer><p class="text-center"><small id="altui-footer">AltUI, amg0, <span class="bg-danger">Waiting Initial Data</span></small></p><span id="debug"></span></footer>
</body>
</html>
]]

	
function findALTUIDevice()
	for k,v in pairs(luup.devices) do
		if( v.device_type == devicetype ) then
			return k
		end
	end
	return -1
end

function myALTUI_Handler(lul_request, lul_parameters, lul_outputformat)
	log('ALTUI_Handler: request is: '..tostring(lul_request))
	log('ALTUI_Handler: parameters is: '..json.encode(lul_parameters))
	log('ALTUI_Handler: outputformat is: '..json.encode(lul_outputformat))
	local lul_html = "";	-- empty return by default
	local mime_type = "";
	debug("hostname="..hostname)
	if (hostname=="") then
		hostname = getIP()
		debug("now hostname="..hostname)
	end
	
	-- find a parameter called "command"
	if ( lul_parameters["command"] ~= nil ) then
		command =lul_parameters["command"]
	else
	    debug("ALTUI_Handler:no command specified, taking default")
		command ="default"
	end
	
	local deviceID = tonumber(lul_parameters["DeviceNum"] or findALTUIDevice() )
	
	-- switch table
	local action = {
		-- ["isregistered"] = 
			-- function(params)
				-- local success,response = isRegisteredSmartPhone(deviceID)
				-- local result = (success==true) and (response=="<executionStatus>0</executionStatus>")
				-- return json.encode( result )
			-- end,
		["home"] = 
			function(params)
				local result = luup.variable_get(service, "PluginConfig", deviceID)
				local tbl = json.decode(result)
				tbl ["info"] = {
					["ui7Check"] = luup.variable_get(service, "UI7Check", deviceID) or "",
					["debug"] = DEBUG_MODE,
					["PluginVersion"] = luup.variable_get(service, "Version", deviceID) or "",
					["RemoteAccess"] = luup.variable_get(service, "RemoteAccess", deviceID) or ""
				}
				
				-- preload necessary scripts : optimization for remote access
				-- without this, ALTUI just dynamically load the script but it seems to take long time sometime
				local optional_scripts=""
				local scripts = {}
				for k,v in pairs(tbl) do	
					if (v["ScriptFile"]  ~= nil) then
						-- scripts[v["ScriptFile"]] = ""
					end
				end
				if ( (lul_parameters["lang"]~=nil) and (lul_parameters["lang"]~="en") ) then
					scripts["J_ALTUI_loc_"..lul_parameters["lang"]..".js"] = ""
				end
				-- scripts["J_ALTUI_utils.js"]=""
				-- scripts["J_ALTUI_verabox.js"]=""
				for k,v in pairs(scripts) do
					scripts[k] = getScriptContent(k)
					optional_scripts = optional_scripts  .. string.format(
						"<script type='text/javascript' data-src='%s' >%s</script>",
						k,
						scripts[k]  -- xml_encode(scripts[k])
						)
				end
				-- debug( json.encode(scripts) )
				local custompages_tbl = json.decode( getDataFor( deviceID, "CustomPages" ) or "{}" )
				local result_tbl ={}
				for k,v in pairs(custompages_tbl) do
					local data = getDataFor( deviceID, v )
					table.insert(  result_tbl , data )
				end
				-- local custompages = luup.variable_get(service, "CustomPages", deviceID) or "[]"
				-- custompages = string.gsub(custompages,"'","\\x27")
				-- custompages = string.gsub(custompages,"\"","\\x22")
				local localcdn = getSetVariable(service, "LocalCDN", lul_device, "")
				local variables={}
				variables["hostname"] = hostname
				variables["localcdn"] = localcdn
				variables["devicetypes"] = json.encode(tbl)
				variables["custompages"] = "["..table.concat(result_tbl, ",").."]"
				variables["ThemeCSS"] = luup.variable_get(service, "ThemeCSS", deviceID) or ""
				variables["style"] = htmlStyle
				variables["mydeviceid"] = deviceID
				if (localcdn ~= "") then
					variables["csslinks"] = htmlLocalCSSlinks:template(variables)
					variables["mandatory_scripts"] = htmlLocalScripts:template(variables)
				else
					variables["csslinks"] = htmlCSSlinks
					variables["mandatory_scripts"] = htmlScripts
				end
				-- " becomes \x22
				variables["optional_scripts"] = optional_scripts
				return htmlLayout:template(variables),"text/html"
			end,
		["save_data"] = 
			function(params)
				local name = lul_parameters["name"]
				local npage = lul_parameters["npage"]
				debug(string.format("ALTUI_Handler: save_data( name:%s npage:%s)",name,npage))
				local variablename = "Data_"..name.."_"..npage
				if (lul_parameters["data"]=="") then
					debug(string.format("ALTUI_Handler: save_data( ) - Empty data",name,npage))
					luup.variable_set(service, variablename, "", deviceID)
					return "ok", "text/plain"
				else
					debug(string.format("ALTUI_Handler: save_data( ) - Not Empty data",name,npage))
					local data = url_decode( lul_parameters["data"] )
					debug(string.format("ALTUI_Handler: save_data( ) - url decoded",name,npage))
					luup.variable_set(service, variablename, data, deviceID)
					debug(string.format("ALTUI_Handler: save_data( ) - returns:%s",data))
					return data, "text/plain"
				end
			end,
		["clear_data"] = 
			function(params)
				local name = lul_parameters["name"]
				local npage = lul_parameters["npage"]
				local variablename = "Data_"..name.."_"..npage
				-- cleanup all found data until we find
				local var = luup.variable_get(service, variablename,  deviceID)
				while ((var ~= nil) and (var ~="" )) do
					luup.variable_set(service, variablename, "", deviceID)
					npage = npage + 1
					variablename = "Data_"..name.."_"..npage
					var = luup.variable_get(service, variablename,  deviceID)
				end
				return "ok", "text/plain"
			end,
		["proxyget"] = 
			function(params)
				local newUrl = lul_parameters["newUrl"]
				local resultName = lul_parameters["resultName"]
				code,result = proxyGet(deviceID,newUrl,resultName)
				local res = string.format("%d,%s",code,result);
				return res, "text/plain"
			end,
		["readtmp"] = 
			function(params)
				-- local command = lul_parameters["oscommand"]
				-- local handle = io.popen(command)
				-- local result = handle:read("*a")
				-- handle:close()
				local filename = url_decode( lul_parameters["filename"] )
				debug("opening file")
				local file = io.open(tmpprefix..filename,'r')
				local result = ''
				if file~=nil then 
					result = "1,"..file:read("*a")
					file:close()
				else 
					result = "0,"
				end
				debug("returning result")
				return result , "text/plain"
				-- return json.encode( {success=(response==0 or response==true), result=result} ) , "application/json"
			end,
		["oscommand"] = 
			function(params)
				-- local command = lul_parameters["oscommand"]
				-- local handle = io.popen(command)
				-- local result = handle:read("*a")
				-- handle:close()
				local command = url_decode( lul_parameters["oscommand"] ) .. '> /tmp/oscommand.log'
				local response = os.execute(command)
				local file = io.open('/tmp/oscommand.log','r')
				local result = file:read("*a")
				local resultcode = ""
				file:close()
				if (response==0 or response==true) then
					resultcode="1,"
				else
					resultcode="0,"
				end
				return resultcode..result , "text/plain"
				-- return json.encode( {success=(response==0 or response==true), result=result} ) , "application/json"
			end,
		["rooms"] = 
			function(params)
				return json.encode( luup.rooms ) , "application/json"
			end,
		["devices"] = 
			function(params)
				return json.encode( luup.devices ) , "application/json"
			end,
		["image"] = 
			function(params)
				local default_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAASJSURBVHja7Jp7aI5RHMff123CMOYyMmFY5LZYI5umFmHhD2pyyYzYkju5hCWX0jZKM9rEkCy5tJostxWRIteZe5FLyW2Y68z35Pfq9Os8z573eT3vu9fOr76d5zzn8jyf59x+57yvu6amxlWfrIGrnpkG1sAaWANrYA2sgTWwBnbKGnmT2e12/7MHb8vOaYhgEJQA9YN6Qj2g5lCoSFu4eNF1K3V5sx9o5M+vC0jxvCRoKjQOalmnW9gH0BYI5kKLoE5B06Vttug8KBMKqyX7S+g+9Ab6SGHwAAN2MIICqL9BlifQMegcdAHj9X1QtjBAxcy2BNoENWbJ1VARtAO6BMiaoO7SgG2C4AA0SZF8CFoDyMf/xRgGbCsExVA8S3oEzQJomUG5AQgSoSFQNNSZlqZ4q8uS34Hx0s0MYA+KSQsv/pHlD0eQQctTVFC1MDkQRQrYtQDdoOgFa6F0qGmwdun10Fh2Lx2wOxnseAS7ofZGDhP0DHoAVUJvnQB2e+OWcdcSEKMRnGTZlgN2K+sBWdACRZXfoBPQYeg8ytmC9IrBLjB5T+VQFynLXrz0TDZrC5gJrKrv0HYoG/lf+dpq/vKlMxnsbRqbcsuqYC9B0wH6MGi2h4CJRDCfjT+x9HyR7mUpYIXDkRAoWF9aeBXzovIAcUX6IBMVYzYTedZb+JghCCIo+gFl3gV00sILtcalGHchdPsr1B0v9lJaeiqgjlLRXKRnmED2QpAGjYH6iEdJyeJZp6FCEarcUW8Y7HTpKRKssD0eWLLVDPYqbQtVoGFQAX2gZVBfBuuiuoSDUgpdRv4Yf4/haSxewDyodLZZSMUH+a6AFXDCdUxVQBpZrJj0UHamX4DxoDb0UI/dAsw1KZ5KfrDH9iP9pqKe3mLdhSJtvLNY6vbYhfa2hRNZmRKWPoPFtxhMSkehcJb0ArpRi2THJA91DXR6lo5j8dMSSFeacDx2Ea17T1HHQpbPRSccscj/3KR3tUVwl7V0LjTMyRaOZnG5O49gacUGrbtUUe8KM1iyHKgduzcUdSY62cK9pOvXzPftx/JeUJRPUnRl8dEO03L3t8VRd7X0oUYpJkuPpdAxkSPAHaTrpyytG4uXK8onKO7FsAM74YWJQ4EqyWffZfJO8U526VA27mRrK13/NPCQult4xmyUrZLiG6GuJvmjnOzS8oa+QnG6USZ5XyprVkv9wiM7L3XlOOaz+8zgVWYzXxhp+Raq+GSSJjb/K9kEl2/BKfkRkEM8i3bfJC0NH61SioufYdawPJsVK0V5XQY+S742t32ALWU95jWC4+yIKFpRtszx/bAPVqaY3V+RM2Lm0rYkJ0NlhX4707J5eDCHLTPF1PJmNhJKVtwvQU8YW2d/LiXLJydiOMWTDWBqs0oLM3jAu7QYm78QTHb9+UXCromZOcXOzzYB+csDHRiMoMMBb004NMmoo8RfBwD/Cvo57XTWQZ8tFjsi3E6UPeW3My0njDYOU+hMS/jWEZL7egc6Q4cJqu2mcwfx/4Pp/2lpYA2sgTWwBtbAGlgDO2W/BRgADRV6RjlErQoAAAAASUVORK5CYII="
				local imgpath = lul_parameters["path"]
				-- get the extension
				local i = string.find(imgpath,".",-5)
				debug("find last dot at position i="..i)
				i=i+2
				debug("i="..i)
				local extension = imgpath:sub( i )
				debug("extension="..extension)
				
				-- build the local IO pathname
				i= string.find(imgpath,"/cmh")
				local webpath = imgpath:sub( i )
				
				-- build physical file name
				local physicalpath = "/www"..webpath;
				log( string.format("extension:%s webpath:%s physicalpath:%s",extension,webpath,physicalpath) )
				
				-- read the file
				debug(string.format("opening %s",physicalpath))
				local file = io.open(physicalpath, "r")
				if (file==nil) then
					log("opening ".. physicalpath .." returns nil, returning default image")
					return default_img
				end
				local content = file:read("*all")
				file:close()
				debug(string.format("closing %s",physicalpath))

				-- encode in B64
				local b64 = mime.b64(content)
				debug(string.format("b64 %s",b64))
				return string.format("data:image/%s;base64,%s",extension,b64) , "image/"..extension
				--return "data:image/gif;base64,R0lGODlhEAAOALMAAOazToeHh0tLS/7LZv/0jvb29t/f3//Ub//ge8WSLf/rhf/3kdbW1mxsbP//mf///yH5BAAAAAAALAAAAAAQAA4AAARe8L1Ekyky67QZ1hLnjM5UUde0ECwLJoExKcppV0aCcGCmTIHEIUEqjgaORCMxIC6e0CcguWw6aFjsVMkkIr7g77ZKPJjPZqIyd7sJAgVGoEGv2xsBxqNgYPj/gAwXEQA7"
			end,
		["devicetypes"] = 
			function(params)
				local result = luup.variable_get(service, "PluginConfig", deviceID)
				local tbl = json.decode(result)
				tbl ["info"] = {
					["debug"] = DEBUG_MODE,
					["ui7Check"] = luup.variable_get(service, "UI7Check", deviceID) or "",
					["PluginVersion"] = luup.variable_get(service, "Version", deviceID) or "",
					["RemoteAccess"] = luup.variable_get(service, "RemoteAccess", deviceID) or ""
				}
				return json.encode(tbl), "application/json"
			end,
		-- ["set_attribute"] = 
			-- function(params)
				-- local attr = lul_parameters["attr"]
				-- local value = lul_parameters["value"]
				-- local devid = lul_parameters["devid"]
				-- luup.attr_set(attr , value, devid)
				-- return "ok"
			-- end,
		["scenes"] = 
			function(params)
				return json.encode( luup.scenes ), "application/json"
			end,
		["default"] = 
			function(params)	
				return "not successful", "text/plain"
			end
	}
	-- actual call
	lul_html , mime_type = switch(command,action)(lul_parameters)
	debug(string.format("lul_html:%s",lul_html or ""))
	return (lul_html or "") , mime_type
end


------------------------------------------------
-- RESET ALTUI COnfig
------------------------------------------------
local function getDefaultConfig()
	local tbl = {}

	tbl["urn:schemas-upnp-org:device:BinaryLight:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
		["StyleFunc"]="ALTUI_PluginDisplays.getStyle",
		-- ["ControlPanelFunc"]="ALTUI_PluginDisplays.drawBinLightControlPanel",
	}
	tbl["urn:schemas-upnp-org:device:RGBController:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
	}
	tbl["urn:antor-fr:device:SamsungTVRemote:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
	}
	tbl["urn:schemas-micasaverde-com:device:DoorLock:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDoorLock",
	}
	tbl["urn:schemas-micasaverde-com:device:DoorSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDoorSensor",
	}
	tbl["urn:schemas-micasaverde-com:device:TemperatureSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawTempSensor",
	}
	tbl["urn:schemas-upnp-org:device:Heater:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHeater",
	}
	tbl["urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHeater",
	}
	tbl["urn:schemas-micasaverde-com:device:HumiditySensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHumidity",
	}
	tbl["urn:schemas-micasaverde-com:device:LightSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawLight",
	}
	tbl["urn:schemas-cd-jackson-com:device:DataMine:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDataMine",
	}
	tbl["urn:schemas-a-lurker-com:device:InfoViewer:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawInfoViewer",
	}
	tbl["urn:demo-micasaverde-com:device:weather:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawWeather",
		["DeviceIconFunc"]="ALTUI_PluginDisplays.drawWeatherIcon",
	}
	tbl["urn:schemas-upnp-org:device:DimmableLight:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmable",
	}
	tbl["urn:schemas-micasaverde-com:device:MotionSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMotion",
	}
	tbl["urn:schemas-micasaverde-com:device:SmokeSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawSmoke",
	}
	tbl["urn:schemas-micasaverde-com:device:WindowCovering:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawWindowCover",
	}
	tbl["urn:schemas-micasaverde-com:device:PowerMeter:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPowerMeter",
	}
	tbl["urn:schemas-micasaverde-com:device:PowerMeter:2"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPowerMeter",
	}
	tbl["urn:schemas-upnp-org:device:DigitalSecurityCamera:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCamera",
	}
	tbl["urn:schemas-upnp-org:device:DigitalSecurityCamera:2"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCamera",
	}
	tbl["urn:schemas-upnp-org:device:cplus:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawCanalplus",
		["ControlPanelFunc"]="ALTUI_IPhoneLocator.drawCanaplusControlPanel"
	}
	tbl["urn:schemas-upnp-org:device:altui:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawAltUI",
	}
	tbl["urn:schemas-futzle-com:device:holidayvirtualswitch:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVacation",
	}
	tbl["urn:schemas-futzle-com:device:CountdownTimer:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCountDown",
	}
	tbl["urn:schemas-upnp-org:device:IPhoneLocator:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawIPhone",
		["StyleFunc"]="ALTUI_IPhoneLocator.getStyle",
		-- ["ControlPanelFunc"]="ALTUI_IPhoneLocator.drawControlPanel",
	}
	return tbl
end

function resetDevice(lul_device,norepeat)
	lul_device = tonumber(lul_device)
	log(string.format("resetDevice(%d,%s)",lul_device, tostring(norepeat or "nil")))

	-- reset the config
	local tbl = getDefaultConfig()
	local default = json.encode( tbl )
	setVariableIfChanged(service, "PluginConfig", default, lul_device)
	debug(string.format("Reseting ALTUI config to %s",default))
end

------------------------------------------------
-- STARTUP Sequence
------------------------------------------------

function startupDeferred(lul_device)
	lul_device = tonumber(lul_device)
	log("startupDeferred, called on behalf of device:"..lul_device)
		
	local debugmode = getSetVariable(service, "Debug", lul_device, "0")
	local oldversion = getSetVariable(service, "Version", lul_device, version)
	local present = getSetVariable(service,"Present", lul_device, 0)
	local remoteurl =getSetVariable(service,"RemoteAccess", lul_device, "https://vera-ui.strongcubedfitness.com/Veralogin.php")
	local localurl = getSetVariableIfEmpty(service,"LocalHome", lul_device, "/port_3480/data_request?id=lr_ALTUI_Handler&command=home")
	local css = getSetVariable(service,"ThemeCSS", lul_device, "")
	local localcdn = getSetVariable(service, "LocalCDN", lul_device, "")
	
	-- clean tmp area from our files
	os.execute('rm /tmp/altui_*');
	
	if (debugmode=="1") then
		DEBUG_MODE = true
		UserMessage("Enabling debug mode for device:"..lul_device,TASK_BUSY)
	end
	
	local major,minor = 0,0
	if (oldversion~=nil) then
		major,minor = string.match(oldversion,"v(%d+)%.(%d+)")
		major,minor = tonumber(major),tonumber(minor)
		debug ("Plugin version: "..version.." Device's Version is major:"..major.." minor:"..minor)
		luup.variable_set(service, "Version", version, lul_device)
	end	

	-- init the configuration table with a valid default
	local tbl = getDefaultConfig()
	local default = json.encode( tbl )
	setVariableIfChanged(service, "PluginConfig", default, lul_device)
	
	-- NOTHING to start 
	if( luup.version_branch == 1 and luup.version_major == 7) then
		luup.set_failure(0,lul_device)	-- should be 0 in UI7
	else
		luup.set_failure(false,lul_device)	-- should be 0 in UI7
	end
	log("startup completed")
end
		
function initstatus(lul_device)
	lul_device = tonumber(lul_device)
	log("initstatus("..lul_device..") starting version: "..version)
	checkVersion(lul_device)
	hostname = getIP()
	local delay = 1		-- delaying first refresh by x seconds
	debug("initstatus("..lul_device..") startup for Root device, delay:"..delay)
	-- http://192.168.1.5:3480/data_request?id=lr_IPX800_Handler
	luup.register_handler("myALTUI_Handler","ALTUI_Handler")
	luup.call_delay("startupDeferred", delay, tostring(lul_device))		
end
 
-- do not delete, last line must be a CR according to MCV wiki page

