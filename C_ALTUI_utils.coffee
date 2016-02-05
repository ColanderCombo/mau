## sourceURL=J_ALTUI_utils.js
# "use strict";
# http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
# This program is free software: you can redistribute it and/or modify
# it under the condition that it is for private or home useage and 
# this whole comment is reproduced in the source code file.
# Commercial utilisation is not authorized without the appropriate
# written agreement from amg0 / alexis . mermet @ gmail . com
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

getQueryStringValue = (key) ->
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"))

isIE11 = () ->
    return navigator.userAgent.indexOf('Trident') != -1 \
        and navigator.userAgent.indexOf('MSIE') == -1

Altui_SelectText = (element) ->
    doc = document
    text = doc.getElementById element
    if doc.body.createTextRange
        range = doc.body.createTextRange()
        range.moveToElementText text
        range.select()
    else if window.getSelection()
        selection = window.getSelection()
        range = doc.createRange()
        range.selectNodeContents text
        selection.removeAllRanges()
        selection.addRange range

Altui_LoadStyle = (styleFunctionName) ->
    title = document.getElementsByTagName('title')[0]
    style = document.createElement 'style'
    style.type = 'text/css'
    css = Altui_ExecuteFunctionByName(styleFunctionName, window)
    style.appendChild(document.createTextNode(css))
    title.parentNode.insertBefore(style,title)

Altui_ExecuteFunctionByName = (functionName, context, device, extraparam) ->
    namespaces = functionName.split('.')
    func = namespaces.pop()
    for namespace in namespaces
        context = context[namespace]
    return context[func].call(context, device, extraparam)

class Localization
    @_unknown_terms: {}
    @_terms: {}

    @_T: (t) ->
        if t in @_terms
            return v
        else
            @_unknown_terms[t] = t
        return t

    @init: (terms) ->
        @_terms = $.extend({}, terms)
        @_unknown_terms = {}

    @dump: () ->
        if AltuiDebug.IsDebug()
            console.log JSON.stringify @_unknown_terms
            console.log JSON.stringify @_terms
            nav = window.navigator
        text = 
            """
browser query:#{getQueryStringValue("lang")} userlanguage:#{nav.userLanguage or ""}     language:#{nav.language or ""}
Unknown terms:#{JSON.stringify(@_uknown_terms)}
"""
        UIManager.pageEditorForm($(".altui-mainpanel"),
                                'altui-page-editor',
                                _T("Localization information"),
                                text,
                                null,
                                _T("Close"), 
                                () -> UIManager.pageHome())

_T = Localization._T

if not RegExp.escape?
    RegExp.escape = (string) -> string.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'

if not Array::in_array?
    Array::in_array = (obj) -> obj in @

if not Number::toPaddedString?
    toPaddedString = (number, length, radix) ->
        string = number.toString(radix or 10)
        for i in [0..(length-string.length)]
            string = '0' + string
        return string

    Number::toPaddedString = (length,radix) -> toPaddedString(@, length, radix)

###
# --> String extensions
###
String::toHHMMSS = () ->
    sec_num = parseInt(@,10)
    if isNaN sec_num
        sec_num = 0
        hours = Math.floor(sec_num / 3600)
        minutes = Math.floor((sec_num - (hours * 3600)) / 60)
        seconds = sec_num - (hours * 3600) - (minutes * 60)

        hours = "0#{hours}" if hours < 10 else hours
        minutes = "0#{minutes}" if minutes <10 else minutes
        seconds = "0#{seconds}" if seconds < 10 else seconds
        time = "#{hours}:#{minutes}:#{seconds}"
        return time

String::fromHHMMSS = () ->
    (h,m,s) = @split(':')
    seconds = (+h or 0)*3600 + (+m or 0)*60 + (+s or 0)
    return seconds

String::escapeQuotes = () -> @replace /'/g, "\\'"

String::escapeDoubleQuotes = () -> @replace /"/g, "\\"" #"

