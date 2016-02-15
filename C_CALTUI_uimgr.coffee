##  sourceURL=J_ALTUI_uimgr.js
# "use strict" 
# http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
# ALTUI: This program is free software: you can redistribute it and/or modify
# it under the condition that it is for private or home useage and 
# this whole comment is reproduced in the source code file
# Commercial utilisation is not authorized without the appropriate
# written devagreement from amg0 / alexis . mermet @ gmail . com
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
  
### The MIT License (MIT)
BOOTGRID: Copyright (c) 2014-2015 Rafael J. Staib

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
###

# Blakc iphone6 //drive.google.com/uc?id=0B6TVdm2A9rnNakxEdDdYVWVxMnM&authuser=0&export=download
# Black : //docs.google.com/uc?authuser=0&id=0B6TVdm2A9rnNLWlIeEZDN1ZGU0k&export=download    
# Transparent : //drive.google.com/uc?id=0B6TVdm2A9rnNMkx5M0FsLWk2djg&authuser=0&export=download

# UIManager.loadScript('https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table","gauge"]}]}');

AltUI_revision = "$Revision$"
NULL_DEVICE = "0-0"
NULL_SCENE = "0-0"
_HouseModes = [];
deviceModalTemplate = ""
deviceActionModalTemplate = ""
defaultDialogModalTemplate = ""
wattTemplate = "<span class='altui-watts '>{0} <small>Watts</small></span>"
# 0:modeid 1:modetext 2:modeclss for bitmap 3:preset_unselected or preset_selected
houseModeButtonTemplate = "  <button type='button' class='btn btn-default altui-housemode'><div>{1}</div><div id='altui-mode{0}' class='{2} {3} housemode'></div></button>"                            
leftNavButtonTemplate = "<button id='{0}' data-altuiid='{1}' type='button' class='altui-leftbutton btn btn-default'>{2}</button>"
deleteGlyph = "<span class='glyphicon glyphicon-trash text-danger' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Delete'></span>"
glyphTemplate = "<span class='glyphicon glyphicon-{0} {2}' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='{1}' ></span>"
hiddenGlyph = "<span class='glyphicon glyphicon-eye-close' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Hidden'></span>"
invisibleGlyph = "<span class='glyphicon glyphicon-ban-circle' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Invisible'></span>"
timeGlyph="<span class='glyphicon glyphicon-time' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='time'></span>"
okGlyph="<span class='glyphicon glyphicon-ok' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='OK'></span>"
plusGlyph="<span class='glyphicon glyphicon-plus' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Add'></span>"
saveGlyph="<span class='glyphicon glyphicon-save' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Save'></span>"
labelGlyph="<span class='glyphicon glyphicon-font' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Label'></span>"
wrenchGlyph=""
optHorGlyph=""
refreshGlyph=""
removeGlyph=""
calendarGlyph=""
signalGlyph=""
searchGlyph = ""
questionGlyph = ""
staremtpyGlyph = ""
starGlyph = ""
loadGlyph = ""
infoGlyph = ""
picGlyph = ""
upGlyph = ""
downGlyph = ""
uncheckedGlyph =""
runGlyph = ""
editGlyph = ""
eyeOpenGlyph = ""
cameraGlyph = ""
onoffGlyph = ""
scaleGlyph = ""
helpGlyph = ""
homeGlyph = ""
tagsGlyph = ""
xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-xs' aria-label='tbd' title='{3}'>{2}</button>"
smallbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-sm' aria-label='tbd' title='{3}'>{2}</button>"
buttonTemplate      = "<button id='{0}' type='button' class='{1} btn btn-{3}' aria-label='tbd' title='{4}'>{2}</button>"
buttonDebugHtml = "<button type='button' class='btn btn-default' id='altui-debug-btn' >Debug<span class='caret'></span></button>"
cameraURI="data:image/png;base64,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"
defaultIconSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAASJSURBVHja7Jp7aI5RHMff123CMOYyMmFY5LZYI5umFmHhD2pyyYzYkju5hCWX0jZKM9rEkCy5tJostxWRIteZe5FLyW2Y68z35Pfq9Os8z573eT3vu9fOr76d5zzn8jyf59x+57yvu6amxlWfrIGrnpkG1sAaWANrYA2sgTWwBnbKGnmT2e12/7MHb8vOaYhgEJQA9YN6Qj2g5lCoSFu4eNF1K3V5sx9o5M+vC0jxvCRoKjQOalmnW9gH0BYI5kKLoE5B06Vttug8KBMKqyX7S+g+9Ab6SGHwAAN2MIICqL9BlifQMegcdAHj9X1QtjBAxcy2BNoENWbJ1VARtAO6BMiaoO7SgG2C4AA0SZF8CFoDyMf/xRgGbCsExVA8S3oEzQJomUG5AQgSoSFQNNSZlqZ4q8uS34Hx0s0MYA+KSQsv/pHlD0eQQctTVFC1MDkQRQrYtQDdoOgFa6F0qGmwdun10Fh2Lx2wOxnseAS7ofZGDhP0DHoAVUJvnQB2e+OWcdcSEKMRnGTZlgN2K+sBWdACRZXfoBPQYeg8ytmC9IrBLjB5T+VQFynLXrz0TDZrC5gJrKrv0HYoG/lf+dpq/vKlMxnsbRqbcsuqYC9B0wH6MGi2h4CJRDCfjT+x9HyR7mUpYIXDkRAoWF9aeBXzovIAcUX6IBMVYzYTedZb+JghCCIo+gFl3gV00sILtcalGHchdPsr1B0v9lJaeiqgjlLRXKRnmED2QpAGjYH6iEdJyeJZp6FCEarcUW8Y7HTpKRKssD0eWLLVDPYqbQtVoGFQAX2gZVBfBuuiuoSDUgpdRv4Yf4/haSxewDyodLZZSMUH+a6AFXDCdUxVQBpZrJj0UHamX4DxoDb0UI/dAsw1KZ5KfrDH9iP9pqKe3mLdhSJtvLNY6vbYhfa2hRNZmRKWPoPFtxhMSkehcJb0ArpRi2THJA91DXR6lo5j8dMSSFeacDx2Ea17T1HHQpbPRSccscj/3KR3tUVwl7V0LjTMyRaOZnG5O49gacUGrbtUUe8KM1iyHKgduzcUdSY62cK9pOvXzPftx/JeUJRPUnRl8dEO03L3t8VRd7X0oUYpJkuPpdAxkSPAHaTrpyytG4uXK8onKO7FsAM74YWJQ4EqyWffZfJO8U526VA27mRrK13/NPCQult4xmyUrZLiG6GuJvmjnOzS8oa+QnG6USZ5XyprVkv9wiM7L3XlOOaz+8zgVWYzXxhp+Raq+GSSJjb/K9kEl2/BKfkRkEM8i3bfJC0NH61SioufYdawPJsVK0V5XQY+S742t32ALWU95jWC4+yIKFpRtszx/bAPVqaY3V+RM2Lm0rYkJ0NlhX4707J5eDCHLTPF1PJmNhJKVtwvQU8YW2d/LiXLJydiOMWTDWBqs0oLM3jAu7QYm78QTHb9+UXCromZOcXOzzYB+csDHRiMoMMBb004NMmoo8RfBwD/Cvo57XTWQZ8tFjsi3E6UPeW3My0njDYOU+hMS/jWEZL7egc6Q4cJqu2mcwfx/4Pp/2lpYA2sgTWwBtbAGlgDO2W/BRgADRV6RjlErQoAAAAASUVORK5CYII="

