## sourceURL=J_ALTUI.js
# This program is free software: you can redistribute it and/or modify
# it under the condition that it is for private or home useage and 
# this whole comment is reproduced in the source code file.
# Commercial utilisation is not authorized without the appropriate
# written agreement from amg0 / alexis . mermet @ gmail . com
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

# -------------------------------------------------------------
#  ALTUI  Plugin javascript Tabs
# -------------------------------------------------------------

altui_Svs = 'urn:upnp-org:serviceId:caltui1'
ip_address = data_request_url

#-------------------------------------------------------------
# Utilities Javascript
#-------------------------------------------------------------


#-------------------------------------------------------------
# Utilities for searching Vera devices
#-------------------------------------------------------------
findDeviceIdx = (deviceID) ->
	for dev,i in jsonp.ud.devices
		if dev.id == deviceID
			return i
	return null

findRootDeviceIdx = (deviceID) ->
	idx = findDeviceIdx deviceID
	while jsonp.ud.devices[idx].id_parent != 0
		idx = findDeviceIdx jsonp.ud.devices[idx].id_parent
	return idx

findRootDevice = (deviceID) ->
	jsonp.ud.devices[findRootDeviceIdx deviceID].id

findDeviceIP = (deviceID) ->
	jsonp.ud.devices[findRootDeviceIdx deviceID].ip


#-------------------------------------------------------------
# Device TAB : Donate
#-------------------------------------------------------------	
altui_Donate = (deviceID) ->
	htmlDonate = """
For those who really like this plugin and feel like it, you can donate what you 
want here on Paypal. It will not buy you more support not any garantee that this 
can be maintained or evolve in the future but if you want to show you are happy 
and would like my kids to transform some of the time I steal from them into 
some <i>concrete</i> returns, please feel very free ( and absolutely not forced 
to ) to donate whatever you want.  thank you !
"""

	html = "<div>#{htmlDonate}</div>"
	set_panel_html html