String::escapeXml = () ->
    XML_CHAR_MAP = { 
        '<': '&lt;'
        '>': '&gt;'
        '&': '&amp;'
        '"': '&quot;'
        "'": '&apos;'
    }
    @replace /[<>&"']/g, (ch) -> XML_CHAR_MAP[ch]

String::format = (arguments...) ->
    for arg,i in arguments
        replacement = ///\{#{i}\}///g
        @ = @replace(replacement, arg)
    @

String::startsWith = (str) -> @indexOf(str) == 0

String::htmlEncode = () ->
    $('<div/').text(@).html()

String::htmlDecode = () ->
    $('<div/>').html(@).text()

String::evalJSON = () -> JSON.parse(@)

###
# <-- String extensions
###

_format2Digits = (d) -> "0#{d}".substr(-2)

_toIso = (date,sep) ->
    sep = sep or 'T'
    iso = "{0}-{1}-{2}{6}{3}:{4}:{5}".format
        date.getFullYear(),
        _format2Digits date.getMonth()+1,
        _format2Digits date.getDate(),
        _format2Digits date.getHours(),
        _format2Digits date.getMinutes(),
        _format2Digits date.getSeconds(),
        sep
    return iso

class HTMLUtils
    @array2Table: (arr,idcolumn,viscols) ->
        html = ""
        idcolumn = idcolumn or 'id'
        viscols = viscols or [idcolumn]
        html += "<div class='col-xs-12'>"

        if arr and $.isArray arr and arr.length > 0
            html+= "<table id='altui-grid' class='table table-condensed table-hover table-striped'>"
            html += "<thead><tr>"
            for k,v of arr[0]
                dataId = "data-identifier='true'" if k == idcolumn else ""
                html+="<th data-column-id='#{k}' #{dataId} data-visible='#{k in viscols}'>#{k}</th>"
            html += "</tr></thead>"
            html += "<tbody>"
            for obj in arr
                html += "<tr>"
                for k,v in obj
                    html += "<td>#{v}</td>"
                html += "</tr>"
            html += "</tbody>"
            html += "</table>"
        html += "</div>"
        return html

    # var panels = [
    # {id:'Header', title:_T("Header"), html:_displayHeader()},
    # {id:'Triggers', title:_T("Triggers"), html:_displayTriggersAndWatches()},
    # {id:'Timers', title:_T("Timers"), html:_displayTimers()},
    # {id:'Lua', title:_T("Lua"), html:_displayLua()},
    # {id:'Actions', title:_T("Actions"), html:_displayActions()},
    # ];
    @createAccordeon: (panels, button) ->
        if button
            buttonHTML = xsbuttonTemplate.format(button.id, button.cls, button.label, button.title)
        else
            buttonHTML = ""
        html = """
<div class='altui-scene-editor'>
    <div class='panel-group' id='accordion'>
"""
    bFirst = true
    for panel,idx in panels
        html += """
        <div class='panel panel-default' id='#{panel.id}'>
            <div class='panel-heading'>
                #{buttonHTML}
                <h4 class='panel-title'>
                    <a data-toggle='collapse' data-parent='#accordion' href='#collapse#{panel.id}'>
                        #{panel.title}
                    </a>
                    <span class='altui-hint' id='altui-hint-#{panel.id}'></span>
                    <span id='trigger' class='caret'></span>";
                </h4>
            </div>
            <div id='collapse#{panel.id}' class='panel-collapse collapse #{'in' if bFirst else ''}'>
                <div class='panel-body'>
                    #{panel.html if panel.html else _T('Empty')}
                </div>
            </div>
        </div>
"""
        bFirst = false
    html += """
    </div>
</div>
"""
    return html
    
isFunction = (x) -> typeof(x) == 'function'
isObject = (obj) -> typeof(x) == 'object'
isInteger = (data) -> data == parseInt(data,10)
isNullOrEmpty = (value) -> not value? or value.length == 0

hexToRgb = (hex) ->
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if result?
        { 
            r: parseInt(result[1],16)
            g: parseInt(result[2],16)
            b: parseInt(result[3],16)
        }
    else
        null

rgbToHex = (r,g,b) ->
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)

getCSS = (prop, fromClass) ->
    $inspector = $("<div>").css('display', 'none').addClass(fromClass)
    $("body").append($inspector) # add to DOM in order to read the CSS property
    try
        return $inspector.css(prop)
    finally
        $inspector.remove()

class AltuiDebug
    @g_debug: false

    @debug: (str) ->
        if @g_debug 
            date = new Date().toISOString()
            ver = g_DeviceTypes.into['PluginVersion']
            console.log("#{date}: ALTUI #{ver}:#{str}")
    @SetDebug: (bDebug) -> @g_debug = bDebug
    @IsDebug: () -> @g_debug