var styles ="""
    html {
        position: relative;
        min-height: 100%;  
    }     
    body {
      /* Margin bottom by footer height */ 
      /* margin-bottom: 140px;  */         
    }               
    #wrap {             
    }                   
    #filler {           
        height: 140px;  
    }                   
    footer {               
      position: absolute;  
      bottom: 0;           
      width: 100%;         
      z-index: -1;         
    }                      
    @-webkit-keyframes horiz_rotate {   
        0% {                                            
            -webkit-transform: translateX(10px) rotateX(0deg);          
            transform: translateX(10px) rotateX(0deg);                  
        }                                               
        50% {                                           
            -webkit-transform: translateX(10px) rotateX(180deg);        
            transform: translateX(10px) rotateX(180deg);                
        }                                               
        100% {                                          
            -webkit-transform: translateX(10px) rotateX(0deg);          
            transform: translateX(10px) rotateX(0deg);                  
        }                                               
    }                                       
    @keyframes horiz_rotate {   
        0% {                                            
            -webkit-transform: translateX(10px) rotateX(0deg);          
            transform: translateX(10px) rotateX(0deg);                  
        }                                               
        50% {                                           
            -webkit-transform: translateX(10px) rotateX(180deg);        
            transform: translateX(10px) rotateX(180deg);                
        }                                               
        100% {                                          
            -webkit-transform: translateX(10px) rotateX(0deg);          
            transform: translateX(10px) rotateX(0deg);                  
        }                                               
    }                                       
    #altui-license {                        
    }                                       
    #altui-license.license-rotated {        
        -webkit-animation: horiz_rotate 3s ease-in-out 0s 5 normal;     
        animation: horiz_rotate 3s ease-in-out 0s 5 normal;             
    }                                       
    .big-glyph  {               
        font-size: 22px;        
        margin: 5px;            
    }                           
    .glyphicon-spin {                                   
        -webkit-animation: spin 1000ms infinite linear; 
        animation: spin 1000ms infinite linear;         
    }                                                   
    @-webkit-keyframes spin {                           
        0% {                                            
            -webkit-transform: rotate(0deg);            
            transform: rotate(0deg);    
        }                                               
        100% {                                          
            -webkit-transform: rotate(359deg);          
            transform: rotate(359deg);              
        }                                               
    }                                                   
    @keyframes spin {                                   
        0% {                                            
            -webkit-transform: rotate(0deg);            
            transform: rotate(0deg);                    
        }                                               
        100% {                                          
            -webkit-transform: rotate(359deg);          
            transform: rotate(359deg);                  
        }                                               
    }                                                   
    .onoffswitch { 
        position: relative; width: 55px;        
        -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none; 
    } 
    .onoffswitch-checkbox { 
        display: none; 
    } 
    .onoffswitch-label { 
        display: block; overflow: hidden; cursor: pointer; 
        border: 2px solid #ADAAAA; border-radius: 20px; 
        margin-top: 3px;    
    } 
    .onoffswitch-inner { 
        display: block; width: 200%; margin-left: -100%; 
        height: 20px; 
        transition: margin 0.3s ease-in 0s; 
    } 
    .onoffswitch-inner:before, .onoffswitch-inner:after { 
        display: block; float: left; width: 50%; padding: 0; line-height: 20px; 
        font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold; 
        box-sizing: border-box; 
    } 
    .onoffswitch-inner:before { 
        content: '00a0'; 
        padding-left: 9px; 
        background-color: #34A7C1; color: #FFFFFF; 
    } 
    .onoffswitch-inner:after { 
        content: '00a0'; 
        padding-right: 9px; 
        background-color: #D4D4D4; color: #999999; 
        text-align: right; 
    } 
    .onoffswitch-switch { 
        display: block; width: 28px; margin: 0px; margin-top: -1px; margin-bottom: -1px;
        background: #FFFFFF; 
        position: absolute; top: 0; bottom: 0; 
        right: 27px; 
        border: 2px solid #ADAAAA; border-radius: 20px; 
        transition: all 0.3s ease-in 0s;  
    } 
    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner { 
        margin-left: 0; 
    } 
    .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch { 
        right: 0px;  
    } 
    .on-off-device .glyphicon-spin {        
        top: 9px;                           
        left: 24px;                         
    }       
    .blocklyTreeLabel {         
        color: black;           
    }                           
    .altui-theme-label{         
        font-size: 12px;        
    }                           
    .altui-theme-thumbnail{     
        padding-bottom: 5px;    
        padding-top: 5px;   
    }                           
    .altui-theme-thumbnail:hover {      
        cursor: pointer;        
        border-width:2px;       
        border-color: green;        
    }                           
    #altui-background {         
        position:fixed;         
        top:0;                  
        left:0;                 
        width:100%;             
        height:100%;            
        z-index: -1;            
    }                           
    .ui-resizable-helper { border: 2px dotted #00F; }   
    .altui-variable-title { 
    }                   
    .altui-variable-buttons {   
    }                   
    .altui-variable-value { 
        max-width: 200px;           
        overflow: hidden;       
        text-overflow: ellipsis;    
        white-space: nowrap;        
    }                   
    .altui-variable-value-history td:first-child {  
        width:170px;    
    }                   
    button.altui-variable-history,button.altui-variable-push {  
        padding-top:    1px;    
        padding-bottom: 1px;    
    }                   
    .altui-warningicon, .altui-infoicon {   
        font-size: 25px;
        padding-left: 5px;      
        padding-right: 5px;     
    }                   
    .altui-widget-frame-div , .solid-border {   
        border:1px solid;
    }                   
    .altui-widget-iframe {  
        width:100%;     
        height:100%;    
        margin: 0;  
        padding-top: 10px; 
        padding-left: 0px; 
        padding-right: 10px; 
        padding-bottom: 10px; 
        border: 0; 
    }                   
    .altui-colorpicker-replacer { 
    }   
    .sp-dd { 
    }   
    .fill { 
        min-height:100%;
        max-height:100%;
        height:100%;
    }                   
    #altui-toggle-messages { 
        margin-bottom: 2px;             
    } 
    div#altui-pagemessage-panel {   
        max-height:100px;   
        height:100px;       
        background-color: #f5f5f5;  
        overflow-y: auto;           
    }                       
    div#altui-pagemessage-panel td {    
        color:black;    
    }                       
    .altui-leftnav .altui-edittoolbox { 
        border:1px solid;
        margin-top: -1px;       
        padding-top: 4px;       
        padding-bottom: 4px;    
        padding-left: 4px;      
        padding-right: 4px;     
        font-size: 16px;        
    }                           
    .altui-leftnav div.altui-widget { 
        border:1px solid;   
        margin-top: -1px;       
        padding-top: 4px;       
        padding-bottom: 4px;    
    }                           
    .altui-leftnav div.altui-edittools { 
        margin-top: -1px;   
        display: inline;    
        padding: 4px;       
    }                       
    .altui-custompage-canvas div.altui-widget:hover { 
        cursor: move; 
    }       
    .altui-custompage-canvas *[disabled] { 
        cursor: move; 
    }       
    .altui-custompage-canvas div.altui-widget.ui-selecting { 
        outline-style: solid;   
        outline-color: red;     
        outline-width: 2px;     
    }                           
    .altui-custompage-canvas div.altui-widget.ui-selected { 
        outline-style: solid;   
        outline-color: green;       
        outline-width: 2px;     
    }                           
    div.altui-gauge-div table { 
      background-color: transparent;    
    }                           
    .altui-widget-delete {      
        margin-top: -1px;       
        font-size:16px;         
        border:1px solid; 
        padding-top: 4px;       
        padding-bottom: 4px;    
        text-align: center;     
    }
    .altui-debug {  
        border:1px solid;
        height:100px;
    }                   
    .altui-custompage-canvas {  
        position: relative;     
        height:500px;           
    }                           
    .altui-tabcontent-fix   {   
      padding-top: 15px; 
      padding-left: 15px; 
      padding-bottom: 15px; 
      padding-right: 15px; 
    }   
    .altui-device-keyvariables {    
    }                           
    .altui-device-controlpanel .panel-body {    
        padding-top: 0px;
        padding-bottom: 0px;
    }   
    .altui-devtab-content {             
        font-size:12px;                 
        font-family:Arial;              
    }                                   
    .altui-device-title {       
        overflow: hidden;       
        height: 28px;           
    }       
    .altui-device-title-input {     
        width: 70%;             
        height: 20px;           
    }       
    .altui-scene-title-input {      
        width: 60%;             
        height: 20px;           
    }       
    .altui-mainpanel , .altui-device-toolbar{       
        margin-top: 2px;            
        margin-bottom: 2px;         
    }       
    .altui-device-toolbar .btn-group{       
        margin-left: 2px;           
        margin-right: 2px;          
    }       
    div.altui-device-heading, div.altui-scene-heading { 
        height:30px;
        padding-top: 5px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-left: 10px;
    }
    div.altui-device-body {
        height:52px;
        padding-top: 0px;
        padding-right: 5px;
        padding-bottom: 5px;
        padding-left: 5px;
    }
    div.altui-scene-body {
        height:85px;
        padding-top: 5px;
        padding-right: 5px;
        padding-bottom: 5px;
        padding-left: 5px;
    }
    #altui-device-filter-form { 
        margin-top:5px;         
    }
    div.altui-battery { 
        margin-top:2px;         
        margin-right:5px;       
        margin-bottom:0px;      
    }
    div.altui-battery .progress-bar { 
        color: black;           
    }
    .caret.caret-reversed {             
        border-top-width: 0;            
        border-bottom: 4px solid ;  
    }           
    .form-inline > * {  
        margin:5px 3px; 
    }                   
    div.altui-scene-body button {   
        margin-left:1px;            
        margin-right:1px;           
    }
    .altui-scene-history {  
        clear: left;    
    }                       
    .altui-editscene {      
        clear: left;    
    }                       
    .altui-runscene {       
        height:76px;
    }                       
    .altui-hint {       
        padding-left:10px;
        padding-right:10px;
    }                       
    .altui-scene-date{      
        clear: right;       
        width: 80px;        
        text-align: right;  
    }                       
    .altui-pausescene {     
        padding-right: 3px; 
        cursor: pointer;    
    }               
    img.altui-plugin-icon {             
        font-size: 1.5em;           
        height: 35px;               
    }                               
    textarea#altui-editor-text ,textarea#altui-luascene{        
        font-size: 0.9em;           
        font-family:monospace;      
    }                               
    div.altui-favorites-container   {       
        padding-left: 0px;      
        padding-right: 0px;     
    }       
    div.altui-favorites-device, div.altui-favorites-scene {             
        float:  left;           
        text-align: center;     
        border-width:1px;       
        border-style: solid;    
        margin: 2px;            
        padding-left: 2px;      
        padding-right: 2px;     
        position: relative;     
    }       
    div.altui-favorites-device:hover, div.altui-favorites-scene:hover {             
        cursor: pointer;        
        border-width:2px;       
        border-color: green;        
    }       
    .altui-favorites-device-content, .altui-favorites-scene-content {   
        clear:both;             
        text-align: center;     
    }   
    .altui-favorites-title {        
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;     
        width: 100%; max-width: 100%    
    }       
    .altui-favorites-watts {    
        float: right;           
        text-align: right;      
        font-size: 14px;        
        bottom: 0px;            
        position: absolute;     
        right: 0px;             
    }                           
    .btn.altui-housemode{       
        padding-left: 0px;      
        padding-right: 0px;     
    }                           
    .housemode {                
        text-align: center;     
        cursor: pointer;        
        width:80px;             
        height: 60px;           
        font-size: 40px;        
        background: url('data:image/png;base64,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') no-repeat;        
    }       
    .preset_home.preset_unselected {        
        background-position: -17px -5px;    
    }       
    .preset_home.preset_selected {      
        background-position: -17px -120px;  
    }       
    .preset_away.preset_unselected {        
        background-position: -213px -5px;   
    }       
    .preset_away.preset_selected {      
        background-position: -213px -120px; 
    }       
    .preset_night.preset_unselected {       
        background-position: -115px -5px;   
    }       
    .preset_night.preset_selected {     
        background-position: -115px -120px; 
    }       
    .preset_vacation.preset_unselected {        
        background-position: -315px -5px;   
    }       
    .preset_vacation.preset_selected {      
        background-position: -315px -120px; 
    }       
    .preset_home {      
      margin: auto;     
    }       
    .preset_away {      
      margin: auto;     
    }       
    .preset_night {     
      margin: auto;     
    }       
    .preset_vacation {      
      margin: auto;     
    }       
    .imgLogo {      
        display: block;     
        max-width: 150px;       
        margin-left: auto;      
        margin-right: auto;     
        height: 35px;           
        width: 80px;            
        background: url('data:image/png;base64,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') no-repeat; 
    }       
    .altui-leftnav {        
        width: 100%;        
    }       
    .altui-breadcrumb {     
        display: inline-block;  
        margin-right: 10px;     
        padding-top: 6px;       
        padding-bottom: 6px;    
    }       
    .altui-controlpanel-button  {   
        padding: 0px;
        font-size: 13px;            
        cursor: pointer; 
        text-align: center; 
    }       
    .altui-button-onoff     {   
        margin-top: 2px;    
    }                           
    .altui-button-stateLabel {  
      color: #918f8f;           
      text-align: center;       
      text-transform: uppercase;    
      font-size: 11px;          
    }                           
    .altui-favorite  {      
        padding-right: 3px; 
        cursor: pointer;    
    }               
    .paused {       
      color: red    
    }               
    .activated {    
      color: green  
    }               
    #altui-grid, .altui-grid {      
        font-size: 12px;    
    }               
    #altui-grid th , .altui-grid th {       
        font-size: 12px;    
        text-transform: capitalize; 
    }               
    input.altui-plugin-version {        
        display: inline;    
        width: 44px; 
        padding-left: 3px;  
        padding-right: 3px; 
    }               
    .altui-device-icon {            
        cursor: pointer;    
        margin-left: 0px;   
        margin-right: 0px;  
        height: 50px;       
        margin-top: 1px;    
        width: 50px;        
    }                       
    .altui-oscommand-configtbl th {     
        text-transform: capitalize;     
    }                                   
    .altui-room-name  {     
        cursor: pointer;    
    }                       
    .altui-quality-color  {     
        height: 15px;   
        width: 30px;    
        background: linear-gradient(to right, red , green); 
    }                       
    .altui-quality-grey {       
        height: 15px;   
        width: 30px;    
        background: grey;   
    }                       
    .table .table {                 
    background-color:transparent;   
    }                       
"""