#-------------------------------------------------------------
# Device TAB : Settings
#-------------------------------------------------------------	
altui_Settings = (deviceID) ->
	present  = get_device_state(deviceID,  altui_Svs, 'Present',1)
	ipaddr = findDeviceIP(deviceID)
	config = get_device_state(deviceID,  altui_Svs, 'PluginConfig',1)
	themecss = get_device_state(deviceID,  altui_Svs, 'ThemeCSS',1)
	localhome = get_device_state(deviceID,  altui_Svs, 'LocalHome',1)
	localcdn = get_device_state(deviceID,  altui_Svs, 'LocalCDN',1)
	localbootstrap = get_device_state(deviceID,  altui_Svs, 'LocalBootstrap',1)
	extraCtrl = get_device_state(deviceID,  altui_Svs, 'ExtraController',1)
	remoteUrl = get_device_state(deviceID,  altui_Svs, 'RemoteAccess',1)

	style = """
<style>
	table.altui_table td:first-child {
		width: 140px
	}
	input.altui-ui-input {
		width: 440px
	}
	hr.altui_hr {
		border: 0
		color: grey
		margin-top: 5px
		margin-bottom: 5px
		background-color: grey
		height: 1px
	}
</style>
"""
	htmlOpenLocal= """
<button class="btn btn-default btn-sm" id="altui-open-local">Local</button>
"""
	htmlRemote= """
<button class="btn btn-default btn-sm" id="altui-open-remote">Remote</button>
"""
	htmlConfig = """
<textarea id="altui-config" rows="6" cols="70"></textarea>
"""
	htmlTheme = """
<input id="altui-theme" class="altui-ui-input form-control" placeholder="Url to download a theme css"></input>
"""
	htmlHome = """
<input id="altui-home" class="altui-ui-input form-control" placeholder="options, see below"></input>
"""
	htmlCDN = """
<input 
	id="altui-cdn" 
	class="altui-ui-input form-control" 
	placeholder="optional localcdn pathname, uses internet otherwise">
</input>
"""
	htmlBootstrap = """
<input 
	id="altui-localbootstrap" 
	class="altui-ui-input form-control" 
	placeholder="optional local bootstrap relative url, use internet otherwise">
</input>
"""
	htmlCTRL = """
<input 
	id="altui-ctrl" 
	class="altui-ui-input form-control" 
	placeholder="Comma separated list of ip_addr for extra controllers">
</input>
"""
	htmlSetConfig= """
<button class="btn btn-default btn-sm" id="altui-setconfig">
	Set Configuration
</button>
"""
	htmlResetConfig= """
<button class="btn btn-default btn-sm" id="altui-resetconfig">
	Default Configuration
</button>
"""
	htmlViewJson = """
<button class="btn btn-default btn-sm" id="altui-viewconfig">
	View Configuration
</button>
"""
	html = style + """
<div class="pane" id="pane"> 
	<table class="altui_table" id="altui_table">
		<tr>
			<td>Open</td>
			<td><div class="btn-group">#{htmlOpenLocal}#{htmlRemote}</div></td>
		</tr>
		<tr>
			<td>Theme</td>
			<td> #{htmlTheme} </td>
		</tr>
		<tr>
			<td>Home Page Url Parameters</td>
			<td> #{htmlHome} </td>
		</tr>
		<tr>
			<td>url options</td>
			<td>
				<ul>
					<li><b>home</b>=(pageHome , 
									 pageRooms , 
									 pageDevices , 
									 pageScenes , 
									 pageSceneEdit , 
									 pagePlugins , 
									 pageUsePages , 
									 pageEditPages , 
									 pageCredits , 
									 pageLuaTest , 
									 pageLuaStart , 
									 pageOptions , 
									 pageEditor , 
									 pageZwave , 
									 pageLocalization , 
									 pagePower ,
									 pageChildren , 
									 pageRoutes , 
									 pageQuality , 
									 pageTblDevices , 
									 pageOsCommand)</li>
					<li><b>lang</b>=(en , fr , it)</li>
					<li><b>Layout</b>=lean</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>Local CDN ?</td>
			<td> #{htmlCDN} </td>
		</tr>
		<tr>
			<td>Local Bootstrap ?</td>
			<td> #{htmlBootstrap} </td>
		</tr>
		<tr>
			<td>Extra Controllers</td>
			<td> #{htmlCTRL} </td>
		</tr>
		<tr>
			<td>Config</td>
			<td> #{htmlConfig} </td>
		</tr>
		<tr>
			<td>Actions</td>
			<td> #{htmlViewJson}#{htmlSetConfig}#{htmlResetConfig}</td>
		</tr>
	</table>
</div>
"""

	set_panel_html(html)
	$("#altui-theme").val(themecss)
	$("#altui-home").val(localhome)
	$("#altui-cdn").val(localcdn)
	$("#altui-localbootstrap").val(localbootstrap)
	$("#altui-ctrl").val(extraCtrl)

	$("#altui-config").text(config)
	$("#altui-theme").text(themecss).change () ->
		themecss = $(this).val()+' '
		saveVar(deviceID,  altui_Svs, "ThemeCSS", themecss, true)
	$("#altui-home").change () ->
		home = $(this).val()+' '
		saveVar(deviceID,  altui_Svs, "LocalHome", home, true)
	$("#altui-cdn").change () ->
		cdn = $(this).val()
		saveVar(deviceID,  altui_Svs, "LocalCDN", cdn, true)
	$("#altui-localbootstrap").change () ->
		bootstrap = $(this).val()
		saveVar(deviceID,  altui_Svs, "LocalBootstrap", bootstrap, true)
	$("#altui-ctrl").change () ->
		ctrl = $(this).val()
		saveVar(deviceID,  altui_Svs, "ExtraController", ctrl, true)
	$("#altui-open-remote").click () ->
		window.open( remoteUrl, '_blank')
	if window.location.hostname.indexOf("relay") !=-1
		$("#altui-open-local").remove()
	else
		$("#altui-open-local").click () ->
			url = window.location.origin + "/port_3480/data_request?id=lr_ALTUI_Handler&command=home&" + $("#altui-home").val()
			window.open( url, '_blank')
	$("#altui-setconfig").click () ->
		varVal = $("#altui-config").val()
		saveVar(deviceID,  altui_Svs, 'PluginConfig', varVal, true)
	$("#altui-viewconfig").click () ->
		varVal = $("#altui-config").val()
		url = "http://jsoneditoronline.org/?json="+varVal
		window.open(url,'_blank')
	$("#altui-resetconfig").click () ->
		url = buildUPnPActionUrl(deviceID,altui_Svs,'Reset')
		$.ajax({
			type: "GET",
			url: url,
			cache: false,
		}).done(() ->
			setTimeout () ->
				config = get_device_state(deviceID,  altui_Svs, 'PluginConfig',1)
				$("#altui-config").val(config)			
			, 2000 
		).fail(() ->
			alert('Reset Failed!')
		)	

#-------------------------------------------------------------
# Save functions
#-------------------------------------------------------------	


#-------------------------------------------------------------
# Pattern Matching functions
#-------------------------------------------------------------	

#-------------------------------------------------------------
# Variable saving ( log , then full save )
#-------------------------------------------------------------
saveVar = (deviceID, service, varname, varVal, reload) ->
	set_device_state deviceID, altui_Svs, varName, varVal, if reload then 1 else 0

#-------------------------------------------------------------
# Helper functions to build URLs to call VERA code from JS
#-------------------------------------------------------------
buildVeraURL = (deviceId, fnToUse, varName, varValue) ->
	if varValue?
		code = """#{fnToUse}("#{altui_Svs}", "#{varName}", "#{varValue}", #{deviceID})"""
	else
		code = """#{fnToUse}("#{altui_Svs}", "#{varName}", #{deviceID})""" 
	"#{ip_address}" + $.params {
		id: 'lu_action'
		serviceId: 'urn:micasaverde-com:serviceId:HomeAutomationGateway1'
		action: 'RunLua'
		Code: code
	}

buildVariableSetUrl = (deviceID, varName, varValue) ->
	"#{ip_address}" + $.params {
		id: 'variableset'
		DeviceNum: deviceID
		serviceId: altui_Svs
		Variable: varName
		Value: varValue
	}

buildUPnpActionUrl = (deviceID, service, action, params) ->
	paramList = {
		id: 'action'
		output_format: json
		DeviceNum: deviceID
		serviceId: service
		action: action
	}
	for value,i in params
		paramList[i] = value
	"#{ip_address}" + $.params(paramList)