formatAjaxErrorMessage = (jqXHR, exception) ->
    if jqXHR.status == 0
        ('Not connected. Please verify your network connection.')
    else if jqXHR.status == 404
        ('The requested page not found. [404]')
    else if jqXHR.status == 500
       ('Internal Server Error [500].')
    else if exception == 'parsererror'
       ('Requested JSON parse failed.')
    else if exception == 'timeout'
       ('Time out error.')
    else if exception == 'abort'
       ('Ajax request aborted.')
    else {
       ('Uncaught Error.\n' + jqXHR.responseText)
   

class MyLocalStorage
    @set: (key,item) ->
        if not key?
            return null
        localStorage.setItem(key, JSON.stringify(item))
        return item

    @get: (key) ->
        if not key?
            return null
        json = localStorage.getItem(key)
        return JSON.parse(json) if json? else null

    @clear: (key) ->
        if not key?
            return null
        return localStorage.removeItem(key)

    @setSettings: (key, val) ->
        settings = @get("ALTUI_Settings")
        if not settings?
            settings = {}
        settings[key] = val
        return @set("ALTUI_Settings", settings)

    @getSettings: (key) ->
        settings = @get("ALTUI_Settings")
        settings = settings[key] if settings? else null


class Favorites
    @_favorites: $.extend { device: {}, scene:{} }, MyLocalStorage.getSettings("Favorites")
    MyLocalStorage.setSettings("Favorites", @_favorites)

    @save: () -> MyLocalStorage.setSettings("Favorites",@_favorites)

    @set: (type,id,bFavorite) ->
        @_favorites[type][id] = bFavorite
        if MyLocalStorage.getSettings('UseVeraFavorites')
            switch type
                when 'device'
                    device = MultiBox.getDeviceByAltuiID(id)
                    MultiBox.setAttr(device, 'onDashboard', 1 if bFavorite else 0)
                when 'scene'
                    scene = MultiBox.getSceneByAltuiID(id)
                    scene.onDashboard = 1 if bFavorite else 0
                    MultiBox.editScene(scene.altuiid,scene)
        @save()

    @get: (type,id) ->
        if MyLocalStorage.getSettings('UseVeraFavorites')
            switch type
                when 'device'
                    device = MultiBox.getDeviceByAltuiID(id)
                    @_favorites[type][id] = (device.onDashboard==1)
                when 'scene'
                    scene = MultiBox.getSceneByAltuiID(id)
                    @_favorites[type][id] = (scene.onDashboard==1)
        return @_favorites[type][id] or false                    


class EventBus
    @_subscriptions: {
        # altui specific ones              # parameters
        on_altui_deviceTypeLoaded : []  # table of { func, object }
        
        # global ones 
        on_ui_deviceStatusChanged : []  # table of { func, object }
        on_ui_initFinished :        []
        on_ui_userDataFirstLoaded : []
        on_ui_userDataLoaded :      []
        on_startup_luStatusLoaded : []
        
        # ctrl specific ones , 0 is the master then other are going to be added dynamically
        on_ui_userDataFirstLoaded_0 :   []
        on_ui_userDataLoaded_0 :        []
        on_startup_luStatusLoaded_0 :   []
    }

    @_allSet: (tbl) ->
        for k,v in tbl
            if v == false
                return false 
        return true

    @registerEventHandler: (eventname, object, funcname) ->
        if not @_subscriptions[eventname]?
            @_subscriptions[eventname] = []
        for sub,idx in @_subscriptions[eventname]
            if sub.object == object and sub.funcname == funcname
                return false
        @_subscriptions[eventname].push { object: object, funcname: funcname }

    @waitForAll: (event, eventtbl, object, funcname) ->
        _state = {}
        _signal = (eventname) ->
            thArgs = arguments
            _state[eventname] = true
            # if all are true, call the object,funcname
            if @_allSet(_state)
                theArgs[0] = event
                if $.isFunction(funcname)
                    (funcname).apply(object,theArgs)
                else
                    (object[funcname]).apply(object, theArgs)
        for event,idx in eventtbl
            _state[event] = false
            @registerEventHandler(event, @, _signal)

    @publishEvent: (eventname) ->
        if @_subscriptions[eventname]
            theArgs = arguments
            for sub, idx in @_subscriptions[eventname]
                if $.isFunction(sub.funcname)
                    (sub.funcname).apply(sub.object,theArgs)
                else
                    func = sub.object[sub.funcname]
                    func.apply(sub.object,theArgs)
        else
            @_subscriptions[eventname] = []

    @getEventSupported: () -> Object.keys(@_subscriptions)


class PageManager
    @_pages: null

    @_fixMyPage: (page) ->

    @init: (pages) ->
    @recoverFromStorage: () ->
    @clearStorage: () ->
    @savePages: () ->
    @addPage: () ->
    @deletePage: (name) ->
    @getPageFromName: (name) ->
    @updateChildrenInPage: (page, widgetid, position, size, zindex) ->
    @insertChildrenInPage: (page, tool, position, zindex) ->
    @remove