ALTUI_Templates = null
class ALTUI_Templates_Factory
    @dropdownTemplate: """
<div class='btn-group pull-right'>
    <button 
     class='btn btn-default btn-xs dropdown-toggle altui-device-command' 
     type='button' 
     data-toggle='dropdown' 
     aria-expanded='false'> 
        <span class='caret'></span>
    </button>
    <ul class='dropdown-menu' role='menu'>
        <li>
            <a id='{0}' class='altui-device-variables' href='#' role='menuitem'>Variables</a>
        </li>
        <li>
            <a id='{0}' class='altui-device-actions' href='#' role='menuitem'>Actions</a>
        </li>
        <li>
            <a id='{0}' class='altui-device-controlpanelitem' href='#' role='menuitem'>
                Control Panel
            </a>
        </li>
        <li>
            <a id='{0}' class='altui-device-hideshowtoggle' href='#' role='menuitem'>{1}</a>
        </li>
    </ul>
</div>
<div class='pull-right text-muted'>
    <small>#{0} </small>
</div>
    """

    @batteryHtmlTemplate: """
<div class='altui-battery progress pull-right' style='width: 35px; height: 15px;'>
    <div 
     class='progress-bar {1}' 
     role='progressbar' 
     aria-valuenow='60' 
     aria-valuemin='0' 
     aria-valuemax='100' 
     style='min-width: 1em; width: {0}%;'>
        {0}%
    </div>
</div>
    """

    @devicecontainerTemplate: """
<div class='panel panel-{4} altui-device' data-altuiid='{5}' id='{0}'>
    <div class='panel-heading altui-device-heading'>
        {6} {7}
        <div 
         class='panel-title altui-device-title'
         data-toggle='tooltip' 
         data-placement='left' 
         title='{2}'>
            {1}
        </div>
    </div>
    <div class='panel-body altui-device-body'>
        {8}{3}
    </div>
</div>
    """

    @deviceEmptyContainerTemplate = """
<div class=' col-sm-6 col-md-4 col-lg-3 '>
    <div class='panel panel-default altui-device' data-altuiid='{1}' id='{0}'>
    </div>
</div>      
    """

    # 0: variable, 
    # 1: value, 
    # 2: service, 
    # 3: id, 
    # 4: push btn color class, 
    # 5: watch provider name
    @deviceVariableLineTemplate = """
<tr>
    <td class='altui-variable-title'>
        <span title='{2}'>
            {0}
        </span>
    </td>
    <td class='altui-variable-buttons'>
        #{@smallbuttonTemplate.format('{3}', 'altui-variable-history', glyphTemplate.format( "calendar", _T("History"), "" ),_T('History'))}
        #{@smallbuttonTemplate.format( '{3}', 'altui-variable-push {4}', glyphTemplate.format( "signal", _T("Push to {5}"), "" ),_T("Push to {5}"))}
    </td>
    <td id='{3}' class='altui-variable-value' >
        {1}
    </td>
</tr>   
    """

class LuaEditor
    # 0: Lua code to edit
    @luaEditorModalTemplate: (luacode) -> """
<div id='luaEditorModal' class='modal fade'>
    <div class='modal-dialog modal-lg'>
        <div class='modal-content'>
            <div class='modal-header'>
                <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                    <span aria-hidden='true'>
                        &times;
                    </span>
                </button>
                <h4 class='modal-title'>LUA Editor</h4>
            </div>
            <div class='modal-body'>
                <div class='form-group'>
                    <label for='altui-luacode-text'>Lua Code</label>
                    <textarea 
                     id='altui-luacode-text' 
                     rows='10' 
                     class='form-control' 
                     placeholder='enter code here'>
                        #{luacode}
                    </textarea>
                </div>
            </div>
            <div class='modal-footer'>
                <!--<button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>-->
                <!--<button type='button' class='btn btn-default altui-luacode-test' >"+_T("Test Code")+"</button>-->
                <!--<button type='button' class='btn btn-primary altui-luacode-save' data-dismiss='modal'>"+_T("Save Changes")+"</button>-->
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
    """

    @openDialog: (luacode, onSaveCB) ->
        dialog = DialogManager.registerDialog('luaEditorModel', @luaEditorModalTemplate(luacode))
        DialogManager.dlgAddDialogButton(dialog, 
                                         false, 
                                         _T("Close"), 
                                         '', 
                                         {'data-dismiss': 'modal'})
        DialogManager.dlgAddDialogButton(dialog, 
                                         false, 
                                         _T("Test Code"),
                                         'altui-luacode-test')
        DialogManager.dlgAddDialogButton(dialog, 
                                         true, 
                                         _T("Save Changes"),
                                         'altui-luacode-save',
                                         {'data-dismiss':'modal'})

        dialog.on "click touchend", ".altui-luacode-text", () ->
            lua = $("#altui-luacode-text").val()
            MultiBox.runLua 0, lua, (result) -> alert(JSON.stringify(result))
        .on("click touchend", ".altui-luacode-save", () ->
            code = $("#altui-luacode-text").val()
            onSaveCB(code)
        dialog.modal()

class DialogManager
    @optionsToString: (options) ->
        tbl = []
        options = $.extend({}, options)

        for key,val in options
            typ = Object.prototype.toString.call(val)
            if typ != "[object Object]" and typ != "[object Array]"
                tbl.push("#{key}-#{val}")
        return tbl.join(' ')

    # this method assumes htmlDialog id property is equal to 'name'
    @registerDialog: (name, htmlDialog) ->
        dialog = $("div#dialogs div##{name}")
        if dialog.length == 0
            $("div#dialogs").append(htmlDialog)
        else
            $(dialog).replaceWith(htmlDialog)
        dialog = $("div#dialogs div##{name}")
        # remove all callbacks for now
        $(dialog).off()
        $("div#dialogs").off()
        return dialog

    @getActionParameterHtml: (id, device, actionname, actiondescriptor, cbfunc) ->
        if $.isFunction(cbfunc) 
            Html = ""
            bFound = false
            MultiBox.getDeviceActions device, (services) ->
                for service,idx in services
                    for action,idx2 in service.Actions
                        if action.name == actionname
                            bFound = true
                            for param,idx in action.input
                                curvalue = actiondescriptor.params[param] or ''
                                Html += "<label for='#{id}-#{param}'>#{param}</label>"
                                Html += """
                                    <input 
                                     id='#{id}-#{param}' 
                                     class='form-control' 
                                     type='text' 
                                     required 
                                     value='#{curvalue}'
                                     placeholder='enter parameter value'>
                                    </input>
                                """
                        return !bFound
                    return !bFound
                cbfunc("<div class='#{id}'>#{Html}</div>")

    @getDeviceServiceVariableSelect: (device, service, variable) ->
        select = $("<select id='altui-select-variable' class='form-control'></select>")
        if device? and device.altuiid!=NULL_DEVICE
            for state, idx in device.states.sort(@sortByVariableName)
                if service == state.service and variable == state.variable
                    isSelected = 'selected'
                else
                    isSelected = ''
                select.append("""
<option value='#{state.id}' #{isSelected}>
    #{state.variable} : (#{state.service})
</option>
                """
        return select.wrap( "<div></div>" ).parent().html();    

    @getDeviceActionSelect: (id, device, actiondescriptor, cbfunc) ->
        MultiBox.getDeviceActions device, (services) ->
            select = $("<select required id='#{id}' class='form-control'></select>")
            isSelected = if actiondescriptor.action == '' then 'selected' else ''    
            select.append("<option value='0' ${isSelected}>Select ...</option>")
            for service,idx in services
                group = $("<optgroup label='#{service.ServiceId}'></optgroup>")
                for service,idx in service.Actions
                    selected = ""
                    if actiondescriptor.action == action.name and actiondescriptor.service == service.ServiceId
                        selected = 'selected'

                    group.append("""
<option value='#{service.ServiceId}.#{action.name}' #{selected}>
    #{action.name}
</option>
                    """)
                select.append(group)

            @getActionParameterHtml("#{id}-parameters",
                                    device,
                                    actiondescriptor.action,
                                    actiondescriptor,
                                    (parameters) ->
                                        cbfunc(select.wrap("<div></div>").parent().html()+parameters)


    @createSpinningDialog: (message, glyph) ->
        # 0: title, 1: body
        glyph2 = glyph or glyphTemplate.format( "refresh", 
                                               _T("Refresh"), 
                                               "text-warning glyphicon-spin big-glyph")
        defaultSpinDialogModalTemplate = """
<div id='dialogModal' class='modal' data-backdrop='static' data-keyboard='false'>
  <div class='modal-dialog modal-sm'>
    <div class='modal-content'>
      <div class='modal-body'>
      <div class='row-fluid'>
      #{glyph2} #{message or ""}
      </div>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
        """
        DialogManager.registerDialog('dialogModal',defaultSpinDialogModalTemplate)

    @genericDialog: (message, title, buttons, cbfunc) ->
        result = false
        dialog = DialogManager.registerDialog('dialogModal',
                                              defaultDialogModalTemplate.format(title,message,""))

        for button, i in buttons
            DialogManager.dlgAddDialogButton(dialog, button.isdefault, button.label)

        # buttons
        $('div#dialogs')
            .off('submit', "div#dialogModal form")
            .on('submit', 'div#dialogModel form', () ->
                result = true
                dialog.modal('hide')
            .off('hide.bs.modal', 'div#dialogModal')
            .on('hide.bs.modal', 'div#dialogModal', () ->
                if $.isFunction(cbfunc)
                    cbfunc(result)
            )

        dialog.modal {
            # wire up the actual modal functionality and show the dialog
            backdrop: 'static'
            keyboard: true
            show: true          # ensure the modal is shown immediately
        }
        return result

    @confirmDialog: (message, cbfunc) ->
        warningpic = "<div class='altui-warningicon pull-left'>#{questionGlyph}</div>"
        @genericDialog(message, 
                       warningpic+_T("Are you Sure ?"), 
                       [{isdefault:true, label: _T("Yes")}],
                       cbfunc)

    @infoDialog: (title, message, cbfunc) ->
        header = "<div class='altui-infoicon pull-left'>#{infoGlyph}</div> #{title}"
        @genericDialog(message, header, [], cbfunc)

    @triggerDialog: (trigger, controller, cfunc) ->
        dialog = DialogManager.createPropertyDialog(_T('Trigger'))
        device = MultiBox.getDeviceByID(controller, trigger.device)
        DialogManager.dlgAddLine(dialog, 
                                 "TriggerName", 
                                 _T("TriggerName"), 
                                 trigger.name, 
                                 "", 
                                 {required:''})
        devid = if device then device.altuiid else NULL_DEVICE
        DialogManager.dlgAddDevices(dialog, devid, () -> # callback
            DialogManager.dlgAddEvents(dialog, 
                                       "Events", 
                                       "altui-select-events", 
                                       devid, 
                                       trigger.template,
                                       trigger.arguments)
            $('div#dialogModal').modal()
        , (device) -> # filter
            MultiBox.controllerOf(device.altuiid).controller == controller
        )
        $('div#dialogs').on('submit', 'div#dialogModal form', (event) ->
            trigger.name = $('#altui-widget-TriggerName').val()
            trigger.enabled = 1
            trigger.device = parseInt(MultiBox.controllerOf($('#altui-select-device').val()), id)
            trigger.template = $('#altui-select-events').val()
            trigger.arguments = []
            for elem, idx in $('.altui-arguments input')
                id = $(elem).prop('id').substring('altui-event-param'.length)
                trigger.arguments.push({id: id, value: $(elem).val()})
                # on UI7 10, for motion sensor which have no argument list in 
                # their eventlist definition it seems that passing at least 
                # {id:1} is mandatory
                if trigger.argument.length == 0
                    trigger.arguments.push({id: 1})

                if trigger.device > 0 and trigger.template > 0
                    $('div#dialogModal').modal('hide')
                    $('.modal-backdrop').remove() # hack as it is too fash
                    if $.isFunction(cbfunc)
                        cbfunc(trigger)

    @triggerUsersDialog: (trigger, controller, cbfunc) ->
        dialog = DialogManager.createPropertyDialog(_T('Notify Users'))
        selectedusers = (trigger.users or "").toString().split(",") 
        for user, idx in users
            inarray = $.inArray(user.id.toString(), selectedusers)
            DialogManager.dlgAddCheck(dialog,
                                      'user-#{user.id}',
                                      (inarray != -1),
                                      user.Name,
                                      'altui-notify-user')
        $('div#dialogModal').modal()
        $('div#dialogs')    
            .off('submit',"div#dialogModal form")
            .on( 'submit',"div#dialogModal form", (event) ->
                var lines=[]
                for check, idx in $('.altui-notify-user')
                    if $(check).prop('checked') == true
                        id = $(check).prop('id').substring("altui-widget-user-".length)
                        lines.push(id)
                if (lines.length>0)
                    trigger.users = lines.join(",")
                else
                    # warning : in UI7 setting a empty string is not sufficient
                    delete trigger.users   
                $('div#dialogModal').modal('hide')
                $(".modal-backdrop").remove()  # hack as it is too fast
                if ($.isFunction(cbfunc))
                    (cbfunc)(event)
            )

    @createPropertyDialog: (title) ->
        dialog = DialogManager.registerDialog('dialogModel',
                                              defaultDialogModalemplate.format title, '' 'modal-lg')
        DialogManager.dlgAddDialogButton dialog, true, _T("Save Changes")
        return dialog

    @dlgAddDialogButton: (dialog, bSubmit, label, extraclass, extraattrs) ->
        ea = if extraattrs then @optionsToString(extraattrs) else ''
        typ = if bSubmit then 'submit' else 'button'
        cls = if bSubmit then 'primary' else 'default'
        html = """
<button type='#{typ}' class='btn btn-#{cls'} #{extraclass or ''}' #{ea}>
    #{label}
</button>
        """
        $(dialog).find('.modal-footer').append(html)

    @dlgAddCheck: (dialog, name, value, label, extraclass) ->
        propertyline = """
<label class='checkbox-inline'>
    <input 
     type='checkbox' 
     class='#{extraclass or ''}' 
     id='altui-widget-#{name}' 
     #{if value then 'checked' else ''} 
     value='#{value}' 
     title='check to invert status value'>
    #{label or name}
</label>
        """
        $(dialog).find(".row-fluid").append(propertyline)

    @dlgAddDayOfWeek: (dialog, name, label, value, _timerDOW) ->
        # 0: sunday
        selected_days = value.split(',')
        propertyline = """
<div class='form-group' id='altui-widget-#{name}'>
    <label title='#{name}'>#{label}: </label>
        """
        for element, idx in _timerDOW
            propertyline += """
 <label class='checkbox-inline'>
    <input 
     type='checkbox' 
     class='altui-widget-TimerDayOfWeek' 
     id='altui-widget-#{name+element.value}'
     #{if $.inArray(element.value.toString(),selected_days)!=-1) then 'checked' else ''}
     value='#{element.value}' />
    #{element.text}
 </label>
            """
        propertyline += xsbuttonTemplate.format('altui-TimerDayOfWeek-setAll',
                                                '',
                                                okGlyph,
                                                _T("All"))
        propertyline += xsbuttonTemplate.format('altui-TimerDayOfWeek-clearAll',
                                                '',
                                                removeGlyph,
                                                _T("None"))
        propertyline += "</div>";
        $(dialog).find(".row-fluid").append(propertyline)
        $("#altui-TimerDayOfWeek-setAll").click () ->
            $(".altui-widget-TimerDayOfWeek").each (i,e) ->
                id = parseInt($(e).prop('id').substring("altui-widget-#{name}".length)
                if id < 8
                    $(e).prop('checked', true)

        $("#altui-TimerDayOfWeek-clearAll").click () ->
            $(".altui-widget-TimerDayOfWeek").each (i,e) ->
                id = parseInt($(e).prop('id').substring("altui-widget-#{name}".length)
                if  id < 8
                    $(e).prop('checked', false)

    


































