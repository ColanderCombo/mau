//#  sourceURL=J_ALTUI_uimgr.js
// "use strict"; 
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// ALTUI: This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file
// Commercial utilisation is not authorized without the appropriate
// written devagreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE .
 
/*The MIT License (MIT)
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
*/

// Black : //docs.google.com/uc?authuser=0&id=0B6TVdm2A9rnNLWlIeEZDN1ZGU0k&export=download    
// Transparent : //drive.google.com/uc?id=0B6TVdm2A9rnNMkx5M0FsLWk2djg&authuser=0&export=download

// UIManager.loadScript('https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table","gauge"]}]}');
var AltUI_revision = "$Revision$";
var NULL_DEVICE = "0-0";
var NULL_SCENE = "0-0";
var _HouseModes = [];
var deviceModalTemplate = "";
var deviceActionModalTemplate = "";
var defaultDialogModalTemplate = "";
var wattTemplate = "<span class='altui-watts '>{0} <small>Watts</small></span>";
// 0:modeid 1:modetext 2:modeclss for bitmap 3:preset_unselected or preset_selected
var houseModeButtonTemplate = "  <button type='button' class='btn btn-default altui-housemode'><div>{1}</div><div id='altui-mode{0}' class='{2} {3} housemode'></div></button>";							
var leftNavButtonTemplate = "<button id='{0}' data-altuiid='{1}' type='button' class='altui-leftbutton btn btn-default'>{2}</button>";
var deleteGlyph = "<span class='glyphicon glyphicon-trash text-danger' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Delete'></span>";
var glyphTemplate = "<span class='glyphicon glyphicon-{0} {2}' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='{1}' ></span>";
var hiddenGlyph = "<span class='glyphicon glyphicon-eye-close' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Hidden'></span>";
var invisibleGlyph = "<span class='glyphicon glyphicon-ban-circle' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Invisible'></span>";
var timeGlyph="<span class='glyphicon glyphicon-time' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='time'></span>";
var okGlyph="<span class='glyphicon glyphicon-ok' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='OK'></span>";
var wrenchGlyph="<span class='glyphicon glyphicon-wrench' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Settings'></span>";
var plusGlyph="<span class='glyphicon glyphicon-plus' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Add'></span>";
var saveGlyph="<span class='glyphicon glyphicon-save' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Save'></span>";
var labelGlyph="<span class='glyphicon glyphicon-font' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Label'></span>";
var optHorGlyph="";
var refreshGlyph="";
var removeGlyph="";
var calendarGlyph="";
var searchGlyph = "";
var questionGlyph = "";
var staremtpyGlyph = "";
var starGlyph = "";
var loadGlyph = "";
var infoGlyph = "";
var picGlyph = "";
var upGlyph = "";
var downGlyph = "";
var uncheckedGlyph ="";
var runGlyph = "";
var editGlyph = "";
var cameraGlyph = "";
var onoffGlyph = "";
var scaleGlyph = "";
var helpGlyph = "";
var homeGlyph = "";
var tagsGlyph = "";
var xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-xs' aria-label='tbd' title='{3}'>{2}</button>";
var smallbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-sm' aria-label='tbd' title='{3}'>{2}</button>";
var buttonTemplate 		= "<button id='{0}' type='button' class='{1} btn btn-{3}' aria-label='tbd' >{2}</button>";
var buttonDebugHtml = "<button type='button' class='btn btn-default' id='altui-debug-btn' >Debug<span class='caret'></span></button>";
var cameraURI="data:image/png;base64,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";
var defaultIconSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAASJSURBVHja7Jp7aI5RHMff123CMOYyMmFY5LZYI5umFmHhD2pyyYzYkju5hCWX0jZKM9rEkCy5tJostxWRIteZe5FLyW2Y68z35Pfq9Os8z573eT3vu9fOr76d5zzn8jyf59x+57yvu6amxlWfrIGrnpkG1sAaWANrYA2sgTWwBnbKGnmT2e12/7MHb8vOaYhgEJQA9YN6Qj2g5lCoSFu4eNF1K3V5sx9o5M+vC0jxvCRoKjQOalmnW9gH0BYI5kKLoE5B06Vttug8KBMKqyX7S+g+9Ab6SGHwAAN2MIICqL9BlifQMegcdAHj9X1QtjBAxcy2BNoENWbJ1VARtAO6BMiaoO7SgG2C4AA0SZF8CFoDyMf/xRgGbCsExVA8S3oEzQJomUG5AQgSoSFQNNSZlqZ4q8uS34Hx0s0MYA+KSQsv/pHlD0eQQctTVFC1MDkQRQrYtQDdoOgFa6F0qGmwdun10Fh2Lx2wOxnseAS7ofZGDhP0DHoAVUJvnQB2e+OWcdcSEKMRnGTZlgN2K+sBWdACRZXfoBPQYeg8ytmC9IrBLjB5T+VQFynLXrz0TDZrC5gJrKrv0HYoG/lf+dpq/vKlMxnsbRqbcsuqYC9B0wH6MGi2h4CJRDCfjT+x9HyR7mUpYIXDkRAoWF9aeBXzovIAcUX6IBMVYzYTedZb+JghCCIo+gFl3gV00sILtcalGHchdPsr1B0v9lJaeiqgjlLRXKRnmED2QpAGjYH6iEdJyeJZp6FCEarcUW8Y7HTpKRKssD0eWLLVDPYqbQtVoGFQAX2gZVBfBuuiuoSDUgpdRv4Yf4/haSxewDyodLZZSMUH+a6AFXDCdUxVQBpZrJj0UHamX4DxoDb0UI/dAsw1KZ5KfrDH9iP9pqKe3mLdhSJtvLNY6vbYhfa2hRNZmRKWPoPFtxhMSkehcJb0ArpRi2THJA91DXR6lo5j8dMSSFeacDx2Ea17T1HHQpbPRSccscj/3KR3tUVwl7V0LjTMyRaOZnG5O49gacUGrbtUUe8KM1iyHKgduzcUdSY62cK9pOvXzPftx/JeUJRPUnRl8dEO03L3t8VRd7X0oUYpJkuPpdAxkSPAHaTrpyytG4uXK8onKO7FsAM74YWJQ4EqyWffZfJO8U526VA27mRrK13/NPCQult4xmyUrZLiG6GuJvmjnOzS8oa+QnG6USZ5XyprVkv9wiM7L3XlOOaz+8zgVWYzXxhp+Raq+GSSJjb/K9kEl2/BKfkRkEM8i3bfJC0NH61SioufYdawPJsVK0V5XQY+S742t32ALWU95jWC4+yIKFpRtszx/bAPVqaY3V+RM2Lm0rYkJ0NlhX4707J5eDCHLTPF1PJmNhJKVtwvQU8YW2d/LiXLJydiOMWTDWBqs0oLM3jAu7QYm78QTHb9+UXCromZOcXOzzYB+csDHRiMoMMBb004NMmoo8RfBwD/Cvo57XTWQZ8tFjsi3E6UPeW3My0njDYOU+hMS/jWEZL7egc6Q4cJqu2mcwfx/4Pp/2lpYA2sgTWwBtbAGlgDO2W/BRgADRV6RjlErQoAAAAASUVORK5CYII="

var styles ="					\
	#altui-background {			\
		position:fixed;			\
		top:0;					\
		left:0;					\
		width:100%;				\
		height:100%;			\
		z-index: -1;			\
	}							\
	.ui-resizable-helper { border: 2px dotted #00F; }	\
	.altui-variable-value-history td:first-child {	\
		width:170px;	\
	}					\
	button.altui-variable-history {	\
		padding-top: 	1px;	\
		padding-bottom: 1px;	\
	}					\
	.altui-warningicon {	\
		font-size: 25px;\
		padding-left: 5px;		\
		padding-right: 5px;		\
	}					\
	.altui-widget-frame-div , .solid-border {	\
		border:1px solid;\
	}					\
	.fill {	\
		min-height:100%;\
		max-height:100%;\
		height:100%;\
	}					\
	#altui-toggle-messages { \
		margin-bottom: 2px;				\
	} \
	div#altui-pagemessage-panel {	\
		max-height:100px;	\
		height:100px;		\
		background-color: #f5f5f5;	\
		overflow-y: auto; 			\
	}						\
	div#altui-pagemessage-panel td {	\
		color:black;	\
	}						\
	.altui-leftnav .altui-edittoolbox { \
		border:1px solid;\
		margin-top: -1px;		\
		padding-top: 4px;		\
		padding-bottom: 4px;	\
		padding-left: 4px;		\
		padding-right: 4px;		\
		font-size: 16px;		\
	}							\
	.altui-leftnav div.altui-widget { \
		border:1px solid;	\
		margin-top: -1px;		\
		padding-top: 4px;		\
		padding-bottom: 4px;	\
	}							\
	.altui-leftnav div.altui-edittools { \
		margin-top: -1px;	\
		display: inline;	\
		padding: 4px;		\
	}						\
	.altui-custompage-canvas div.altui-widget:hover { \
		cursor: move; \
	}		\
	.altui-custompage-canvas *[disabled] { \
		cursor: move; \
	}		\
	.altui-custompage-canvas div.altui-widget.ui-selecting { \
		outline-style: solid;	\
		outline-color: red;		\
		outline-width: 2px;		\
	}							\
	.altui-custompage-canvas div.altui-widget.ui-selected { \
		outline-style: solid;	\
		outline-color: green;		\
		outline-width: 2px;		\
	}							\
	div.altui-gauge-div table { \
	  background-color: transparent;	\
	}							\
	.altui-widget-delete {		\
		margin-top: -1px;		\
		font-size:16px;			\
		border:1px solid; \
		padding-top: 4px;		\
		padding-bottom: 4px;	\
		text-align: center;		\
	}\
	.altui-debug {	\
		border:1px solid;\
		height:100px;\
	}					\
	.altui-custompage-canvas {	\
		position: relative;		\
		height:500px;			\
	}							\
	.altui-tabcontent-fix	{	\
	  padding-top: 15px; \
	  padding-left: 15px; \
	  padding-bottom: 15px; \
	  padding-right: 15px; \
	}	\
	.altui-device-keyvariables {	\
	}							\
	.altui-device-controlpanel .panel-body {	\
		padding-top: 0px;\
		padding-bottom: 0px;\
	}	\
	.altui-devtab-content {				\
		font-size:12px;					\
		font-family:Arial;				\
	}									\
	.altui-device-title {		\
		overflow: hidden;		\
		height: 28px;			\
	}		\
	.altui-mainpanel , .altui-device-toolbar{		\
		margin-top: 2px;			\
		margin-bottom: 2px;			\
	}		\
	div.altui-device-heading, div.altui-scene-heading {	\
		height:30px;\
		padding-top: 5px;\
		padding-right: 10px;\
		padding-bottom: 5px;\
		padding-left: 10px;\
	}\
	div.altui-device-body {\
		height:52px;\
		padding-top: 0px;\
		padding-right: 5px;\
		padding-bottom: 5px;\
		padding-left: 5px;\
	}\
	div.altui-scene-body {\
		height:85px;\
		padding-top: 5px;\
		padding-right: 5px;\
		padding-bottom: 5px;\
		padding-left: 5px;\
	}\
	#altui-device-filter-form { \
		margin-top:5px;			\
	}\
	div.altui-battery { \
		margin-top:2px;			\
		margin-right:5px;		\
		margin-bottom:0px;		\
	}\
	div.altui-battery .progress-bar { \
		color: black;			\
	}\
	.caret.caret-reversed {				\
		border-top-width: 0;			\
		border-bottom: 4px solid ;	\
	}			\
	.form-inline > * {	\
		margin:5px 3px;	\
	}					\
	div.altui-scene-body button {	\
		margin-left:1px;			\
		margin-right:1px;			\
	}\
	.altui-scene-history {	\
		clear: left;	\
	}						\
	.altui-editscene {		\
		clear: left;	\
	}						\
	.altui-runscene {		\
		height:76px;\
	}						\
	.altui-hint {		\
		padding-left:10px;\
		padding-right:10px;\
	}						\
	.altui-scene-date{		\
		clear: right;		\
		width: 80px;		\
		text-align: right;	\
	}						\
	.altui-pausescene {		\
		padding-right: 3px;	\
	}				\
	img.altui-plugin-icon { 			\
		font-size: 1.5em;			\
		height: 35px;				\
	}								\
	textarea#altui-editor-text ,textarea#altui-luascene{		\
		font-size: 0.9em;			\
		font-family:monospace;		\
	}								\
	.housemode {				\
		text-align: center;		\
		cursor: pointer;		\
		width:60px;				\
		height: 60px;			\
		background: url('data:image/png;base64,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') no-repeat;		\
	}		\
	div.altui-favorites-container	{		\
		padding-left: 0px;		\
		padding-right: 0px;		\
	}		\
	div.altui-favorites-device, div.altui-favorites-scene {				\
		float:	left;			\
		text-align: center;		\
		border-width:1px;		\
		border-style: solid;	\
		margin: 2px;			\
		padding-left: 2px;		\
		padding-right: 2px;		\
	}		\
	div.altui-favorites-device:hover, div.altui-favorites-scene:hover {				\
		cursor: pointer;		\
		border-width:2px;		\
		border-color: green;		\
	}		\
	.altui-favorites-device-content, .altui-favorites-scene-content {	\
		clear:both;				\
		text-align: center;		\
	}	\
	.altui-favorites-title {		\
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;		\
		width: 100%; max-width: 100% 	\
	}		\
	.preset_home.preset_unselected {		\
		background-position: -25px -5px;	\
	}		\
	.preset_home.preset_selected {		\
		background-position: -25px -120px;	\
	}		\
	.preset_away.preset_unselected {		\
		background-position: -215px -5px;	\
	}		\
	.preset_away.preset_selected {		\
		background-position: -215px -120px;	\
	}		\
	.preset_night.preset_unselected {		\
		background-position: -115px -5px;	\
	}		\
	.preset_night.preset_selected {		\
		background-position: -115px -120px;	\
	}		\
	.preset_vacation.preset_unselected {		\
		background-position: -315px -5px;	\
	}		\
	.preset_vacation.preset_selected {		\
		background-position: -315px -120px;	\
	}		\
	.preset_home {		\
	  margin: auto;		\
	}		\
	.preset_away {		\
	  margin: auto;		\
	}		\
	.preset_night {		\
	  margin: auto;		\
	}		\
	.preset_vacation {		\
	  margin: auto;		\
	}		\
	.imgLogo {		\
		display: block;		\
		max-width: 150px;		\
		margin-left: auto;		\
		margin-right: auto;		\
		height: 35px;			\
		width: 80px;			\
		background: url('data:image/png;base64,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') no-repeat; \
	}		\
	.altui-leftnav {		\
		width: 100%;		\
	}		\
	.altui-breadcrumb {		\
		display: inline-block;	\
		margin-right: 10px;		\
		padding-top: 6px;		\
		padding-bottom: 6px;	\
	}		\
	.on-off-device {		\
	  width: 70px;		\
	  height: 38px;		\
	  border: none;		\
	}		\
	.altui-controlpanel-button	{	\
		padding: 0px;\
		font-size: 13px;			\
		cursor: pointer; \
		text-align: center; \
	}		\
	.altui-button-onoff		{	\
		width: 75px;			\
		height: 50px;			\
	}							\
	.altui-button-stateLabel {	\
	  color: #918f8f;			\
	  text-align: center;		\
	  text-transform: uppercase;	\
	  font-size: 11px;			\
	}							\
	.altui-favorite  {		\
		padding-right: 3px;	\
	}				\
	.paused {		\
	  color: red	\
	}				\
	.activated {	\
	  color: green	\
	}				\
	.on-off-device.off {		\
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAoCAYAAABD0IyuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAKOSURBVGhD7ZhZb+MwDITz//9c8tJs49x3srmb800lvXGgdYcSbctoC2iADyIGrWtNJVp2wxgTAUAzEoMRgWYkBiMCzUgMRgSaoXg8HjRAwZ//SUCzCpfLhYZCgtf5bqBZhs1mQ0Mlwet+F9Asyu12oyGIGr1u1/R7PTMaDs1kPDbTycTMplMzn83MYj5PWS4WXvgfdTqd0muWAZpams2mCRhKKu5L3SQxg37fjEejNBiGg8nCQUG42G23fGk4BwloalmtVjSE136/N7xyhoNBpVVjs1ou+dJwHghoFkDUer1OcdUucRD2qqkaTAYJzeML0NTw3L+ipDDs2qXb9fql11TZThnalQNNJU5JYdi1TxyGtJ3QpLVoeg40fczpxnySwrBrnw6Hw2s7cTihthNDgnPLgKYPzSFOCsOufeInVB19hjlS6CQ4PwaaCrySwrBrjbI+EzqYv//uAc0tBZoKvJLCsGuN6gqGIaG5pUBTgVdSGHatEW+jLBgmBvOUvWJiMJZ+1VY6n880uCWFYdc+8VOprmB8Bz1o+pjRzfkkhWHXPh3onamuxzW/j5Hg/BhoKnFKCsOufeJD3a864DHH45EGWVIYdu3Sld6VXG/YaLJaNO9L0CyAKCkMu3aJg8j6SxYMhxIimOfJHc3nBTS1uN6ZpDDsWtJ+tzNJp1NLf9F+tIJmEUp8/Hbqfr+bzvt78A9VzPO7NJxHHmgWhftBCHEoSZK8Pm3mD3ZVtlGRUBholqHqZ84t3fifdjvdQvneUmW1cKM9f3zwn4D3LQHNMrRaLRp0h7+cGn1aHe23t/+2UNZb8qtFGwyvEE2TlYBmCLbU5HhrCIK/85OAZiQGIwLNSAxGBJqRGIyAaXwCmHJBNse7DisAAAAASUVORK5CYII=') no-repeat;		\
	}		\
	.on-off-device.on {		\
	  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAoCAYAAABD0IyuAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAy5JREFUaEPtmbtuE0EUhkcgQYNEOiQangABQjjcYyDU0IRLYm4mYCdcGkQoCRWCyqKlRYIXCDUvgJSGhgYoLblz4as0nLF3opPZfy5rL5IXzZE+7egUO55PZ87sroWUMgKAyUgUYwUmI1GMFZiMFEPMfuIEcZjYm+Q0e4hDxFFiX5LLBZicEQ4QVeJtt9uV/X6fhukYDAbq8pk4SaD7TARMzgjLxB8iOHq9nrqge2UGJkO59+m9PLJZkeL51d08WxzzlHhyZcz6ZSnql6SolaV4RKwuSFG9KMWDC3Sj81LcPSdF5awUK2fo1qP7TxOp35oVmPSx8OFFWoZGS+Fi1ok1ElMjMTtSSMj9RMidsZC51UW5/fsnTTF9JFsM/v4QYNIFlMFB1aKkqGp5zCpFS0mqRNw+nZsUHcPhUF3gOnzApA0owiRVLXwLkZSHyfbhUm7Ny8bXLzRF/qEaNwVcjwuYREAJJiHVontKsn1UpZTfrNEU7mg2myNcY0fANbmASRNnT+H4qoVvoUSKuDkvv/34TtO4wyaDj20xSb+BSRMoAWGKcVXL8ngLHd+o0BT+sMngY0/AtdmASRMowcSUosWMTiKjt+xUS0k2ttSzmT9sMvjYFVmfcWCSA59TEKYYdUTXlRhjG+neQtUibpTk9q+wk8gmg49dkfWEgkkOlIBIiXFtI6oWJWapRFOEhU0GHwcEXCMCJjlQAiJUjDqik6Yrlk7RFGFhk8HHAQHXiIBJDpSACBGjn12S/hLF/I9iDr66jkWYhIjRW0n1mKJvpWsfX2MRJqFijOZb2FNJAUWYpMQQAcd1YZ9jFEHbyRSj8D7g0ZPvyxWawh82GXzsCbg2GzCJgDJMTDkBrwSqagr7rqQ49q6GZXBMMbrPeF4iy5t1msIdNhl87Ai4JhcwacO7pUwxvqphchpb/+Z7TKfTURe4Hhcw6cJbOb6q4b3GkJP3F7xpPm/CZAhQiiKkaviWYnLmqgX+5muSqiAtZlfVJHLUCeWSoxoyCcrhMyf8rVmAyVmh3W7TJTwm/b6LgMlZo9Vq6Saaijz/ZOPAZCSKsQKTkSjGCkxGohgLUvwFOBYW/Ol9cekAAAAASUVORK5CYII=') no-repeat;		\
	}		\
	.on-off-device.spinner {		\
	  background: url('data:image/gif;base64,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') no-repeat center;		\
	}		\
	.big-spinner {		\
	  background: url('data:image/gif;base64,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')  no-repeat center;\
	}		\
	#altui-grid {		\
		font-size: 12px;	\
	}				\
	#altui-grid th {		\
		font-size: 12px;	\
		text-transform: capitalize;	\
	}				\
	.altui-plugin-version {		\
		display: inline;	\
		width: 44px; \
		padding-left: 3px;	\
		padding-right: 3px;	\
	}				\
	.altui-device-icon {			\
		margin-left: 0px;	\
		margin-right: 0px;	\
		height: 50px;		\
		margin-top: 1px;	\
		width: 50px;		\
	}						\
	.altui-oscommand-configtbl th {		\
		text-transform: capitalize;		\
	}									\
	.table .table {					\
	background-color:transparent;	\
	}								\
";		


var LuaEditor = (function () {
	// 0: Lua code to edit
	var luaEditorModalTemplate = "<div id='luaEditorModal' class='modal fade'>";
	luaEditorModalTemplate += "  <div class='modal-dialog modal-lg'>";
	luaEditorModalTemplate += "    <div class='modal-content'>";
	luaEditorModalTemplate += "      <div class='modal-header'>";
	luaEditorModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
	luaEditorModalTemplate += "        <h4 class='modal-title'>LUA Editor</h4>";
	luaEditorModalTemplate += "      </div>";
	luaEditorModalTemplate += "      <div class='modal-body'>";
	luaEditorModalTemplate += "      	<div class='form-group'>";
	luaEditorModalTemplate += "      		<label for='altui-luacode-text'>Lua Code</label>";
	luaEditorModalTemplate += "      		<textarea id='altui-luacode-text' rows='10' class='form-control' placeholder='enter code here'>{0}</textarea>";
	luaEditorModalTemplate += "      	</div>";
	luaEditorModalTemplate += "      </div>";
	luaEditorModalTemplate += "      <div class='modal-footer'>";
	// luaEditorModalTemplate += "        <button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
	// luaEditorModalTemplate += "        <button type='button' class='btn btn-default altui-luacode-test' >"+_T("Test Code")+"</button>";
	// luaEditorModalTemplate += "        <button type='button' class='btn btn-primary altui-luacode-save' data-dismiss='modal'>"+_T("Save Changes")+"</button>";
	luaEditorModalTemplate += "      </div>";
	luaEditorModalTemplate += "    </div><!-- /.modal-content -->";
	luaEditorModalTemplate += "  </div><!-- /.modal-dialog -->";
	luaEditorModalTemplate += "</div><!-- /.modal -->";

	// $(".altui-mainpanel").append(luaEditorModalTemplate);
	
	return {
		openDialog: function(luacode, onSaveCB) {
			var dialog =  DialogManager.registerDialog( 'luaEditorModal', luaEditorModalTemplate.format( luacode ) )
			DialogManager.dlgAddDialogButton(dialog, false, _T("Close"), '', { 'data-dismiss':'modal'} );
			DialogManager.dlgAddDialogButton(dialog, false, _T("Test Code"),'altui-luacode-test');
			DialogManager.dlgAddDialogButton(dialog, true, _T("Save Changes"),'altui-luacode-save',{ 'data-dismiss':'modal'});
			dialog
				.on("click touchend",".altui-luacode-test",function(){ 
					var lua = $("#altui-luacode-text").val();
					MultiBox.runLua(0,lua, function(result) {
						alert(result);
					});
				})
				.on("click touchend",".altui-luacode-save",function(){ 
					// Save Callback
					var code = $("#altui-luacode-text").val();
					onSaveCB(code);
				});
			dialog.modal();
		}
	};
})();

var DialogManager = ( function() {
		
	function _optionsToString(options)
	{
		var tbl=[];
		options = $.extend( { },options);
		
		$.each( options, function(key,val) {
			var typ = Object.prototype.toString.call(val);
			if ((typ!="[object Object]") && (typ!="[object Array]")){
				tbl.push("{0}='{1}'".format(key,val)); 
			}
		});
		return tbl.join(' ');
	};
	
	// this method assumes htmlDialog id property is equal to 'name'
	function _registerDialog( name, htmlDialog ) {
		var dialog = $("div#dialogs div#"+name);
		if (dialog.length ==0) 
			$("div#dialogs").append(htmlDialog);
		else
			$(dialog).replaceWith(htmlDialog);
		dialog = $("div#dialogs div#"+name);
		// remove all callbacks for now
		$(dialog).off();			
		$("div#dialogs").off();
		return  dialog;
	};
	
	function _getActionParameterHtml( id, device, actionname, actiondescriptor, cbfunc )
	{
		if ($.isFunction( cbfunc )) {
			var Html="";
			var bFound = false;
			MultiBox.getDeviceActions(device,function( services ) {
				$.each(services, function(idx,service) {
					$.each(service.Actions, function(idx2,action) {
						if (action.name == actionname) {
							bFound = true;
							$.each(action.input, function(idx,param){
								var curvalue = actiondescriptor.params[param] || '';
								Html += ("	<label for='"+id+"-"+param+"'>"+param+"</label>");
								Html += ("	<input id='"+id+"-"+param+"' class='form-control' type='text' required value='"+curvalue+"' placeholder='enter parameter value'></input>");
							});
						}
						return !bFound;
					});
					return !bFound;
				});
				cbfunc("<div class='"+id+"'>"+Html+"</div>");
			});
		}
	};
	
	function _getDeviceServiceVariableSelect(device, service, variable) {
		// var device = MultiBox.getDeviceByID( deviceid );
		var select = $("<select id='altui-select-variable' class='form-control'></select>");
		if ((device!=null) && (device.altuiid!=NULL_DEVICE)) {
			$.each(device.states.sort(_sortByVariableName), function(idx,state) {
				select.append("<option value='{0}' {2}>{1}</option>".format(
					state.id,
					state.variable + " : ("+state.service+")",
					(service==state.service) && (variable==state.variable)? 'selected' : ''));
			});
		}
		return select.wrap( "<div></div>" ).parent().html();			
	};

	function _getDeviceActionSelect(id, device, actiondescriptor, cbfunc) {
		MultiBox.getDeviceActions(device,function( services ) {
			var select = $("<select required id='"+id+"' class='form-control'></select>");
			select.append("<option value='0' {0}>Select ...</option>".format( actiondescriptor.action==''? 'selected' : ''));
			$.each(services, function(idx,service) {
				var group = $("<optgroup label='"+service.ServiceId+"'></optgroup>");
				$.each(service.Actions, function(idx2,action) {
					var selected = "";
					if ((actiondescriptor.action==action.name) && (actiondescriptor.service==service.ServiceId))
						selected = 'selected';

					group.append("<option value='{0}' {2}>{1}</option>".format(
						service.ServiceId+"."+action.name,
						action.name,
						selected));
				});
				select.append(group);
			});

			_getActionParameterHtml( id+"-parameters",device, actiondescriptor.action, actiondescriptor, function(parameters){
				cbfunc( select.wrap( "<div></div>" ).parent().html() + parameters );
			});
		});
	};
		
	function _createSpinningDialog(message) {
				// 0: title, 1: body
		var defaultSpinDialogModalTemplate="";
		defaultSpinDialogModalTemplate = "<div id='dialogModal' class='modal' data-backdrop='static' data-keyboard='false'>";
		defaultSpinDialogModalTemplate += "  <div class='modal-dialog modal-sm'>";
		defaultSpinDialogModalTemplate += "    <div class='modal-content'>";
		defaultSpinDialogModalTemplate += "      <div class='modal-body'>";
		defaultSpinDialogModalTemplate += "      <div class='row-fluid'>";
		defaultSpinDialogModalTemplate += "      {0} {1}";
		defaultSpinDialogModalTemplate += "      </div>";
		defaultSpinDialogModalTemplate += "      </div>";
		defaultSpinDialogModalTemplate += "    </div><!-- /.modal-content -->";
		defaultSpinDialogModalTemplate += "  </div><!-- /.modal-dialog -->";
		defaultSpinDialogModalTemplate += "</div><!-- /.modal -->";
		return DialogManager.registerDialog('dialogModal',defaultSpinDialogModalTemplate.format( "<div class='big-spinner' style='height:70px;'></div>",message || ""));
	};
	
	function _confirmDialog(message,cbfunc) {
		var result = false;
		var warningpic = "<div class='altui-warningicon pull-left'>{0}</div>".format(questionGlyph);
		var dialog = DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 
								warningpic+_T("Are you Sure ?"), 			// title
								message						// body
								));
		DialogManager.dlgAddDialogButton(dialog, true, _T("Yes"));
		// buttons
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				result = true;
				dialog.modal('hide');
			})
			.off('hide.bs.modal',"div#dialogModal")
			.on( 'hide.bs.modal',"div#dialogModal", function() {
				if ($.isFunction(cbfunc))
					(cbfunc)(result);
			});

		dialog.modal({                    // wire up the actual modal functionality and show the dialog
		  "backdrop"  : "static",
		  "keyboard"  : true,
		  "show"      : true                     // ensure the modal is shown immediately
		});
		return result;
	};
	
	function _triggerDialog( trigger, controller, cbfunc ) {
		var dialog = DialogManager.createPropertyDialog(_T('Trigger'));
		var device = MultiBox.getDeviceByID( controller ,trigger.device);
		DialogManager.dlgAddLine( dialog , "TriggerName", _T("TriggerName"), trigger.name, "", {required:''} ); 
		DialogManager.dlgAddDevices( dialog , device ? device.altuiid : NULL_DEVICE, 
			function() {			// callback
				DialogManager.dlgAddEvents( dialog, "Events", "altui-select-events",device ? device.altuiid : NULL_DEVICE , trigger.template, trigger.arguments );
				$('div#dialogModal').modal();
			},
			function( device ) {	// filter
				return (MultiBox.controllerOf(device.altuiid).controller == controller);
			}
		);
		$('div#dialogs').on( 'submit',"div#dialogModal form",  function( event ) {	
			trigger.name = $("#altui-widget-TriggerName").val();
			trigger.enabled = 1;
			trigger.device = parseInt(MultiBox.controllerOf( $("#altui-select-device").val() ).id) ;
			trigger.template = $("#altui-select-events").val();
			trigger.arguments = [];
			$(".altui-arguments input").each( function(idx,elem)
			{
				var id = $(elem).prop('id').substring("altui-event-param".length);
				trigger.arguments.push( {id:id, value: $(elem).val() } );
			});
			// on UI7 10, for motion sensor which have no argument list in their  eventlist definition
			// it seems that passing at least {id:1} is mandatory 
			if (trigger.arguments.length==0)
				trigger.arguments.push( {id:1} );
			
			if ((trigger.device>0) && (trigger.template>0))
			{
				$('div#dialogModal').modal('hide');
				$(".modal-backdrop").remove();	// hack as it is too fast
				if ($.isFunction(cbfunc))
					(cbfunc)(trigger);
			}
		});
	}
	
	function _triggerUsersDialog(trigger,controller,cbfunc) {
		var dialog = DialogManager.createPropertyDialog(_T('Notify Users'));
		var users = MultiBox.getUsersSync(controller);
		var selectedusers = (trigger.users || "").toString().split(",");
		$.each(users, function(idx,user){
			var inarray  = $.inArray(user.id.toString(),selectedusers);
			DialogManager.dlgAddCheck(dialog,'user-'+user.id,(inarray!=-1),user.Name,'altui-notify-user');
		});
		$('div#dialogModal').modal();
		$('div#dialogs')	
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function(event) {
				var lines=[];
				$(".altui-notify-user").each(function(idx,check) {
					if ($(check).prop('checked')==true) {
						var id = $(check).prop('id').substring("altui-widget-user-".length)
						lines.push(id);
					}
				});
				if (lines.length>0)
					trigger.users = lines.join(",");
				else
					delete trigger.users;	// warning : in UI7 setting a empty string is not sufficient
				$('div#dialogModal').modal('hide');
				$(".modal-backdrop").remove();	// hack as it is too fast
				if ($.isFunction(cbfunc))
					(cbfunc)(event);
			});
	};
	
	function _createPropertyDialog(title)
	{
		var dialog =  DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 
								title, 			// title
								""				// body
							));
		DialogManager.dlgAddDialogButton(dialog, true, _T("Save Changes"));
		return dialog; 
	};
	
	function _dlgAddDialogButton(dialog, bSubmit, label, extraclass, extraattrs) {
		var html = "<button type='{0}' class='btn {2} {3}' {4} >{1}</button>".format( 
			(bSubmit ? 'submit' : 'button'),
			label,
			'btn-'+(bSubmit ? 'primary' : 'default'),
			(extraclass) ? extraclass : '',
			(extraattrs) ? _optionsToString(extraattrs) : ''
			)
		$(dialog).find(".modal-footer").append(html);
	};
	
	function _dlgAddCheck(dialog, name, value, label, extraclass)
	{
		var propertyline = "";
		// propertyline += "<div class='checkbox'>";
		propertyline +="<label class='checkbox-inline'>";
		propertyline +=("  <input type='checkbox' class='"+(extraclass || '')+"' id='altui-widget-"+name+"' " + ( (value==true) ? 'checked' : '') +" value='"+value+"' title='check to invert status value'>"+(label ? label : name));
		propertyline +="</label>";
		// propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};

	function _dlgAddDayOfWeek(dialog,name, label, value, _timerDOW)
	{
		//0:sunday
		var selected_days = value.split(',');
		var propertyline = "";
		propertyline += "<div class='form-group' id='altui-widget-"+name+"'>";
		propertyline += "	<label  title='"+name+"'>"+label+": </label>";
		$.each(_timerDOW, function(idx,element) {
			// propertyline += "<div class='checkbox'>";
			propertyline +="<label class='checkbox-inline'>";
			propertyline +=( "<input type='checkbox' id='altui-widget-"+name+element.value+"' " + ( ($.inArray(element.value.toString(),selected_days)!=-1) ? 'checked' : '') +" value='"+element.value+"' />"+element.text);
			propertyline +="</label>";
		});
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddColorPicker(dialog, name, label, help, value, options)
	{
		var optstr = _optionsToString(options);
		value = (value==undefined) ? '' : value ;
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<span title='"+(help || '')+"'>"+helpGlyph+"</span>";
		propertyline += "<input id='altui-widget-"+name+"' type='color' name='{0}' value='{1}' {2}></input>"
			.format(name,value,optstr);
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};

	function _dlgAddLine(dialog, name, label, value,help, options)
	{
		var optstr = _optionsToString($.extend( {type:'text'},options));
		value = (value==undefined) ? '' : value ;
		var placeholder = ((options !=undefined) && (options.placeholder==undefined)) ? "placeholder:'enter "+name+"'" : "";
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<span title='"+(help || '')+"'>"+helpGlyph+"</span>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value+"' "+placeholder+" ></input>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddSelect(dialog, name, label, value, lines, htmloptions)
	{
		var optstr = _optionsToString(htmloptions);
		value = (value==undefined) ? '' : value ;
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+name+"'>"+label+"</label>";
		propertyline += "	<select id='altui-widget-"+name+"' class='form-control' "+optstr+">";
		$.each(lines, function(idx,line){
			propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (value==line.value)?'selected':'');
		})
		propertyline += "</select>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};	

	function _dlgAddTimeInterval(dialog, name, label, value, lines)
	{
		var unit = (value||' ').slice(-1);
		var value = parseInt(value);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title=''>"+label+"</label>";
		propertyline += "	<div class='form-inline'>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' type='number' value='"+value+"' placeholder='enter "+name+"' ></input>";
		propertyline += "	<select id='altui-widget-"+name+"Unit' class='form-control' >";
		$.each(lines, function(idx,line){
			propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (unit==line.value)?'selected':'');
		})
		propertyline += "</select>";
		propertyline += "</div>";	// form inline
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddTime(dialog, name, value, _timerRelative)
	{
		function _decomposeTimer( value ) {
			var iKind = 0;
			var newvalue = '';
			if (value.substring(0,8)=="00:00:00") {
				newvalue = "00:00:00";
				if (value.slice(-1)=="R") {
					iKind=1;
				}
				else if (value.slice(-1)=="T")
					iKind=4;
				else
					iKind=0;
			} else {
				if (value.substring(0,1)=="-") {
					if (value.slice(-1)=="R") {
						iKind=2;
						newvalue = value.substr(1,value.length-2);
					}
					else if (value.slice(-1)=="T") {
						iKind=5;
						newvalue = value.substr(1,value.length-2);
					}
					else {
						iKind=0;
						newvalue = value.substr(1,value.length-1);
					}
				}
				else {
					if (value.slice(-1)=="R") {
						iKind=3;
						newvalue = value.substr(0,value.length-1);
					}
					else if (value.slice(-1)=="T") {
						iKind=6;
						newvalue = value.substr(0,value.length-1);
					}
					else {
						iKind=0;
						newvalue = value;
					}
				}
			}	
			return 	{ value: newvalue, iKind: iKind };
		};
		
		var pattern = "^[0-2][0-9][:]{1}[0-5][0-9][:][0-5][0-9]$"; 
		var res = _decomposeTimer((value==undefined) ? '' : value );
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='hh:mm:ss'>"+name+"</label>";
		propertyline += "	<span title='hh:mm:ss'>"+helpGlyph+"</span>";
		propertyline += "	<div class='form-inline'>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' pattern='"+pattern+"' value='"+res.value+"' placeholder='hh:mm:ss' ></input>";
		propertyline += "	<select id='altui-widget-type-"+name+"' class='form-control' >";
		$.each(_timerRelative, function(idx,line){
			propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (idx==res.iKind)?'selected':'');
		})
		propertyline += "</select>";
		propertyline += "</div>";	// form inline
		propertyline += "</div>";	// form group
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddTimer(dialog, name, label, value, htmloptions )
	{
		var optstr = _optionsToString(htmloptions);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='Date Time'>"+(label ? label : name)+"</label>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' type='time' value='"+value+"' placeholder='absolute time' "+optstr+"></input>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddDateTime(dialog, name, value )
	{
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='Date Time'>"+name+"</label>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' type='datetime-local' value='"+value+"' placeholder='absolute time' ></input>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	

	function _dlgAddVariables(dialog, widget, cbfunc)
	{
		$("#altui-select-device").on("change",function() {
			widget.properties.deviceid = $("#altui-select-device").val();
			var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
			$("#altui-select-variable").replaceWith( _getDeviceServiceVariableSelect( device , widget.properties.service, widget.properties.variable ) );
		});
		
		//service & variables
		widget.properties.deviceid = $("#altui-select-device").val();
		var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-servicevariable'>Variable</label>";
		propertyline +=     _getDeviceServiceVariableSelect( device , widget.properties.service, widget.properties.variable );
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
		cbfunc();
	};
	
	function _dlgAddDevices(dialog, deviceid, cbfunc, filterfunc)
	{
		var select = $("<select id='altui-select-device' class='form-control'></select>");
		select.append("<option value='0' {0}>Select ...</option>".format( deviceid==NULL_DEVICE ? 'selected' : ''));
		MultiBox.getDevices( 
			function(idx,device) {
				select.append('<option value={0} {3}>{1} -- #{2}</option>'.format( device.altuiid, device.name, device.altuiid, deviceid==device.altuiid ? 'selected' : ''));
			},
			$.isFunction(filterfunc) ? filterfunc : null,
			function () {
				// all devices are enumarated
				var propertyline = "";
				propertyline += "<div class='form-group'>";
				propertyline += "	<label for='altui-widget-device'>"+_T("Device")+"</label>";
				propertyline +=     select.wrap( "<div></div>" ).parent().html();
				propertyline += "</div>";
				
				$(dialog).find(".row-fluid").append(propertyline);
				cbfunc();
			}
		);
	};
	
	function _dlgAddScenes(dialog, widget, cbfunc)
	{
		var select = $("<select id='altui-widget-sceneid' class='form-control'></select>");
		select.append("<option value='0' {0}>Select ...</option>".format( widget.properties.sceneid==NULL_SCENE ? 'selected' : ''));
		MultiBox.getScenes( 
			function(idx, scene) {
				select.append('<option value={0} {2}>{1}</option>'.format( scene.altuiid, scene.name, widget.properties.sceneid==scene.altuiid ? 'selected' : ''));				
			}, 
			null, 
			function(scenes) {
				var propertyline = "";
				propertyline += "      	<div class='form-group'>";
				propertyline += "      		<label for='altui-widget-sceneid'>Scene to Run</label>";
				propertyline += 			select.wrap( "<div></div>" ).parent().html();
				propertyline += "      	</div>";
				$(dialog).find(".row-fluid").append(propertyline);
				cbfunc();
			} 
		);
	};

	function _getDialogActionValue(id)
	{
		var val = $("#"+id).val().split('.');
		return {
			service: val[0],
			action: val[1]
		};
	};
	
	function _dlgAddEvents(dialog, label, htmlid, deviceid, eventid, args)
	{
		var selected_event = null;

		function _findArgumentValue(args,id,defaultValue) {
			var value='';
			$.each(args,function(idx,arg) {
				if (arg.id==id) {
					value = (arg.value!=undefined) ? arg.value : defaultValue; 
					return false;
				}
			});
			return value;
		};
		
		function _getSelectForEvents( events ) {
			var select = $("<select required id='"+htmlid+"' class='form-control'></select>");
			select.append("<option value='0' {0}>Select ...</option>".format( eventid==0 ? 'selected' : ''));
			selected_event = null;
			$.each(events, function(idx,event){
				var selected = '';
				if (eventid==event.id) {
					selected_event = event;
					selected = 'selected';
				}
				select.append("<option value='{0}' {2}>{1}</option>".format(
					event.id,
					event.label.text,
					selected));
			});
			return select.wrap( "<div></div>" ).parent().html();
		};

		function _getEventArguments( selected_event, args ) {
			var propertyline="";
			if ((selected_event!=null) && (selected_event.argumentList)) 
			{
				$.each(selected_event.argumentList, function(idx,eventarg) {
					propertyline += "<div class='form-group'>";
					propertyline += "	<label for='altui-event-param{0}'>{1} {2}</label>".format(idx,eventarg.name,eventarg.comparisson);
					propertyline += "	<input required id='altui-event-param{0}' type='text' class='form-control' value='{1}' placeholder='default to {2}'></input>"
						.format(eventarg.id, _findArgumentValue(args,eventarg.id,eventarg.defaultValue), eventarg.defaultValue );
					propertyline += "</div>";
					// (argument.value !=undefined) ? argument.value : eventarg.defaultValue );	
				});
			} 
			return propertyline;
		}
		
		//callback, if select device changes, we need to update actions
		$("#altui-select-device").on("change",function() {
			deviceid = $(this).val();
			args=[];
			eventid=0;
			selected_event = null;
			var device = MultiBox.getDeviceByAltuiID( deviceid );
			var events = MultiBox.getDeviceEvents(device);
			$("select#"+htmlid).replaceWith( _getSelectForEvents( events ) );
			$(".altui-arguments").html( _getEventArguments(selected_event, args) );
		});
		
		$('div#dialogModal').on("change","#"+htmlid,function() {
			args=[];
			eventid=$(this).val();
			selected_event = null;
			var device = MultiBox.getDeviceByAltuiID( deviceid );
			var events = MultiBox.getDeviceEvents(device);
			$.each(events, function(idx,event){
				if (eventid==event.id) {
					selected_event = event;
				}
			});
			$(".altui-arguments").html( _getEventArguments(selected_event, args) );
		});
		
		var device = MultiBox.getDeviceByAltuiID( deviceid );
		var events = MultiBox.getDeviceEvents(device);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='"+htmlid+"'>"+label+"</label>";
		propertyline +=     _getSelectForEvents(events);
		propertyline += "</div>";
		
		propertyline += "<div class='altui-arguments'>";
		propertyline += _getEventArguments( selected_event , args );
		propertyline += "</div>";
		
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddActions(id, dialog,widget,actiondescriptor,label, cbfunc)
	{
		// callback when select of actions is changed
		function _onChangeAction(event)
		{
			var id = $(this).prop('id');
			$.extend( actiondescriptor , _getDialogActionValue(id) );
			widget.properties.deviceid = $("#altui-select-device").val();
			_getActionParameterHtml( 
				id+"-parameters",
				MultiBox.getDeviceByAltuiID(widget.properties.deviceid), 
				actiondescriptor.action, 
				actiondescriptor, 
				function(html) {
					$("."+id+"-parameters").replaceWith(html);
				}
			);
		};
		
		//callback, if select device changes, we need to update actions
		$("#altui-select-device").on("change",function() {
			widget.properties.deviceid = $("#altui-select-device").val();
			actiondescriptor.service = '';
			actiondescriptor.action = '';
			$("."+id+"-parameters").remove();
			var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
			_getDeviceActionSelect( id, device , actiondescriptor, function (result) {
				$("#"+id).replaceWith( result );
				$("#"+id).on("change", _onChangeAction );
			});
		});
			
		// get actions for the selected device
		var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		_getDeviceActionSelect( id, device , actiondescriptor, function (result) {
			//result is a select with all the actions
			var propertyline = "";
			propertyline += "<div class='form-group'>";
			propertyline += "	<label for='"+id+"'>"+label+"</label>";
			propertyline +=     result;
			propertyline += "</div>";
			
			$(dialog).find(".row-fluid").append(propertyline);
			
			//callback, if select action changes, we need to update parameters
			$("#"+id).on("change", _onChangeAction );
			cbfunc();
		});
	};

		
	return {
		registerDialog : _registerDialog,		// name, html
		createSpinningDialog: _createSpinningDialog,
		confirmDialog: _confirmDialog,
		triggerDialog: _triggerDialog,
		triggerUsersDialog: _triggerUsersDialog,
		createPropertyDialog:_createPropertyDialog,
		dlgAddDialogButton: _dlgAddDialogButton,	// (dialog, bSubmit, label)
		dlgAddCheck:_dlgAddCheck,
		dlgAddColorPicker : _dlgAddColorPicker,	//(dialog, name, label, help, value, options)
		dlgAddLine:_dlgAddLine,
		dlgAddSelect: _dlgAddSelect,
		dlgAddVariables:_dlgAddVariables,
		dlgAddDevices:_dlgAddDevices,
		dlgAddScenes:_dlgAddScenes,
		dlgAddActions:_dlgAddActions,
		dlgAddEvents:_dlgAddEvents,		
		dlgAddDayOfWeek:_dlgAddDayOfWeek,
		dlgAddTimer: _dlgAddTimer,
		dlgAddTimeInterval: _dlgAddTimeInterval,
		dlgAddDateTime:_dlgAddDateTime,
		dlgAddTime:_dlgAddTime,
		getDialogActionValue: _getDialogActionValue
	};
})();


//=====================================================================		
// Scene Editor
//=====================================================================		

//helper formatting functions
function _formatAction(controller,action) {
	function _displayDevice(controller,deviceid) {
		var device = MultiBox.getDeviceByID(controller,deviceid);
		return device.name + "<small class='text-muted'> (#"+device.altuiid+")</small>";
	};
	function _displayArguments(Thearguments) {
		var html=[];
		$.each(Thearguments, function(idx,arg) {
			html.push("{0}: {1}".format( arg.name, arg.value));
		});
		return html.join(',');
	};
	return {
		device:_displayDevice(controller,action.device),
		action:action.action,
		arguments:_displayArguments(action.arguments)
	}
};

function _formatTrigger(controller,trigger)
{
	function _findEventFromTriggerTemplate(controller,device,template)
	{
		var devtype = device.device_type;
		var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);
		var event = null;
		$.each( _devicetypesDB[devtype].ui_static_data.eventList2, function( idx,e) {
			if (e.id == template) {
				event = e;
				return false;
			}
		});
		return event;
	};
	var line = {};
	var deviceid = trigger.device;
	var device = MultiBox.getDeviceByID(controller,deviceid);
	var event = _findEventFromTriggerTemplate( controller,device, trigger.template );
	line.name = trigger.name;
	line.device = device.name + "<small class='text-muted'> (#"+device.altuiid+")</small>";
	line.descr = event.label.text.replace("_DEVICE_NAME_","<b>"+device.name+"</b>");
	line.condition = "";
	line.lastrun = trigger.last_run ? _toIso(new Date(trigger.last_run*1000)," ") : "";
	
	if (trigger.arguments && event.argumentList)  {
		$.each(trigger.arguments, function( idx,argument) {
			var id = argument.id;
			var eventargtemplate = null;
			$.each(event.argumentList, function(idx,eventarg) {
				if (eventarg.id==id)
				{
					line.condition +="{0} {1} {2}".format(
						eventarg.name,
						eventarg.comparisson,
						(argument.value !=undefined) ? argument.value : eventarg.defaultValue );	
					return false;	// we had a match
				}				
			});
		});
	} else {
		var lines = [];
		if (event.serviceStateTable)
			$.each(event.serviceStateTable, function(key,serviceState){
				lines.push("{0} {1} {2}".format( key, serviceState.comparisson, serviceState.value));					
			});
		line.condition += lines.join(" AND ");
	}

	return line;
};

var SceneEditor = function (scene) {
	var xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-xs' aria-label='tbd' title='{3}'>{2}</button>";
	var jsonButton = xsbuttonTemplate.format('','altui-toggle-json pull-right','json','json');
	var _timerTypes = [
		{value:0,text:_T('**Illegal**')},
		{value:1,text:_T('interval')},
		{value:2,text:_T('day of week')},
		{value:3,text:_T('day of month')},
		{value:4,text:_T('absolute')}
	];
	var _timerDOW = [
		{value:1,text:_T('Mo')},
		{value:2,text:_T('Tu')},
		{value:3,text:_T('We')},
		{value:4,text:_T('Th')},
		{value:5,text:_T('Fr')},
		{value:6,text:_T('Sa')},
		{value:7,text:_T('Su')}
	];
	var _timerRelative = [
		{value:"{0}",text:_T('At a certain time of day')},
		{value:"00:00:00R",text:_T('At sunrise')},
		{value:"-{0}R",text:_T('Before sunrise')},
		{value:"{0}R",text:_T('After sunrise')},
		{value:"00:00:00T",text:_T('At sunset')},
		{value:"-{0}T",text:_T('Before sunset')},
		{value:"{0}T",text:_T('After sunset')}
	];

	var scenealtuiid = scene.altuiid;
	var scenecontroller = MultiBox.controllerOf(scene.altuiid).controller;

	function _makeAltuiid(controllerid,id) {
		return controllerid+"-"+id;
	}
	// trigger do not have IDs so use array index
	function _displayTrigger(trigger,idx) {
		function _displayTriggerUsers(trigger) {
			var lines=[];
			if (trigger.users)
				$.each(trigger.users.toString().split(","), function(idx,userid) {
					var user  =  MultiBox.getUserByID(scenecontroller,userid);
					lines.push(user.Name);
				});
			var html ="";
			html += lines.join(", ");
			return html;
		}
		function _displayTriggerRestrictions(trigger) {
			var html ="";
			if (trigger.days_of_week) {
				var res = $.map( trigger.days_of_week.split(','), function (day) { return _timerDOW[parseInt(day)-1].text; });
				html += res.join(',');
			}
			if (trigger.start_time && trigger.stop_time)
				html += ("[{0}-{1}]".format(trigger.start_time,trigger.stop_time));
			return html;
		};
				
		var html="";
		var triggerinfo = _formatTrigger(scenecontroller,trigger);
		html +="<tr data-trigger-idx='"+idx+"'>";
		html +="<td>";
		html +="<input type='checkbox' {0} class='altui-enable-trigger' id='{1}'></input>".format( trigger.enabled==true ? 'checked' : '',idx);
		html +="</td>";

		html +="<td>";
		html +="<b>{0}</b>".format(triggerinfo.name);
		html +="</td>";

		html +="<td>{0}</td><td>{1}</td>".format(
			triggerinfo.device,
			triggerinfo.descr);
		html +="<td><small>";
		html += triggerinfo.condition;
		html +="</small></td>";		

		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-triggertimerestrict', "<span class='glyphicon glyphicon-time "+(trigger.days_of_week ? 'text-success' : '' ) +"' aria-hidden='true'></span>",_displayTriggerRestrictions(trigger));
		html += smallbuttonTemplate.format( idx, 'altui-trigger-users', "<span class='glyphicon glyphicon-user "+(trigger.users ? 'text-success' : '' ) +"' aria-hidden='true'></span>",_displayTriggerUsers(trigger));
		html +="</td>";
		
		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-luatrigger', "<span class='glyphicon glyphicon-flash' aria-hidden='true'>Lua</span>",trigger.lua);
		html +="</td>";
		
		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-deltrigger', deleteGlyph,'Delete trigger');
		html += smallbuttonTemplate.format( idx, 'altui-edittrigger', editGlyph, 'Edit trigger');
		html +="</td>";
		html +="</tr>";
		return html;
	};

	function _editTrigger( triggeridx , jqButton) {
		//Object {name: "blw 2", enabled: 1, template: 2, device: 5, arguments: Array[1]…}LastEval: 0arguments: Array[1]device: 5enabled: 1last_run: 1424626243lua: "return false"name: "blw 2"template: 2
		var trigger = (triggeridx!=-1) 
		? scene.triggers[ triggeridx ] 
		: {
			name:'',
			enabled:1,
			template:'',
			device:0,
			arguments:[],
			lua:''
		};
		
		DialogManager.triggerDialog( trigger, scenecontroller, function() {
			// now update the UI
			if (triggeridx>=0) {
				$("tr[data-trigger-idx="+triggeridx+"]").replaceWith( _displayTrigger(trigger,triggeridx) );
			} else {
				scene.triggers.push( trigger );
				var parent = $(jqButton).closest("tr")
				parent.before(  _displayTrigger(trigger,scene.triggers.length-1) );
			}
			_showSaveNeeded();
		} );
	};
	
	function _displayJson(type,obj) {
		return "<pre id='altui-json-"+type+"' class='altui-json-code'>"+JSON.stringify( obj )+"</pre>";
	};
	
	function _displayTimer(timer) {
		var html="";
		html +="<tr>";
		html +="<td>";
		html +="<input type='checkbox' {0} class='altui-enable-timer' id='{1}'></input>".format( timer.enabled==true ? 'checked' : '', timer.id);
		html +="</td>";
		html +="<td>";
		html +="<b>{0}</b>".format(timer.name);
		html +="</td>";
		html +="<td>";
		switch( parseInt(timer.type) ) {
			case 1:
				// h for hour m for minutes
				html += "{0}: {1}".format( _timerTypes[timer.type].text, timer.interval);
				break;
			case 2:
				// T sunset , R sunrise ,  <0 before , >0 after
				// day of week : sunday = 0
				html += "{0}: {1} h:m:s= [{2}]".format( _timerTypes[timer.type].text, timer.days_of_week, timer.time );
				break;
			case 3:
				// T sunset , R sunrise ,  <0 before , >0 after
				// days of month is a csv list
				html += "{0}: {1} h:m:s= [{2}]".format( _timerTypes[timer.type].text, timer.days_of_month, timer.time);
				break;
			case 4:
				html += "{0}: {1} ".format( _timerTypes[timer.type].text, timer.abstime);
				break;
			default:
				html+= JSON.stringify(timer);
		}
		html +="</td>";
		html +="<td>";
		html += smallbuttonTemplate.format( timer.id, 'altui-deltimer', deleteGlyph,'Delete timer');
		html += smallbuttonTemplate.format( timer.id, 'altui-edittimer', editGlyph,'Edit timer');
		html +="</td>";
		html +="</tr>";
		//todo enabled , last_run , next_run
		return html;
	};
	
	function _findTimerById( scene, timerid ) {
		var timer = null;
		if (scene.timers) {
			$.each(scene.timers, function( idx,_timer) {	
				if (_timer.id == timerid) {
					timer = _timer;
					return false;
				}
			});
		}
		return timer;
	};
	
	function _editTriggerUsers( triggeridx, jqButton ) {
		var trigger = scene.triggers[ triggeridx ];
		DialogManager.triggerUsersDialog(trigger,scenecontroller,function() {
			$(".altui-trigger-users").find(".glyphicon").toggleClass("text-success",(trigger.users!=undefined));
			_showSaveNeeded();
		});
	};
	
	function _editTriggerRestrict( triggeridx, jqButton ) {
		function _hideShowControls(  ) {
			var bViewOthers = $("#altui-widget-RestrictTrigger").prop('checked');
			$("#altui-widget-StartTime").closest(".form-group").toggle(bViewOthers);
			$("#altui-widget-StopTime").closest(".form-group").toggle(bViewOthers);
			$("#altui-widget-TimerDayOfWeek").closest(".form-group").toggle(bViewOthers);
		};

		var trigger = scene.triggers[ triggeridx ];
		if (trigger.start_time)
			trigger.start_time = trigger.start_time.fromHHMMSS().toString().toHHMMSS();
		if (trigger.stop_time)
			trigger.stop_time = trigger.stop_time.fromHHMMSS().toString().toHHMMSS();

		var dialog = DialogManager.createPropertyDialog(_T('Trigger Restriction'));
		DialogManager.dlgAddCheck(dialog,'RestrictTrigger',(trigger.days_of_week !=undefined),_T('Restrict trigger based on certain times'));
		DialogManager.dlgAddDayOfWeek(dialog, "TimerDayOfWeek", _T("TimerDayOfWeek"), trigger.days_of_week || '' , _timerDOW);
		DialogManager.dlgAddTimer(dialog, "StartTime", _T("Start Time"), trigger.start_time);
		DialogManager.dlgAddTimer(dialog, "StopTime", _T("Stop Time"),trigger.stop_time);
		$('div#dialogModal').modal();
		_hideShowControls();
		
		$('div#dialogs')	
			.off( 'change',"input#altui-widget-RestrictTrigger")
			.on( 'change',"input#altui-widget-RestrictTrigger", function() {
				_hideShowControls();
			})
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				if ($("#altui-widget-RestrictTrigger").prop('checked')==false) {
					trigger.start_time=undefined;
					trigger.stop_time=undefined;
					trigger.days_of_week=undefined;
				} else 
				{
					var tmp = $("#altui-widget-TimerDayOfWeek input:checked").map( function(idx,elem){ return $(elem).val() });
					trigger.days_of_week = $.makeArray(tmp).join(",");
					if (trigger.days_of_week =="") {
						trigger.start_time=undefined;
						trigger.stop_time=undefined;
						trigger.days_of_week=undefined;
					} else {
						trigger.start_time  =$("#altui-widget-StartTime").val();
						trigger.stop_time  =$("#altui-widget-StopTime").val();
					}
				}
				$(".altui-triggertimerestrict").find(".glyphicon").toggleClass("text-success",(trigger.days_of_week!=undefined));
				$('div#dialogModal').modal('hide');
				_showSaveNeeded();
			});
		};
	
	function _editTimer( timerid, jqButton ) 	{
		var _timerUnits = [
			{value:'h',text:'h'},
			{value:'m',text:'m'}
		];

		function _formatRFC3339Date(str) {	//2011-12-21T11:33:23Z
			if (str && str!='')
			{
				var datetime = str.split(' ');
				var ymd = datetime[0].split('-');
				var hms = datetime[1].split(':');
				str = ymd[0] + '-'
					+ ('00'+ymd[1]).slice(-2) + '-'
					+ ('00'+ymd[2]).slice(-2)
					+ 'T'
					+ ('00'+hms[0]).slice(-2) + ':'
					+ ('00'+hms[1]).slice(-2) + ':'
					+ ('00'+hms[2]).slice(-2);
			}
			return str;
		};
		
		function _getNewTimerID() {
			var max = 0;
			if (scene.timers) {
				$.each(scene.timers, function (idx,timer) {
					max = Math.max(max, timer.id);
				})
			}
			return ++max;
		};
		function _getTimerTime() {
			var template = $("#altui-widget-type-TimerTime").val();
			var val = $("#altui-widget-TimerTime").val();
			if (val=='')
				val = "00:00:00";
			return template.format( val );
		};
		
		function _showHideItems( timertype ) {
			switch (parseInt(timertype)) {
				case 1:	// interval
					$("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit")
						.closest("div.form-group").show();
					$("#altui-widget-TimerDayOfWeek, #altui-widget-TimerDayOfMonth, #altui-widget-TimerTime, #altui-widget-TimerDateTime")
						.closest("div.form-group").hide();
					$("#altui-widget-TimerDateTime").val("");
					break;
				case 2: // day of week
					$("#altui-widget-TimerDayOfWeek,#altui-widget-TimerTime")
						.closest("div.form-group").show();
					$("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit, #altui-widget-TimerDayOfMonth, #altui-widget-TimerDateTime")
						.closest("div.form-group").hide();
					$("#altui-widget-TimerDateTime").val("");
					break;
				case 3:	// day of month
					$("#altui-widget-TimerDayOfMonth, #altui-widget-TimerTime")
						.closest("div.form-group").show();
					$("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit, #altui-widget-TimerDayOfWeek, #altui-widget-TimerDateTime")
						.closest("div.form-group").hide();
					$("#altui-widget-TimerDateTime").val("");
					break;
				case 4:
					$("#altui-widget-TimerDateTime")
						.closest("div.form-group").show();
					$("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit,#altui-widget-TimerDayOfWeek, #altui-widget-TimerDayOfMonth, #altui-widget-TimerTime")
						.closest("div.form-group").hide();
					break;
				case 0:
				default:
			}
		};
		
		//{"id":1,"name":"Interval","type":1,"enabled":1,"interval":"3h","last_run":1427346180,"next_run":1427363702}
		var timer = (timerid!=-1) ? _findTimerById( scene, timerid ) : {
			id: _getNewTimerID(),
			enabled: 1,
			name: 'new timer',
			type: 1,
			interval: '1h'
		};
		var dialog = DialogManager.createPropertyDialog(_T('Timer'));
		DialogManager.dlgAddLine( dialog , "TimerName", _T("TimerName"), timer.name, "", {required:''} ); 
		DialogManager.dlgAddSelect(dialog, "TimerType", _T("TimerType"), timer.type, _timerTypes, {required:''});
		DialogManager.dlgAddTimeInterval(dialog, "TimerInterval",_T("TimerInterval"),timer.interval, _timerUnits);
		DialogManager.dlgAddDayOfWeek(dialog, "TimerDayOfWeek", _T("TimerDayOfWeek"), timer.days_of_week || '' , _timerDOW);
		DialogManager.dlgAddLine(dialog, "TimerDayOfMonth", _T("TimerDayOfMonth"), timer.days_of_month || '' ,"nn,nn,nn", {
			pattern:'^[0-9]+(,[0-9]+)*$',
			placeholder:'Enter comma separated numbers: nn,nn,nn'
		});
		DialogManager.dlgAddTime(dialog, "TimerTime", timer.time || '' ,_timerRelative);
		DialogManager.dlgAddDateTime(dialog, "TimerDateTime", _formatRFC3339Date(timer.abstime || ''));
		$('div#dialogModal').modal();
		_showHideItems( timer.type );
		
		$('div#dialogs')
			.on( 'change',"div#dialogModal #altui-widget-TimerType", function() {
				_showHideItems( $(this).val() );
			})
			.on( 'submit',"div#dialogModal form", 
				{  button: jqButton },
				function( event ) {
					// save for real this time
					timer.name = $("#altui-widget-TimerName").val();
					timer.type = parseInt($("#altui-widget-TimerType").val());
					switch( timer.type ) {
						case 1:	// interval
							var val = $("#altui-widget-TimerInterval").val();
							if (val=='')
								return;
							timer.interval = $("#altui-widget-TimerInterval").val()+$("#altui-widget-TimerIntervalUnit").val();
							break;						
						case 2:	// day of week
							var tmp = $("#altui-widget-TimerDayOfWeek input:checked").map( function(idx,elem){ return $(elem).val() });
							timer.days_of_week = $.makeArray(tmp).join(",");
							timer.time = _getTimerTime();
							break;
						case 3:	// day of month
							timer.days_of_month = $("#altui-widget-TimerDayOfMonth").val();
							if (timer.days_of_month=='')
								return;
							timer.time = _getTimerTime();
							break;
						case 4:
							timer.abstime = $("#altui-widget-TimerDateTime").val().replace('T',' ');
							if (timer.abstime=='')
								return;
							break;
						case 0:
						default:
							return;
					}
					$('div#dialogModal').modal('hide');
					var parent = $(event.data.button).closest("tr");
					if (timerid>=0) {
						// edit
						parent.replaceWith( _displayTimer(timer) );
					} else {
						// addition
						scene.timers.push( timer );
						parent.before( _displayTimer(timer) );
					}
					_showSaveNeeded();
				}
			);
	};
	
	function _displayAction(action,ida,idg) {
		var actioninfo = _formatAction(scenecontroller,action);
		var html="";
		html +="<tr>";
		html += "<td>{0}</td><td>{1} (<small class='text-muted'>{2}</small>)</td>".format(
			actioninfo.device,			// _displayDevice(action.device),
			actioninfo.action,			// action.action, 
			actioninfo.arguments		//_displayArguments(action.arguments)
		);
		html +="<td>";
		html += smallbuttonTemplate.format( "{0}.{1}".format(idg,ida), 'altui-delaction', deleteGlyph, 'Delete Action');
		html += smallbuttonTemplate.format( "{0}.{1}".format(idg,ida), 'altui-editaction', editGlyph, 'Edit Action');
		html +="</td>";
		html +="</tr>";
		return html;
	};
	
	function _editAction(scene, action, ida, idg, jqButton) {
		function _translateArgumentsToTbl( Thearguments ) {
			var res = [];
			$.each(Thearguments, function(idx,arg) { res[arg.name] = arg.value; } );
			return res;
		};
		
		var dialog = DialogManager.createPropertyDialog(_T('Action'));
		var device = MultiBox.getDeviceByID(scenecontroller,action.device);
		DialogManager.dlgAddDevices( dialog , device ? device.altuiid : NULL_DEVICE , 
			function() {		// callback 
				var widget = {
					properties: {
						deviceid: device ? device.altuiid : NULL_DEVICE,
						action: {
							service:action.service,
							action:action.action,
							params:_translateArgumentsToTbl(action.arguments)
						}
					}
				};
				DialogManager.dlgAddActions("altui-select-action",dialog, widget, widget.properties.action, _T('Action'), function() {
					$('div#dialogModal').modal();
				});
			},
			function( device ) {		// filter
				return (MultiBox.controllerOf(device.altuiid).controller == scenecontroller);
			}
		);
		
		$('div#dialogs')
			.on( 'submit',"div#dialogModal form", 
			{ scene: scene, button: jqButton },
			function( event ) {
				// save for real this time
				action.device = parseInt(MultiBox.controllerOf( $("#altui-select-device").val() ).id );
				action = $.extend(action , DialogManager.getDialogActionValue("altui-select-action") );
				action.arguments = [];
				// read params
				$(".altui-select-action-parameters input").each( function(idx,elem) {
					action.arguments.push({
						name: $(elem).prop('id').substring( "altui-widget-action-parameters-".length ),
						value: $(elem).val()
					});
				} );		
				if ((action.device>0) && (action.action!=""))
				{
					$('div#dialogModal').modal('hide');
					
					// now update UI
					// var ids = $(event.data.button).prop("id").split(".");	// groupidx.actionidx
					var parent = $(event.data.button).closest("tr");
					if (ida>=0) {
						//edit
						parent.replaceWith( _displayAction(action,ida,idg) );
					}
					else {
						//add
						scene.groups[ idg ].actions.push( action );
						parent.before( _displayAction(action,scene.groups[ idg ].actions.length - 1 ,idg) );
					}
					_showSaveNeeded();
				}
			}
		);
	};
		
	function _displayGroup(group,idx) {
		var hours = parseInt( group.delay / 3600 ) % 24;
		var minutes = parseInt( group.delay / 60 ) % 60;
		var seconds = group.delay % 60;
		var result = "";
		if (group.delay>=3600)
			result += hours + "h ";
		if (group.delay>=60)
			result +=  minutes + "m ";
		result += seconds +"s ";
		var html="";
		html += "<tr data-group-idx='"+idx+"'>";
		html += "<td>";
		html +="<h4>{0}</h4>".format(result);
		// html += "</td>";
		// html +="<td>";
		if (idx>0) {
			// Group IDX 0 : is the "Immediate" group, it cannot be deleted
			html += smallbuttonTemplate.format( idx, 'altui-delgroup', deleteGlyph, 'Delete group');
			html += smallbuttonTemplate.format( idx, 'altui-editgroup', editGlyph, 'Edit group');
		}
		html +="</td>";			
		html += "<td>";
		html +="<table class='table table-condensed' data-group-idx='"+idx+"'>";
		html +="<tbody>";
		$.each(group.actions, function(ida,action) {
			html += _displayAction(action,ida,idx);
		});
		html +=("<tr><td colspan='3'>"+smallbuttonTemplate.format( idx, 'altui-addaction', plusGlyph,_T('Action'))+" "+_T('Action')+"</td></tr>");
		html +="</tbody>";
		html +="</table>";
		html += "</td>";

		html += "</tr>";
		return html;
	};

	function _editGroup( idx,  group , _button ) {
			var dialog = DialogManager.createPropertyDialog(_T('Scene Action Group'));
			// DialogManager.dlgAddLine(dialog, "Delay", _T("Delay"),group.delay ,"delay in seconds",{
				// type:'number',
				// min:1,
				// required:''
			// });
			DialogManager.dlgAddTimer(dialog, _T("Delay"), null, group.delay.toString().toHHMMSS(), {
				step: 1
			});
			$('div#dialogs')
				.on( 'submit',"div#dialogModal form", 
					{ scene: scene, group:group, button:_button },
					function( event ) {
						// save for real this time
						var duration = $("#altui-widget-Delay").val().fromHHMMSS();
						var bOK = true;
						$.each(scene.groups, function(ifx,grp) {
							if (grp.delay == duration)	// cannot have twice the same duration
							{
								bOK = false; 
								return false;
							}
						});
						if (bOK==false) {
							alert("cannot have twice the same duration");
							return ;
						}
						$('div#dialogModal').modal('hide');
						var group  = event.data.group;
						group.delay = duration;
						
						// now update UI
						var parent = event.data.button.closest("tr");
						if (idx>0) {
							// Edit
							parent.replaceWith( _displayGroup(group,idx) );
						} else {
							// Add 
							scene.groups.push( group );
							parent.before( _displayGroup(group,scene.groups.length-1) );
						}
						_showSaveNeeded();
					});
			$('div#dialogModal').modal();
		};
		
	function _showSaveNeeded( bNoSaveNeeded ) {
		if (bNoSaveNeeded == true)
			$(".altui-scene-editbutton").removeClass("btn-danger").addClass("btn-default");
		else
			$(".altui-scene-editbutton").removeClass("btn-default").addClass("btn-danger");
		_updateAccordeonHeaders();
	};

	function _sceneEditDraw() {
		// var htmlSceneAddButtonTmpl = "  <button type='submit' class='btn btn-default {0}'>"+plusGlyph+"</button>";
		var rooms = $.grep( MultiBox.getRoomsSync(), function(room,idx) {
			return ( MultiBox.controllerOf(room.altuiid).controller == scenecontroller );
		});	

		//scene options room, name, modes

		var panels = [
			{id:'Header', title:_T("Header"), html:_displayHeader()},
			{id:'Triggers', title:_T("Triggers"), html:_displayTriggers()},
			{id:'Timers', title:_T("Timers"), html:_displayTimers()},
			{id:'Actions', title:_T("Actions"), html:_displayActions()},
			{id:'Lua', title:_T("Lua"), html:_displayLua()},
		];
		function _createAccordeon(panels) {
			var bFirst = true;
			var html="";
			html += "<div class='bs-example'>";
			html += "    <div class='panel-group' id='accordion'>";
			$.each( panels, function (idx,panel){
				html += "        <div class='panel panel-default' id='"+panel.id+"'>";
				html += "            <div class='panel-heading'>";
				html += 				jsonButton;
				html += "                <h4 class='panel-title'>";
				html += "                    <a data-toggle='collapse' data-parent='#accordion' href='#collapse"+panel.id+"'>"+panel.title+"</a><span class='altui-hint' id='altui-hint-"+panel.id+"'></span><span id='trigger' class='caret'></span>";
				html += "                </h4>";
				html += "            </div>";
				html += "            <div id='collapse"+panel.id+"' class='panel-collapse collapse {0}'>".format(bFirst ? 'in':'');
				html += "                <div class='panel-body'>";
				html += 					panel.html || _T('Empty');
				html += "                </div>";
				html += "            </div>";
				html += "        </div>";
				bFirst = false;
			})
			html += "    </div>";
			html += "</div>";
			return html
		};
		function _displayHeader() {
			var htmlRoomSelect = "<select id='altui-room-list' class='form-control'>";
			var htmlRoomName = "<input id='altui-scene-name-input' type='text' class='form-control' value='"+scene.name+"'></input>";
			if (rooms) {
					htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format("No Room",0,'');
					$.each(rooms, function(idx,room) {
						var selected = (room.id.toString() == scene.room);
						htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format(room.name,room.id,selected ? 'selected' : '');
					});
			}
			htmlRoomSelect += "</select>";
			var html="";
			html += "<div class='form form-inline'><label for='altui-room-list'>"+_T("Room")+" :</Label>"+htmlRoomSelect+"<label for='altui-scene-name-input'>"+_T("Name")+" :</Label>"+htmlRoomName;
			html+="</div>";
			if (UIManager.UI7Check()==true) {
				if (scene.modeStatus == undefined)
					scene.modeStatus="0";
				var modes = scene.modeStatus.split(',');
				html += "<label for='altui-scene-mode-input'>"+_T("Runs in all modes, or in selected mode")+" :</Label>";
				html += "<div class='btn-group'>";
				$.each(_HouseModes, function(idx,mode) {
					var select = ($.inArray( mode.id.toString(), modes) == -1) ? "preset_unselected" : "preset_selected";
					html += (houseModeButtonTemplate.format(mode.id, mode.text, mode.cls, select));
				});
				html+="</div>";
			}
			return html;
		}
		function _displayTriggers() {
			var html="";
			try {
				html += _displayJson( 'Triggers', scene.triggers);
				html +="<table class='table table-condensed'>";
				html +="<tbody>";
				if (scene.triggers) {
					$.each( scene.triggers, function(idx,trigger) {
						html += _displayTrigger(trigger,idx);	// trigger do not have IDs so use array index
					});
				}
				html +=("<tr><td colspan='7'>"+smallbuttonTemplate.format( -1, 'altui-addtrigger', plusGlyph,_T('Trigger'))+" "+_T('Trigger')+"</td></tr>");
				html +="</tbody>";
				html +="</table>";
			}
			catch(err) {
				var str = _T("error happened during decoding triggers, probable duplicate ID or invalid format");
				html +="</tbody>";
				html +="</table>";
				html +="<span class='text-danger'>"+str+"</span>";
				PageMessage.message( str, "danger");
			}
			return html;
		}
		function _displayTimers() {
			var html = "";
			html += _displayJson( 'Timers', scene.timers);
			try {
				html +="<table class='table table-condensed'>";
				html +="<tbody>";
				if (scene.timers) {
					$.each( scene.timers, function(idx,timer) {
						html += _displayTimer(timer);
					});
				}
				html +=("<tr><td colspan='4'>"+smallbuttonTemplate.format( -1 , 'altui-addtimer', plusGlyph,_T('Timer'))+" "+_T('Timer')+"</td></tr>");
				html +="</tbody>";
				html +="</table>";
			}
			catch(err) {
				var str = _T("error happened during decoding timers, probable duplicate ID or invalid format");
				html +="</tbody>";
				html +="</table>";
				html +="<span class='text-danger'>"+str+"</span>";
				PageMessage.message( str, "danger");
			}
			return html;
		}
		function _displayActions() {
			var html="";
			html += _displayJson( 'Actions', scene.groups );
			try {
				html +="<table class='table table-condensed'>";
				html +="<tbody>";
				if (scene.groups)
				{
					$.each(scene.groups, function(idx,group){
						html += _displayGroup(group,idx);
					});
				}
				html +=("<tr><td colspan='3'>"+smallbuttonTemplate.format( -1 , 'altui-addgroup', plusGlyph,_T('Delay'))+" "+_T('Delay')+"</td></tr>");
				html +="</tbody>";
				html +="</table>";
			}
			catch(err) {
				var str = _T("error happened during decoding actions, probable duplicate ID or invalid format");
				html +="</tbody>";
				html +="</table>";
				html +="<span class='text-danger'>"+str+"</span>";
				PageMessage.message( str, "danger");
			}
			return html;
		}
		function _displayLua() {
			var html="";
			var lua = (scene.lua!=undefined) ? scene.lua : "";
			// html +="<form class='col-sm-11' role='form' action='javascript:void(0);'>";
			html +="  <div class='form-group'>";
			html += ("    <label for='altui-luascene'>Lua scene code:</label>");
			html +="    <textarea id='altui-luascene' rows='10' class='form-control' placeholder='enter code here'>"+lua+"</textarea>";
			html +="  </div>";
			// html +="</form>";
			return html;
		}

		var htmlSceneEditButton = "  <button type='submit' class='btn btn-default altui-scene-editbutton'>"+_T("Submit")+"</button>";
		var html="";
		html += _createAccordeon(panels);
		html +=  htmlSceneEditButton;
		return html;
	};
	
	function _updateAccordeonHeaders() {
		function _countActions(scene) {
			var n=0;
			$.each(scene.groups, function(i,g) {
				n+=g.actions.length;
			})
			return n;
		};
		$("#altui-hint-Lua").html( ($("#altui-luascene").val()=="") ? "" : plusGlyph );
		$("#altui-hint-Triggers").html( '<span class="badge">{0}</span>'.format( scene.triggers.length));
		$("#altui-hint-Timers").html( '<span class="badge">{0}</span>'.format( scene.timers.length));
		$("#altui-hint-Actions").html( '<span class="badge">{0}</span>'.format( _countActions(scene)) );
		if (UIManager.UI7Check())
		{
			var html = $.map( $("div.housemode.preset_selected") , function(elem,idx) {	
				var id = parseInt( $(elem).prop('id').substring("altui-mode".length) ) - 1;
				return _HouseModes[ id ].text;
			}).join(",");
			$("#altui-hint-Header").html( '<span class="text-muted"><small>({0})</small></span>'.format( html ));
		}
	};
	
	function _runActions() {
		//
		// actions
		//
		_updateAccordeonHeaders();
		$(".altui-json-code").hide();
		$(".altui-mainpanel")
			.on("click",".altui-luatrigger",function() { 
				var id = parseInt($(this).prop('id'));
				LuaEditor.openDialog( scene.triggers[id].lua !=undefined ? scene.triggers[id].lua : "" , function(code){
					scene.triggers[id].lua = code;
					_showSaveNeeded();
					PageMessage.message( "Event Lua code edited, remember to save your changes", "info");
					});
			})
			.on("click",".altui-trigger-users",function() { 
				var id = parseInt($(this).prop('id'));
				_editTriggerUsers( id , $(this) );
			})
			.on("click",".altui-triggertimerestrict",function() { 
				var id = parseInt($(this).prop('id'));
				_editTriggerRestrict( id , $(this) );
			});
		
		$(".altui-toggle-json").click( function() {
			var id = $(this).closest('.panel').prop('id');
			var type = "#altui-json-"+id;
			$(type).toggle();
		});
		
		$(".altui-mainpanel")
			.on("change","#altui-luascene",function() { 
				if ( $("#altui-luascene").val() != scene.lua ) {
					_showSaveNeeded(false);
				}
			})
			.on("click",".altui-scene-editbutton",function(){ 
				scene.lua = $("#altui-luascene").val();
				scene.name = $("#altui-scene-name-input").val();
				if (scene.paused==undefined)
					scene.paused=0;
				// scene.paused = 0;		// UI7 seems to use this but could not find where in UI7.
				if (UIManager.UI7Check()==true) {
					var selectedmode = $(".altui-housemode div.preset_selected");
					if (selectedmode.length>0) {
						scene.modeStatus = $.map( selectedmode, function(elem,idx) {
								return $(elem).prop('id').substring("altui-mode".length);
							} ).join(",");
					}
					else
						scene.modeStatus="0";
				}
				MultiBox.editScene(scenealtuiid,scene);
				_showSaveNeeded(true);
			});

		// $(".altui-mainpanel").off("click",".altui-deltrigger");
		$(".altui-mainpanel").on("click",".altui-deltrigger",function(){ 
			scene.triggers.splice( $(this).prop('id') , 1 );
			$(this).parents("tr").remove();
			_showSaveNeeded();
			PageMessage.message( "Trigger deleted, remember to save your changes", "info");
			// MultiBox.setScene(sceneid,scene);
		});
		
		$(".altui-mainpanel")
			.on("click",".altui-housemode",function(){ 
				var div = $(this).find("div.housemode");
				if (div.hasClass("preset_selected"))
					div.removeClass("preset_selected").addClass("preset_unselected");
				else
					div.removeClass("preset_unselected").addClass("preset_selected");
				_showSaveNeeded();
			})
			.on("click",".altui-deltimer",function(){ 
				var id = parseInt($(this).prop('id'));
				$.each(scene.timers , function (idx,timer) {
					if (timer.id ==id) {
						scene.timers.splice( idx , 1 );
						// now rename IDs !
						var newid=1;
						$.each(scene.timers, function( idx,timer) {
							timer.id = newid++;
						});
						_showSaveNeeded();
						return false; // we found it, stop the iteration
					}
				});
				$(this).parents("tr").remove();
				PageMessage.message( "Timer deleted, remember to save your changes", "info");
				// MultiBox.setScene(sceneid,scene);
			})
			.on("click",".altui-edittimer",function(){ 
				var id = parseInt($(this).prop('id'));
				_editTimer( id , $(this) );
			})
			.on("click",".altui-addtimer",function(){ 
				_editTimer( -1 , $(this) );
			})
			.on("click",".altui-delaction",function(){ 
				// groupid . actionid
				var ids = $(this).prop('id').split('.');
				var group = scene.groups[ ids[0] ];
				group.actions.splice( ids[1], 1 );
				$(this).parents("tr [data-group-idx=0]").parent().parent().replaceWith( _displayGroup(group,ids[0] ) );
				// $(this).parents("tr").first().remove();
				_showSaveNeeded();
				PageMessage.message( "Action deleted, remember to save your changes", "info");
				// MultiBox.setScene(sceneid,scene);
			})
			.on("click",".altui-editaction",function(){ 
				var ids = $(this).prop('id').split('.');
				var group = scene.groups[ ids[0] ];
				var action = group.actions[ ids[1] ];
				_editAction(scene,action,ids[1],ids[0],$(this));
			})
			.on("click",".altui-addaction",function(){ 
				var newaction = {
					device:'',
					service:'',
					action:'',
					arguments:[]
				};
				var idg = $(this).parents("table[data-group-idx]").data("group-idx");
				_editAction(scene,newaction,-1,idg,$(this));
			})
			.on("click",".altui-delgroup",function(){ 
				var id = parseInt($(this).prop('id'));
				$(this).parents("tr").remove();
				scene.groups.splice( id , 1 );
				_showSaveNeeded();
				PageMessage.message( "Group of actions deleted, remember to save your changes", "info");
			})
			.on("click",".altui-editgroup",function(){ 
				var groupidx = parseInt($(this).prop('id'));
				_editGroup( groupidx, scene.groups[ groupidx ] , $(this) );
			})
			.on("click",".altui-addgroup",function(){ 
				var group = {"delay":'',"actions":[]};
				_editGroup( -1 , group , $(this) );
			})
			.on("click",".altui-edittrigger",function(){ 
				var triggeridx = $(this).parents("tr[data-trigger-idx]").data("trigger-idx");
				_editTrigger( triggeridx , $(this) );
			})
			.on("click",".altui-addtrigger",function(){ 
				_editTrigger( -1 , $(this) );
			})
			.on("click",".altui-pausescene",function(){ 
				scene.paused = (scene.paused==1) ? 0 : 1;
				$(this).removeClass('paused activated').addClass( ((scene.paused>0) ? 'paused':'activated') );			
				_showSaveNeeded();
			});
		
		$("#altui-room-list").change( function() {
			scene.room = $(this).val();
			_showSaveNeeded();
		});
		
		$(".altui-enable-trigger").click( function() {
			var checked = $(this).is(':checked');
			var id = $(this).prop('id');
			_showSaveNeeded();
			scene.triggers[ id ].enabled = (checked == true) ? 1 : 0;
		});
		
		$(".altui-enable-timer").click( function() {
			var checked = $(this).is(':checked');
			var id = $(this).prop('id');
			$.each(scene.timers, function(idx,timer) {
				if (timer.id == id) {
					timer.enabled = (checked == true) ? 1 : 0;
					_showSaveNeeded();
					return false; // break the loop
				}
			});
		});
	}
	
	return {
		sceneEditDraw 	: _sceneEditDraw,
		runActions 		: _runActions
	}
};

// ===========================
//  Page UI pieces helpers
// ===========================
var PageMessage = (function(window, undefined ) {
	var _badgeTemplate = '<span class="badge">{0}</span>&nbsp;';
	var _msgTemplate = '<span class="altui-pagemessage-txt" >{0}</span>';
	var _pageMessageIdx = 0;
	
	function _toDataset(dataset) {
		if (dataset == undefined)
			return '';
		var lines=[];
		$.each( dataset, function(key,val) {
			lines.push( "data-{0}='{1}'".format(key,val));
		});
		return lines.join(' ');
	};		
	
	// dataset enables to mark messages and find them back later, it is a {} object translated into data-* attributes
	function _messageRow(_pageMessageIdx, badge, now,txt,html,level,dataset)
	{
		var close = "<button class='close altui-pagemessage-close' type='button' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		var badgehtml = (badge>1) ? _badgeTemplate.format(badge) : "";
		var htmlmsg = ("<tr data-idx='{0}' {4} class='{3}'><td>"+close+"</td><td>"+badgehtml+"</td><td>{1}</td><td class='altui-pagemessage-txt'>{2}</td><td>{5}</td></tr>").format( 
			_pageMessageIdx,
			now.toLocaleString(),
			txt.htmlEncode(),
			level,
			_toDataset(dataset),
			html || "");
		return htmlmsg;
	};	

	function _updateMessageButtonColor() {
		function _setColor(cls) {
			$("#altui-toggle-messages").attr("class","dropdown-toggle btn "+"btn-"+cls);
		};
		if ($("div#altui-pagemessage  tr.danger").length>0)
			_setColor('danger');
		else if ($("div#altui-pagemessage  tr.warning").length>0)
			_setColor('warning');
		else if ($("div#altui-pagemessage  tr.info").length>0)
			_setColor('info');
		else if ($("div#altui-pagemessage  tr.success").length>0)
			_setColor('success');
		else {
			_setColor('default');
			// $("#altui-toggle-messages").dropdown("toggle");
			$("#altui-toggle-messages").next(".collapse").removeClass("in");
			$("#altui-toggle-messages span").removeClass( "caret-reversed" );
		}
	};
	
	function _clearMessage( msgidx ) {
		$("div#altui-pagemessage  tr[data-idx='" + msgidx + "']").remove();
		_updateMessageButtonColor();
	};
	
	function _message(txt,level,bReload,dataset)		
	{
		var html="";
		
		// level =success, info, warning, danger
		if ((level!="success") &&  (level!="info" ) &&  (level!="warning") &&  (level!="danger"))	{
			level = "info";
		}
		if (bReload==true) {
			if (level=="success")
				level="info";
			html += "<button class='btn btn-default btn-sm altui-savechanges-button' onclick='MultiBox.saveChangeCaches(0,\"{0}\")'>Save Changes</button>";
		}

		//
		// if same message already exists, simply increase the badge count
		//
		var now = new Date();
		var found = null;				
		$("div#altui-pagemessage td.altui-pagemessage-txt").each( function(idx,obj) {
			if (txt == $(obj).html()) {
				found = $(obj);
				return false;
			}
		}); 
		var idx = _pageMessageIdx;
		if (found != null)
		{
			var tr = $(found).parent();
			idx = $(tr).data('idx');
			var badge = $(tr).find("span.badge");
			var n = 2;
			if (badge.length>0)
			{
				n = 1+parseInt(badge.html());
			}
			$(tr).replaceWith( _messageRow(idx, n, now.toLocaleString(),txt,html.format(idx),level,dataset) );
			if (level== "success")
				setTimeout( function () { PageMessage.clearMessage( idx ) ; }, 5000 );
		}
		else {
			var htmlmsg = _messageRow(idx, 1, now.toLocaleString(),txt,html.format(idx),level,dataset);
			$("div#altui-pagemessage tbody").prepend( htmlmsg );
			$("div#altui-pagemessage  tr.success[data-idx='" + idx + "']").each( function(idx,elem) {
				var that = $(elem);
				setTimeout( function() { $(that).remove();_updateMessageButtonColor(); } , 5000 );
			});
			_pageMessageIdx++;
		}
		_updateMessageButtonColor();
		return idx;
	};
	
	function _jobMessage(device,job)
	{
		var now = new Date();
		var txt = "#{0}:{1}:{2}".format(job.id,device.name,job.comments);
		var tr = $("div#altui-pagemessage tr[data-jobid='"+job.id+"']");
		if (tr.length>0) {
			var idx = $(tr).data('idx');
			var badge = $(tr).find("span.badge");
			$(tr).replaceWith( 
				_messageRow(idx, 1, now.toLocaleString(),txt, "", UIManager.jobStatusToColor( job.status ), {
					devid : device.id,	//device concerned
					jobid : job.id	 	//message for this job, will replace old one
				}) 
			);
			if (job.status==4)
				setTimeout( function () { _clearMessage( idx ) }, 5000 );
		}
		else
		{
			// new message
			_message(
				txt,
				UIManager.jobStatusToColor( job.status ),
				false, 
				{
					devid : device.id,	//device concerned
					jobid : job.id	 	//message for this job, will replace old one
				}
			);
		}
	};
	
	function _clearJobMessage(device)
	{
		var devicemessages = $(".altui-pagemessage[data-devid='"+device.id+"']");
		setTimeout( function() {
			$(devicemessages).remove();			
			_updateMessageButtonColor();
		}, 5000 );
	};

	function _init() {
		var Html="";
		Html+="<div class='' id='altui-pagemessage'>";
		Html+="	<button id='altui-toggle-messages' class='btn btn-default dropdown-toggle' type='button' data-toggle='collapse' data-target='#altui-pagemessage-panel' >";
		Html+=( _T("Messages") + "&nbsp;<span class='caret'></span>");
		Html+="	</button>";
		Html+="	<div class='panel panel-default collapse' id='altui-pagemessage-panel' >";
		Html+="		<div class='panel-body'>";
		Html+="			<table class='table table-condensed table-responsive'>";
		Html+="				<tbody>";
		Html+="				</tbody>";
		Html+="			</table>";
		Html+="		</div>";
		Html+="	</div>";
		Html+="</div>";
		$("#altui-pagetitle").before( Html );
		// close button for pageMessages
		$( document )
			.on( "click", ".altui-pagemessage-close", function() {
				// $(this).closest("tr").remove();
				PageMessage.clearMessage( $(this).closest("tr").data('idx') );
			})
			.on( "click", "#altui-toggle-messages", function() {
				$(this).find("span").toggleClass( "caret-reversed" );
			})
			
	};
	
	function _clear() {
		$("#altui-pagemessage tbody").empty();
		_updateMessageButtonColor();
	};
	
	return {
		init			: _init,
		clear			: _clear,
		clearMessage	: _clearMessage,
		message			: _message, // (txt,level,bReload,dataset)	
		jobMessage		: _jobMessage,
		clearJobMessage	: _clearJobMessage,
	};
})();

var UIManager  = ( function( window, undefined ) {  
	// in English, we will apply the _T() later, at display time
	var _checkOptions = [
		{ id:'ShowVideoThumbnail', type:'checkbox', label:"Show Video Thumbnail in Local mode", _default:1 },
		{ id:'FixedLeftButtonBar', type:'checkbox', label:"Left Buttons are fixed on the page", _default:1 },
		{ id:'ShowWeather', type:'checkbox', label:"Show Weather on home page", _default:1 },
		{ id:'Menu2ColumnLimit', type:'number', label:"2-columns Menu's limit", _default:15, min:2, max:30  },
		{ id:'TempUnitOverride', type:'select', label:"Weather Temp Unit (UI5)", _default:'c', choices:'c|f'  },
	];
	var edittools = [];
	var tools = [];

	function _initLocalizedGlobals() {
		edittools = [
			{id:1000, glyph:'object-align-top' , onclick: onAlignTop},
			{id:1010, glyph:'object-align-horizontal', onclick: onAlignHorizontal },
			{id:1020, glyph:'object-align-bottom' , onclick: onAlignBottom },
			{id:1030, glyph:'object-align-left' , onclick: onAlignLeft },
			{id:1040, glyph:'object-align-vertical' , onclick: onAlignVertical},
			{id:1050, glyph:'object-align-right' , onclick: onAlignRight}
		];
		tools = [
			{ 	id:10, 
				cls:'altui-widget-label', 
				no_refresh:true,
				html: _toolHtml(labelGlyph,_T("Label")),
				property: _onPropertyLabel, 
				widgetdisplay: function(widget,bEdit)	{ return "<p style='color:{1}; '>{0}</p>".format(widget.properties.label,widget.properties.color); },
				properties: {
					label:'Default Label',
					color:$(".altui-mainpanel").css("color")
				} 
			},
			{ 	id:20, 
				cls:'altui-widget-variable', 
				html: _toolHtml(infoGlyph,_T("Variable")),
				property: _onPropertyVariable, 
				widgetdisplay: function(widget,bEdit)	{ 
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					return "<p style='color:{1};'>{0}</p>".format( 
						(widget.properties.deviceid!=NULL_DEVICE) 
							? (MultiBox.getStatus( device, widget.properties.service, widget.properties.variable ) || '')
							: 'not defined',
						widget.properties.color);
				},
				properties: {
					deviceid:NULL_DEVICE,
					service:'',
					variable:'',
					color:$(".altui-mainpanel").css("color")
				} 
			},
			{ 	id:30, 
				cls:'altui-widget-image', 
				no_refresh:true,
				html: _toolHtml(picGlyph,_T("Image")),
				property: _onPropertyImage, 
				onWidgetResize: _onResizeStub,
				aspectRatio: true,
				widgetdisplay: function(widget,bEdit)	{ 
					return "<img src='{0}' style='max-height:100%; max-width:100%; height:100%; width:100%; '></img>".format( widget.properties.url);
				},
				properties: {
					url:'data:image/png;base64,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'
				} 
			},
			{ 	id:35, 
				cls:'altui-widget-frame', 
				no_refresh:true,
				aspectRatio: false,
				html: _toolHtml(uncheckedGlyph,_T("Frame")),
				property: _onPropertyFrame, 
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{ 
					return "<div class='altui-widget-frame-div' src='{0}' style='max-height:100%; max-width:100%; height:100%; width:100%; background:{1}; '>{0}</div>".format( widget.properties.label,widget.properties.css );
				},
				defaultSize: { width:50, height:50 },
				zindex: -1,
				properties: {
					label:'',
					css:''
				} 
			},
			{ 	id:40, 
				cls:'altui-widget-icon', 
				html: _toolHtml(picGlyph,_T("Device Icon")),
				property: _onPropertyIcon, 
				widgetdisplay: function(widget,bEdit)	{ 
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					return (widget.properties.deviceid==NULL_DEVICE) ? ("<p>"+picGlyph+"</p>") : _deviceIconHtml( device );
				},
				properties: {
					deviceid:NULL_DEVICE
				} 
			},
			{ 	id:50, 
				cls:'altui-widget-runscene', 
				no_refresh:true,
				html: _toolHtml(runGlyph,_T("Scene")),
				property: _onPropertyRunscene, 
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{ 
					var scene = MultiBox.getSceneByAltuiID(widget.properties.sceneid);
					return "<button type='button' class='{1} btn btn-default' aria-label='Run Scene' onclick='{3}' style='{5}'>{4}{2}</button>".format(
							scene ? scene.altuiid : NULL_DEVICE,
							'altui-widget-runscene-button',
							runGlyph.replace('glyphicon','pull-right glyphicon'),
							(bEdit==true)?'':'MultiBox.runSceneByAltuiID("{0}")'.format(scene ? scene.altuiid : NULL_DEVICE),
							widget.properties.label,
							"height: 100%; width: 100%;"
							);
				},
				properties: {
					sceneid:NULL_SCENE,
					label:''
				} 
			},
			{ 	id:60, 
				cls:'altui-widget-upnpaction', 
				no_refresh:true,
				html: _toolHtml(runGlyph,_T("Action")),
				property: _onPropertyUpnpAction, 
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{ 
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					return "<button type='button' class='{1} btn btn-default' aria-label='Run Scene' onclick='{3}' style='{5}' >{4}{2}</button>".format(
						device ? device.altuiid : NULL_DEVICE,
						'altui-widget-upnpaction-button',
						runGlyph.replace('glyphicon','pull-right glyphicon'),
						(bEdit==true)?'':'MultiBox.runActionByAltuiID("{0}", "{1}", "{2}", {3} )'.format(
							device ? device.altuiid : NULL_DEVICE,
							widget.properties.service,
							widget.properties.action,
							JSON.stringify(widget.properties.params)
						),
						widget.properties.label,
						"height: 100%; width: 100%;"
						);
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE,
					label:'',
					service:'',
					action:'',
					params:{}
				} 
			},
			{ 	id:65, 
				cls:'altui-widget-2statebtn', 
				html: _toolHtml(onoffGlyph,_T("Multi State")),
				property: _onPropertyOnOffButton, 
				widgetdisplay: function(widget,bEdit)	{
					var status=0;
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (widget.properties.deviceid!= NULL_DEVICE)
					{
						status = MultiBox.getStatus(device, widget.properties.service, widget.properties.variable);
						if  ((status==undefined) || (status==null) ||(status==false) || (status=='0') )
							status = 0;
						else if ((status=='true') || (status=='1') || (status>=1))
							status = 1;
						if (widget.properties.inverted==true)
							status = 1-status;
					}
					var htmlLabels=$("<div class='altui-widget-2statebtn-labels'></div>");
					if ( (status==0) && (widget.properties.labels[0]!=undefined) )
						htmlLabels.append( $("<small class='pull-right'></small>").text(widget.properties.labels[0]));
					if ( (status==1) && (widget.properties.labels[1]!=undefined) )
						htmlLabels.append( $("<small class='pull-left'></small>").text(widget.properties.labels[1]));
					htmlLabels = htmlLabels.wrap( "<div></div>" ).parent().html();
					
					return "<button  type='button' style='color:{4};' class='{1} btn btn-default' aria-label='Run Scene' onclick='{3}' >{2}</button>".format(
						widget.properties.deviceid,					// id
						'altui-widget-2statebtn',					// class
						onoffGlyph,									// content
						(bEdit==true)? '' : 'UIManager.onoffOnClick( {0})'.format(widget.id),				// editmode
						// widget.properties.service,					// action service
						// widget.properties.action,					// action name
						// JSON.stringify(widget.properties.params),	// action parameter
						(status==0) ? 'red' : 'green'				// status & color of button
						)+htmlLabels;
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE,
					service:'',		// display state service
					variable:'',	// display state variable
					inverted:0,	// inverted to that onstate is value 0
					labels: [],		// 0:onlabel , 1:offlabel
					action_off: {
						service:'',
						action:'',
						params:{}
					},
					action_on: {
						service:'',
						action:'',
						params:{}
					}
				} 
			},
			{ 	id:70, 
				cls:'altui-widget-camera', 
				no_refresh:true,
				html: _toolHtml(cameraGlyph,_T("Camera")),
				onWidgetResize: _onResizeCamera,
				aspectRatio: true,
				property: _onPropertyCamera, 
				widgetdisplay: function(widget,bEdit)	{ 
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					return ((device!=null) && (device.altuiid!=NULL_DEVICE)) ? _cameraDraw(device,widget.size) : "<img src='{0}' style='max-height:100%; max-width:100%;'></img>".format(cameraURI);	//"<div class='altui-camera-div'>xxx</div>";
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE
				} 
			}
			,{ 	id:80, 
				cls:'altui-widget-gauge', 
				html: _toolHtml(scaleGlyph,_T("Gauge")),
				property: _onPropertyGauge, 
				onWidgetResize: _onResizeGauge,
				widgetdisplay: function(widget,bEdit)	{ 
					return "<div class='altui-gauge-div' id='altui-gauge-{0}' ></div>".format( widget.id );
				},
				onWidgetDisplay: _onDisplayGauge,
				properties: {	//( deviceID, service, action, params, cbfunc )
					label:'',
					deviceid:NULL_DEVICE,
					min:0,
					max:100,
					greenfrom:'',
					orangefrom:'',
					redfrom:'',
					majorTicks:[],
					service:'',
					variable:''
				} 
			}	
			];		
	};
	
	//---------------------------------------------------------
	// private functions
	//---------------------------------------------------------

	// var _uiengine = null;		// setTimeout timer object for ui refresh
	// var _devicetypesDB = {};
	var _ui7Check = true;
	var _version = "";
	var _remoteAccessUrl = "";

	//var devicecontainerTemplate = "<div class=' col-xs-12 col-sm-6 col-md-4 col-lg-3 '><p data-toggle='tooltip' data-placement='left' title='{2}'>{0} [{1}]</p></div>"


	function _createScript(scriptName ) {
		var container = $(".altui-scripts")[0];			// js object
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.setAttribute("data-src", scriptName);
		container.appendChild(script);
	};
	
	function _loadScript(scriptLocationAndName, cbfunc) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptLocationAndName;
		script.setAttribute("data-src", scriptLocationAndName);

		// once script is loaded, we can call style function in it
		$(script).load( cbfunc );
		head.appendChild(script);
	};
	
	function _loadD3Script( drawfunc ) {
		var altuidevice = MultiBox.getDeviceByID( 0, g_MyDeviceID );
		var localcdn = ( MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "LocalCDN" ).trim() || "");
		var scriptname = (localcdn=="") ? "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" : (localcdn+"/d3.min.js");	//supports https
		var len = $('script[src="'+scriptname+'"]').length;
		if (len==0) {				// not loaded yet
			UIManager.loadScript(scriptname,function() {
				(drawfunc)();
			});
			return;
		}
		(drawfunc)();
	};

	// func is the function to call, if it contains module.funcname it is a UI7 style. otherwise it is assumed UI5 style
	// UI7 style already uses jquery normally
	function _fixScriptPostLoad( name, code, ui7style ) {
		if (!ui7style) 
		{
		// if (name=="J_WakeUpLight.js") {
			// https://regex101.com/
			var re = /\$\((.*?)\).value\s*=(.*);/g; 
			var subst = '$(\'#\'+$1).val($2);'; 
			code = code.replace(re, subst);

			re = /\$\((.*?)\).value/g; 
			var subst = '$(\'#\'+$1).val()'; 
			code = code.replace(re, subst);
			
			re = /\$\((.*?)\).innerHTML\s*?=\s*?(.*?);/g; 
			var subst = '$(\'#\'+$1).html($2)'; 
			code = code.replace(re, subst);

			re = /\$\((.*?)\).innerHTML/g; 
			var subst = '$(\'#\'+$1).html()'; 
			code = code.replace(re, subst);

			re = /\$\((.*?)\).checked/g; 
			subst = '$(\'#\'+$1).is(\':checked\')'; 
			code = code.replace(re, subst);

			re = /\(\$\(([^#]*?)\)\)?/g; 
			subst = '($(\'#\'+$1).length>0)'; 
			code = code.replace(re, subst);
		// } 			
			if (name=="J_ProgramLogicC.js") {
				re = /!\$\((selectedEventObj)\)/g; 
				subst = '($("#"+selectedEventObj).length==0)'; 
				code = code.replace(re, subst);
				
				re = /\$\$\((.*?)\)/g; 
				subst = '$($1)'; 
				code = code.replace(re, subst);
			}
			if (name=="J_OWServer.js") {
				// J_OWServer.js & others
				re = /=\s*new\s+Hash\(\);/g; 
				subst = '= {};'; 
				code = code.replace(re, subst);
				re = /.set\((.*),(.*)\)/g; 
				subst = '[$1]=$2'; 
				code = code.replace(re, subst);
			}
		}
		if (name=="J_RGBController1.js") {
			re = /#RGBController_red .ui-slider-range, #RGBController_red .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/; 
			subst = '#RGBController_red .ui-slider-range, #RGBController_red .ui-slider-handle,#RGBController_red .ui-widget-header, #RGBController_red .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			re = /#RGBController_green .ui-slider-range, #RGBController_green .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/; 
			subst = '#RGBController_green .ui-slider-range, #RGBController_green .ui-slider-handle,#RGBController_green .ui-widget-header, #RGBController_green .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			re = /#RGBController_blue .ui-slider-range, #RGBController_blue .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/; 
			subst = '#RGBController_blue .ui-slider-range, #RGBController_blue .ui-slider-handle,#RGBController_blue .ui-widget-header, #RGBController_blue .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			re = /#RGBController_white .ui-slider-range, #RGBController_white .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/; 
			subst = '#RGBController_white .ui-slider-range, #RGBController_white .ui-slider-handle,#RGBController_white .ui-widget-header, #RGBController_white .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			}
		return code;
	};
	
	function _initDB(devicetypes,cbfunc) {		

		EventBus.registerEventHandler("on_altui_deviceTypeLoaded",UIManager,function() {
			(cbfunc)();
		});
		
		var _devicetypesDB = MultiBox.initDB(devicetypes).getALTUITypesDB();
		_ui7Check = (_devicetypesDB["info"].ui7Check == "true" );
		_version = _devicetypesDB["info"].PluginVersion;
		_remoteAccessUrl =_devicetypesDB["info"].RemoteAccess;
		
		// foreach load the module if needed
		// AltuiDebug.SetDebug( _devicetypesDB["info"].debug ) ;

		var _toload=0;
		$.each(_devicetypesDB, function(devtype,obj) {
			if (obj!=null && obj.ScriptFile!=null) {
				var len = $('script[data-src="'+obj.ScriptFile+'"]').length;
				if (len==0) {
					// not loaded yet
					_toload++;
					_loadScript(obj.ScriptFile, function() {						
						// script has been loaded , check if style needs to be loaded and if so, load them
						$.each(_devicetypesDB,function(idx,dt) {
							if ( (dt.ScriptFile == obj.ScriptFile) && (dt.StyleFunc != undefined) ) {
								Altui_LoadStyle(dt.StyleFunc);
								return false;	// exit the loop
							}
						});				
						_toload--;
					});	// load script & styles once script is loaded
				} 
				// else loaded
			}
		});
		if ($.isFunction(cbfunc)) {
			function notifyTermination() {
				if (_toload==0)
					EventBus.publishEvent("on_altui_deviceTypeLoaded");
				else
					setTimeout( notifyTermination, 500 );
			};
			notifyTermination();
		}
	};

	function _enhanceValue(value) 
	{
		//try to guess what is the value
		var valuetype = $.type(value);
		if ($.isNumeric(value)) {
			if ( value>=1035615941 && value <= 4035615941) {
				var date = new Date(value*1000);
				return date.toLocaleString();
			}
			return value;
		} else if ( (valuetype==='string') && ( (value.indexOf("http") === 0) || (value.indexOf("https") === 0) || (value.indexOf("ftp") === 0) ) ) {
			return "<a href='{0}'>{0}</a>".format(value);
		}
		return value.toString().htmlEncode();
	};
	
	function _enhanceEditorValue(id,value,altuiid)
	{
		var extradata = altuiid ? ("data-altuiid='"+altuiid+"'") : "";
		if ($.isNumeric(value) && value>=1035615941 && value <= 4035615941) {
			var field = "<input {2} type='datetime-local' class='form-control' id='{0}' name='{0}' value='{1}'>";
			var date = new Date(value*1000);
			// var offset = date.getTimezoneOffset();
			// offset = ((offset<0? '+':'-')+ _format(parseInt(Math.abs(offset/60)))+ ":"+_format(Math.abs(offset%60)));
			return field.format(id, _toIso(date),extradata);
		}
		return "<input {2} id='{0}' class='form-control' type='text' value='{1}'></input>".format(id,value,extradata);
	};
		
	function _deviceDrawVariables(device) {
		// 0: variable , 1: value , 2: service
		var deviceVariableLineTemplate = "  <tr>";
		// deviceVariableLineTemplate += "         <th scope='row'>1</th>";
		deviceVariableLineTemplate += "         <td><span title='{2}'>{0}</span></td>";
		deviceVariableLineTemplate += 	("<td>"+smallbuttonTemplate.format( '{3}', 'altui-variable-history', calendarGlyph,'History')+"</td>");
		deviceVariableLineTemplate += "         <td id='{3}' class='altui-variable-value' >{1}</td>";
		deviceVariableLineTemplate += "     </tr>";

		function _clickOnValue() {
			var id = $(this).prop('id');	// idx in variable state array
			var tbl = [device.states[id].service , device.states[id].variable]//atob(id).split('.');
			var value = MultiBox.getStatus(device,tbl[0],tbl[1]);
			$(this).off( "click");
			$(this).html( _enhanceEditorValue(id,value) );
			$(this).find("input#"+id)
				.focus()
				.focusout( function() {
				var id = $(this).prop('id');	
				var tbl = [device.states[id].service , device.states[id].variable]//atob(id).split('.');
				var oldval = $(this).attr("value");	// oldval
				var val = $(this).val();	// but this is in UTC so we need to convert back to locale timezone
				if (oldval != val) {
					if ($(this).attr('type')=='datetime-local') {
						var d = new Date(val);	// input returns in UTC but we want in locale
						var locale = d.getTime() + (d.getTimezoneOffset()*60000);	// add offset so that it is locale
						val = locale/1000;
					}
					MultiBox.setStatus( device, tbl[0],tbl[1], val );
				}
				$(this).parent().click(_clickOnValue);
				$(this).replaceWith(_enhanceValue(val));					
			});
		};
			
		// prepare the text for the modal .. .for each variable do a line, add lines to template
		// var device = MultiBox.getDeviceByID( devid );
		if (device!=null) {
			var lines = [];
			$.each(device.states.sort(_sortByVariableName), function(idx,state) {
				var str = deviceVariableLineTemplate.format(
					state.variable, 
					_enhanceValue(state.value), 
					state.service,
					idx 
					);
				lines.push(  str );
			});

			// update modal with new text
			DialogManager.registerDialog('deviceModal',deviceModalTemplate.format( lines.join(''), device.name, device.altuiid ));
			$("button.altui-variable-history").click( function() {
				var tr = $(this).closest("tr");
				var varidx = tr.find("td.altui-variable-value").prop('id');
				var historypre = $(this).closest("tbody").find("table#"+varidx);
				var width = tr.width();
				if (historypre.length==0) {
					MultiBox.getDeviceVariableHistory( device, varidx, function(history) {
						AltuiDebug.debug("getDeviceVariableHistory returned :"+history.result); 
						var html = "<tr><td colspan='3'>";
						html += "<div class='panel panel-default'> <div class='panel-body'>";
						// html += "<div class='table-responsive'>";
						html +="<table id='{0}' class='table table-condensed altui-variable-value-history'>".format(varidx);
						html +="<thead>";
						html += ("<tr><th>{0}</th><th>{1}</th><th>{2}</th></tr>".format(_T("Date"),_T("Old"),_T("New")));
						html +="</thead>";
						html +="<tbody>";
						history.lines.reverse();
						$.each(history.lines, function(i,e) {
							html += ("<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>".format(e.date,_enhanceValue(e.oldv),_enhanceValue(e.newv)));
						});
						html +="</tbody>";
						html +="</table>";
						// html += "</div>";
						html += "  </div></div>";
						// var lines = $.map(history.lines, function(e) {
							// return "{0}\t'{1}'\t'{2}'".format(e.date,e.old,e.new);
						// });
						// html += ("<pre id='{0}' style='max-width:"+width+"px;' class='altui-variable-history-text pre-scrollable'>{1}</pre>").format(varidx,lines.join('\n'));
						html += "</td></tr>";
						tr.after(html);
						// $("table#"+varidx).bootgrid({
							// caseSensitive: false,
							// statusMapping: {}
						// })
				
					});
				}
				else
					historypre.closest("tr").remove();
			});
			$(".altui-variable-value").click( _clickOnValue );
			// show the modal
			$('#deviceModal').modal();
		}
	};

	function _deviceCreate() {
		// prepare modal
		// show
		$('#deviceCreateModal button.btn-primary')
			.off('click')
			.on('click', function() {
				if (confirm("Are you sure you want to create this device")) {			
					MultiBox.createDevice( 
						0,	// only on main controller for now
						{
							dfile: $("#altui-input-dfile").val(),
							ifile: $("#altui-input-ifile").val(),
							descr: $("#altui-input-dtitle").val()
						},
						function ( newid ) {
							$('#deviceCreateModal').modal('hide');
							if (newid)
								PageMessage.message( _T("Device {0} created successfully").format(newid), "success");
							else
								PageMessage.message( _T("Device creation failed"), "danger");
						}
					);
				}
			});
		$('#deviceCreateModal').modal();
	};
	
	function _deviceDrawActions(device) {
		
		// 0:name 1:name
		var deviceActionParamTemplate = "<div class='input-group input-group-sm'>";
		deviceActionParamTemplate +=	"  <span class='input-group-addon' id='sizing-addon3'>{0}</span>";
		deviceActionParamTemplate +=	"  <input type='text' class='form-control' placeholder='{1}' aria-describedby='sizing-addon3'>";
		deviceActionParamTemplate +=	"</div>";

		// 0: action , 1: value , 2: service, 3: devid
		var deviceActionLineTemplate = "  <tr>";
		deviceActionLineTemplate += "         <td><span title='{2}'><button class='btn btn-default btn-sm altui-run-action' data-altuiid='{3}' data-service='{2}' >{0}</button></span></td>";
		deviceActionLineTemplate += "         <td>{1}</td>";
		deviceActionLineTemplate += "     </tr>";

		// for each services for that device type
		// enumerate actions name & parameters		
		// var device = MultiBox.getDeviceByID( devid );

		MultiBox.getDeviceActions(device, function( services ) {
			AltuiDebug.debug("MultiBox.getDeviceActions => returns services:{0}".format( JSON.stringify(services)));
			var lines = [];
			$.each( services, function( idx,service) {
				$.each( service.Actions, function (key1,action) {
					var params = [];
					$.each(action.input, function (key2,param) {
						params.push( deviceActionParamTemplate.format(param,param) );
					});
					lines.push( deviceActionLineTemplate.format(action.name,params.join(''),service.ServiceId,device.altuiid) );
				});
			});
			
			// update modal with new text
			var extrabuttons = MultiBox.isDeviceZwave(device) ? buttonTemplate.format( device.altuii, "altui-update-neighbors", _T("Update Neighbors"),"default") : "";
			DialogManager.registerDialog('deviceActionModal',deviceActionModalTemplate.format( lines.join(''), device.name, device.altuiid, extrabuttons ));

			$('div#deviceActionModal button.altui-run-action').click( function() {
				var service = $(this).data().service;	// better than this.dataset.service in case of old browsers
				var altuiid = $(this).data().altuiid;
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				var action = $(this).text();
				// search parameters
				var inputs= $(this).parents("tr").find("td:nth-child(2) div.input-group");
				var parameters = {};
				$.each( inputs, function( i, param) {
					var paramname = $(param).find("input").prop("placeholder");
					var paramvalue = $(param).find("input").val();
					if (paramname != undefined)
						parameters[paramname]=paramvalue;
				});
				
				MultiBox.runAction( device, service, action, parameters, function(result) {
					alert(result);
				});
			});
			$('div#deviceActionModal button.altui-update-neighbors').click( function() {
				var altuiid = $(this).prop('id');
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				MultiBox.updateNeighbors( device );
			});
				
			// show the modal
			$('#deviceActionModal').modal();
		});
	};

	// This is the list with all job statuses and their meaning:
// -1: No job, i.e. job doesn't exist.
// 0: Job waiting to start.
// 1: Job in progress.
// 2: Job error.
// 3: Job aborted.
// 4: Job done.
// 5: Job waiting for callback. Used in special cases.
// 6: Job requeue. If the job was aborted and needs to be started, use this special value.
// 7: Job in progress with pending data. This means the job is waiting for data, but can't take it now.	
// job_None=-1, // no icon
// job_WaitingToStart=0, // gray icon
// job_InProgress=1, // blue icon
// job_Error=2, // red icon
// job_Aborted=3, // red icon
// job_Done=4, // green icon
// job_WaitingForCallback=5 // blue icon - Special case used in certain derived classes
	function _jobStatusToColor( status ) {
		status = parseInt(status);
		switch(status) {
			case 1:
			case 5:
			case 6:
			case 7:
				return "info";
			case 0:
				return "active";
			case 2:
			case 3:
				return "danger";
			case 4:
				return "success";
			case -1:
			default:
				return "default";
		}
	};

	function _enhancedDeviceTitle(device) {
		var glyphs=[];
		glyphs.push((device.favorite==true) ? starGlyph : staremtpyGlyph);

		if (device.hidden==true) 
			glyphs.push(hiddenGlyph);
		if (device.invisible==true) 
			glyphs.push(invisibleGlyph);
		
		var template="{0} <small class='altui-device-title-name'>{1}</small>";
		return template.format(glyphs.join(' '), device.name);
	}
	
	function _defaultDeviceDrawWatts( device ) {
		var html ="";
		var watts = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 
		if (isNaN(watts)==false) 
			html += wattTemplate.format(watts);
		else {
			watts = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'UserSuppliedWattage' )); 
			if (isNaN(watts)==false) 
				html += wattTemplate.format(watts);
		}
		return html;
	};
	function _defaultDeviceDrawAltuiStrings(device) {
		var html ="";
		$.each( ['DisplayLine1','DisplayLine2'],function(i,v) {
			var dl1 = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altui1', v ); 
			if (dl1 != null) 
				html += $("<div class='altui-"+v+"'></div>").text(dl1).wrap( "<div></div>" ).parent().html()
		});
		return html!="" ? html : optHorGlyph;
	};
	function _defaultDeviceDraw( device ) {
		var html = _defaultDeviceDrawWatts(device);
		html += _defaultDeviceDrawAltuiStrings(device);
		return html;
	};

	function _isObject(obj)
	{
		return (Object.prototype.toString.call(obj)== "[object Object]");
	};
	
	function _hasObjectProperty( obj )
	{
		var bFound = false;
		$.each( obj, function(key,val) {
			if ( _isObject(val) )
			{
				bFound=true;
				return false;
			}
		});
		return bFound;
	};
	
// icons http://192.168.1.16/cmh/skins/default/img/devices/device_states/binary_light_default.png
//_devicetypesDB[ device.device_type ].ui_static_data.flashicon
//_devicetypesDB[ device.device_type ].ui_static_data.default_icon
//
//192.168.1.5/cmh/skins/default/img/devices/device_states/../../../icons/intro.png
//192.168.1.16/cmh/skins/default/img/devices/device_states/../../../icons/intro.png
//192.168.1.16/cmh/skins/default/img/icons/intro.png
	function _getDeviceIconPath(device) {
		var id = device.altuiid;
		var controller = MultiBox.controllerOf(id).controller;
		var ui5 = MultiBox.isUI5( controller );
		var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);
		var icon='';
		switch( device.device_type ) {
			case 'urn:schemas-futzle-com:device:CountdownTimer:1': 
				icon = '//apps.mios.com/plugins/icons/1588.png';
				break;
			default:
				var str = "";
				var src = defaultIconSrc;
				var dt = _devicetypesDB[ device.device_type ];
				AltuiDebug.debug("Icon for device altuiid:"+device.altuiid+"  device.type:"+device.device_type);
				if ((dt != undefined) && (dt.ui_static_data!=undefined))
				{
					//dt.ui_static_data.DisplayStatus
					//dt.ui_static_data.state_icons
					
					// check if there are objects in dt.ui_static_data.state_icons
					if (dt.ui_static_data.state_icons !=undefined)	//  some state icons found
					{
						var si = dt.ui_static_data.state_icons;
						if (_hasObjectProperty(si) == true )	// UI7 style
						{
							// enumerate each object until a condition is met true
							var bFound = false;
							$.each( si , function(key,obj) {
								if (_isObject(obj) && (obj.img!=undefined) ) {
									// obj.conditions is an array
									// obj.img s the icon
									if (MultiBox.evaluateConditions(device, device.subcategory_num || -1, obj.conditions))
									{
										bFound = true;
										str = obj.img;
									}
								}
								return (bFound==false);
							});
							// in UI7 if icon path starts with .. it is relative to skins/default/img/devices/device_states/
						}
						else	// UI5 style
							if (dt.ui_static_data.flashicon != undefined)
							{
								//The filename in flashicon undergoes a special transformation for variable icons. 
								//The extension ".png" is changed to "_0.png", "_25.png", "_50.png", "_75.png" or "_100.png" 
								//depending on the value of the service variable, linearly scaled from its range of 0:(MaxValue-MinValue) to 0:100. 
								//Values round up; 1-25 produces the "_25" image; 26-50 produces the "_50" image, and so on. 
								// For images which are not found (for instance, if the web server returns 404 Not Found) the default image is used.
								
								// mostlikely in UI5 icons are not located in devicestates folder, so let's fix it
								var baseIconName = dt.ui_static_data.flashicon;
								AltuiDebug.debug("UI5 style static baseIconName:"+baseIconName);
								var dot = baseIconName.lastIndexOf('.');
								if (dot >=0)
									baseIconName=baseIconName.substr(0,dot);
								if (baseIconName.substring(0,4)!="http")
								{
									baseIconName = "../../../"+baseIconName;
								}
								AltuiDebug.debug("UI5 style static baseIconName modified :"+baseIconName);
								var ds = dt.ui_static_data.DisplayStatus;
								if ((ds.Service != undefined) && (ds.Variable != undefined))
								{
									var variable = MultiBox.getStatus( device, ds.Service, ds.Variable );
									if (variable==null) 
										variable=0;
									var status = variable / (ds.MaxValue - ds.MinValue);
									var val = Math.ceil( status * 4 );
									str = baseIconName + "_" + (isNaN( val * 25 ) ? 0 : (val * 25)) + ".png";
								}
								else
									str = baseIconName + ".png";
							}
							else
								str = si[0] || defaultIconSrc;	// incase si is an empty [}
							AltuiDebug.debug("Icon for device id:"+id+"  str :"+str);
					}
					else {
						// no state icons found
						//str = (dt.ui_static_data.default_icon != undefined) ? dt.ui_static_data.default_icon : dt.ui_static_data.flashicon;
						if (ui5==true)
							str = (dt.ui_static_data.flashicon != undefined) ? dt.ui_static_data.flashicon : dt.ui_static_data.default_icon;
						else
							str = (dt.ui_static_data.default_icon != undefined) ? dt.ui_static_data.default_icon : dt.ui_static_data.flashicon;
						AltuiDebug.debug("Icon for device id:"+id+"  string from json:"+str);
						if (str == undefined) {
							AltuiDebug.debug("Undefined icon in ui_static_data, device.type:"+device.device_type);
							AltuiDebug.debug("dt.ui_static_data:"+JSON.stringify(dt.ui_static_data));
							AltuiDebug.debug("Setting default icon");
							str = "icons/generic_sensor.png";
						}
						str = str.replace(".swf",".png");
						if ( (str == "icons/generic_sensor.png") || (str == "icons/Light_Sensor.png"))
							str = defaultIconSrc;
						else if (str == "icons/Window_Covering.png")
							str = (MultiBox.isUI5( controller ) ? "../../../icons/Window_Covering.png" : "../../icons/Window_Covering.png");
						// //192.168.1.16/cmh/skins/default/img/devices/device_states/../../icons/Window_Covering.png
						else if (str.substr(0,6) == "icons/")
							str = "../../../" +str;
						AltuiDebug.debug("Icon for device id:"+id+"  string after correction:"+str);
					}	
				}
				else {
					AltuiDebug.debug("Icon for device id:"+id+"  DeviceType unknown or not static data");
					str = defaultIconSrc;
				}
				
				//console.log("type:{0} icon:{1}".format(device.device_type,str));
				if( str.substring(0,4)=="http") {
					AltuiDebug.debug("Icon for device id:"+id+"  IconPath:"+str);
					return str;
				}
				
				if (str.substring(0,14)=="data:image/png")
					icon = str;
				else 
					icon = MultiBox.getIconPath(controller, str );

				AltuiDebug.debug("Icon for device id:"+id+"  IconPath:"+icon);
				break;
		};
		return icon;
	};

	function _deviceIconHtml( device, zindex )	// deviceid if device is null
	{
		var controller = MultiBox.controllerOf(device.altuiid).controller;
		//
		// get ALTUI plugin definition to see if we have a custom icon drawing , so allways on master controller => 0!
		//
		var _devicetypesDB = MultiBox.getALTUITypesDB();	// master controller
		
		if (device==null)
			return "<img class='altui-device-icon pull-left img-rounded' data-org-src='/err' src='{0}' alt='_todo_' onerror='UIManager.onDeviceIconError(\"{1}\")' {2} ></img>".format(
				defaultIconSrc,
				device.altuiid,
				(zindex ? " style='z-index:{0};' ".format(zindex) : "" )
				);
			// return "<img class='altui-device-icon pull-left img-rounded' data-org-src='/err' src='"+defaultIconSrc+"' alt='_todo_' "+(zindex ? "style='z-index:{0}'" : "")+" onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";		
		// if there is a custom function, use it
		if (_devicetypesDB[ device.device_type ]!=null && _devicetypesDB[ device.device_type ].DeviceIconFunc!=null) {
			return  Altui_ExecuteFunctionByName(_devicetypesDB[ device.device_type ].DeviceIconFunc, window, device);
		}
		
		//otherwise
		var iconPath = _getDeviceIconPath( device );
		var iconDataSrc = "";
		if (MultiBox.isRemoteAccess()) {
			iconDataSrc = IconDB.getIconContent( controller, iconPath, function(data) {
				$("img[data-org-src='"+iconPath+"']").attr('src',data);
			});
		}
		else
			iconDataSrc = iconPath;
		return "<img class='altui-device-icon pull-left img-rounded' data-org-src='"+iconPath+"' src='"+iconDataSrc+"' alt='_todo_' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
	}
	
	function _deviceDraw(device) {
		var id = device.altuiid;
		var iconHtml = _deviceIconHtml( device );
		var batteryHtml ="";
		var batteryLevel = MultiBox.getDeviceBatteryLevel(device);
		if (batteryLevel != null)
		{
			var color="danger";
			if (batteryLevel>=80)
				color = "success";
			else if (batteryLevel>=30)
				color = "info";
			else if (batteryLevel>=10)
				color = "warning";
			color = "progress-bar-"+color;
			
			var batteryHtmlTemplate="";
			batteryHtmlTemplate+="<div class='altui-battery progress pull-right' style='width: 35px; height: 15px;'>";
			batteryHtmlTemplate+="  <div class='progress-bar {1}' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='min-width: 1em; width: {0}%;'>";
			batteryHtmlTemplate+="    {0}%";
			batteryHtmlTemplate+="  </div>";
			batteryHtmlTemplate+="</div>";
			batteryHtml = batteryHtmlTemplate.format(batteryLevel,color);
		}
		
		var dropdownTemplate =  "";
		
		dropdownTemplate +=  "<div class='btn-group pull-right'>";
		dropdownTemplate += "<button class='btn btn-default btn-xs dropdown-toggle altui-device-command' type='button' data-toggle='dropdown' aria-expanded='false'>"; 
		dropdownTemplate += "<span class='caret'></span>";
		dropdownTemplate += "</button>";
		dropdownTemplate += "<ul class='dropdown-menu' role='menu'>";
		dropdownTemplate += "<li><a id='"+device.altuiid+"' class='altui-device-variables' href='#' role='menuitem'>Variables</a></li>";
		dropdownTemplate += "<li><a id='"+device.altuiid+"' class='altui-device-actions' href='#' role='menuitem'>Actions</a></li>";
		dropdownTemplate += "<li><a id='"+device.altuiid+"' class='altui-device-controlpanelitem' href='#' role='menuitem'>Control Panel</a></li>";
		dropdownTemplate += "</ul></div>";
		dropdownTemplate += "<div class='pull-right text-muted'><small>#"+device.altuiid+" </small></div>";

		var devicecontainerTemplate	= "<div class='panel panel-{4} altui-device' data-altuiid='{5}' id='{0}'>"
		devicecontainerTemplate	+=		"<div class='panel-heading altui-device-heading'>"+dropdownTemplate+batteryHtml+"<div class='panel-title altui-device-title' data-toggle='tooltip' data-placement='left' title='{2}'>{1}</div></div>";
		devicecontainerTemplate	+=  	"<div class='panel-body altui-device-body'>";
		devicecontainerTemplate	+= 	  	iconHtml;
		devicecontainerTemplate	+= 	  	"{3}";
		devicecontainerTemplate	+= 	  "</div>";
		devicecontainerTemplate	+= 	  "</div>";
		
		var deviceHtml ="";
		if ( id /*&& ( (device.invisible == undefined) || (device.invisible ==false) )*/ ) 
		{
			var tooltip=[];
			$.each( device, function(key,val) {
				var typ = Object.prototype.toString.call(val);
				if ((typ!="[object Object]") && (typ!="[object Array]")){
					tooltip.push("{0}: {1}".format(key,val)); 
				}
			});
			tooltip = tooltip.join('\n');
		
			// check which plugin function to call by deviceType
			// if not, defaults to _defaultDeviceDraw()
			
			var devicebodyHtml = "";
			var controller = MultiBox.controllerOf(device.altuiid).controller;

			//
			// get ALTUI plugins definition, this is allways on master controller, so controller 0 !
			//
			var _devicetypesDB = MultiBox.getALTUITypesDB();	// master controller / Plugin information
			if (device.device_type.startsWith('urn:schemas-dcineco-com:device:MSwitch')) {
				devicebodyHtml+=ALTUI_PluginDisplays.drawMultiswitch(device);
			} else if (_devicetypesDB[ device.device_type ]!=null && _devicetypesDB[ device.device_type ].DeviceDrawFunc!=null) {
				//drawfunction = eval( _devicetypesDB[ device.device_type ].DeviceDrawFunc );
				devicebodyHtml+= Altui_ExecuteFunctionByName(_devicetypesDB[ device.device_type ].DeviceDrawFunc, window, device);
			}
			else {
				devicebodyHtml+= _defaultDeviceDraw(device);
			}
			// $("div.altui-device#"+id+" div.panel-body" ).append(deviceHtml);
			deviceHtml = devicecontainerTemplate.format(
				id,
				_enhancedDeviceTitle(device),
				tooltip,
				devicebodyHtml,
				UIManager.jobStatusToColor(device.status),
				device.altuiid);
			device.dirty=false;
		}
		return deviceHtml;
	};

	function _sceneDraw(scene,norefresh) {
		function _findSceneNextRun(scene) {
			var nextrun=0;
			if (scene.timers != undefined) {
				$.each( scene.timers , function(idx, timer) {
					nextrun = (nextrun==0) ? timer.next_run : Math.min(nextrun,timer.next_run);
				});
			}
			return nextrun;
		};
		var delButtonHtml = buttonTemplate.format( scene.altuiid, 'btn-xs altui-delscene pull-right', deleteGlyph,'default');
		var pauseButtonHtml = glyphTemplate.format( "off", _T("Pause Scene") , 'altui-pausescene ' + ((scene.paused>0) ? 'paused':'activated'));
		var favoriteHtml = (scene.favorite==true) ? starGlyph : staremtpyGlyph;
		var label = ((scene.hidden==true) ? hiddenGlyph+' ' : '') + scene.name;

		var lastrun = (scene.last_run != undefined) ? okGlyph+" "+_toIso(new Date(scene.last_run*1000)) : '';
		lastrun = lastrun.replace('T',' ');
		var nextrun = _findSceneNextRun(scene);
		nextrun = (nextrun==0) ? '' : timeGlyph+" "+_toIso(new Date(nextrun*1000));
		nextrun = nextrun.replace('T',' ');
		
		var idDisplay = "<div class='pull-right text-muted'><small>#"+scene.altuiid+" </small></div>";
				
		var scenecontainerTemplate = "";
		scenecontainerTemplate	+=  "<div class='panel panel-default altui-scene "+((norefresh==true) ? 'altui-norefresh': '') +"' id='{0}' data-altuiid='{0}'>"
		scenecontainerTemplate	+=	"<div class='panel-heading altui-scene-heading'>"+delButtonHtml +idDisplay+" <span class='panel-title altui-scene-title' data-toggle='tooltip' data-placement='left' title='{2}'>"+pauseButtonHtml+favoriteHtml+"<small>{1}</small></span></div>";
		scenecontainerTemplate	+=  "<div class='panel-body altui-scene-body'>";
		scenecontainerTemplate	+=  "<small class='altui-scene-date text-muted pull-right'>{6}</small><small class='altui-scene-date text-info pull-right'>{7}</small>";
			scenecontainerTemplate	+=  "<table>";
				scenecontainerTemplate	+=  "<tbody>";
				scenecontainerTemplate	+=  "<tr>";
					scenecontainerTemplate	+=  "<td>{3}</td>";
					scenecontainerTemplate	+=  "<td>";
						scenecontainerTemplate	+=  "{4}{5}";
					scenecontainerTemplate	+=  "</td>";
				scenecontainerTemplate	+=  "</tr>";
				scenecontainerTemplate	+=  "</tbody>";
			scenecontainerTemplate	+=  "</table>";
		scenecontainerTemplate	+=  "</div>";
		scenecontainerTemplate	+=  "</div>";

		var runButtonHtml = buttonTemplate.format( scene.altuiid, 'altui-runscene', _T("Run")+"&nbsp;"+runGlyph,'primary');
		var editButtonHtml = buttonTemplate.format( scene.altuiid, 'altui-editscene pull-left', wrenchGlyph,'default');
		var calendarHtml = buttonTemplate.format( scene.altuiid, 'altui-scene-history pull-left', calendarGlyph,'default');
		return scenecontainerTemplate.format(scene.altuiid, label, 'tooltip', runButtonHtml , editButtonHtml , calendarHtml , lastrun, nextrun);
	};
	
	function _cameraDraw(device,size,zindex) // size:1,2,3,... 1=220px
	{
		var obj = null;
		// if (size==undefined)
			// size={
				// width: 220,
				// height:265
			// };
			
		if (device) {
			var directstreaming = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" );
			if (MultiBox.isRemoteAccess() || isNullOrEmpty(directstreaming) || isIE11()  )
			{
				obj = $("<img></img>")
					.attr('src',"data_request?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
					.css("max-width","100%")
					.css("max-width","100%")
					.css("width","100%")
					.css("height","100%")
					.css("z-index",(zindex ? zindex : 0))
					.attr("data-camera",device.altuiid);
				var timeout = null;
				function _resfreshIt(id) {
					var cam = $("img[data-camera='"+id+"']");
					if ($(cam).length>=1) {
						$(cam).attr('src',"data_request?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime());
						timeout = setTimeout(function() { _resfreshIt(id); } , 1500 );
					}
				};
				timeout = setTimeout(function() { _resfreshIt(device.altuiid); } , 1500 );
			}
			else
			{
				var streamurl = "url(http://{0}{1})".format(
					device.ip,	//ip
					MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" )	//DirectStreamingURL
				);

				obj = $("<div ></div>") .css({
								"background-image": streamurl,
								"background-size": "contain",
								"background-repeat": "no-repeat"
							})
					.css("max-width","100%")
					.css("max-width","100%")
					.css("z-index",(zindex ? zindex : 0))
					// .css("width","100%")
					// .css("height","100%")
					.height((size!=undefined)&&(size.height!=undefined) ? size.height : 300)
					.width((size!=undefined)&&(size.width!=undefined)? size.width : Math.floor(300*640/480))
			}
		} else
			obj = $("<div >"+_T("Unknown Device")+"</div>");
		return obj.wrap( "<div></div>" ).parent().html();
	};

	function _fixHeight( domparent ) {
		// Because when you give absolute position to something, you take it out of the layout flow. 
		// This means that its dimensions are no longer used to calculate its parent's height, among everything else
		var parentHeight = $(domparent).height();
		var maxHeight = 0;
		$(domparent).children().each( function(idx,elem) {
			// var p = $(elem).position();
			var height = $(elem).outerHeight();
			var top = parseInt($(elem).css('top'));
			if ($.isNumeric(top)==false)
				top=0;
			maxHeight = Math.max(maxHeight, top + height);
		});
		maxHeight+=15;	// bottom padding
		
		// Reposition error msg at the bottom
		$(domparent).find("pre").each( function(idx) {
			$(this).css( {top: maxHeight, position:'absolute'} );
			maxHeight += ($(this).outerHeight());	// this = PRE
		});
		$(domparent).height(maxHeight);
	};
			
	function _codifyName(name)
	{
		return name.replace(/:/g,"_").replace(/-/g,"_");
	}
	
	function  _deviceDrawControlPanelJSTab( device, tab, domparent ) {
		var devid = device.altuiid;

		$(domparent).addClass("altui-norefresh");	// javascript tabs are not refreshed
		
		var script = tab.ScriptName;
		if (script =="shared.js")
			return;	// do not want UI5 tool pages !
		var func = tab.Function;
		set_JSAPI_context( {
			set_panel_html_callback: function(html) {
				$(domparent).html(html);
			},
			deviceid: device.id,
			altuiid: device.altuiid,
			controllerid: MultiBox.controllerOf(device.altuiid).controller,
		});
		// set_set_panel_html_callback(function(html) {
			// $(domparent).html(html);
		// });
		try {
			var result = eval( func+"("+device.id+")" );	// we need the real VERA box ID here
		}
		catch(err) {
			set_panel_html("an error occurred while displaying the javascript tab. devid: "+devid+" err:"+err.message+" <pre>stack:"+err.stack+"</pre>");
		}		
		// _fixHeight(domparent);
	};
	
	function  _deviceDrawControlPanelTab( device, tab, domparent ) {
		var devid = device.altuiid;
		function _prepareSceneGroupOffset( tab, control ) {
			var offset={top:0, left:0 };
			// var ctrlgroupid = control.ControlGroup;
			// var ctrlgroup = null;
			// $.each(tab.ControlGroup, function(i,grp) {
				// if (grp.id == ctrlgroupid) {
					// ctrlgroup=grp;
					// return false;
				// }
			// })
			// if (ctrlgroup) {
				// var scenegrpid = ctrlgroup.scenegroup;
				// var scenegrp = null;
				// $.each(tab.SceneGroup, function(i,scn) {
					// if (scn.id==scenegrpid) {
						// scenegrp=scn;
						// offset.top = scn.top || 0;
						// offset.left = scn.left || 0;
						// return false;
					// }
				// });
				
			// }
			// offset = {
				// top:offset.top*24,
				// left:offset.top*80
			// };
			return offset;
		};
		
		function _displayControl( domparent, device, control, idx, groupoffset ) {
			var paddingleft = parseInt($("#altui-device-controlpanel-"+devid).css("padding-left")) + (groupoffset.left || 0);
			var paddingtop = parseInt($("#altui-device-controlpanel-"+devid+" .panel-body ").css("padding-top")) + (groupoffset.top || 0);
			switch(control.ControlType) {
				case "line_break": 
				case "spacer": 
					// no action to do for control panel, only for UI7 dashboard
					break;
				case "label": {
					$( "<p>"+control.Label.text+"</p>" )
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + (control.Display.Top || 0), 
							left: paddingleft  + (control.Display.Left || 0), 
							position:'absolute'})
						// .width(control.Display.Width)
						.height(control.Display.Height);
					break;
				};
				case "input": {
					$( "<input id='{0}'></input>".format(control.ID))
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + (control.Display.Top || 0), 
							left: paddingleft  + (control.Display.Left || 0), 
							position:'absolute'})
						.width(control.Display.Width)
						.height(control.Display.Height);
					break;
				};
				case "variable": {
					// Width is ignored on UI5
					$( "<p>{0}</p>".format( MultiBox.getStatus( device, control.Display.Service, control.Display.Variable ) || "" ))
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + (control.Display.Top || 0), 
							left: paddingleft  + (control.Display.Left || 0), 
							position:'absolute'})
						// .width(control.Display.Width)
						.height(control.Display.Height);
					break;
				};	
				case "multi_state_button": {
					var value1 = MultiBox.getStatus( device, control.states[0].Display.Service, control.states[0].Display.Variable );
					var value2 = MultiBox.getStatus( device, control.states[1].Display.Service, control.states[1].Display.Variable );
					var armedValue1 = control.states[0].Display.Value;
					var armedValue2 = control.states[1].Display.Value;
					var bInverted = (armedValue2>armedValue1);
					var csvlabel = (bInverted ? "{1},{0}" : "{0},{1}").format( control.states[1].Label.text,control.states[0].Label.text);
					var onoff = (bInverted ? (value2==armedValue2): (value1==armedValue1) );
					if (device.device_type == "urn:schemas-upnp-org:device:DimmableLight:1")		// special case ! VERA is not following the JSON file here
						onoff = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
					var uniqid = devid+"-"+idx;
					var html=ALTUI_PluginDisplays.createOnOffButton(onoff , "altui-device-msb-"+uniqid , csvlabel);
					var obj = $(html);
					obj .appendTo( $(domparent) )
						.css({ position:'absolute' });				
					if (control.Display) {
						if (control.Display.Height)
							obj.height(control.Display.Height);	
						if (control.Display.Width)
							obj.width(control.Display.Width);
						if (control.Display.Top)
							obj.css( { top: control.Display.Top } );
						obj.css( { left: paddingleft+ (control.Display.Left || 0) } );
					}
					$("div#altui-device-msb-"+uniqid).off('click touchend');
					$("div#altui-device-msb-"+uniqid).on('click touchend',function() {
						var state = (bInverted) ? control.states[1] : control.states[0];
						ALTUI_PluginDisplays.toggleButton(devid, "div#altui-device-msb-"+uniqid, state.Display.Service, state.Display.Variable, function(id,newval) {
							var parameters = {};
							var whichone = (bInverted) ? newval : 1-newval;
							parameters[ control.states[whichone].Command.Parameters[0].Name ] = control.states[whichone].Command.Parameters[0].Value; 
							MultiBox.runAction( device, 
								control.states[whichone].Command.Service, control.states[whichone].Command.Action, 
								parameters );
						});						
					});
					
					break;
				};
				case "button": {
					if (control.Display) 
					{
						var bActif = false;
						if (control.Display.Service && control.Display.Variable) {
							var valueToMatch = control.Display.Value || 1 ;
							var valueNow = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable )
							bActif = (valueToMatch==valueNow);
						}
						var button = $( "<button type='button' class='btn btn-{1} altui-controlpanel-button'>{0}</button>".format(control.Label.text, bActif ? 'primary' : 'default'))
							.appendTo( $(domparent) );
						
						control.Display.Width = Math.max( control.Display.Width || 10 , $(button).outerWidth() );
						if ((control.Display.Top && control.Display.Left) /*|| (groupoffset.top && groupoffset.left)*/){
							button.css({
									top: paddingtop + (control.Display.Top  || 0), 
									left: paddingleft  + (control.Display.Left  || 0), 
									"min-width": control.Display.Width+"px",	// forcing bootstrap
									"max-width": control.Display.Width+"px",	// forcing bootstrap
									position:'absolute'
									});
						}
						else {
							button.css({
									"min-width": control.Display.Width+"px",	// forcing bootstrap
									"max-width": control.Display.Width+"px",	// forcing bootstrap
									"margin-top": "5px",	
									"margin-left": "10px",	
									"margin-right": "10px",	
									"margin-bottom": "5px",	
									})
									
									.addClass('pull-left');
						}
						button
							.width(control.Display.Width)
							.height(control.Display.Height)
							.click( function() {
								//"Command":{"Service":"urn:a-lurker-com:serviceId:InfoViewer1","Action":"SetParameters","Parameters":[{"Name":"newLuaPattern","ID":"thePattern"}]}}	
								var parameters = {};
								$.each(control.Command.Parameters, function(idx,param) {
									if (param.Value )
										parameters[ param.Name ] = param.Value;
									if (param.ID)
										parameters[ param.Name ] = $(domparent).find("#"+param.ID).val();
								});
								MultiBox.runAction( device, control.Command.Service, control.Command.Action, parameters, null );
							});	
					}
					else {
						//UI5 does not display button
					}
					break;
				};
				case "slider": {
					var val = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable ) || 0;
					var uniqid = devid+"-"+idx;
					var symbol = control.LabelSymbol ? control.LabelSymbol.text : '';
					$("<div id='altui-slider-horizontal-value-"+uniqid+"' class=''></div>")
						.html( val+symbol )
						.appendTo( $(domparent) )
						.css({
							top: control.Display.Top, 
							left: control.Display.Left, 
							position:'absolute'})
						// .width(control.Display.Width)
						.height(30 /*control.Display.Height*/ );		
						
					var obj = $("<div id='altui-slider-horizontal-"+uniqid+"'></div>")
						.appendTo( $(domparent) )
						.css({
							top: control.Display.Top+30, 
							left: control.Display.Left, 
							position:'absolute'})
						.width(control.Display.Width)
						// .height(control.Display.Height );
						
						obj.slider( {
						  // range: "min",
						  min: parseFloat(control.Display.MinValue || 0 ),
						  max: parseFloat(control.Display.MaxValue || 100),
						  value: val ,
						  step: 1,
						  slide: function( event, ui ) {
							$("#altui-slider-horizontal-value-"+uniqid).html(ui.value+symbol);
						  },
						  change: function( event, ui ) {
							var params={};
							params[ control.Command.Parameters[0].Name ] = ui.value;
							MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						  } 
						});
					break;
				};
				case "slider_vertical": {
					function _onClickSlider(event) {
						var uniqid = event.data.uniqid;
						var control = event.data.control;
						var htmlid = "altui-slider-vertical-value-"+uniqid;
						var val = $(this).text();	// it is a div
						var cls = $(this).attr('class');
						var style = $(this).attr('style') + ' width:50px; ';
						$(this).hide();
						$("input#"+htmlid).val( val).show().focus();
					};
					function _displaySliderValue(uniqid,control,val) {
						var color = control.ControlCode == "heating_setpoint" ? "text-danger" : "text-primary";
						var htmlid = "altui-slider-vertical-value-"+uniqid;
						$("<div id='"+htmlid+"' class='"+color+"'>"+val*10+"</div>")
							.appendTo( $(domparent) )
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
								position:'absolute'})
							// .width(control.Display.Width)
							.height(20 /*control.Display.Height*/ )		// height given by class on UI5
							.click( {uniqid:uniqid, control:control},_onClickSlider);
						$("<input required id='"+htmlid+"' type='number' step='"+1/10+"' value='' />")
							.appendTo( $(domparent) )
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
								position:'absolute'})
							// .width(control.Display.Width)
							.height(25 /*control.Display.Height*/ )		// height given by class on UI5
							.width(50)
							.hide()
							.change( function() {
								var val = $(this).val();
								var htmlid = $(this).prop('id');
								$("div#"+htmlid).text(val).show();
								$("div#altui-slider-vertical-"+uniqid).slider("value", val*10 );
								$("input#"+htmlid).hide();	// toggle both DIV and INPUT
							});
					};
					
					// {"ControlGroup":"6","ControlType":"slider_vertical","top":"0","left":"3.5","ControlPair":"1","ID":"NewCurrentSetpointCool","Style":"numeric","Display":{"Service":"urn:upnp-org:serviceId:TemperatureSetpoint1_Cool","Variable":"CurrentSetpoint","Top":30,"Left":570,"Width":100,"Height":20},"Command":{"Service":"urn:upnp-org:serviceId:TemperatureSetpoint1_Cool","Action":"SetCurrentSetpoint","Parameters":[{"Name":"NewCurrentSetpoint","ID":"NewCurrentSetpointCool"}]},"ControlCode":"cooling_setpoint"}
					var val = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable );
					var uniqid = devid+"-"+idx;
					_displaySliderValue(uniqid,control,val)

						
					$("<div id='altui-slider-vertical-"+uniqid+"'></div>")
						.appendTo( $(domparent) )
						.css({
							top: control.Display.Top+30, 
							left: control.Display.Left, 
							position:'absolute'})
						// .width(control.Display.Width)
						.height(100 /*control.Display.Height*/ )		// height given by class on UI5
						.slider( {
						  orientation: "vertical",
						  range: "min",
						  min: 0,
						  max: 1000,
						  step: 1,
						  value: val*10 ,
						  slide: function( event, ui ) {
							$("#altui-slider-vertical-value-"+uniqid).text(ui.value/10);
							// $( "#amount" ).val( ui.value );
						  },
						  change: function( event, ui ) {
							var params={};
							params[ control.Command.Parameters[0].Name ] = ui.value/10;
							MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						  } 
						});
					break;
				};
				case "image": {
					//{"ControlGroup":"3","ControlType":"image","top":"0","left":"0","Display":{"url":"?id=request_image&cam=","Top":0,"Left":0,"Width":320,"Height":240}}
					var container = $(domparent).parents(".altui-device-controlpanel-container").addClass("altui-norefresh");
					var directstreaming = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" );
					if (MultiBox.isRemoteAccess() || isNullOrEmpty(directstreaming) || isIE11() ) {
						var img = $("<img></img>")
							.appendTo($(domparent))
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
								position:'absolute'})
							// .attr('src',control.Display.url+device.id+"'&t="+ new Date().getTime())
							.attr('src',control.Display.url+device.id)
							.attr('data-camera',device.altuiid)
							.height(280)
							.width(370);
							// .height(control.Display.Height)
							// .width(control.Display.Width);
						var timeout = null;
						function _refreshIt(id) {
							var cam = $("img[data-camera='"+id+"']");
							if ( $(cam).length>=1 ) {
								img.attr('src',control.Display.url+device.id+"'&t="+ new Date().getTime());
								setTimeout( function() { _refreshIt(id); }, 1500 );
							}
						};
						timeout = setTimeout( function() { _refreshIt(device.altuiid); }, 1500 );
					} else {
						var streamurl = "url(http://{0}{1})".format(
							device.ip,	//ip
							directstreaming	//DirectStreamingURL
						);
						var div = $("<div></div>")
							.appendTo($(domparent))
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
								"background-image": streamurl,
								"background-size": "contain",
								"background-repeat": "no-repeat",
								position:'absolute'})
							.height(280)
							.width(370);
							// .height(control.Display.Height)
							// .width(control.Display.Width);
					}
					break;
				};
				default: {
					if (AltuiDebug.IsDebug())
						$(domparent).append("<pre>Unknown control type:"+control.ControlType+". See Debug</pre>");
				};
			};
		};

		$(domparent).css({position: 'relative'});
		if (tab.TabType=="flash") {
			$.each( tab.Control, function (idx,control) {
				var offset = _prepareSceneGroupOffset( tab, control );
				_displayControl( domparent, device, control, idx, offset );
			});
		}

		// fix height because absolute positioning removes element from the DOM calculations
		_fixHeight( domparent );
	};
	
	function _deviceDrawControlPanelOneTabContent(device, parent, tabidx ) {
		// Allways master controller for customer javascript functions, so 0!
		var _altuitypesDB = MultiBox.getALTUITypesDB();	// Master controller
		var dt = _altuitypesDB[device.device_type];
		if (dt!=null && dt.ControlPanelFunc!=null && (tabidx==0)) {
			Altui_ExecuteFunctionByName(dt.ControlPanelFunc, window, device, parent);
			_fixHeight( parent );
		}
		else if (tabidx>0) {
			// on the contrary, UI5/7 static definition file is part of the controller specific device type DB 
			// so real controller this time
			var controller = MultiBox.controllerOf(device.altuiid).controller;
			var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);	// Master controller
			var dt = _devicetypesDB[device.device_type];
			var tab = dt.ui_static_data.Tabs[tabidx-1];
			if ((tab.TabType!="javascript") || (tab.ScriptName!="shared.js")) {
				if ( tab.TabType=="flash") {
					_deviceDrawControlPanelTab( device, tab, parent );		// row for Flash Panel
				} else {
					_deviceDrawControlPanelJSTab( device, tab, parent );
				}
			}
		}
	};
	
	function _setActiveDeviceTabIdx( idx) {
		$("#altui-devtab-tabs li").removeClass('active');
		if (idx!=null)
			$("li#altui-devtab-"+idx).find("a").tab('show');
		else
			$("li#altui-devtab-0").find("a").tab('show');
	};	
	
	function _getActiveDeviceTabIdx() {
		var obj = $("#altui-devtab-tabs li.active");
		if (obj.length ==0)
			return null;
		var pagename = obj.prop('id');
		return pagename.substring( "altui-devtab-".length);
	};	
			
	function _displayActiveDeviceTab(activeTabIdx, device, domparent) {
		if ($(domparent).hasClass("altui-norefresh")==false) {
			$(domparent).html("");
			_deviceDrawControlPanelOneTabContent(device, domparent, activeTabIdx );
		}
	};

	function _deviceDrawControlPanel( device, container ) {
		var controller = MultiBox.controllerOf(device.altuiid).controller;
		var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);		// for MCV display info

		function _deviceDrawDeviceUsedIn( device, container ) {
			var usedin_objects = MultiBox.getDeviceDependants(device);
			var html ="";
			html +="<div class='row'>";
			html += "<div id='altui-device-usedin-"+device.altuiid+"' class='col-xs-12 altui-device-usedin'>"
			html += "<ul>";
			if (usedin_objects.length>0)
				$.each(usedin_objects, function(idx,obj) {
					var info= (obj.action) ? _formatAction(controller,obj.action) : _formatTrigger(controller,obj.trigger);
					var smallbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-sm' aria-label='tbd' title='{3}'>{2}</button>";
					html += "<li>Scene #{0} <span class='text-info'>'{1}'</span>, {2} <span class='text-info'>'{3}'</span>  &nbsp;".format(
						obj.scene, 
						obj.name, 
						obj.type, 
						obj.trigger 
							? "{0} {1} (<small class='text-muted'>{2}</small>)".format(info.name, info.descr,info.condition) 
							: "{0} (<small class='text-muted'>{1}</small>)".format(obj.action.action,info.arguments)
						);
					html += smallbuttonTemplate.format(obj.scene,"btn btn-default btn-sm altui-scene-goto",searchGlyph,_T("See")); // searchGlyph
					html += "</li>";
				});
			else
				html += "<li>{0}</li>".format(_T("Not used in scenes"));
			html += "</ul>";
			// html +=  "<span><pre>{0}</pre></span>".format( JSON.stringify(usedin_objects) );
			html += "</div>";
			html += "</div>";	// row
			$(container).append( html );
			$(".altui-scene-goto").click(function(){
				var altuiid = $(this).prop("id");
				UIManager.pageSceneEdit(altuiid);
			});
		};
		
		function _deviceDrawControlPanelAttributes(device, container ) {
			var devid = device.altuiid;
			// Draw hidding attribute panel
			var html ="";
			html+="<div class='row'>";
			html += "<div id='altui-device-attributes-"+devid+"' class='col-xs-12 altui-device-attributes'>"
			html += "<form class='form'>";
			$.each( device, function(key,val) {
				var typ = Object.prototype.toString.call(val);
				if ((typ!="[object Object]") && (typ!="[object Array]")){
					html += "<div class='col-sm-6 col-md-4 col-lg-3'>";
					html += "<div class='form-group'>";
					html += "<label for='"+key+"'>"+key+"</label>";
					html += _enhanceEditorValue(key,val,devid)
					// html += "<input id='"+key+"' data-altuiid='"+devid+"' class='form-control' value='"+val+"'></input>";
					html += "</div>"
					html += "</div>"
				}
			});
			html += "</form>";
			html += "</div>";
			html += "</div>";	// row
			$(container).append( html );

			$(".altui-device-attributes input").focusout( function( event ) {
				var altuiid = $(this).data('altuiid');
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				var attribute = $(this).prop('id');
				var oldval = $(this).attr('value');	// this is HTML value so old value
				var value = $(this).val();			// this is jq dynamic value so new value
				var input = $(this);
				if (value!=oldval) {
					DialogManager.confirmDialog(_T("Are you sure you want to modify this attribute"),function(result) {
						if (result==true) {
							MultiBox.setAttr(device, attribute, value,function(result) {
								if (result==null) {
									PageMessage.message( "Set Attribute action failed!", "warning" );				
								}
								else {
									PageMessage.message( "Set Attribute succeeded! a LUUP reload will happen now, be patient", "success" );			
								}
							});
						}
						else {
							$(input).val(oldval);
						}
					});
				}
			});
		};
		
		function _deviceDrawWireFrame( device,container) {
			var devicecontroller = MultiBox.controllerOf(device.altuiid).controller;
			MultiBox.getRooms(null, function(room,idx) {
				return ( MultiBox.controllerOf(room.altuiid).controller == devicecontroller );
			},function(rooms) {
				var htmlRoomSelect = "<select id='altui-room-list' class='form-control input-sm'>";
				if (rooms)
						htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format("No Room",0,'');
						$.each(rooms, function(idx,room) {
							var selected = (room.id.toString() == device.room);
							htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format(room.name,room.id,selected ? 'selected' : '');
						});
				htmlRoomSelect 	  += "</select>";
		
				var htmlDeleteButton= buttonTemplate.format( device.altuiid, 'btn-xs altui-deldevice pull-right', deleteGlyph,'default');;
				var html ="";
				html+="<div class='row'>";
					html +="<div id='altui-device-controlpanel-"+device.altuiid+"' class='col-xs-12 altui-device-controlpanel' data-altuiid='"+device.altuiid+"'>";
					html +="	<div class='panel panel-default'>";
					html +="		<div class='panel-heading form-inline'>";
					html += htmlDeleteButton;
					html +="			<h1 class='panel-title'>{0} {1} {2} (#{3}) "+htmlRoomSelect+"</h1>";
					html +="		</div>";
					html +="		<div class='panel-body'>";
					html +="		</div>";
					html +="	</div>";
					html +="</div>";
				html += "</div>";	// row
				$(container).append( html.format(device.manufacturer || '', device.model || '', device.name || '', device.id) );	
				$("#altui-room-list").change( function() {
					MultiBox.renameDevice(device, device.name, $(this).val() );
				});
			})
		};
			
		function _defereddisplay(bAsync) {
			function _createDeviceTabs( device, bExtraTab, tabs ) {
				var lines= [];
				lines.push("<ul class='nav nav-tabs' id='altui-devtab-tabs' role='tablist'>");
				if (bExtraTab) {
					lines.push( "<li id='altui-devtab-0' role='presentation' ><a href='#altui-devtab-content-0' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format("AltUI") );
				}
				$.each( tabs, function( idx,tab) {
					if ((tab.TabType!="javascript") || (tab.ScriptName!="shared.js")) {
						lines.push( "<li id='altui-devtab-{1}' role='presentation' ><a href='#altui-devtab-content-{1}' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format(tab.Label.text,idx+1) );
					}
				});
				lines.push("</ul>");
				var html = "<div class='tab-content {0}'>".format( (UIManager.UI7Check()==true) ? '' : 'altui-tabcontent-fix');
				if (bExtraTab) {
					html += "<div id='altui-devtab-content-0' class='tab-pane bg-info altui-devtab-content'>";
					html += "</div>";
				}
				$.each( tabs, function( idx,tab) {
					if ((tab.TabType!="javascript") || (tab.ScriptName!="shared.js")) {
						html += "<div id='altui-devtab-content-{0}' class='tab-pane bg-info altui-devtab-content'>".format(idx+1);
						html += "</div>";
					}
				});
				html += "</div>";
				return lines.join('')+html;
			};

			if (_toLoad==0) {
				$(container).append( "<div class='row'><div class='altui-debug-div'></div></div>" );	// Draw hidden debug panel

				container = container.find(".panel-body");	
				var _altuitypesDB = MultiBox.getALTUITypesDB();					// for ALTUI plugin info
				var dt = _devicetypesDB[device.device_type];
				var bExtraTab = (_altuitypesDB[device.device_type] && _altuitypesDB[device.device_type].ControlPanelFunc!=null);
				$(container).append( "<div class='row'>" + _createDeviceTabs( device, bExtraTab, dt.ui_static_data.Tabs ) + "</div>" );

				$(container).find("li a").first().tab('show');	// activate first tab
				var activeTabIdx = _getActiveDeviceTabIdx();
				var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
				_displayActiveDeviceTab(activeTabIdx, device, domparent);

				if (bAsync) {
					$("#altui-device-attributes-"+device.altuiid).toggle(false);		// hide them by default;
					$("#altui-device-usedin-"+device.altuiid).toggle(false);		// hide them by default;
					$(".altui-debug-div").toggle(false);					// hide
				}

				if (AltuiDebug.IsDebug()) {
					$("div.altui-debug-div").append( "<pre>"+JSON.stringify(dt.ui_static_data.Tabs)+"</pre>" );				
				}
				
			}
		};

		var _toLoad = 0;
		_deviceDrawControlPanelAttributes( device, container ); 				// row for attributes
		_deviceDrawDeviceUsedIn( device, container );							// row for device 'used in' info
		_deviceDrawWireFrame(device,container);
				
		var dt = _devicetypesDB[ device.device_type ];
		if ((dt != undefined) && (dt.ui_static_data!=undefined)) {
			// load scripts
			var scripts = {};
			$.each( dt.ui_static_data.Tabs, function( idx,tab) {
				if (tab.TabType=="javascript" && tab.ScriptName!="shared.js")
				{
					var script = tab.ScriptName;
					var func = tab.Function;
					if (scripts[script] == undefined)
						scripts[script]=[];
					scripts[script].push( func );
				}
			});
		
			if (Object.keys(scripts).length==0)
				_defereddisplay(true);
			else
			{
				$.each( scripts , function (scriptname,func){
					var len = $('script[data-src="'+scriptname+'"]').length;
					if (len==0) {				// not loaded yet
						_toLoad ++;
					}
				});
				$.each( scripts , function (scriptname,func){
					var len = $('script[data-src="'+scriptname+'"]').length;
					if (len==0) {				// not loaded yet
						_createScript( scriptname );
						FileDB.getFileContent( controller, scriptname, function(data) {
							_toLoad --;
							// vague tentative to fix the code of loaded script !!!
							var ui7style = false;
							$.each(func, function(i,f) {
								if (f.indexOf('.')!=-1) {
									ui7style=true;
									return false;
								}
							});
							data = _fixScriptPostLoad( scriptname , data, ui7style );
							var code = "//# sourceURL="+scriptname+"\n"+data;
							$('script[data-src="'+scriptname+'"]').text(code);
							_defereddisplay(true);
						})
					}
				})
			}
		}
	};
	
	function _checkAltuiUpdate(data) {
		var re = /\$Revision:\s*(\d*).*\$/; 
		var m;
		if ((m = re.exec(AltUI_revision)) !== null) {
			var jsrevision = parseInt(m[1]);
			var elems = data.split(",");
			var newrev = parseInt(elems[0]);
			var newfeatures = elems[1].split(';');
			if (newrev > jsrevision) {
				DialogManager.confirmDialog(_T("a newer version #{0} of ALTUI is available, do you want to upgrade ?").format(newrev),function(result) {
					if (result==true)
						MultiBox.triggerAltUIUpgrade(elems[2]);
				});
				var html ="<ul>";
				html += $.map(newfeatures,function(e) { return "<li>"+e+"</li>"} ).join('');
				html +="</ul>"
				$("div#dialogModal .row-fluid").append(html);
			}
		}
	};
	
	function _refreshFooter() {
		// refresh footer if needed
		if ($("small#altui-footer span.bg-danger").length == 1) {
			var re = /\$Revision:\s*(\d*).*\$/; 
			var m;
			if ((m = re.exec(AltUI_revision)) !== null) {
				var jsrevision = m[1];
				var info = MultiBox.getBoxInfo()[0];
				var infotbl=[];
				for( var key in info) { infotbl.push( info[key] || "") };
				$("small#altui-footer").html( "<p>AltUI {0}.{1}, amg0,{2}</p>".format(_version,jsrevision,infotbl.join(", ")));
				$("small#altui-footer").append( "<span>"+UIManager.getPayPalButtonHtml( false ) + "</span>");
				
				// JSONP call that will trigger a response with a call to _checkAltuiUpdate(data)
				var url = "//code.mios.com/svn_public/mios_alternate_ui/lastver.txt";
				$.ajax({
				  url: url,
				  dataType: "jsonp",
				  cache:false,
				  success: function (data) {
					  alert(data);
				  }
				});
			}
		}
	};
	
	function _drawRoomFilterButtonAsync( selectedroom ) {
		var dfd = $.Deferred();
		var toolbarHtml="";
		var rooms = $.when(MultiBox.getRooms()).then(function(rooms) {
			toolbarHtml+="	<div class='btn-group' id='altui-device-room-filter'>";
				toolbarHtml+="  <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>";
				toolbarHtml+=  (homeGlyph + '&nbsp;' +_T('Rooms') + "<span class='caret'></span>");
				toolbarHtml+="  </button>";
				toolbarHtml+="  <ul class='dropdown-menu' role='menu' {0}>".format(
					(rooms.length+2>=parseInt(MyLocalStorage.getSettings('Menu2ColumnLimit'))) ? "style='columns: 2; -webkit-columns: 2; -moz-columns: 2;'" : ""
					);
					$.each([{id:-1,name:_T('All')},{id:0,name:_T('No Room')}], function( idx, room) {
						toolbarHtml+="<li><a href='#' id='{1}' data-altuiid='{2}' class='{3}' >{0}</a></li>".format(room.name,room.id,"",(selectedroom==room.id) ? 'bg-primary' : '');
					});
					var namearray = $.map(rooms, function(r) { return r.name;} );
					var filteredrooms = $.grep(rooms, function(room, idx) {
						return $.inArray(room.name ,namearray) == idx;
					});
					$.each(filteredrooms, function( idx, room) {
						toolbarHtml+="<li><a href='#' id='{1}' data-altuiid='{2}' class='{3}'>{0}</a></li>".format(room.name,room.id,room.altuiid,(selectedroom==room.altuiid) ? 'bg-primary' : '');
					});
					toolbarHtml+="  </ul>";
			toolbarHtml+="</div>";			
			dfd.resolve(toolbarHtml);
		});
		return dfd.promise();
	};
		
	function _refreshUIPerDevice(eventname,device) {
		// refresh device panels
		$(".altui-device-controlpanel[data-altuiid='"+device.altuiid+"']").not(".altui-norefresh").each( function(index,element) {			
			// force a refresh/drawing if needed.
			// the event handler for the tab SHOW event will take care of the display of the tab
			var activeTabIdx = _getActiveDeviceTabIdx();
			_setActiveDeviceTabIdx(activeTabIdx);
		});
	};
	
	function _resizeFavorites() {
		// console.log(".altui-favorites-device.length="+$(".altui-favorites-device").length);
		if ($(".altui-favorites-device").length>0) {
			// var first = $($(".altui-favorites-device")[0]);
			// var width = first.innerWidth() 
			var margin = 2*2+4;	// margin + border
			var width = $(".altui-favorites").innerWidth();
			var nperlines = (width>=1200) ? 10 : (width>=992) ? 8 : (width>=768) ? 6 : (width>=500) ? 4 : 3;
			width = ($(".altui-favorites").innerWidth())/nperlines-margin;
			// console.log("width="+width);
			$(".altui-favorites-device").each(function(idx,elem){
				$(elem).outerWidth( width );
				$(elem).outerHeight( width );
			})		
			$(".altui-favorites-scene-content")
				.css("font-size",Math.floor(width/2))
				.css("margin-top",Math.floor(width/4));	// width == height
			$(".altui-favorites-device-content")
				.css("font-size",Math.floor(width/4))
				.css("margin-top",Math.floor(width/2) - Math.floor(width/8));	// width == height
		}
	};

	function _redrawFavorites() {
		function _drawFavoriteDevice(device) {
			var html="";
			html += "<div class='altui-favorites-device-content' data-altuiid='{0}'>".format(device.altuiid);
			switch(device.device_type) {
				case "urn:schemas-upnp-org:device:BinaryLight:1":
					var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' ); 
					status = parseInt(status);
					html += "<span class='{1}'>{0}</span>".format(
						status==1 ? "On" : "Off",
						status==1 ? "text-success" : "text-danger"
					);
					break;
				case "urn:schemas-micasaverde-com:device:WindowCovering:1"	:
				case "urn:schemas-upnp-org:device:DimmableLight:1":
					var loadLevelStatus = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelStatus' ); 
					html += "<span>{0}%</span>".format(loadLevelStatus);				
					break;
				case "urn:schemas-micasaverde-com:device:HumiditySensor:1":
					var level = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:HumiditySensor1', 'CurrentLevel' ); 
					html += "<span>{0}%</span>".format(level);				
					break;
				case "urn:schemas-micasaverde-com:device:TemperatureSensor:1":
					var temp = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' ); 
					// var ws = MultiBox.getWeatherSettings();
					// if (ws.tempFormat==undefined)
						// ws.tempFormat="";
					html += "<span>{0}</span>".format(temp+"&deg;"/*+ws.tempFormat*/);
					break;			
				case "urn:schemas-micasaverde-com:device:MotionSensor:1":
					var tripped = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Tripped' )); 
					html += ("<span>{0}</span>".format( (tripped==true) ? "<span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'></span>" : ""));
					break;
				case "urn:schemas-upnp-org:device:VSwitch:1":
					var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VSwitch1', 'Status' ); 
					status = parseInt(status);
					html += "<span class='{1}'>{0}</span>".format(
						status==1 ? "On" : "Off",
						status==1 ? "text-success" : "text-danger"
					);
					break;
				default:
					html += "-";
					break;
			}
			html += "</div>";
			return html;
		};
		function _drawFavoriteScene(scene) {
			return "<div data-altuiid='{1}' class='altui-favorites-scene-content'>{0}</div>".format(runGlyph,scene.altuiid);
		};
		
		var favoriteTemplate = "";
		favoriteTemplate += "<div class='altui-favorites-container ' >";
		// favoriteTemplate += "<div class='altui-favorites-container col-xs-3 col-sm-3 col-md-2 col-lg-1' >";
			favoriteTemplate += "<div class='altui-favorites-device' >";
				favoriteTemplate += "<div class='pull-left altui-favorites-title'>";
					favoriteTemplate += "<small class='text-muted'>";
					favoriteTemplate += "{0}";
					favoriteTemplate += "</small>";
				favoriteTemplate += "</div>";
				favoriteTemplate += "{1}";
			favoriteTemplate += "</div>";
		favoriteTemplate += "</div>";

		var html = "";
		// $(".altui-favorites").toggle(false);
		MultiBox.getDevices(null , function(device) { return device.favorite; }, function(devices) {
			html += "<div class='altui-favorites row'>";
			$.each(devices, function(idx,device) {
				html +=favoriteTemplate.format(device.name,_drawFavoriteDevice(device));
			})

			MultiBox.getScenes(null, function(scene) { return scene.favorite; }, function (scenes) {
				$.each(scenes, function(idx,scene) {
					html +=favoriteTemplate.format(scene.name,_drawFavoriteScene(scene));
				})
			html += "</div>";		

				// html += "<div class='col-xs-12'>";
				// html +="	<br><p>"+_T("This plugin is a work in progress, it will continuously evolve over time.");
				// html +=	_T("You may check out the evolutions on the Micasaverde <a href='http://forum.micasaverde.com/index.php/topic,30310.msg216129.html#msg216129'>Forum</a>")+"</p>";
				// html += "</div>";		

				$(".altui-favorites").replaceWith(html);
				// $(".altui-favorites").toggle(true);
				_resizeFavorites();
			})
		});
	};

	function _refreshUI( bFull, bFirstTime ) {
		// refresh rooms
		// refresh devices
		AltuiDebug.debug("_refreshUI( {0}, {1} )".format(bFull,bFirstTime));
		
		// $(".altui-device") which do not have a btngroup in open state
		// to avoid a refresh to erase an opened popup menu
		$(".altui-device:not(:has(div.btn-group.open))").each( function( index, element) {
			var devid = $(element).data("altuiid");
			var device = MultiBox.getDeviceByAltuiID( devid );
			if ( (device!=null) && (bFull==true || device.dirty==true) ) {
				
				// get HTML for device and draw it
				var Html = _deviceDraw(device);
				$(element).replaceWith(  Html );
				
				// draw job information.
				if (device.Jobs != undefined) {
					$.each( device.Jobs, function( idx, job ) {
						PageMessage.jobMessage( device,job );
					});
				}
				else
				{
					PageMessage.clearJobMessage( device );
				}
			}
		});

		// refresh scenes
		$(".altui-scene").not(".altui-norefresh").each( function(index,element) {
			var altuiid = $(element).data("altuiid");
			var scene = MultiBox.getSceneByAltuiID( altuiid );
			// get HTML for scene and draw it
			if (scene) {
				var html = _sceneDraw( scene);
				$(element).replaceWith(  html );
			}
			else {
				$(element).parent().remove();
			}
		});
		
		// refresh custom pages
		if ($(".altui-page-contents").not(".altui-norefresh").length>0)
		{
			var pagename = _getActivePageName();
			var page = PageManager.getPageFromName( pagename );
			// for all widget present which need refresh
			var selector = "#altui-page-content-{0} .altui-widget".format(pagename);
			$(selector).each( function (idx,elem) {
				var widgetid = $(elem).prop('id');
				var widget = PageManager.getWidgetByID( page, widgetid );
				var tool = _getToolByClass( widget.cls );
				if (tool.no_refresh !=true) {
					var html = _getWidgetHtml( widget, false );	// not edit mode
					$(elem).replaceWith( html );
				}
			});
			_updateDynamicDisplayTools( false );
		}
		
		// refresh favorites
		_redrawFavorites();
	};

	var ALTUI_hometimer=null;
	function _stoprefreshModes() {
		// console.log("stop refresh");
		if (ALTUI_hometimer!=null)
			clearTimeout(ALTUI_hometimer);
	};

	function _refreshModes() {
		// console.log("refresh");
		_stoprefreshModes();
		if (UIManager.UI7Check()==true) {
			MultiBox.getHouseMode( function (mode) {
				// console.log("mode="+mode);
				if (mode) {
					$("div.housemode").removeClass("preset_selected").addClass("preset_unselected");
					$("#altui-mode"+mode).removeClass("preset_unselected").addClass("preset_selected");
				}
				ALTUI_hometimer=setTimeout( _refreshModes, 10000 );		
			});
		};
	};
	
	function _initOptions(css) {
		$.each(_checkOptions, function(idx,opt) {
			if (MyLocalStorage.getSettings(opt.id) == null)
				MyLocalStorage.setSettings(opt.id,opt._default);
		});
	};
	
	function _initUIEngine(css) {
		$("title").after("<style type='text/css'>{0}</style>".format(css));
	};
	
	function _initEngine(styles, devicetypes, themecss,cbfunc) {
		_initOptions();
		if (themecss && (themecss.trim()!="") )
			$("title").after("<link rel='stylesheet' href='"+themecss+"'>");
		_initUIEngine(styles);
		_initDB(devicetypes,cbfunc);
	};

	function _initCustomPages( custompages ) {
		PageManager.init(custompages);
	};

	function _clearScripts() {
	};
	
	//------------------------------------------------------------	
	//  CUSTOM PAGE MENU
	//------------------------------------------------------------	

	var startpos = null;
	var _widgetOnCanvasResizableOptions = function(tool) {
		return {
			aspectRatio: tool.aspectRatio ||false,		// no aspect ratio by default
			grid: [ 5,5 ],
			containment: "parent",
			stop: function( event, ui ) {
				var pagename = _getActivePageName();
				var page = PageManager.getPageFromName( pagename );
				var widgetid = $(ui.helper).prop('id');
				(tool.onWidgetResize)(page,widgetid,ui.position,ui.size);
				PageManager.updateChildrenInPage( page, widgetid, ui.position, ui.size );
				_showSavePageNeeded(true);
			}
		}
	};
	
	// one page if specified, all pages otherwise
	var _widgetOnCanvasDraggableOptions = function(page) {
		return {
			grid: [ 5,5 ],
			cancel: false,	// prevent draggable to be cancelled on disabled buttons
			// helper: "clone",
			revert: "invalid",
			// snap: true,
			// snapMode: "inner",
			// snapTolerance: 20,
			start: function(event, ui) {
				startpos = ui.position;
				$(this).toggleClass("ui-selected");
			},
			drag: function(event, ui) {
				// take all selected elements except me and fix their position to make them move.
				var canvas = $( _getPageSelector( page ) );
				var selected = canvas.find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
				selected.each( function(index,elem) {
					var elempos = $(elem).position();
					$(elem).css ({
						top: elempos.top + (ui.position.top-startpos.top),
						left: elempos.left + (ui.position.left-startpos.left)
					})
				});
				startpos = ui.position;
				// console.log( "selected:"+selected.length+", "+JSON.stringify(startpos) + ":" + JSON.stringify(ui.position) );
			},
			stop: function(event, ui) {
				var canvas = $( _getPageSelector( page ) );
				startpos = null;
				var selected = canvas.find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
				var maxwidth = canvas.width();
				var maxheight = canvas.height();
				selected.each( function(index,elem) {
					var elempos = $(elem).position();
					if (elempos.top <= 0)
						$(elem).css ('top',0);
					if (elempos.top + $(elem).height() >= maxheight)
						$(elem).css ('top',maxheight - $(elem).height() );
					if (elempos.left <= 0)
						$(elem).css ('left',0);
					if (elempos.left+$(elem).width() >= maxwidth)
						$(elem).css ('left',maxwidth - $(elem).width() );
				});
			}
		};
	};
	
	// ------------------------------------------
	// Property dialog box for toolbox widgets
	// ------------------------------------------
	function _replaceElementKeepAttributes( selector, html ) {
		var oldobject = $(selector);
		var cls = oldobject.attr('class');
		var style = oldobject.attr('style');
		var newobject = $(html).attr('class',cls).attr('style',style);
		oldobject.replaceWith(newobject);
		return $(selector);
	};
	
	function _replaceWidget(widget) {
		var tool = _getToolByClass( widget.cls );
		var html = _getWidgetHtml(widget,true);
		var page = PageManager.getPageFromName( _getActivePageName() );
		var selector = _getWidgetSelector(page,widget);
		$(selector).draggable("disable");
		_replaceElementKeepAttributes( selector, html );
		$(selector).draggable(_widgetOnCanvasDraggableOptions(page));
		if ($.isFunction( tool.onWidgetResize) ) {
			$(selector).resizable( _widgetOnCanvasResizableOptions(tool) );
		}
	};
	function _showSavePageNeeded(bNeeded) {
		$("#altui-page-action-save")
			.toggleClass("btn-info",bNeeded)
			.closest("li.dropdown").find("a.dropdown-toggle")
				.toggleClass("btn-info",bNeeded);
	};
	
	function _onPropertyImage(real_widget) {
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var pagename = _getActivePageName();
		var page = PageManager.getPageFromName( pagename );

		var properties = widget.properties;		
		var propertyline = "";
		propertyline += "      	<div class='form-group'>";
		propertyline += "      		<label for='altui-widget-imgsource'>Image Source</label>";
		propertyline += "      		<input id='altui-widget-imgsource' class='form-control' type='url' value='{0}' placeholder='enter url or data URI here'></input>";
		propertyline += "      	</div>";
		var dialog = DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 
						'Image Properties',																// title
						"<form>"+propertyline.format( widget.properties.url.htmlEncode() )+"</form>"	// body
					));

		DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));				
		// buttons
		$('div#dialogModal form').off('submit');
		$('div#dialogModal form').on( 'submit', function() {
			real_widget.properties.url = $('#altui-widget-imgsource').val();
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			$( _getWidgetSelector(page,real_widget) ).find("img").attr("src",real_widget.properties.url);
		});
		
		$('div#dialogModal').modal();
	};
	
	function _onPropertyVariable(real_widget) {
		
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog(_T('Device Variable Properties'));
		DialogManager.dlgAddDevices( dialog , widget.properties.deviceid, function() {
			DialogManager.dlgAddVariables(dialog, widget, function() {
				DialogManager.dlgAddColorPicker(dialog, "Color", _T("Color"), "", widget.properties.color);
				// run the show
				$('div#dialogModal').modal();
			});
		});		
		
		// buttons
		$('div#dialogs')
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.properties.color = $('#altui-widget-Color').val();
			var selected = MultiBox.getStateByID( real_widget.properties.deviceid,$("#altui-select-variable").val() );
			real_widget.properties.service = selected.service;
			real_widget.properties.variable = selected.variable;
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onPropertyLabel(widget) {
		var dialog = DialogManager.createPropertyDialog('Label Properties');
		DialogManager.dlgAddLine(dialog, "Label", _T("Button Label"), widget.properties.label, "");
		DialogManager.dlgAddColorPicker(dialog, "Color", _T("Color"), "", widget.properties.color);

		// buttons
		$('div#dialogs')
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			widget.properties.label = $('#altui-widget-Label').val();
			widget.properties.color = $('#altui-widget-Color').val();
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(widget);
		});
		
		$('div#dialogModal').modal();
	};

	function _onPropertyRunscene(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Run Scene Properties');
		DialogManager.dlgAddScenes( dialog , widget, function() {
			DialogManager.dlgAddLine(dialog, "Label", _T("Button Label"), widget.properties.label, "");
			// run the show
			$('div#dialogModal').modal();
		});
		
		// buttons
		$('div#dialogs')		
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			$('div#dialogModal button.btn-primary').off('click');
			real_widget.properties.sceneid = $('#altui-widget-sceneid').val();
			real_widget.properties.label = $("#altui-widget-Label").val();
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};
	
	function _onPropertyUpnpAction(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('UPnP Action Properties');
		DialogManager.dlgAddDevices( dialog , widget.properties.deviceid, function() {
			DialogManager.dlgAddActions("altui-widget-action",dialog, widget, widget.properties, _T('Action'), function() {
				DialogManager.dlgAddLine(dialog, "Label", _T("Button Label"), widget.properties.label, "");
				// run the show
				$('div#dialogModal').modal();
			});
		});
		
		// dialog Save Button
		$('div#dialogs')		
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.properties.service = widget.properties.service;
			real_widget.properties.action = widget.properties.action;
			real_widget.properties.label = $("#altui-widget-Label").val();

			// read params
			real_widget.properties.params={};
			$("div.altui-widget-action-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-parameters-".length );
				real_widget.properties.params[name]=value;
			});
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});	
	};

	function _onPropertyOnOffButton(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('OnOff Button Properties');
		
		DialogManager.dlgAddDevices( dialog , widget.properties.deviceid, function() {
			DialogManager.dlgAddVariables(dialog, widget, function() {
				DialogManager.dlgAddCheck(dialog,'Inverted',widget.properties.inverted);
				DialogManager.dlgAddLine(dialog,'OffLabel', _T('OffLabel'),widget.properties.labels[0]);
				DialogManager.dlgAddActions("altui-widget-action-off",dialog, widget, widget.properties.action_off, _T('Action to switch OFF'), function() {
					DialogManager.dlgAddLine(dialog,'OnLabel', _T('OnLabel'), widget.properties.labels[1]);
					DialogManager.dlgAddActions("altui-widget-action-on",dialog, widget, widget.properties.action_on, _T('Action to switch ON'), function() {
						// run the show
						$('div#dialogModal').modal();
					});
				});
			});
		});
		
		// dialog Save Button
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			if (widget.properties.deviceid==0)
				return;	// mandatory data
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.properties.inverted = $("#altui-widget-Inverted").is(':checked');

			var selected = MultiBox.getStateByID( real_widget.properties.deviceid,$("#altui-select-variable").val() );
			real_widget.properties.variable = selected.variable;
			real_widget.properties.service = selected.service;
			
			real_widget.properties.action_off = DialogManager.getDialogActionValue("altui-widget-action-off");
			real_widget.properties.labels[0] = $("#altui-widget-OffLabel").val();
			real_widget.properties.action_on = DialogManager.getDialogActionValue("altui-widget-action-on");
			real_widget.properties.labels[1] = $("#altui-widget-OnLabel").val();
			// read params
			real_widget.properties.action_on.params={};
			$("div.altui-widget-action-on-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-on-parameters-".length );
				real_widget.properties.action_on.params[name]=value;
			});
			// read params
			real_widget.properties.action_off.params={};
			$("div.altui-widget-action-off-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-off-parameters-".length );
				real_widget.properties.action_off.params[name]=value;
			});
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});	
	};
	
	function _onPropertyFrame(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var tool = _getToolByClass( widget.cls );
		var dialog = DialogManager.createPropertyDialog(_T('Frame Properties'));
		DialogManager.dlgAddLine(dialog, "Label", _T("Frame Label"), widget.properties.label, "");
		DialogManager.dlgAddLine(dialog, "CSS", _T("background CSS"), widget.properties.css, "");
		$('div#dialogModal').modal();
		// buttons
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				real_widget.properties.label = $("#altui-widget-Label").val();
				real_widget.properties.css = $("#altui-widget-CSS").val();
				$('div#dialogModal').modal('hide');
				_showSavePageNeeded(true);
				_replaceWidget(real_widget);
			});
	};
	
	function _onPropertyIcon(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Device Icon Properties');
		
		DialogManager.dlgAddDevices( dialog , widget.properties.deviceid, function() {
			// run the show
			$('div#dialogModal').modal();
		});
		
		// buttons
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = $("#altui-select-device").val();
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onResizeStub(page, widgetid, position, size)
	{
	};
	
	function _onResizeCamera(page, widgetid, position, size)
	{
		var widget = PageManager.getWidgetByID( page, widgetid ); 
		var tool = _getToolByClass( widget.cls );
		widget.size = size;
		_replaceWidget(widget);
	};
	
	function _onResizeGauge(page, widgetid, position, size)
	{
		var widget = PageManager.getWidgetByID( page, widgetid ); 
		var tool = _getToolByClass( widget.cls );
		widget.size = size;
		_onDisplayGauge(page,widgetid,true);
	};

	function _onPropertyCamera(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Camera Properties');
		
		DialogManager.dlgAddDevices( dialog , widget.properties.deviceid, 
			function() {
				// run the show
				$('div#dialogModal').modal();
			},
			function(device) {		// filter function
				return (device.device_type=="urn:schemas-upnp-org:device:DigitalSecurityCamera:2");
			}
		);
		
		// buttons
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = $("#altui-select-device").val();
			real_widget.size = $.extend({ width:Math.floor(300*640/480), height:300},widget.size);
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			var tool = _getToolByClass( real_widget.cls );
			_replaceWidget(real_widget);
		});
	};

	function _onPropertyGauge(real_widget) {		
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Gauge Properties');
		DialogManager.dlgAddDevices( dialog , widget.properties.deviceid, function() {
			DialogManager.dlgAddVariables(dialog, widget, function() {
				DialogManager.dlgAddLine(dialog,'Label', _T('Label'), widget.properties.label);
				DialogManager.dlgAddLine(dialog,'Min', _T('Min'), widget.properties.min);
				DialogManager.dlgAddLine(dialog,'Green', _T('Green'), widget.properties.greenfrom);
				DialogManager.dlgAddLine(dialog,'Orange', _T('Orange'), widget.properties.orangefrom);
				DialogManager.dlgAddLine(dialog,'Red', _T('Red'), widget.properties.redfrom);
				DialogManager.dlgAddLine(dialog,'Max', _T('Max'), widget.properties.max);
				DialogManager.dlgAddLine(dialog,'Ticks', _T('Ticks'), widget.properties.majorTicks.join(','),'nn,nn,nn');
				// run the show
				$('div#dialogModal').modal();
			});
		});		
		
		// buttons
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			if (widget.properties.deviceid==0)
				return;	// mandatory data
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.size = $.extend({ width:120, height:120},widget.size);
			var states = MultiBox.getStatesByAltuiID( widget.properties.deviceid );
			var variable = $("#altui-select-variable").val();
			if (variable!=null) {
				var selected = MultiBox.getStateByID( real_widget.properties.deviceid,variable );
				real_widget.properties.variable = selected.variable;
				real_widget.properties.service = selected.service;
				real_widget.properties.label = $("#altui-widget-Label").val();
				real_widget.properties.min = $("#altui-widget-Min").val();
				real_widget.properties.max = $("#altui-widget-Max").val();
				real_widget.properties.greenfrom = $("#altui-widget-Green").val();
				real_widget.properties.orangefrom = $("#altui-widget-Orange").val();
				real_widget.properties.redfrom = $("#altui-widget-Red").val();
				var ticks = $("#altui-widget-Ticks").val();
				real_widget.properties.majorTicks = ticks.split(',');
				_showSavePageNeeded(true);
				
				// refresh widget
				var pagename = _getActivePageName();
				var page = PageManager.getPageFromName( pagename );
				_onDisplayGauge(page,real_widget.id,true);
			}
			$('div#dialogModal').modal('hide');
		});
	}

	function _onDisplayGauge(page,widgetid,bEdit)
	{
		var widget=PageManager.getWidgetByID( page, widgetid );
		var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		var value = parseFloat( MultiBox.getStatus(device, widget.properties.service, widget.properties.variable) || 0 );
		var data = google.visualization.arrayToDataTable([
		  ['Label', 'Value'],
		  [widget.properties.label || '', value],
		]);
		if (value > widget.properties.max)
			widget.properties.max = value;
		if (value < widget.properties.min)
			widget.properties.min = value;
		widget.size = $.extend({ width:120, height:120},widget.size);
		var options = {
		  width: widget.size.width,
		  height: widget.size.height,
		  minorTicks: 5,
		  min: widget.properties.min,
		  max: widget.properties.max
		};

		if (widget.properties.majorTicks.length>0)
			options = $.extend(options, {
				majorTicks:	widget.properties.majorTicks
			});				

		if ($.isNumeric(widget.properties.greenfrom))
			options = $.extend(options, {
				greenFrom:	widget.properties.greenfrom, 
				greenTo: 	$.isNumeric(widget.properties.orangefrom) ? widget.properties.orangefrom : widget.properties.max
			});
		if ($.isNumeric(widget.properties.orangefrom))
			options = $.extend(options, {
				yellowFrom:	widget.properties.orangefrom, 
				yellowTo: 	$.isNumeric(widget.properties.redfrom) ? widget.properties.redfrom : widget.properties.max
			});
		if ($.isNumeric(widget.properties.redfrom))
			options = $.extend(options, {
				redFrom:	widget.properties.redfrom, 
				redTo: 		widget.properties.max
			});

		var chart = new google.visualization.Gauge(document.getElementById("altui-gauge-"+widgetid));
		chart.draw(data, options);
	};
		
	// ------------------------------------------
	// Edit Tools
	// ------------------------------------------
	function onAlignTop(selected)
	{
		var min = Math.min.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().top;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',min);
		});
		_showSavePageNeeded(true);
	};
	function onAlignHorizontal(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().top+$(elem).height()/2;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',max-$(elem).height()/2);
		});
		_showSavePageNeeded(true);
	};
	function onAlignBottom(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().top+$(elem).height();}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',max-$(elem).height());
		});
		_showSavePageNeeded(true);
	};
	function onAlignLeft(selected)
	{
		var min = Math.min.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().left;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',min);
		});
		_showSavePageNeeded(true);
	};
	function onAlignVertical(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().left+$(elem).width()/2;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',max-$(elem).width()/2);
		});
		_showSavePageNeeded(true);
	};
	function onAlignRight(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().left+$(elem).width();}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',max-$(elem).width());
		});
		_showSavePageNeeded(true);
	};

	
	// ------------------------------------------
	// public Callback
	// ------------------------------------------
	function _onoffOnClick(widgetid) {
		// find the widget
		var pagename = _getActivePageName();
		var page = PageManager.getPageFromName( pagename );
		var widget=PageManager.getWidgetByID( page, widgetid );
		// find the device
		var device= MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		// trigger the right action
		var status = MultiBox.getStatus(device, widget.properties.service, widget.properties.variable);
		if  ((status==undefined) || (status==false) || (status=='0') )
			status = 0;
		else if ((status=='true') || (status=='1') || (status>=1))
			status = 1;
		var actiondescriptor = (status==1) ? widget.properties.action_off : widget.properties.action_on;
		if (widget.properties.inverted)
			status = 1-status;
		MultiBox.runAction( device, actiondescriptor.service, actiondescriptor.action, actiondescriptor.params);
	};
	
	// ------------------------------------------
	// Master table for toolbox configuration
	// ------------------------------------------
	function _toolHtml(glyph,label) {
		return "<span class='pull-left'>{0}</span><small class='pull-right'>{1}</small>".format(glyph,label);
	};

	function _getToolByClass( cls )
	{
		var result = null;
		$.each(tools, function(idx,tool) {
			if (tool.cls == cls)
			{
				result = tool;
				return false;
			}
		});
		return result;
	};

	function _getActivePageName() {
		var pagename = $("#altui-page-tabs li.active").prop('id');
		return pagename != undefined ? pagename.substring( "altui-page-".length) : '';
	};
	
	// one page if specified, all pages otherwise
	function _getPageSelector( page ) {
		if (page == undefined)
				return ".altui-page-content-one";
		return "#altui-page-content-{0}".format(page.name);
	};
	function _getWidgetSelector(page,widget) {
		if ((page==undefined) || (widget==undefined))
			return "";
		return _getPageSelector(page)+" .altui-widget#"+widget.id
	};
	
	function _createPageTabsHtml( bEditMode ) {
		var actions = "";
		var lines = new Array();
		PageManager.forEachPage( function( idx, page) {
			lines.push( "<li id='altui-page-{0}' role='presentation' ><a href='#altui-page-content-{0}' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format(page.name) );
		});
		
		if (bEditMode==true) {
			actions+="<li role='presentation' class='dropdown'>";
			actions+="<a class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-expanded='false'>";
			actions+="Actions <span class='caret'></span>";
			actions+="</a>";
			actions+="<ul class='dropdown-menu' role='menu'>";
			actions+="<li><a id='altui-page-action-new' href='#'>"+_T("New Page")+"</a></li>";
			actions+="<li><a id='altui-page-action-properties' href='#'>"+_T("Page Properties")+"</a></li>";
			actions+="<li><a id='altui-page-action-delete' href='#'>"+_T("Delete this Page")+"</a></li>";
			actions+="<li><a id='altui-page-action-save' href='#'>"+_T("Save All Pages")+"</a></li>";
			actions+="</ul>";
			actions+="</li>";
		}
		return "<ul class='nav nav-tabs' id='altui-page-tabs' role='tablist'>"+lines.join('')+actions+"</ul>";
	};

	function _getWidgetHtml( widget , bEditMode )
	{
		var html="";
		if (widget!=null)
		{
			var tool = _getToolByClass( widget.cls )
			widget.properties = $.extend(true,{}, tool.properties, widget.properties);
			var style = (widget.size!=undefined) 
				? 'style="width:{0}px; height:{1}px; z-index:{2};"'.format(widget.size.width, widget.size.height,widget.zindex) 
				: 'style="z-index:{0};"'.format(widget.zindex);
			html += ("<div class='altui-widget {0} ' id='{1}' data-type='{0}' {2}>").format(widget.cls,widget.id,style);
			html += (tool.widgetdisplay)(widget,bEditMode);
			html +="</div>";

			var temp = $(html)
				.css({ 
					position:'absolute',
					overflow: 'hidden',
					top: widget.position.top,
					left: widget.position.left
				});	
			html = $(temp).wrap( "<div></div>" ).parent().html();
		}
		return html;
	};
	
	function _getPageHtml(page,bEditMode) {
		var pageHtml = "<div class='altui-custompage-canvas' style='z-index:0;'>";
		if (page.children)
			$.each(page.children, function(idx,child) {							
				pageHtml += _getWidgetHtml( child, bEditMode );
			});
		pageHtml += "</div>";
		var str = "<div role='tabpanel' class='tab-pane altui-page-content-one' id='altui-page-content-{0}' >{1}</div>".format(page.name,pageHtml);
		var elem = $(str).css('background',page.background);
		return elem.wrap( "<div></div>" ).parent().html();
	};
	
	function _updateDynamicDisplayTools( bEdit )
	{
		// var pagename = _getActivePageName();
		PageManager.forEachPage( function( idx, page) {
			$.each(tools, function(idx,tool) {
				if ($.isFunction( tool.onWidgetDisplay) )
				{
					var selector = "#altui-page-content-{0} .{1}".format(page.name,tool.cls);
					$(selector).each( function(idx,elem) {
						var widgetid = $(elem).prop('id');
						(tool.onWidgetDisplay)(page,widgetid, bEdit);		// edit mode							
					})
				}
			});	
		});
	};
	
	function _createControllerSelect(htmlid) {
		var html = "";
		html += "<form class='form-inline col-xs-12'>";
			html += "<div class='form-group'>";
				html += "<label class='control-label ' for='altui-controller-select' >"+_T("Controller")+":</label>";
				html += "<select id='"+htmlid+"' class='form-control'>";
				$.each(MultiBox.getControllers(), function( idx, controller) {
					html += "<option value='{0}'>{1}</option>".format( idx , controller.ip=='' ? window.location.hostname : controller.ip  );
				});
				html += "</select>";
			html += "</div>";
		html += "</form>";
		return html;
	};

	var bUIReady = false;
	var bEngineReady = false;

	// explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	initEngine 		: _initEngine, 
	initCustomPages : _initCustomPages,
	initLocalizedGlobals : _initLocalizedGlobals,
	loadScript 		: _loadScript,	//(scriptLocationAndName) 
	loadD3Script	: _loadD3Script,
	clearScripts	: _clearScripts,
	
	// UI helpers
	checkAltuiUpdate	: _checkAltuiUpdate,
	UI7Check			: function() { return _ui7Check; },
	RemoteAccessUrl		: function() { return _remoteAccessUrl; },
	stoprefreshModes	: _stoprefreshModes,
	refreshModes		: _refreshModes,
	
	// custom panel widget callbacks
	onoffOnClick 		: _onoffOnClick,
	
	//drawing functions
	jobStatusToColor	: _jobStatusToColor,
	defaultDeviceDrawWatts: _defaultDeviceDrawWatts,	// default HTML for Watts & UserSuppliedWattage variable
	deviceDraw 			: _deviceDraw,					// draw the mini device on device page; can be customized by a plugin by ["DeviceDrawFunc"]
	deviceDrawVariables : _deviceDrawVariables,			// draw the device variables
	deviceDrawActions 	: _deviceDrawActions,			// draw the device Upnp Actions
	deviceDrawControlPanel 	: _deviceDrawControlPanel,	// draw the full device control panel page; can be customized by a plugin ["ControlPanelFunc"]
	deviceCreate		: _deviceCreate,
	cameraDraw			: _cameraDraw,
	sceneDraw			: _sceneDraw,
	refreshUI 			: _refreshUI,					// 
	refreshUIPerDevice	: _refreshUIPerDevice,
	
	// breadcumb
	breadCrumb: function( title , param ) {
		var tbl = [
			{ id:0, title:_T('Home'), onclick:'UIManager.pageHome()', 		parent:-1},
			{ id:1, title:_T('Rooms'), onclick:'UIManager.pageRooms()', 	parent:0 },
			{ id:2, title:_T('Devices'), onclick:'UIManager.pageDevices()', parent:0 },
			{ id:5, title:_T('Control Panel'), onclick:'UIManager.pagexxx()', parent:2 },
			{ id:6, title:_T('Scenes'), onclick:'UIManager.pageScenes()', 	parent:0 },
			{ id:7, title:_T('Scene Edit'), onclick:'UIManager.pageSceneEdit()', parent:6 },
			{ id:8, title:_T('Plugins'), onclick:'UIManager.pagePlugins()', parent:0 },
			{ id:9, title:_T('Custom Pages'), onclick:'UIManager.pageUsePages()', parent:0 },
			{ id:10, title:_T('Edit Pages'), onclick:'UIManager.pageEditPages()', parent:0 },
			{ id:11, title:_T('Credits'), onclick:'UIManager.pageCredits()', parent:0 },
			{ id:12, title:_T('LuaTest'), onclick:'UIManager.pageLuaTest()', parent:0 },
			{ id:13, title:_T('LuaStart'), onclick:'UIManager.pageLuaStart()', parent:0 },
			{ id:14, title:_T('Options'), onclick:'UIManager.pageOptions()', parent:0 },
			{ id:15, title:_T('Editor'), onclick:'UIManager.pageEditor()', parent:8 },
			{ id:16, title:_T('ZWave'), onclick:'UIManager.pageZwave()', parent:0 },
			{ id:17, title:_T('Localize'), onclick:'UIManager.pageLocalization()', parent:0 },
			{ id:18, title:_T('Debug'), onclick:'UIManager.pageDebug()', parent:0 },
			{ id:19, title:_T('Power'), onclick:'UIManager.pagePower()', parent:0 },
			{ id:20, title:_T('Parent/Child'), onclick:'UIManager.pageChildren()', parent:0 },
			{ id:21, title:_T('zWaveRoutes'), onclick:'UIManager.pageRoutes()', parent:0 },
			{ id:22, title:_T('Quality'), onclick:'UIManager.pageQuality()', parent:0 },
			{ id:23, title:_T('TblDevices'), onclick:'UIManager.pageTblDevices()', parent:0 },
			{ id:24, title:_T('OsCommand'), onclick:'UIManager.pageOsCommand()', parent:0 },
			{ id:25, title:_T('Triggers'), onclick:'UIManager.pageTriggers()', 	parent:6 },
		];

		function _parentsOf(child) {
			var html = "";
			$.each(tbl, function( idx,line) {
				if (child.parent==line.id) {
					var thisline = "<li><a href='javascript:void(0);' onclick='"+line.onclick+";return false;' >"+line.title+"</a></li>";
					var parentlines = (line.parent==-1) ? '' :  _parentsOf(line);
					html = parentlines + thisline;
					return false;
				}
			});
			return html;
		};
		
		var html="";
		html+="<ol class='breadcrumb altui-breadcrumb'>";
		// html+="<li><a href='javascript:void(0);' onclick='UIManager.pageHome();return false;' >Home</a></li>";
		// html+="<li><a href='javascript:void(0);' onclick='UIManager.pageDevices();return false;' >Device</a></li>";
		// html+="<li class='active'>Data</li>";
		$.each(tbl, function( idx,line) {
			if (line.title==title) {
				html += _parentsOf(line);
				html += "<li class='active'>{0}</li>".format(line.title);
			}
		});
		html+="</ol>";
		return html;
	},
	
	// pages
	oneColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-xs-12 col-sm-push-1 col-sm-10'>";
		body+="			<h1 id='altui-pagetitle' >"+title+"</h1>";
		body+="			<div class='altui-mainpanel row'>";
		body+="			</div>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	twoColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-sm-10 col-sm-push-2'>";
		body+="			<h1 id='altui-pagetitle' >"+title+"</h1>";
		body+="			<div class='altui-mainpanel row'>";
		body+="			</div>";
		body+="		</div>";
		body+="		<div class='col-sm-2 col-sm-pull-10 hidden-xs {0}'>".format( (MyLocalStorage.getSettings('FixedLeftButtonBar') || "") ? 'affix' : '' );
		body+="			<div class='altui-leftnav btn-group-vertical' role='group' aria-label='...'>";
		body+="				<!--";
		body+="				<button type='button' class='btn btn-default'>One</button>";
		body+="				<button type='button' class='btn btn-default'>Deux</button>";
		body+="				<button type='button' class='btn btn-default'>Trois</button>";
		body+="				-->";
		body+="			</div>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	
	clearPage : function(breadcrumb,title,layout)
	{
		var layoutfunc = layout || UIManager.twoColumnLayout;
		
		UIManager.stoprefreshModes();
		$(".navbar-collapse").collapse('hide');
		$(".altui-layout").remove();

		var body = (layoutfunc)(title || '' );
		$("div[role=main]").append(body);
		PageMessage.init();
		$("#altui-toggle-messages").before ( UIManager.breadCrumb( breadcrumb ) );


		// elements outside of the layout
		$("#dialogs").off().empty();
		$(".altui-scripts").remove();
		$("body").append("<div class='altui-scripts'></div>");
	},
	
	//window.open("data_request?id=lr_ALTUI_Handler&command=home","_self");
	pageHome : function()
	{
		UIManager.clearPage(_T('Home'),_T("Welcome to VERA Alternate UI"),UIManager.oneColumnLayout);
		if ( MyLocalStorage.getSettings('ShowWeather') )
		// if(0)
		{                                                            
			var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
			var ws = MultiBox.getWeatherSettings();
			if ((ws.tempFormat==undefined) || (ws.tempFormat==""))
				ws.tempFormat=MyLocalStorage.getSettings('TempUnitOverride'); 
			var html="";
			html ="<div class='altui-weather-widget col-sm-6'>";
			// html +='<a href="//www.accuweather.com/fr/fr/meylan/1097583/weather-forecast/1097583" class="aw-widget-legal">';
			html +='<a href="//www.accuweather.com/" class="aw-widget-legal">';
			html +=('</a><div id="awcc1439296613816" class="aw-widget-current"  data-locationkey="1097583" data-unit="'+ws.tempFormat.toLowerCase()+'" data-language="'+language.substring(0, 2)+'" data-useip="true" data-uid="awcc1439296613816"></div><script type="text/javascript" src="//oap.accuweather.com/launch.js"></script>');
			html +="</div>";
			// console.log(html);
			$(".altui-mainpanel").append(html);
		}
		UIManager.drawHouseMode();
		$(".altui-mainpanel").append("<div class='col-xs-12'><div class='altui-favorites row'></div></div>");
		$(".altui-mainpanel")
			.off("click",".altui-favorites-scene-content")
			.on("click",".altui-favorites-scene-content",function() {
				var altuiid = $(this).data("altuiid");
				MultiBox.runSceneByAltuiID(altuiid);
			})
			.off("click",".altui-favorites-device-content")
			.on("click",".altui-favorites-device-content",function() {
				var altuiid = $(this).data("altuiid");
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				switch( device.device_type) {
					case "urn:schemas-upnp-org:device:BinaryLight:1":
						var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' ); 
						MultiBox.runAction(device,"urn:upnp-org:serviceId:SwitchPower1","SetTarget", {newTargetValue:1-parseInt(status||1)});
						break;
					case "urn:schemas-micasaverde-com:device:WindowCovering:1"	:
					case "urn:schemas-upnp-org:device:DimmableLight:1":
						var status = parseInt(MultiBox.getStatus(device,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus") || 1);
						MultiBox.runAction( device , "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget: ((status>0) ? 0 : 100) } );
						break;
					case "urn:schemas-upnp-org:device:VSwitch:1":
						MultiBox.runAction( device, "urn:upnp-org:serviceId:VSwitch1","ToggleState", {} );
						break;
					default:
						break;
				}	
			});
		_redrawFavorites();
	},
	
	pageRemoteAccess : function ()
	{
		window.open( _remoteAccessUrl, '_blank');
	},
	
	// ===========================
	//  Page UI pieces helpers
	// ===========================


	setLeftnavRoomsActive : function ( selectedRoomId ) {
		var button = null;
		$(".altui-leftbutton").toggleClass("active",false);
		button = $(".altui-leftbutton[data-altuiid='"+selectedRoomId+"']");			
		if (button.length==0) 
			button = $(".altui-leftbutton[id="+selectedRoomId+"]")
		button.toggleClass("active",true);
	},
	
	leftnavRooms : function ( clickFunction , roomLoadedFunction)
	{
		var leftnav = $(".altui-leftnav");
		$("body").off("click",".altui-leftbutton");
		leftnav.empty()
			.append( leftNavButtonTemplate.format( -1, "", _T("All")) )
			.append( leftNavButtonTemplate.format( -2, "", starGlyph+' '+_T("Favorites")) )
			.append( leftNavButtonTemplate.format( 0, "", _T("No Room")) );
			
		// install a click handler on button
		if ($.isFunction( clickFunction ))  {
			$("body").off("click",".altui-leftbutton");
			$("body").on("click",".altui-leftbutton",function() {
				$(this).parent().children().removeClass("active")
				$(this).addClass("active");
				clickFunction.apply($(this), [$(this).prop('id'), $(this).data('altuiid')]);
			});
		}

		MultiBox.getRooms( null,null,function( rooms ) {
			// calculate unique rooms by name
			var namearray = $.map(rooms, function(r) { return r.name;} );
			var filteredrooms = $.grep(rooms, function(room,idx) {
				return $.inArray(room.name ,namearray) == idx;
			});

			$.each(filteredrooms, function(i,room) {
				leftnav.append( leftNavButtonTemplate.format( room.id, room.altuiid, (room!=null) ? room.name : "No Room") );	
			})
			if ($.isFunction(roomLoadedFunction))
				(roomLoadedFunction)(rooms);
		});
	},

	// ===========================
	//  Full Pages update Methods
	// ===========================
	pageRooms : function ()
	{
		function _roomSummary(room) {
			var rcontroller = MultiBox.controllerOf(room.altuiid).controller;
			var devices = $.grep( MultiBox.getDevicesSync(), function(d) {
				var dcontroller = MultiBox.controllerOf(d.altuiid).controller;
				return (d.room == room.id) && ( dcontroller==rcontroller);
			});
			return devices.length;
		};
		
		UIManager.clearPage(_T('Rooms'),_T("Rooms"),UIManager.oneColumnLayout);
		var formHtml="";
		formHtml+=" <div class='form-group '>";
		formHtml+=" <div class='input-group '>";
		formHtml+="       <input id='altui-create-room-name' type='text' class='form-control' placeholder='Room name...'>";
		formHtml+="       <span class='input-group-btn'>";
		formHtml+="         <button id='altui-create-room' class='btn btn-default' type='button'>"+plusGlyph+"&nbsp;"+_T("Create")+"</button>";
		formHtml+="       </span>";
		formHtml+="     </div><!-- /input-group -->";
		formHtml+="     </div><!-- /form-group -->";
	
		// on the left nav
		// nothing
		
		// on the main panel
		// table of rooms
		$(".altui-mainpanel")
			.append( _createControllerSelect('altui-controller-select'))
			.append($("<div class='col-xs-12'><table id='table' class='table table-condensed'><thead><tr><th>ID</th><th>Name</th><th>Devices</th><th>Actions</th></tr></thead><tbody></tbody></table></div>"));
		$("#altui-controller-select").closest(".form-group").append(formHtml);
		
		var roomListTemplate = "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>";	
		MultiBox.getRooms( null,null,function( rooms) {
			if (rooms) {
				$.each(rooms.sort(sortByName), function(idx,room) {
					var id = room.altuiid;
					var delButtonHtml = smallbuttonTemplate.format( id, 'altui-delroom', deleteGlyph);
					$(".altui-mainpanel tbody").append( roomListTemplate.format(id,(room!=null) ? room.name : "No Room",_roomSummary(room),delButtonHtml) );
				});
				// install click handler for buttons
				$("button.altui-delroom").click( function(event) {
					var id = $(this).prop('id');
					var room = MultiBox.getRoomByAltuiID(id);
					var tr = $(this).closest("tr");
					DialogManager.confirmDialog(_T("Are you sure you want to delete room")+" ("+id+")",function(result) {
						if (result==true) {
							$(tr).remove();
							MultiBox.deleteRoom( room );
						}
					})
				});
				
			}
		});
		
		// $(".altui-mainpanel").off("click","button#altui-create-room");
		$(".altui-mainpanel").on("click","button#altui-create-room",function() 
		{
			MultiBox.createRoom(parseInt($("#altui-controller-select").val()),$("#altui-create-room-name").val() );
		});

	},

	pageControlPanel: function( altuiid ) 
	{
		function _drawDeviceLastUpdateStats( device ) {
			var variables = [
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"FirstConfigured" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"LastUpdate" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"BatteryDate" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"LastWakeup" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"LastRouteUpdate" },
				{ service:"urn:micasaverde-com:serviceId:SecuritySensor1", name:"LastTrip" },
			];
			var html = "<div class='col-xs-12'>";
			html += "<div class='panel panel-default'><div class='panel-body altui-device-keyvariables bg-info'>";
			html += "<div class='row'>";
			$.each(variables, function(idx,variable) {
				var value = MultiBox.getStatus( device, variable.service, variable.name);
				if ((value !=null) && (value !="")) {
					html += "<div class='col-sm-6 col-md-4'><b>{0}</b>: {1}</div>".format(variable.name,_enhanceValue(value));
				}
			});
			html += "</div>";
			html +="</div></div>";		// panel
			html += "</div>";			// col
			return html;
		};
		
		// var rooms = MultiBox.getRoomsSync();
		var device = MultiBox.getDeviceByAltuiID( altuiid );
		var controllerid = MultiBox.controllerOf(altuiid).controller;
		var category = MultiBox.getCategoryTitle( device.category_num );

		UIManager.clearPage(_T('Control Panel'),"{0} <small>{1} <small>#{2}</small></small>".format( device.name , category ,altuiid),UIManager.oneColumnLayout);
		
		$(".altui-mainpanel").append( _drawDeviceLastUpdateStats(device) );
		
		var html = "<div class='form-inline col-xs-12'>";
		html += "<button type='button' class='btn btn-default' id='altui-toggle-attributes' >"+_T("Attributes")+"<span class='caret'></span></button>";
		html += "<button type='button' class='btn btn-default altui-device-variables' id='"+altuiid+"'>"+_T("Variables")+"</button>";
		html += "<button type='button' class='btn btn-default altui-device-actions' id='"+altuiid+"' >"+_T("Actions")+"</button>";
		html += "<button type='button' class='btn btn-default' id='altui-device-usedin' >"+_T("Used in")+"<span class='caret'></span></button>";
		html += "<button type='button' class='btn btn-default' id='altui-device-trigger' >"+plusGlyph+_T("Notification")+"</button>";
		if (AltuiDebug.IsDebug())
			html +=  buttonDebugHtml;
		html += "</div>";
		$(".altui-mainpanel").append( html );

		//
		// Draw device control panel (attributes+panel+debug)
		//
		$(".altui-mainpanel").append( "<div id='altui-device-controlpanel-container-"+altuiid+"' class='col-xs-12 altui-device-controlpanel-container'></div>" );
		var container = $("#altui-device-controlpanel-container-"+altuiid);
		UIManager.deviceDrawControlPanel( device, container ); 	//altuiid, device, domparent
		
		//
		// Manage interactions
		//
		$("#altui-device-attributes-"+altuiid).toggle(false);			// hide them by default;
		$("#altui-device-usedin-"+altuiid).toggle(false);			// hide them by default;
		$(".altui-debug-div").toggle(false);						// hide
		$(container).off('click','.altui-deldevice')
					.on('click','.altui-deldevice',  function(e) {
						var id = $(this).prop('id');
						DialogManager.confirmDialog(_T("Are you sure you want to delete device ({0})").format(id),function(result) {
							if (result==true) {
								MultiBox.deleteDevice(device);
							}
						});
					});
					
		$("#altui-toggle-attributes").click( function() {
			$("#altui-device-attributes-"+altuiid).toggle();		// toogle attribute box
			$("#altui-toggle-attributes span.caret").toggleClass( "caret-reversed" );
		});
		
		$("#altui-device-usedin").click( function() {
			$("#altui-device-usedin-"+altuiid).toggle();		// toogle attribute box
			$("#altui-device-usedin span.caret").toggleClass( "caret-reversed" );
		});
		
		$("#altui-device-trigger").click( function() {
			var info = MultiBox.controllerOf(altuiid);
			var trigger = {
							name: _T("Notification from {0}").format(device.name),
							enabled:1,
							template:'',
							device:info.id,
							arguments:[],
							lua:''
						};
			DialogManager.triggerDialog( trigger, info.controller, function( trigger ) {
				var info = MultiBox.controllerOf(altuiid);
				var newid = MultiBox.getNewSceneID( info.controller );
				var scenetemplate = { 
						notification_only: parseInt(device.id),
						name:_T("Notification from {0}").format(device.name),
						id: newid.id,
						altuiid: newid.altuiid,
						triggers: [trigger],
						groups: [{"delay":0,"actions":[]}],
						timers: [],
						lua:"",
						room:0
				};

				// clear page
				UIManager.pageSceneEdit(NULL_SCENE,scenetemplate);
				// DialogManager.triggerUsersDialog( trigger, info.controller, function() {
					// var scene = {};					
				// });
			});		
		})
		// resgister a handler on tab click to force a disaply & reload of JS tab , even if already loaded
		$(container).off('click','.altui-device-controlpanel ul#altui-devtab-tabs a')
					.on('click','.altui-device-controlpanel ul#altui-devtab-tabs a',  function(e) {
						// remove the no refresh class so we force a full redisplay of the 
						// tab with the latest var values
						var targettab = $(e.target).attr("href").slice("#altui-devtab-content-".length);
						var domparent  =  $('div#altui-devtab-content-'+targettab);
						$(domparent).toggleClass('altui-norefresh',false);
					});
		
		// register a handler on tab changes to update height of domparent ( usefulk when child are in absolute positioning )
		$(container).off('shown.bs.tab', 'a[data-toggle="tab"]');
		$(container).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
			var controlpanel = $(e.target).closest(".altui-device-controlpanel");
			var altuiid = $(controlpanel).data("altuiid")
			var device = MultiBox.getDeviceByAltuiID( altuiid );
			var activeTabIdx = _getActiveDeviceTabIdx();
			var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
			_displayActiveDeviceTab(activeTabIdx, device, domparent);
		});
	},
	
	onDeviceIconError : function( altuiid ) {
		$("div.altui-device[data-altuiid="+altuiid+"] img").attr('src',defaultIconSrc);
	},
	
	pageDevices : function ()
	{
		var _roomID2Name = {};
		var _deviceID2RoomName = {};
		var _deviceDisplayFilter = {
			filterformvisible 	: false,
			room			: MyLocalStorage.getSettings("DeviceRoomFilter") || -1,
			favorites		: (MyLocalStorage.getSettings("ShowFavoriteDevice")==true),
			invisible 		: (MyLocalStorage.getSettings("ShowInvisibleDevice")==true),
			batterydevice	: (MyLocalStorage.getSettings("ShowBatteryDevice")==true),
			category		: MyLocalStorage.getSettings("CategoryFilter") || 0,
			filtername		: MyLocalStorage.getSettings("DeviceFilterName") || "",
			isRoomFilterValid 		: function() {return this.room!=-1},
			isCategoryFilterValid 	: function() {return this.category!=0},
		};
		
		// filter function
		function deviceFilter(device) {
			if ((_deviceID2RoomName[ device.altuiid ]==null) && (parseInt(device.room)!=0)) {
				var controller = MultiBox.controllerOf(device.altuiid).controller;
				_deviceID2RoomName[ device.altuiid ] = _roomID2Name["{0}-{1}".format(controller,device.room)];
			}

			var batteryLevel = MultiBox.getDeviceBatteryLevel(device);
			var regexp = new RegExp(RegExp.escape(_deviceDisplayFilter.filtername),"i")
			return ( (parseInt(_deviceDisplayFilter.room) <0) || (device!=null &&  _deviceID2RoomName[device.altuiid] == _roomID2Name[_deviceDisplayFilter.room]) ) 
				&& ( (_deviceDisplayFilter.invisible == true) || (device.invisible != "1") )	
				&& ( (_deviceDisplayFilter.category == 0) || (device.category_num == _deviceDisplayFilter.category) ) 
				&& ( ((_deviceDisplayFilter.favorites == false) && (_deviceDisplayFilter.room!=-2) ) || (device.favorite == true) ) 
				&& ( (_deviceDisplayFilter.filtername.length==0) || (device.name.search( regexp )!=-1) ) 
				&& ( (batteryLevel != null) || (false == _deviceDisplayFilter.batterydevice));
		}
		
		function _deviceCreateModalHtml() {
			var deviceCreateModalTemplate = "<div id='deviceCreateModal' class='modal fade'>";
			deviceCreateModalTemplate += "  <div class='modal-dialog modal-lg'>";
			deviceCreateModalTemplate += "    <div class='modal-content'>";
			deviceCreateModalTemplate += "      <div class='modal-header'>";
			deviceCreateModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
			deviceCreateModalTemplate += "        <h4 class='modal-title'>Create Device</h4>";
			deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "      <div class='modal-body'>";
				deviceCreateModalTemplate += "      <div class='row-fluid'>";
						deviceCreateModalTemplate += "<form>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-dtitle'>Device Name</label>";
								deviceCreateModalTemplate += "<input type='text' class='form-control' id='altui-input-dtitle' placeholder='Enter the name'>";
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-dfile'>D_xxx.xml filename</label>";
								deviceCreateModalTemplate += "<input type='text' class='form-control' id='altui-input-dfile' placeholder='Enter the filename'>";
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-ifile'>I_xxx.xml filename</label>";
								deviceCreateModalTemplate += "<input type='text' class='form-control' id='altui-input-ifile' placeholder='Enter the filename'>";
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<p class='help-block'>Enter the device D_xx and I_xx file name</p>";
						deviceCreateModalTemplate += "</form>";
				deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "      <div class='modal-footer'>";
			deviceCreateModalTemplate += "        <button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
			deviceCreateModalTemplate += "        <button type='button' class='btn btn-primary'>"+_T("Save Changes")+"</button>";
			deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "    </div><!-- /.modal-content -->";
			deviceCreateModalTemplate += "  </div><!-- /.modal-dialog -->";
			deviceCreateModalTemplate += "</div><!-- /.modal -->";
			return deviceCreateModalTemplate;
		}
		
		function endDrawDevice(devices) {
			_drawDeviceToolbar().done( function() {
				$("#altui-device-room-filter button").toggleClass("btn-info",_deviceDisplayFilter.isRoomFilterValid());
				$("#altui-device-category-filter button").toggleClass("btn-info",_deviceDisplayFilter.isCategoryFilterValid());
			});
			UIManager.refreshUI(true,false);
		};
		
		function drawDeviceContainer(idx, device) {
			var devicecontainerTemplate="<div class=' col-sm-6 col-md-4 col-lg-3 '>";
			devicecontainerTemplate	+= 		"<div class='panel panel-default altui-device' data-altuiid='{1}' id='{0}'>"
			devicecontainerTemplate	+= 	  	"</div>";
			devicecontainerTemplate	+= 	"</div>";		
			var domPanel = $(".altui-mainpanel");
			domPanel.append(devicecontainerTemplate.format(device.id,device.altuiid));	
		};

		function _drawDeviceToolbar() {
			var filterHtml="";
			// filterHtml+="<div class='btn-group'>";
			filterHtml+="<div class='altui-pagefilter'>";
			filterHtml+="<div class='panel panel-default' id='altui-device-filter-form'>";
			filterHtml+="  <div class='panel-body'>";
				filterHtml+="<form class='form-inline'>";
					filterHtml+="<div class='form-group'>";
						filterHtml+="<div class='checkbox'>";
						filterHtml+="  <label>";
						filterHtml+="    <input type='checkbox' value='' id='altui-show-favorites'>";
						filterHtml+="    Favorites";
						filterHtml+="  </label>";
						filterHtml+="</div>";
					filterHtml+="</div>";
					filterHtml+="<div class='form-group'>";
						filterHtml+="<div class='checkbox'>";
						filterHtml+="  <label>";
						filterHtml+="    <input type='checkbox' value='' id='altui-show-invisible'>";
						filterHtml+="    Invisible";
						filterHtml+="  </label>";
						filterHtml+="</div>";
					filterHtml+="</div>";
					filterHtml+="<div class='form-group'>";
						filterHtml+="<div class='checkbox'>";
						filterHtml+="  <label>";
						filterHtml+="    <input type='checkbox' value='' id='altui-show-battery'>";
						filterHtml+="    Battery Devices";
						filterHtml+="  </label>";
						filterHtml+="</div>";
					filterHtml+="</div>";
				filterHtml+="</form>";

				filterHtml+="<div id='altui-device-name-filter' class='input-group'>";
				filterHtml+="<span class='input-group-addon' id='altui-device-search-btn'>"+searchGlyph+"</span>";
				filterHtml+="<span class='input-group-addon' id='altui-device-remove-btn'>"+removeGlyph+"</span>";
				filterHtml+="<input type='text' class='form-control' placeholder='Device Name' aria-describedby='sizing-addon2'>";
				filterHtml+="</div>";

			filterHtml+="  </div>";
			filterHtml+="</div>";
			filterHtml+="</div>";
			
			var toolbarHtml="";
			var roomfilterHtml="";    
			var categoryfilterHtml="";
			var dfd = $.Deferred();		
			$.when( _drawRoomFilterButtonAsync(_deviceDisplayFilter.room) )
			.then( function(html) { 
				roomfilterHtml = html; 

				categoryfilterHtml+="	<div class='btn-group' id='altui-device-category-filter'>";
				categoryfilterHtml+="  <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>";
				categoryfilterHtml+=  (tagsGlyph + '&nbsp;' +_T('Category') + "<span class='caret'></span>");
				categoryfilterHtml+="  </button>";
				categoryfilterHtml+="  <ul class='dropdown-menu' role='menu'>"
				categoryfilterHtml+="<li><a href='#' id='{0}' class='{2}'>{1}</a></li>".format(0,_T('All'),(_deviceDisplayFilter.category==0) ? 'bg-primary' : '');

				$.when( MultiBox.getCategories(
					function(idx,category) {
						categoryfilterHtml+="<li><a href='#' id='{0}' class='{2}'>{1}</a></li>".format(category.id,category.name,(_deviceDisplayFilter.category==category.id) ? 'bg-primary' : '');
					},
					null,
					function(categories) {
						categoryfilterHtml+="  </ul>";
						categoryfilterHtml+="</div>";			
						categoryfilterHtml+="  <button type='button' class='btn btn-default' id='altui-device-filter' >";
						categoryfilterHtml+=  (searchGlyph + '&nbsp;' +_T('Filter') + "<span class='caret'></span>");
						categoryfilterHtml+="  </button>";			
						categoryfilterHtml+="  <button type='button' class='btn btn-default' id='altui-device-create' >";
						categoryfilterHtml+= (plusGlyph + "&nbsp;" + _T("Create"));
						categoryfilterHtml+="  </button>";	
					}
				))
				.then ( function(categories) {
					// Display
					$(".altui-device-toolbar").replaceWith( "<div class='altui-device-toolbar'>"+roomfilterHtml+categoryfilterHtml+filterHtml+"</div>" );
					if (categories.length+1>=parseInt(MyLocalStorage.getSettings('Menu2ColumnLimit')))
						$("#altui-device-category-filter ul").attr('style','columns: 2; -webkit-columns: 2; -moz-columns: 2;');

					$(".altui-pagefilter").css("display","inline");
					
					// interactivity					
					$("#altui-device-remove-btn").off("click touchend").on("click touchend",function() { 
						$(this).parent().find("input").val("");
						_deviceDisplayFilter.filtername = "";
						MyLocalStorage.setSettings("DeviceFilterName",_deviceDisplayFilter.filtername);
						_drawDevices(deviceFilter);
					});
					
					$("#altui-device-search-btn").off("click touchend").on("click touchend",function() { $(this).focus(); });

					$("#altui-device-name-filter input").autocomplete({
						source: $.map( MultiBox.getDevicesSync() , function( device, i ) { return device.name; }  ),
						appendTo: "#altui-device-name-filter",
						delay: 500,
						// minLength: 3,
						change: function(event, ui ) {
							var v= $(this).val();
							_deviceDisplayFilter.filtername = v;
							MyLocalStorage.setSettings("DeviceFilterName",_deviceDisplayFilter.filtername);
							_drawDevices(deviceFilter);
						},
						select: function( event, ui ) {
							var v= ui.item.label;
							_deviceDisplayFilter.filtername = v;
							MyLocalStorage.setSettings("DeviceFilterName",_deviceDisplayFilter.filtername);
							_drawDevices(deviceFilter);
						},
						response: function( event, ui ) {
							if (ui.content.length>0) {
								$("#altui-device-name-filter").removeClass("has-error");
								return;
							}
							$("#altui-device-name-filter").addClass("has-error");
							ui.content.push( { label:_T('No Match'), value:'' } );
						},
					});
					$("#altui-device-name-filter input").val(_deviceDisplayFilter.filtername);
					var v=$("#altui-device-name-filter input").val();
					if (v.length>0)
						$("#altui-device-name-filter input").focus();
					
					$("#altui-device-filter-form").toggle(_deviceDisplayFilter.filterformvisible);
					$("#altui-device-filter").click( function() {
						_deviceDisplayFilter.filterformvisible = !_deviceDisplayFilter.filterformvisible;
						$("#altui-device-filter-form").toggle();
						$("#altui-device-filter span.caret").toggleClass( "caret-reversed" );
					});

					$("#altui-show-battery").prop('checked',_deviceDisplayFilter.batterydevice);
					$("#altui-show-battery").click( function() {
						_deviceDisplayFilter.batterydevice = $(this).prop('checked');
						MyLocalStorage.setSettings("ShowBatteryDevice",_deviceDisplayFilter.batterydevice);
						_drawDevices(deviceFilter);
					});

					$("#altui-show-invisible").prop('checked',_deviceDisplayFilter.invisible);
					$("#altui-show-invisible").click( function() {
						_deviceDisplayFilter.invisible = $(this).prop('checked');
						MyLocalStorage.setSettings("ShowInvisibleDevice",_deviceDisplayFilter.invisible);
						_drawDevices(deviceFilter);
					});

					$("#altui-show-favorites").prop('checked',_deviceDisplayFilter.favorites);
					$("#altui-show-favorites").click( function() {
						_deviceDisplayFilter.favorites = $(this).prop('checked');
						MyLocalStorage.setSettings("ShowFavoriteDevice",_deviceDisplayFilter.favorites);
						_drawDevices(deviceFilter);
					});

					$("#altui-device-create").click( UIManager.deviceCreate );
					$("#altui-device-room-filter a").click( function() {
						$(this).closest(".dropdown-menu").find("li.active").removeClass("active");
						$(this).parent().addClass("active");
						_onClickRoomButton( $(this).prop('id') , $(this).data('altuiid') );
					});
					$("#altui-device-category-filter a").click( function() {
						$(this).closest(".dropdown-menu").find("li.active").removeClass("active");
						$(this).parent().addClass("active");
						_deviceDisplayFilter.category = $(this).prop('id');
						MyLocalStorage.setSettings("CategoryFilter",_deviceDisplayFilter.category);
						_drawDevices(deviceFilter);
					});
					dfd.resolve();
				});
			});
			return dfd.promise();		
		};
		
		function _drawDevices(filterfunc)
		{
			$(".altui-mainpanel").empty();
			// Category & Form filter
			MultiBox.getDevices( drawDeviceContainer , filterfunc, endDrawDevice);
		};
		
		function _onClickRoomButton(htmlid,altuiid)
		{
			// var roomid = $(this).prop('id');
			_deviceDisplayFilter.room = (altuiid !="") ? altuiid : htmlid;	
			UIManager.setLeftnavRoomsActive(_deviceDisplayFilter.room);
			MyLocalStorage.setSettings("DeviceRoomFilter",_deviceDisplayFilter.room);
			_drawDevices(deviceFilter);
		};
		
		// Page Preparation
		UIManager.clearPage(_T('Devices'),_T("Devices"));
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-device-toolbar'></div>");
		
		// Dialogs
		DialogManager.registerDialog('deviceCreateModal', _deviceCreateModalHtml() );
		
		// on the left, get the rooms
		$(".altui-leftnav").empty();
		UIManager.leftnavRooms( 
			_onClickRoomButton,		// click button callback
			function(rooms) {		// all rooms loaded callback
				$.each(rooms, function(idx,room) {
					_roomID2Name[ room.altuiid ] = room.name;
				});
				UIManager.setLeftnavRoomsActive(_deviceDisplayFilter.room);
			}
		);

		_drawDevices(deviceFilter);

		// deletegated event for title click / rename for device
		$(".altui-mainpanel")
			// .on("click",".altui-camera-picture", _onClickCamera )
			.on("click",".altui-device-title-name",function() { 
				if ($(this).find("input.altui-device-title-input").length>=1)
					return;
				var text = $(this).text();
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				$(this).html("<input id='"+altuiid+"' class='altui-device-title-input' value='"+text+"'></input>");

				$("input#"+altuiid+".altui-device-title-input").focusout({altuiid:altuiid},function(event){ 
					var device = MultiBox.getDeviceByAltuiID(event.data.altuiid);
					var newname = $(this).val();
					DialogManager.confirmDialog(_T("Are you sure you want to modify this device to:")+newname,function(result) {
						if (result==true)
							MultiBox.renameDevice(device, newname );
					});
					$(this).parent().text(device.name);
				});
			})
			// .off("click",".altui-favorite")
			.on("click",".altui-favorite",function(event) { 
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				device.favorite = !device.favorite;
				$(this).parents(".altui-device-title").html(_enhancedDeviceTitle(device));
				Favorites.set('device', altuiid, device.favorite);
			})
			// .off("click",".altui-device-controlpanelitem")
			.on("click",".altui-device-controlpanelitem",function(){ 
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				UIManager.pageControlPanel(altuiid);
			})
			// .off("click",".altui-device-icon")
			.on("click",".altui-device-icon",function(){ 
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				UIManager.pageControlPanel(altuiid);
			});
	},

	pageScenes: function ()
	{
		var _roomID2Name={};
		var _sceneID2RoomName={};
		var _sceneFilter={
			room: MyLocalStorage.getSettings("SceneRoomFilter") || -1,
			isValid: function() { return this.room != -1 }
		};
		function _sceneInThisRoom(scene) {
			if ((_sceneID2RoomName[scene.altuiid]==null)&&(scene.room>0)) {
				var controller = MultiBox.controllerOf(scene.altuiid).controller;
				_sceneID2RoomName[scene.altuiid] = _roomID2Name["{0}-{1}".format(controller,scene.room)];
			}
			return ( (_sceneFilter.room<0) || (scene!=null && _sceneID2RoomName[scene.altuiid]==_roomID2Name[_sceneFilter.room]) ) 
				&& ( (_sceneFilter.room!=-2) || (scene.favorite==true) );
		};
		function _onClickRoomButton(htmlid,altuiid) {
			_sceneFilter.room = (altuiid !="") ? altuiid : htmlid;
			UIManager.setLeftnavRoomsActive( _sceneFilter.room );
			MyLocalStorage.setSettings("SceneRoomFilter",_sceneFilter.room);
			_drawScenes( _sceneInThisRoom );
		};
		
		function sceneDraw(idx, scene) {
			var html = UIManager.sceneDraw(scene);
			var scenecontainerTemplate="<div class=' col-sm-6 col-md-4'>";
			scenecontainerTemplate	+= 	html;
			scenecontainerTemplate	+= 	"</div>";		
			var domPanel = $(".altui-mainpanel");
			domPanel.append(scenecontainerTemplate.format(scene.id));	
		};
		
		function afterSceneListDraw(scenes) {
			// draw toolbar buttons
			var toolbarHtml="";
			$.when( _drawRoomFilterButtonAsync( _sceneFilter.room ) )
			.then(function( html) {
				toolbarHtml+= html;	// room filter
				toolbarHtml+="  <button type='button' class='btn btn-default' id='altui-scene-create' >";
				toolbarHtml+=(plusGlyph + "&nbsp;" + _T("Create"));
				toolbarHtml+="  </button>";			
				$(".altui-scene-toolbar").replaceWith( "<div class='altui-scene-toolbar'>"+toolbarHtml+"</div>" );
						
				$("#altui-scene-create").click( function() {
					UIManager.pageSceneEdit(NULL_SCENE);
				});
				$("#altui-device-room-filter button").toggleClass("btn-info",_sceneFilter.isValid());
				
				// actions
				$(".altui-mainpanel")
					// .off("click",".altui-delscene")
					.on("click",".altui-delscene",function() {
						var altuiid = $(this).closest(".altui-scene").data('altuiid');
						var scene = MultiBox.getSceneByAltuiID(altuiid);
						DialogManager.confirmDialog(_T("Are you sure you want to delete scene ({0})").format(altuiid),function(result) {
							if (result==true) {
								MultiBox.deleteScene( scene );
							}
						});
					})
					// .off("click",".altui-pausescene")
					.on("click",".altui-pausescene",function() {
						var altuiid = $(this).closest(".altui-scene").data('altuiid');
						var scene = MultiBox.getSceneByAltuiID(altuiid);
						scene.paused = (scene.paused==1) ? 0 : 1; 
						MultiBox.editScene( altuiid , scene );
					})
					// .off("click",".altui-runscene")
					.on("click",".altui-runscene",function() {
						var altuiid = $(this).closest(".altui-scene").data('altuiid');
						var scene = MultiBox.getSceneByAltuiID(altuiid);
						$(this).removeClass("btn-primary").addClass("btn-success");
						MultiBox.runScene( scene );
					})
					// .off("click",".altui-editscene")
					.on("click",".altui-editscene",function() {
						var altuiid = $(this).closest(".altui-scene").data('altuiid');
						UIManager.pageSceneEdit( altuiid );
					})
					.on("click",".altui-scene-history",function() {
						var altuiid = $(this).closest(".altui-scene").data('altuiid');
						var scene = MultiBox.getSceneByAltuiID(altuiid);
						var dialog =  DialogManager.registerDialog('dialogModal',
							defaultDialogModalTemplate.format( 
							_T("Scene History"), 			// title
							""				// body
							));
						MultiBox.getSceneHistory( scene, function(history) {
							var html="";
							html += "<div class='panel panel-default'> <div class='panel-body'>";
							html +="<table id='{0}' class='table table-condensed altui-variable-value-history'>".format(altuiid);
							html +="<thead>";
							html += ("<tr><th>{0}</th><th>{1}</th></tr>".format(_T("Date"),_T("Name")));
							html +="</thead>";
							html +="<tbody>";
							history.lines.reverse();
							$.each(history.lines, function(i,e) {
								html += ("<tr><td>{0}</td><td>{1}</td></tr>".format( e.date, e.name) );
							});
							html +="</tbody>";
							html +="</table>";
							html += "  </div></div>";
							$(dialog).find(".row-fluid").append(html);
							$('div#dialogModal').modal();
						});
					})
					.on("click",".altui-favorite",function(event) { 
						var altuiid = $(this).closest(".altui-scene").data('altuiid');
						var scene = MultiBox.getSceneByAltuiID(altuiid);
						scene.favorite = !scene.favorite;
						Favorites.set('scene', altuiid, scene.favorite );
						$(this).replaceWith( (scene.favorite==true) ? starGlyph : staremtpyGlyph );
					});
				
				$("#altui-device-room-filter a").click( function() {
					$(this).closest(".dropdown-menu").find("li.active").removeClass("active");
					$(this).parent().addClass("active");
					_onClickRoomButton( $(this).prop('id'), $(this).data("altuiid") );
				});
			});
		};
		
		function _drawScenes( filterfunc )
		{
			$(".altui-mainpanel").empty();
			MultiBox.getScenes( sceneDraw , filterfunc, afterSceneListDraw )
		}
		
		UIManager.clearPage(_T('Scenes'),_T("Scenes"));
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-scene-toolbar'></div>");
		
		// on the left, get the rooms
		UIManager.leftnavRooms( 
			_onClickRoomButton,		// click button callback
			function(rooms) {		// all rooms loaded callback
				$.each(rooms, function(idx,room) {
					_roomID2Name[ room.altuiid ] = room.name;
				});
				UIManager.setLeftnavRoomsActive( _sceneFilter.room );
			}
		);

		_drawScenes( _sceneInThisRoom );
	},

	pageSceneEdit: function (altuiid,newscene_template)
	{
		// Deep copy so we can edit it
		var newid = MultiBox.getNewSceneID( MultiBox.controllerOf(altuiid).controller );
		var orgscene = (altuiid!=NULL_SCENE) ? MultiBox.getSceneByAltuiID( altuiid ) : { 
				name:"New Scene",
				id: newid.id,
				altuiid: newid.altuiid,
				triggers: [],
				groups: [{"delay":0,"actions":[]}],
				timers: [],
				lua:"",
				room:0
		};
		var scene = jQuery.extend(true, {timers:[], triggers:[], groups:[] }, orgscene, newscene_template );

		// clear page
		UIManager.clearPage(_T('Scene Edit'),altuiid!=undefined ? "Edit Scene #"+scene.altuiid : "Create Scene",UIManager.oneColumnLayout);

		var editor = SceneEditor( scene );
		var html = "<div class='col-xs-12'>" ;
			html += UIManager.sceneDraw( scene, true);	// draw scene
			html += editor.sceneEditDraw();					// draw editor
		html += "</div>";
		$(".altui-mainpanel").append(  html );
		
		editor.runActions();							// interactivity
	},

	pagePlugins: function ()
	{
		function _sortBySourceName(a,b)
		{
			if (a.SourceName < b.SourceName)
				return -1;
			if (a.SourceName > b.SourceName)
				return 1;
			return 0;
		};
		
		UIManager.clearPage(_T('Plugins'),_T("Plugins"),UIManager.oneColumnLayout);

		function _getScriptFileList(controller,devicetype) {
			var dtdb = MultiBox.getDeviceTypesDB(controller);
			var dt = dtdb[devicetype];
			var scripts = {};
			if ( dt.ui_static_data && dt.ui_static_data.Tabs )
			{
				$.each( dt.ui_static_data.Tabs, function( idx,tab) {
					if (tab.TabType=="javascript" && tab.ScriptName!="shared.js")
					{
						var script = tab.ScriptName;
						var func = tab.Function;
						if (scripts[script] == undefined)
							scripts[script]=[];
						scripts[script].push( func );
					}
				});
			}
			return scripts;
		};
		
		function _getFileButton(plugin) {
			var html = "";
			html +="<div class='btn-group'>";
			html +="  <button id='{0}' type='button' class='btn btn-default btn-sm dropdown-toggle altui-plugin-files' data-toggle='dropdown' aria-expanded='false'>".format(plugin.id);
			html +=  (_T("Files")+" <span class='caret'></span>");
			html +="  </button>";
			html +="  <ul class='dropdown-menu' role='menu'>";
			if (plugin.Files)
				$.each(plugin.Files.sort(_sortBySourceName), function(idx,file) {
					html +="    <li><a class='altui-plugin-file' href='#' data-plugin='{1}'>{0}</a></li>".format(file.SourceName,plugin.altuiid);
				});
			html +="  </ul>";
			html +="</div>";
			// var filebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-files',  glyphTemplate.format("file","Files",""));
			return html;
		};
		
		var pluginTemplate = "<tr><td>{6}</td><td>{0}</td><td>{1}.{2}</td><td>{7}</td><td>{3} {4}</td><td>{5}</td><td>{8}</td></tr>";
		function drawPlugin(idx, plugin) {
			var iconTemplate = "<img class='altui-plugin-icon' src='//apps.mios.com/{0}'></img>";
			var filebutton = _getFileButton(plugin);
			var helpbutton = smallbuttonTemplate.format( plugin.altuiid, 'altui-plugin-icon altui-plugin-question-sign',  glyphTemplate.format("question-sign","Help",""), "Help");
			var infobutton = smallbuttonTemplate.format( plugin.altuiid, 'altui-plugin-icon altui-plugin-info-sign',  glyphTemplate.format("info-sign","Information",""), "Info");
			var updatebutton = smallbuttonTemplate.format( plugin.altuiid, 'altui-plugin-icon altui-plugin-update',  glyphTemplate.format("retweet","Update Now",""), "Update");
			var deletebutton = smallbuttonTemplate.format( plugin.altuiid, 'altui-plugin-icon altui-plugin-uninstall',  glyphTemplate.format("remove","Uninstall",""), "Uninstall");
			var inputbox = "<input class='form-control input-sm altui-plugin-version' id='altui-plugin-version-{0}' title='{1}'></input>".format( plugin.altuiid,_T("Version number or empty for latest official version"));

			var pluginTxt = pluginTemplate.format(
				plugin.Title,
				plugin.VersionMajor,
				plugin.VersionMinor,
				helpbutton,
				infobutton,
				inputbox+updatebutton,
				iconTemplate.format(plugin.Icon),
				filebutton,
				deletebutton
				);
			$(".altui-mainpanel tbody").append(pluginTxt);
			$("button#"+plugin.altuiid+".altui-plugin-question-sign").data("url",plugin.Instructions);
		};
		
		function endDrawPlugin() {
			// adding manually installed plugin
			var devices = MultiBox.getDevicesSync();
			var manual_plugins={};

			// first aggregate to find manually installed plugin
			$.each( $.grep(devices,function(d){ return d.id_parent==0  && d.plugin==undefined}) , function(i,d) {
				var controller = MultiBox.controllerOf(d.altuiid).controller;
				manual_plugins[d.device_file] = {
					devtype : d.device_type,
					files   : [],
					devaltuiid : d.altuiid
				};
				$.each( [d.device_file,d.device_json,d.impl_file], function(i,filename) {
					if (filename && filename !="")
						manual_plugins[d.device_file].files.push( {SourceName:filename} );
				});
				if (!d.device_json) {
					// try to get it from the .xml file
					FileDB.getFileContent(controller,d.device_file , function( str ) {
						var re = /<staticJson>(.*)<\/staticJson>/; 
						var m; 
						if ((m = re.exec(str)) !== null) {
							if (m.index === re.lastIndex) {
								re.lastIndex++;
							}
							manual_plugins[d.device_file].files.push( {SourceName:m[1]} );
						}
					});
				}
			});

			// for each, create a virtual plugin structure so we can display
			$.each(manual_plugins, function( key,value) {
				// add also the JS files used for the tabs for such device type
				var controller = MultiBox.controllerOf(value.devaltuiid).controller;
				var scripts = _getScriptFileList( controller,value.devtype ); 
				$.each(scripts, function(key,script) {
					value.files.push({SourceName:key});
				});
				var plugin = {
					id:-1,
					altuiid: value.devaltuiid,		// put the id of the device requesting this file, so that we know the "controller"
					Files: value.files
				};
				var pluginTxt = pluginTemplate.format(
					key,
					"?",
					"",
					"",
					"",
					"",
					"<img class='altui-plugin-icon' src='//apps.mios.com/images/plugin.png'></img>",
					_getFileButton(plugin),
					""
					);
				$(".altui-mainpanel tbody").append(pluginTxt);
			});
			$(".altui-plugin-question-sign").click(function() {
				var url = $(this).data("url"); 
				window.open( url, '_blank');
			});
			$(".altui-plugin-info-sign").click(function() {
				var altuiid = $(this).prop("id");
				var pluginid = altuiid.split("-")[1];
				window.open("http://apps.mios.com/plugin.php?id="+pluginid, '_blank');
			});
			$(".altui-plugin-file").click(function() {
				var altuiid = $(this).data("plugin");
				var info = MultiBox.controllerOf(altuiid);
				var name = $(this).text();
				FileDB.getFileContent(info.controller,name , function( txt ) {
					var url = MultiBox.buildUPnPGetFileUrl(altuiid,name);
					UIManager.pageEditor(name,txt,"Download",function(txt) {
						$(".altui-mainpanel a[download]")[0].click();
					});
					$(".altui-mainpanel").prepend("<div class='hidden' >Download: <a href='"+url+"' download>"+name+"</a></div>");
				});
			});
			$(".altui-plugin-update").click(function() {
				var id = $(this).prop("id");
				if (id==undefined)	return;
				DialogManager.confirmDialog(_T("are you sure you want to update plugin #{0}").format(id),function(result) {
					if (result==true) {
						var val = $("#altui-plugin-version-"+id).val();
						if ($.isNumeric(val)==true) {
							MultiBox.updatePluginVersion(id,val,function(result) {
								PageMessage.message( _T("Update Plugin succeeded, be patient Luup will reload"), "success");
								// alert(result);
							});
						}
						else
							MultiBox.updatePlugin(id,function(result) {
								PageMessage.message( _T("Update Plugin succeeded, be patient Luup will reload"), "success");
								// alert(result);
							});
					}
				});
			});
			$(".altui-plugin-uninstall").click(function() {
				var id = $(this).prop("id");
				if (id==undefined)	return;
				DialogManager.confirmDialog(_T("Are you sure you want to uninstall this plugin #{0} and all its created devices").format(id),function(result) {
					if (result==true) {
						MultiBox.deletePlugin(id,function(result) {
							alert(result);
						});
					}
				});
			});
		};	
		
		$(".altui-mainpanel").append($("<table id='table' class='table table-condensed'><thead><tr><th></th><th>"+_T("Name")+"</th><th>"+_T("Version")+"</th><th>"+_T("Files")+"</th><th>Actions</th><th>"+_T("Update")+"</th><th>"+_T("Uninstall")+"</th></tr></thead><tbody></tbody></table>"));
		MultiBox.getPlugins( drawPlugin , endDrawPlugin);
	},
	
	pageTriggers: function()
	{
		UIManager.clearPage(_T('Triggers'),_T('Triggers'),UIManager.oneColumnLayout);
		$(".altui-mainpanel").empty();
		var bFirst=true;
		var bBody=false;
		var arr = [];
		MultiBox.getScenes( null , function(s) {return s.triggers!=null}, function(scenes) {
			$.each(scenes, function(idx,scene) {
				var controller = MultiBox.controllerOf(scene.altuiid).controller;
				var triggers = $.grep(scene.triggers,function(t) { return t.last_run!=undefined});
				$.each(triggers, function(idx,trigger) {
					var triggerinfo = _formatTrigger(controller,trigger);
					arr.push( {
						lastrun: triggerinfo.lastrun,
						scene: scene.name,
						trigger: triggerinfo.name,
						device: triggerinfo.device,
						condition: "{0} {1}".format(triggerinfo.descr,triggerinfo.condition),
						id: scene.altuiid+"-"+idx
					})
				})
			});
		})
		
		var viscols = MyLocalStorage.getSettings("TriggersVisibleCols") || [];
		if (viscols.length==0)
			viscols = [ 'lastrun','scene','trigger','device','condition','id'];

		$(".altui-mainpanel").append( _array2Table(arr,'id',viscols) );
		$("#altui-grid").bootgrid({
			caseSensitive: false,
			statusMapping: {}
		})
		.bootgrid("sort",{
			lastrun:"desc"
		})
		.on("loaded.rs.jquery.bootgrid", function (e) {
			var settings = $("#altui-grid").bootgrid("getColumnSettings");
			viscols = $.map($.grep(settings, function (obj) { return obj.visible == true }),function(obj){ return obj.id;});
			MyLocalStorage.setSettings("TriggersVisibleCols",viscols);
			/* your code goes here */
		});	
	},
	
	pageUsePages: function ()
	{
		// var pages = g_CustomPages;
		// PageManager.init(g_CustomPages);
		UIManager.clearPage(_T('Custom Pages'),"",UIManager.oneColumnLayout);
		// $("#altui-pagetitle").text("Your Custom Pages");

		var pageTabs = _createPageTabsHtml();

		var Html = "<div class='tab-content altui-page-contents'>";
		PageManager.forEachPage( function( idx, page) {
			Html += _getPageHtml(page,false)	// no edit mode
		});
		Html += "</div>";
		
		$(".altui-mainpanel").html( pageTabs + Html );
		$('#altui-page-tabs a:first').tab('show');
		_updateDynamicDisplayTools( false );
	},
	
	pageEditPages: function ()
	{				
		function _pagePageProperty(pagename) {
			var propertyline = "";
			var page = PageManager.getPageFromName(pagename);
			var pageAttributes = [
				{ key:'name', 		label:'Name', 			placeholder:'enter name' },
				{ key:'background',	label:'CSS Background', placeholder:'enter css string' , helptext:'any css3 valid background property'}
			];

			$.each( pageAttributes , function(idx,attributes) {
				var htmlid = 'altui-page-'+attributes.key;
				propertyline += "<div class='form-group'>";
				propertyline += "	<label for='{0}'>{1}</label>".format(htmlid, attributes.label);
				propertyline += "	<input id='{0}' class='form-control' type='text' value='{2}' placeholder='{1}'></input>"
					.format(
						htmlid,
						attributes.placeholder,
						page[ attributes.key ].replace(/'/g, '&quot;')
					);
				if (attributes.helptext)
					propertyline += "<p class='help-block'>{0}</p>".format(attributes.helptext);
				propertyline += "</div>";
			});

			var dialog = DialogManager.registerDialog('dialogModal',
							defaultDialogModalTemplate.format( 
							'Page Properties',					// title
							"<form>"+propertyline+"</form>"		// body
						));

			DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));							
			// buttons
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal button.btn-primary').on( 'click', function() {
				$.each( pageAttributes , function(idx,attributes) {
					var htmlid = 'altui-page-'+attributes.key;
					page[ attributes.key ] = $("#"+htmlid).val();
				});
				$('div#dialogModal').modal('hide');
				_displayPages();
			});
			
			$('div#dialogModal').modal();
		};
		
		// var pages = g_CustomPages;
		// PageManager.init(g_CustomPages);

		function _createPageEditorHtml() {
			var pageTabs = _createPageTabsHtml( true );		// edit mode

			var Html = "<div class='tab-content altui-page-contents altui-norefresh'>";
			PageManager.forEachPage( function( idx, page) {
				Html += _getPageHtml(page, true)	// edit mode
			});
			Html += "</div>";
			return pageTabs + Html;
		};
		
		function _createToolboxHtml() {
			function _createToolHtml(tool) {
				var html="";
				html += ("<div class='altui-widget {0} col-xs-11' id='{1}' data-type='{0}' >{2}</div>").format(tool.cls,tool.id,tool.html);
				return html;
			};

			var lines = new Array();
			$.each(tools , function(idx,tool) {
				lines.push( "<div class='row'>"+_createToolHtml(tool)+"</div>" );
			});

			var editBoxTemplate = "<div class='row'><div class='altui-edittoolbox col-xs-11' aria-label=''>{0}</div></div>";
			var editBoxLines = new Array();
			$.each(edittools , function(idx,tool) {
				var glyph = glyphTemplate.format( tool.glyph, tool.glyph,"" );
				editBoxLines.push("<div id='"+tool.glyph+"' class='altui-edittools'>"+glyph+"</div>");
			});
			lines.push(editBoxTemplate.format( editBoxLines.join('') ) );
			lines.push( "<div class='row'><div class='altui-widget-delete col-xs-11'>"+deleteGlyph+"</div></div>"  );
			return lines.join('');
		};
		
		function _displayPages() {
			var pageEditorHtml = _createPageEditorHtml();
			$(".altui-mainpanel").html( pageEditorHtml );
			$('#altui-page-tabs a:first').tab('show');
			_updateDynamicDisplayTools( true );	//edit mode
			
			// make all reloaded children draggable
			$(".altui-mainpanel .altui-widget")							
				.draggable( _widgetOnCanvasDraggableOptions() )	// for all pages

			// add resizable & gauges
			$.each(tools, function(idx,tool){
				if ($.isFunction( tool.onWidgetResize) ) {
				// if (tool.resizable==true) {
					$(".altui-custompage-canvas ."+tool.cls).resizable(
						_widgetOnCanvasResizableOptions(tool)
					);
				}
			});
			
			// make all pages droppable
			$(".altui-custompage-canvas")
			.selectable()
			.droppable({
				accept: ".altui-widget",
				tolerance: "fit",
				drop: function(event, ui) {
					var pagename = _getActivePageName();
					var page = PageManager.getPageFromName( pagename );
					var parent = $(this);
					var dropped = ui.helper;				// clone
					var type = ui.helper.data( "type" );	// data-type attr
					var tool = _getToolByClass( type );

					var position = ui.helper.position();
					var size = { width:ui.helper.width(),  height:ui.helper.height() };
					var widgetid = 0;
					if ( $(parent)[0] === $(ui.helper.parent())[0] )
					{
						// internal drag and drop on the page canvas
						widgetid = $(ui.helper).prop('id');
						if ($.isFunction( tool.onWidgetResize) ) {
							(tool.onWidgetResize)(page, widgetid, position, size);
							PageManager.updateChildrenInPage( page, widgetid, position, size );
						}
						else
							PageManager.updateChildrenInPage( page, widgetid, position );
						_showSavePageNeeded(true);

						// save also all selected items which moved as well as part of the drag and drop
						var selected = $(_getPageSelector( page )).find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
						$.each(selected, function (idx,elem) {
							widgetid = $(elem).prop('id');
							PageManager.updateChildrenInPage( page, widgetid, $(elem).position() , $(elem).size() );
							_showSavePageNeeded(true);
						});
					}
					else	
					{
						var parentoffset = $(this).offset();
						position = {
							top:	Math.round(ui.offset.top - parentoffset.top),
							left:	Math.round(ui.offset.left - parentoffset.left)
						};
						// adding from the toolbox
						widgetid = PageManager.insertChildrenInPage( page, tool, position);
						_showSavePageNeeded(true);

						var widget=PageManager.getWidgetByID( page, widgetid );
						var html = _getWidgetHtml( widget , true);		// edit mode
						var obj = $(html)
							.appendTo(parent)
							.draggable( _widgetOnCanvasDraggableOptions(page) );
						if ($.isFunction( tool.onWidgetResize) ) 
						{	
							obj.resizable(
								_widgetOnCanvasResizableOptions(tool)
							);
						}
						if ($.isFunction( tool.onWidgetDisplay) )
						{
							(tool.onWidgetDisplay)(page,widgetid, true);		// edit mode							
						}
					}
				}
			})
		};
		
		// draw page & toolbox
		UIManager.clearPage(_T('Edit Pages'),_T("Custom Pages Editor"),UIManager.twoColumnLayout);
		PageMessage.message(_T("Drag and Drop to add/move/delete controls. use Ctrl+Click or lasso to select multiple controls"),"info");

		// Get and draw the HTML areas
		var toolboxHtml = _createToolboxHtml();
		$(".altui-leftnav").append( toolboxHtml );
		_displayPages();
		
		// User interactivity
		$(".altui-widget-delete").droppable({
				accept: ".altui-widget",
				tolerance: "pointer",
				drop: function(event, ui) {
					var pagename = _getActivePageName();
					var page = PageManager.getPageFromName( pagename );
					var dropped = ui.helper;				// clone
					if ( $(dropped).parents(".altui-leftnav").length==0 ) { // not from toolbox
						var selected = $(_getPageSelector( page )).find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
						selected.each( function(idx,elem)
						{
							PageManager.removeChildrenInPage( page, $(elem).prop('id') );
							$(elem).remove();
						});
						PageManager.removeChildrenInPage( page, dropped.prop('id') );
						_showSavePageNeeded(true);
						ui.draggable.remove();
					}
					// var type = ui.helper.data( "type" );	// data-type attr
				}
		});
		$(".altui-leftnav .altui-widget").draggable({
			// containment: ".altui-custompage-canvas",
			grid: [ 5,5 ],
			helper: "clone",
			cursorAt: { left: 5 },
			// snap: true,
			// snapMode: "inner",
			// snapTolerance: 20,
			revert: "invalid"
		});
		
		// call backs
		$(".altui-edittools").click( function () {
			var id = $(this).prop('id');
			$.each(edittools, function(idx,tool){
				if (tool.glyph == id) {
					// update on HTML page
					var page = PageManager.getPageFromName( _getActivePageName() );
					var selected = $( _getPageSelector( page ) ).find(".altui-widget.ui-selected");
					(tool.onclick)( selected );
					
					// update the children position for each selected children
					$.each(selected, function (idx,elem) {
						var widgetid = $(elem).prop('id');
						PageManager.updateChildrenInPage( page, widgetid, $(elem).position() , $(elem).size() );
						_showSavePageNeeded(true);
					});
				}
			})
		});
			
		// $(".altui-mainpanel").off("click",".altui-widget"); 
		$(".altui-mainpanel").on("click",".altui-widget",function(event){ 
			if (event.ctrlKey == false ) {
				$(".altui-widget").removeClass("ui-selected");
				var pagename = _getActivePageName();
				var page = PageManager.getPageFromName( pagename );
				var cls = $(this).data( "type" );
				var tool = _getToolByClass( cls );
				var widgetid = $(this).prop('id');
				var widget=PageManager.getWidgetByID( page, widgetid );
				// apply defaults
				widget.properties = $.extend(true,{}, tool.properties, widget.properties);
				(tool.property)( widget );
			}
			else
				$(this).toggleClass("ui-selected");
		});

		// $(".altui-mainpanel").off("click","#altui-page-action-delete"); 
		$(".altui-mainpanel").on("click","#altui-page-action-delete",function(){ 
			// find active page
			PageManager.deletePage( _getActivePageName() );
			_displayPages();
		});
		
		// $(".altui-mainpanel").off("click","#altui-page-action-new"); 
		$(".altui-mainpanel").on("click","#altui-page-action-new",function(){ 
			// find active page
			var name = PageManager.addPage( );
			_displayPages();
		});
		
		// $(".altui-mainpanel").off("click","#altui-page-action-save"); 
		$(".altui-mainpanel").on("click","#altui-page-action-save",function(){ 
			// find active page
			PageManager.savePages( );
			_showSavePageNeeded(false);
		});
		
		// $(".altui-mainpanel").off("click","#altui-page-action-properties"); 
		$(".altui-mainpanel").on("click","#altui-page-action-properties",function(){ 
			// find active page
			_pagePageProperty( _getActivePageName() );
		});
		
	},
	
	pageWip: function ()
	{
		UIManager.clearPage(_T('Wip'),_T("Work In Progress"));
		$(".altui-mainpanel").append("<h3>Sorry this is not yet implemented</h3>");
	},

	getPayPalButtonHtml: function( bIncludeImg )
	{
		var html="";
		html +="<form class='form-inline' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>";
		html +="<input type='hidden' name='cmd' value='_s-xclick'>";
		html +="<input type='hidden' name='encrypted' value='-----BEGIN PKCS7-----MIIHTwYJKoZIhvcNAQcEoIIHQDCCBzwCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYBgrvHCzBPosImvVO9sO/oQ6dA12Rwlm8LS/iYoBltw9THdpHZSTy6edM7kOXS0wO9d8x4mRvDNitkmKR00AsE7BhnMSpkZxkF3EBlsClTlnJnSj6Hlts+0wNInGA4M0Gt7W/QkbbVSMQSjRBKjvnZPaShJi+GiM66GIuuQfOLCiTELMAkGBSsOAwIaBQAwgcwGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQI4PwIBKEQzASAgagmW+C6IENMiD2UmunCUtPixtHNXimbkiH0O9CozvAOXVOz77J88574qyHlERlGutGcqiARaT2igEla1YodKdXsKNW1rHUU4OskLG7pLMa7XbGfqCt4LHupanyqD2Pq2ImnpILoO2S0GKGOFwHENBub95SmENZ7aKROnJYJorF+NhMYOngPFQIjji+t/lDmM0H/jmUsviFPEbNeuhTIzC08EC0UwocykDSgggOHMIIDgzCCAuygAwIBAgIBADANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wHhcNMDQwMjEzMTAxMzE1WhcNMzUwMjEzMTAxMzE1WjCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMFHTt38RMxLXJyO2SmS+Ndl72T7oKJ4u4uw+6awntALWh03PewmIJuzbALScsTS4sZoS1fKciBGoh11gIfHzylvkdNe/hJl66/RGqrj5rFb08sAABNTzDTiqqNpJeBsYs/c2aiGozptX2RlnBktH+SUNpAajW724Nv2Wvhif6sFAgMBAAGjge4wgeswHQYDVR0OBBYEFJaffLvGbxe9WT9S1wob7BDWZJRrMIG7BgNVHSMEgbMwgbCAFJaffLvGbxe9WT9S1wob7BDWZJRroYGUpIGRMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbYIBADAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4GBAIFfOlaagFrl71+jq6OKidbWFSE+Q4FqROvdgIONth+8kSK//Y/4ihuE4Ymvzn5ceE3S/iBSQQMjyvb+s2TWbQYDwcp129OPIbD9epdr4tJOUNiSojw7BHwYRiPh58S1xGlFgHFXwrEBb3dgNbMUa+u4qectsMAXpVHnD9wIyfmHMYIBmjCCAZYCAQEwgZQwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tAgEAMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xNTAzMjExNjA4MThaMCMGCSqGSIb3DQEJBDEWBBS1KnzlMSVF1j/bSaX7KrGSY/9UfzANBgkqhkiG9w0BAQEFAASBgE5yoK937Hb6m4gwk0ekKGgb2l5WqTDL8mzCley2jMRPbhFPkfjUvQ4yIzQVA+3HzSWPOY3qDiq729JL5fcmJtz0GfuwbB1Iuu4H99HQ4KO02LRnX911i3ATimC151amR9OmLrNoWIPGAaL8KsIoONiOM4e45mZWC9bEwQCqOxIK-----END PKCS7-----'>";
		html +="<input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG_global.gif' border='0' name='submit' alt='PayPal ֠The safer, easier way to pay online.'>";
		html +="<img alt='' border='0' src='https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif' width='1' height='1'>";
		html +="</form>";
		return html;
	},
	
	pageCredits: function ()
	{
		UIManager.clearPage(_T('Credits'),_T("Credits"));
		
		var tbl = [
			["GetVera","http://getvera.com/","the zWave Getaway and backend platform"],
			["Bootstrap","http://getbootstrap.com/","set of css and javascript components for responsive design user interfaces"],
			["jQuery","http://jquery.com/","javascript framework and browser differences abstraction layer"],
			["jQueryUI","http://jqueryui.com/","jQuery User Interface widgets ( like slider )"],
			["Touch Punch","http://touchpunch.furf.com/","jQuery UI fix for touch screen devices"],
			["Bootstrap Validator","https://github.com/1000hz/bootstrap-validator","Form validator in Bootstrap 3 style"],
			["D3js","http://d3js.org/","D3 Data Driven Documents & Les Miserables tutorial"],
			["Bootgrid","http://www.jquery-bootgrid.com/","Jquery Bootstrap Grid"],
			["amg0","http://forum.micasaverde.com/","reachable as amg0 on this forum "]
		];
		var html = "<dl>";
		$.each(tbl, function (idx,line) {
			html +="<dt>{0} (<a href='{1}'>{1}</a>)</dt>".format(line[0],line[1]);
			html +="<dd>{0}</dd><hr>".format(line[2]);
		});
		html +="</dl>";

		html +="<p>For those who really like this plugin and feel like it, you can donate what you want here on Paypal. It will not buy you more support not any garantee that this can be maintained or evolve in the future but if you want to show you are happy and would like my kids to transform some of the time I steal from them into some <i>concrete</i> returns, please feel very free ( and absolutely not forced to ) to donate whatever you want.  thank you !</p>";
		// html += UIManager.getPayPalButtonHtml( true );

		$(".altui-mainpanel").append(html);
	},
	

	pageEditorForm: function (title,txt,button,onClickCB) {
		var html = "";
		html +="<form class='altui-editor-form col-sm-11' role='form' action='javascript:void(0);'>";
		html +="  <div class='form-group'>";
		html +="    <label for='altui-editor-text'>"+title+":</label>";
		html +="    <textarea id='altui-editor-text' rows='20' class='form-control' placeholder='xxx'>"+txt.htmlEncode()+"</textarea>";
		html +="  </div>";
		html +="  <button id='altui-luaform-button' type='submit' class='btn btn-default'>"+button+"</button>";
		html +="</form>";
		$(".altui-mainpanel").append(html);
		$("#altui-luaform-button").click( function() {
			var txt = $("textarea#altui-editor-text").val();
			onClickCB(txt,$(this));
		});
	},
	
	pageEditor: function (filename,txt,button,cbfunc)
	{
		UIManager.clearPage(_T('Editor'), filename,UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<p> </p>");
		UIManager.pageEditorForm(filename,txt,button,function(newtxt) {
			if ($.isFunction(cbfunc)) 
				cbfunc(newtxt);
		});
	},
	
	pageLuaTest: function ()
	{
		UIManager.clearPage(_T('LuaTest'),_T("LUA Code Test"),UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<p>This test code will succeed if it is syntactically correct and does not return false. an error in the code or a return false will trigger a failure</p>");
		UIManager.pageEditorForm("Lua Test Code","return true",_T("Submit"),function(lua) {
			MultiBox.runLua(0,lua, function(result) {
				if ( result == "Passed")
					PageMessage.message( _T("Code execution succeeded"), "success");
				else
					PageMessage.message( _T("Code execution failed"), "danger");
			});
		});
	},
	
	pageOsCommand: function ()
	{
		var defaultCommands = [
			{label:_T("Disk Usage"), command:'du -h' },
			{label:_T("Free Space"), command:'df -h' },
			{label:_T("Plugin Files"), command:'ls -l /etc/cmh-ludl' },
			{label:_T("Log Sizes"), command:'ls -l /var/log/cmh' },
			{label:_T("Search Logs"), command:"cat /var/log/cmh/LuaUPnP.log | grep '{0}'" },
			{label:_T("Tail Logs"), command:"tail -n 50 /var/log/cmh/LuaUPnP.log" },
			{label:_T("Find Json"), command:"find / -name *json*.lua" }
		];
		var commands = MyLocalStorage.getSettings("OsCommands") || defaultCommands;
		var actions = [
			{ name:'delete', glyph:deleteGlyph }
		];
		function _drawFrequentCommandBar(commands) {
			var html="";
			html+="  <div id='altui-frequent-commands-bar' class='form-group'>";
			html+="    <label for='altui-btngroup'>"+_T("Frequent Commands")+editButtonHtml+"</label>";
			html+="  	<div class='btn-group' id='altui-btngroup'>";
			$.each(commands, function(idx,obj) {
				html += "<button id='{0}' type='button' class='btn btn-default altui-oscommand-button' data-cmd='{2}' '>{1}</button>".format(idx,obj.label,obj.command.replace(/'/g, '&quot;'));
			});
			html+="  	</div>";
			html+="  </div>";
			return html;
		};
		function _drawCommandTable(commands) {
			var html="";
			html+= "<table class='table table-condensed altui-oscommand-configtbl'>";
			html+= "    <thead>";
			html+= "      <tr>";
			html+= "<th>"+_T("Actions")+"</th>";
			$.each(defaultCommands[0] ,function(key,val) {
				html+= "<th>"+_T(key)+"</th>";
			})
			html+= "      </tr>";
			html+= "    </thead>";
			html+= "    <tbody>";
			$.each(commands,function(idxcmd,cmd) {
				html+= "<tr>";
				html+= "<td>";
				$.each(actions,function(idxaction,action) {
					html += smallbuttonTemplate.format( idxcmd, 'altui-oscommand-configtbl-action-'+action.name, action.glyph ,action.name);
				});
				html+= "</td>";
				$.each(cmd,function(key,val) {
					html+= "<td>"+val+"</td>";
				})
				html+= "</tr>";
			})
			html+= "<tr>";
			html+= "<td>";
			html += smallbuttonTemplate.format( commands.length, 'altui-oscommand-configtbl-action-add', plusGlyph ,_T('Add') );
			html+= "</td>";
			$.each(defaultCommands[0],function(key,val) {
				html+= "<td>"+"<input required type='text' class='form-control' id='"+key+"' placeholder='"+key+"'>"+"</td>";
			})
			html+= "</tr>";
			html+= "<tr>";
			html+= "<td>";
			html += smallbuttonTemplate.format( commands.length, 'altui-oscommand-configtbl-action-reset', refreshGlyph ,_T('Default') );
			html+= "</td><td colspan=2></td>";
			html+= "</tr>";
			html+= "    </tbody>";
			html+= "</table>";
			return html;
		};
		
		function _replaceANSI(str) {
			var re = /\[33;1m(.*)\[0m/g;
			var subst = '<span class=\'altui-orange\'>$1</span>'; 
			str = str.replace(re, subst);			
			re = /\[35;1m(.*)\[0m/g;
			subst = '<span class=\'altui-magenta\'>$1</span>'; 
			str = str.replace(re, subst);			
			re = /\[31;1m(.*)\[0m/g;
			subst = '<span class=\'altui-red\'>$1</span>'; 
			str = str.replace(re, subst);	
			re = /\[36;1m(.*)\[0m/g;
			subst = '<span class=\'altui-cyan\'>$1</span>'; 
			str = str.replace(re, subst);				
			return str;
		};
		
		UIManager.clearPage(_T('OsCommand'),_T("OS Command"),UIManager.oneColumnLayout);
		
		var editButtonHtml = buttonTemplate.format( 'altui-editoscmd-0', 'altui-editoscmd', wrenchGlyph,'default');

		var html = "";
		html+="<div class='col-xs-12'><form>";
		html+=	"<p>"+_T("Enter a Vera OS ( Unix ) command, the stdout will be returned and displayed below")+"</p>";
		html += _drawFrequentCommandBar(commands);
		html += _createControllerSelect('altui-controller-select');
		html+="  <div class='form-group'>";
		html+="    <label for='oscommand'>"+_T("OS Command")+"</label>";
		html+="    <input type='text' class='form-control' id='oscommand' placeholder='Type your OS command like: df '>";
		html+="  </div>";
		html+="</form>";
		html+="<button type='button' id='altui-oscommand-exec-button' class='btn btn-default'>"+_T("Run")+"</button>";
		html+="<hr>";
		html+="<h3>"+_T("Output")+"</h3>";
		html+="<pre id='altui-oscommand-result' class='pre-scrollable'></pre>";
		html+="</div>";
		$(".altui-mainpanel").append( html );

		$(".altui-mainpanel").on("click",".altui-oscommand-button",function(e){ 
			// e.stopPropagation();
			var val = $(this).data("cmd");
			$("#oscommand").val( val );
			setTimeout( function() { $("#altui-oscommand-exec-button").click() } ,100 );
		});
		
		$(".altui-mainpanel").on("click","#altui-oscommand-exec-button",function(e){ 
			function _execCmd(cmd) {
				show_loading();
				MultiBox.osCommand( parseInt($("#altui-controller-select").val()), oscmd, function(res) {
					hide_loading();
					var html = $("<span></span>").text(res.result).html();	// escape html
					$('#altui-oscommand-result').html( (res.success==true) ? _replaceANSI(html) : _T("failed to execute"));
				});
			};
			
			var oscmd = $("#oscommand").val();
			if (oscmd.indexOf("{0}") > -1) {
				var dialog = DialogManager.registerDialog('dialogModal',
								defaultDialogModalTemplate.format( 
								_T('Command Parameters'),		// title
								"<form></form>"					// body
							));
				var lastOne = MyLocalStorage.getSettings("LastOne_"+'param0') || "";
				DialogManager.dlgAddLine(dialog, 'param0', _T('Parameter'), lastOne,"", {required:''} );
				DialogManager.dlgAddDialogButton(dialog, true, _T("Run"));
				$('div#dialogModal').modal();
				$('div#dialogs')
					.off('submit',"div#dialogModal")
					.on( 'submit',"div#dialogModal", function() {
							$('div#dialogModal').modal('hide');
							var val = $("#altui-widget-param0").val();
							MyLocalStorage.setSettings("LastOne_"+'param0'+name,val);
							oscmd = oscmd.format( val );
							$("#oscommand").val( oscmd );
							setTimeout(function() {
								_execCmd(oscmd);
							}, 300 );
						});
			}
			else
				_execCmd(oscmd);
		});
		
		// SHOW EDIT TABLE
		$(".altui-mainpanel").on("click",".altui-editoscmd",function(e){ 
			if ( $(".altui-oscommand-configtbl").length == 0 ) {
				$("#altui-frequent-commands-bar").after(   _drawCommandTable(commands) );
			}
			else {
				$(".altui-oscommand-configtbl").remove();
			}
		});
		
		// DELETE
		$(".altui-mainpanel").on("click",".altui-oscommand-configtbl-action-delete",function(e){ 
			//delete command
			var index = $(this).prop('id');
			commands.splice(index,1);
			$("div#altui-frequent-commands-bar").replaceWith( _drawFrequentCommandBar(commands) );
			$("table.altui-oscommand-configtbl").replaceWith( _drawCommandTable(commands) );
			MyLocalStorage.setSettings("OsCommands",commands);
		});

		// ADD
		$(".altui-mainpanel").on("click",".altui-oscommand-configtbl-action-add",function(e){ 
			var tr = $(this).closest("tr"); 
			var label =tr.find("input#label").val();
			var command = tr.find("input#command").val();
			if ( label && command ) {
				commands.push( {label:label, command:command } );
				$("div#altui-frequent-commands-bar").replaceWith( _drawFrequentCommandBar(commands) );
				$("table.altui-oscommand-configtbl").replaceWith( _drawCommandTable(commands) );
				MyLocalStorage.setSettings("OsCommands",commands);
			}
		});

		// RESET
		$(".altui-mainpanel").on("click",".altui-oscommand-configtbl-action-reset",function(e){ 
			commands = cloneObject(defaultCommands);
			$("div#altui-frequent-commands-bar").replaceWith( _drawFrequentCommandBar(commands) );
			$("table.altui-oscommand-configtbl").replaceWith( _drawCommandTable(commands) );
			MyLocalStorage.setSettings("OsCommands",commands);
		});
	},
	
	pageLuaStart: function ()
	{
		function _prepareUI( ctrlid ) {
			var lua = MultiBox.getLuaStartup(ctrlid );
			UIManager.pageEditorForm("Lua Startup Code",lua,"Submit",function(newlua) {
				if (newlua!=lua) {
					DialogManager.confirmDialog(_T("do you want to change lua startup code ? if yes, it will generate a LUA reload, be patient..."),function(result) {
						if (result==true) {
							MultiBox.setStartupCode(ctrlid,newlua)
								.done( function(){
									PageMessage.message(_T("Lua Startup code has been modified"),"success");
								})
								.fail(function(){
									PageMessage.message(_T("Lua Startup can only be modified on controller 0"),"danger");
								});
						}
					});
				}
			});
		}

		UIManager.clearPage(_T('LuaStart'),_T("LUA Startup"),UIManager.oneColumnLayout);
		
		// DOES NOT WORK on other ctrl as the url gets too long
		
		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select'));
		$("#altui-controller-select").change(function(){
			$(".altui-editor-form").remove();
			_prepareUI( parseInt($("#altui-controller-select").val()) );
		});
		_prepareUI( 0 );
	},
	
	pagePower: function() 
	{
		UIManager.clearPage(_T('Power'),_T("Power Chart"),UIManager.oneColumnLayout);
		
		// prepare and load D3 then draw the chart
		$(".altui-mainpanel")
			.append(
				"<style>				\
					.altui-energy-d3chart {			\
						font: 12px sans-serif;	\
					}							\
					.altui-energy-d3chart .axis {			\
						font: 10px sans-serif;	\
					}							\
					.altui-energy-d3chart .axis path, .altui-energy-d3chart .axis line {	\
					  fill: none;				\
					  stroke: "+getCSS('color','bg-info')+";				\
					  shape-rendering: crispEdges;	\
					}							\
					.altui-energy-d3chart rect {				\
						fill: "+getCSS('background-color','bg-info')+";			\
					}							\
					.altui-energy-d3chart text {				\
						fill: "+getCSS('color','bg-info')+";		\
					}							\
				</style>"
			)
			.append("<svg class='altui-energy-d3chart'></svg>");

		var margin = {top: 10, right: 50, bottom: 10, left: 150},
			width = $(".altui-mainpanel").innerWidth() - margin.left - margin.right-30,
			barHeight = 20,
			height = 0; // calculated later

		function _processEnergyData(input)
		{
			// prepare data
			var data = input.trim().split('\n');
			$.each(data, function(i,line) {
					data[i] = line.split('\t');
			});
			return data;
		};
		
		function _refreshPowerChart() {
			if ($(".altui-energy-d3chart").length==0)
				return;	// stop refreshing
			MultiBox.getPower( function(res) {
				var data = _processEnergyData(res);
				var x = d3.scale.linear()
						.range([0, width])
						.domain([0, d3.max(data, function(d) { return +d[4]; })]);	// d[4] is watts and is text, must convert to int
						
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("top");
					
				var chart = d3.select(".altui-energy-d3chart");
				chart.selectAll("g.device").data(data);
				
				var t = chart.transition().duration(1000);
				t.select(".axis").call(xAxis);
				
				var bar = t.selectAll("g.device");
				bar.select("text.wattage")
						.attr("x", function(d) { return /*Math.max( x(d[4]) - 3, 10 );*/ x(d[4])-3 })
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.attr("text-anchor","end")
						.text(function(d) { return (parseInt(d[4])!=0) ? d[4] : ''; });
				bar.select("rect")
						.attr("width", function(d) { return x(d[4]); })
						.attr("height", barHeight - 1);

				setTimeout( _refreshPowerChart , 5000 );
			});
		};
		
		function _drawPowerChart() {
			if ($(".altui-energy-d3chart").length==0)
				return;	// stop refreshing

			MultiBox.getPower( function(res) {
				// prepare data
				var data = _processEnergyData(res);
				
				// async func to draw the chart
				$(".altui-energy-d3chart").replaceWith("<svg class='altui-energy-d3chart'></svg>");
				margin = {top: 10, right: 50, bottom: 10, left: 150};
				width = $(".altui-mainpanel").innerWidth() - margin.left - margin.right-30;
				barHeight = 20;
				height = (1+data.length)*(barHeight +1);
					
				var x = d3.scale.linear()
						.range([0, width])
						.domain([0, d3.max(data, function(d) { return +d[4]; })]);	// d[4] is watts and is text, must convert to int
						
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("top");
					
				var chart = d3.select(".altui-energy-d3chart")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				chart.append("g")
					.attr("class","axis")
					.attr("transform", "translate(0,"+(barHeight-1)+")")
					.call(xAxis);
					
				chart.append("text")
					.attr("x",-10)
					.attr("y",barHeight / 2)
					.attr("text-anchor","end")
					.text("Watts");
					
				var bar = chart.selectAll("g.device")
					.data(data)
					.enter()
						.append("g")
						.attr("class","device")
						.attr("transform", function(d, i) { return "translate(0," + (i+1) * barHeight + ")"; });
					
				bar.append("rect")
						.attr("width", function(d) { return x(d[4]); })
						.attr("height", barHeight - 1);

				bar.append("text")
						.attr("class","wattage")
						.attr("x", function(d) { return /*Math.max( x(d[4]) - 3, 10 );*/ x(d[4])-3 })
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.attr("text-anchor","end")
						.text(function(d) { return (parseInt(d[4])!=0) ? d[4] : ''; });
				bar.append("text")
						.attr("class","name")
						.attr("x", -5)
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.attr("text-anchor","end")
						.text(function(d) { return "{0}, #{1}".format(d[1],d[0]); });

				setTimeout( _refreshPowerChart , 5000 );
			});
		}
		
		UIManager.loadD3Script( _drawPowerChart );
	},
	
	pageZwave: function() 
	{
		function _nodename(d)		{ return "{0}, #{1}".format(d.name, d.altuiid); }
		function _commQuality(altuiid) {
			//PollOk/(PollOk+PollNoReply)
			var device = MultiBox.getDeviceByAltuiID(altuiid);
			var service="urn:micasaverde-com:serviceId:ZWaveDevice1"
			var PollNoReply = parseInt(MultiBox.getStatus(device,service,"PollNoReply"));
			var PollOk = parseInt(MultiBox.getStatus(device,service,"PollOk"));
			if (PollOk+PollNoReply>0)
				return ( PollOk / (PollOk+PollNoReply) );
			return 1;
		};
		function _countNeighbors(device) {
			var n=0;
			$.each( device.states, function(i,s) {
				if (s.variable=="Neighbors") {
					n = s.value.split(',').length;
					return false;
				}
			});
			return n;
		};
		function _NeighborsOf(device)	{ 
			var result = [];
			var controllerid = MultiBox.controllerOf(device.altuiid).controller;
			$.each( device.states, function(i,s) {
				if (s.variable=="Neighbors") {
					result = s.value.split(',');
					$.each(result, function(i,r) {
						var device = MultiBox.getDeviceByAltID( controllerid, 1, r );	// 1=zWave controller, r=altid
						result[i] = (device) ? device.altuiid : null;
					});
					return false;
				}
			})
			return result;
		};
		var width=0, height=0, chart=null, orders=null;
		var data = $.grep( MultiBox.getDevicesSync() , function(d) {return /*(MultiBox.controllerOf(d.altuiid).controller==0) &&*/ (d.id_parent==1);} );
		orders = {
			id:$.map( data.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)}), function(d) { return d.altuiid; }),
			name: $.map( data.sort( sortByName ), function(d) { return d.altuiid; }),
			mesh:$.map( data.sort(function(a, b){return _countNeighbors(b)-_countNeighbors(a)}), function(d) { return d.altuiid; })
		};

		UIManager.clearPage(_T('ZWave'),_T("zWave Network"),UIManager.oneColumnLayout);
		// $("div#dialogs").append(deviceModalTemplate.format( '', '', 0 ));
		DialogManager.registerDialog('deviceModal',deviceModalTemplate.format( '', '', 0 ));
		var html = "";
		html += "<form class='form-inline'>";
			html += "<div class='form-group'>";
				html += "<label class='control-label ' for='altui-zwavechart-order' >"+_T("Order By")+":</label>";
				html += "<select id='altui-zwavechart-order' class='form-control'>";
					html += "<option value='id'>ID</option>";
					html += "<option value='name'>"+_T("Name")+"</option>";
					html += "<option value='mesh'>"+_T("Mesh")+"</option>";
				html += "</select>";
			html += "</div>";
			html += ("<button type='button' id='altui-reset-pollcounters' class='btn btn-default' >"+_T("Reset Poll Counters")+"</button>");
		html += "</form>";
			html += "<div class='altui-zwavechart-container'>";
				html += "<svg class='d3chart'></svg>";
			html += "</div>";
		$(".altui-mainpanel")
			.append(html)
			.append(
				"<style>				\
					.d3chart {			\
						font: 12px sans-serif;	\
					}							\
					.d3chart .ligne {			\
					}							\
					.d3chart .colonne {			\
					}							\
					.d3chart .cellule {			\
					}							\
					.d3chart line {				\
						stroke-width: 1px;		\
						stroke: "+$("#altui-pagetitle").css("color")+";			\
					}							\
					.d3chart text {				\
						fill: "+$("#altui-pagetitle").css("color")+";			\
					}							\
					.d3chart text.active {		\
						fill: "+getCSS('color','text-danger')+";				\
					}							\
				</style>"
			);

		function _drawChart( chart, width, height, orderby  ) {	
			var x = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, width]);

			var y = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, height]);
			
			var c = d3.scale.quantize()
				.domain( [0,1] )
				.range(["red","orange","yellow","yellowgreen","green"]);

			var row = chart.selectAll(".ligne").data(data);
			row.enter()
				.append("g")
					.attr("class","ligne")
					.attr("transform",function(d,i) { return "translate(0,"+y(d.altuiid)+")"; } )
					.append("text")
					  .attr("x", -6)
					  .attr("y", x.rangeBand() / 2)
					  .attr("dy", ".32em")
					  .attr("text-anchor", "end")
					  .text(function(d) { return _nodename(d); })
						.on("mouseover", function(p) {
							d3.select(this).classed("active", true);						
						})
						.on("mouseout", function(p) {
							d3.select(this).classed("active", false);						
						})
						.on('click',function(d,i) {
							var device = MultiBox.getDeviceByAltuiID(d.altuiid);
							UIManager.deviceDrawVariables(device);
						});
					
			row.append("line")
				.attr("x2", width);
			row.exit()
				.remove();
				
			var cell = row.selectAll(".cellule")
				.data( function(d)  { 
					return _NeighborsOf(d); 
					} );
				
			cell.enter()
				.append("rect")
					.attr("class","cellule")
					.attr("x", function(d) {
							return x(d); 
							// return x(d.id); 
							} )
					.attr("width",x.rangeBand())
					.attr("height",y.rangeBand())
					// .style("fill",c(_commQuality(d)))
					.style("fill",function(d) { 
						return c(_commQuality(d3.select(this.parentNode).datum().altuiid));
						})
					.on("mouseover", function(p) {
						var lignedatum = d3.select(this.parentNode).datum();
						d3.selectAll(".ligne text").classed("active", function(d, i) { return d.altuiid == lignedatum.altuiid; });
						d3.selectAll(".colonne text").classed("active", function(d, i) { return d.altuiid == p; });						
					})
					.on("mouseout", function(p) {
						d3.selectAll("text").classed("active", false);						
					})
					.on('click',function(d,i) {
						var lignedatum = d3.select(this.parentNode).datum();
						var device = MultiBox.getDeviceByAltuiID(lignedatum.altuiid);
						UIManager.deviceDrawVariables(device);
					});
		
			cell.exit()
				.remove();
			
			var col = chart.selectAll(".colonne").data(data);
			col.enter()
				.append("g")
					.attr("class","colonne")
					.attr("transform",function(d,i) { return "translate("+x(d.altuiid)+",0) rotate(-90)"; } )
					.append("text")
					  .attr("x", 6)
					  .attr("y", x.rangeBand() / 2)
					  .attr("dy", ".32em")
					  .attr("text-anchor", "start")
					  .text(function(d) { return _nodename(d); });

			col.append("line")
				.attr("x1", -width);
				
			col.exit().remove();
		};
		
		
		function _drawzWavechart()
		{
			$(".d3chart").replaceWith("<svg class='d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 150, right: 10, bottom: 10, left: 150};
			width = $(".altui-zwavechart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.min(width,available_height - margin.top - margin.bottom);
			if (width<height)
				height = width;
			else
				width = height;
				
			chart = d3.select(".d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
			chart.append("line")
					.attr({
						x1: width-1,
						x2: width-1,
						y1: 0,
						y2: height});
			chart.append("line")
					.attr({
						x1: 0,
						x2: width,
						y1: height,
						y2: height});

			_drawChart( chart, width, height, $("#altui-zwavechart-order").val() );
		};
		UIManager.loadD3Script( _drawzWavechart );
		
		$("#altui-reset-pollcounters").click(function() {
			MultiBox.resetPollCounters().done(function(){
				PageMessage.message(_T("Counters have been reset properly"),"success");
			});
		});
		
		$("#altui-zwavechart-order").change( function() {
			var orderby=$(this).val();
			
			var x = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, width]);

			var y = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, height]);
			var t= chart.transition().duration(2000)	
			var row = t.selectAll(".ligne")
					.delay(function(d, i) { return y(d.altuiid) * 4; })
					.attr("transform",function(d,i) { return "translate(0,"+y(d.altuiid)+")"; } )
				.selectAll(".cellule")
					.delay(function(d, i) { return x(d) * 4; })
					.attr("x", function(d) { return x(d); } )
			var col = t.selectAll(".colonne")
					.delay(function(d, i) { return x(d.altuiid) * 4; })
					.attr("transform",function(d,i) { return "translate("+x(d.altuiid)+",0) rotate(-90)"; } )
		});
		$( window )
			.off( "resize", _drawzWavechart )
			.on( "resize", _drawzWavechart );
	},
	
	_findNodeByZwID : function (data,zwid) {
		var found=null;
		$.each(data.nodes,function( idx, node) {
			if (node.zwid==zwid) {
				found=node;
				return false;
			}
		});
		return found;
	},
	
	pageQuality: function()  {
		var data = { nodes:[] , links:[] };
		var linkcolor, color, svg;
		var height = null, width = null;
		var margin = {top: 20, right: 10, bottom: 10, left: 20};
		var ygap = 30;
		var filtered = false;
		var devices = null;
		
		//http://stackoverflow.com/questions/25595387/d3-js-how-to-convert-edges-from-lines-to-curved-paths-in-a-network-visualizatio
		function draw_curve(Ax, Ay, Bx, By, M) {

			// side is either 1 or -1 depending on which side you want the curve to be on.
			// Find midpoint J
			var Jx = Ax + (Bx - Ax) / 2
			var Jy = Ay + (By - Ay) / 2

			// We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
			var a = Bx - Ax
			var asign = (a < 0 ? -1 : 1)
			var b = By - Ay
			var bsign = (b < 0 ? -1 : 1)
			var theta = Math.atan(b / a)

			// Find the point that's perpendicular to J on side
			var costheta = asign * Math.cos(theta)
			var sintheta = asign * Math.sin(theta)

			// Find c and d
			var c = M * sintheta
			var d = M * costheta

			// Use c and d to find Kx and Ky
			var Kx = Jx - c
			var Ky = Jy + d

			return "M" + Ax + "," + Ay +
				   "Q" + Kx + "," + Ky +
				   " " + Bx + "," + By
		};
		
		function _drawChart() {
			var data;
			function _prepareDataLinks(data) {
				data.links=[];
				$.each(data.nodes, function(idx,node) {
					var source = null;
					$.each(node.routes, function(idx,route) {
						source = node;
						var split = route.split("-");
						var routequality = (split[1] || '0');
						var nodes = split[0].split(".");
						$.each(nodes, function(idx,zwid) {
							var dest = UIManager._findNodeByZwID(data,zwid);
							if (dest!=null) {
								data.links.push( {
									id:source.zwid+"-"+dest.zwid,
									quality:parseInt(routequality),
									broken:(routequality.slice(-1)=="x"),
									source: source,
									target: dest,
									manual_route: node.manual_routes
								});
								source = dest;	// skip to next segment
							}
						});
					})
				});
				return (data);
			};
			function _prepareDataRoutes2(  ) {
				data = { nodes:[] , links:[] };
				var color = {};
				var nColor = 0;
				if (devices) {
					var zwavenet = MultiBox.getDeviceByType("urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
					if (zwavenet) {
						color[zwavenet.device_type]=nColor++;
						data.nodes.push({ 
							x:0,
							y:0,
							id:parseInt(zwavenet.id), 
							zwid:0,
							name:zwavenet.name, 
							color:color[zwavenet.device_type],
							group:0,
							routes: []
							});
						var y=ygap;
						$.each( devices.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)}), function( idx,device ) {
							var ManualRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","ManualRoute");
							var AutoRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","AutoRoute");
							if ( ManualRoute || AutoRoute)
							{
								var route = "";
								var bManual = false;
								if ( ManualRoute && (ManualRoute!="undefined")) {
									route = ManualRoute; bManual = true;
								}
								else
									route = AutoRoute;
								if (color[device.device_type]==undefined)
									color[device.device_type]=nColor++;
								// like this: "2-20x,7-59x,2.7-78"
								var routes = route.split(",");
								var firstnode = route[0].split("-")
								var group = (firstnode[0]=="0") ? 1 : 2;
								data.nodes.push({ 
									x: group * width/4,
									y: y,
									id:parseInt(device.id), 
									zwid:parseInt(device.altid),
									name:device.name+':'+device.id+'#'+device.altid, 
									color:color[device.device_type] ,
									group: group,
									routes: routes,
									manual_routes: bManual
								});
								y+=ygap;
							}
						});
					}
					data=_prepareDataLinks(data);
				}
				return data;
			};			
			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (filtered) {
					filtered = false;
					data = _prepareDataRoutes2(  );
				}
				else {
					filtered = true;
					// remove from data all nodes and links for nodes not invovled in this routing
					var authorized = [];
					authorized.push( 0 );
					authorized.push( selection.datum().zwid );
					$.each(selection.datum().routes, function(idx,route) {
						var split = route.split("-");
						var nodes = split[0].split(".");
						$.each(nodes, function(idx,zwid) {
							authorized.push( parseInt(zwid) );
						});
					});
					data.nodes=$.grep(data.nodes,function(node) {
						return ( $.inArray(node.zwid , authorized) != -1 );
					});
					$.each(data.nodes, function(idx,node) {
						node.y = idx*ygap; 
					})
				}
				_prepareDataLinks(data);
				_updateChartRoutes2(data);
			};
			function _createChartRoutes2(data) {		
				linkcolor = d3.scale.quantize()
					.domain( [d3.max(data.links, function(d) {return d.quality;} ),d3.min(data.links, function(d) {return d.quality;} )] )
					.range(["red","orange","yellow","green"]);

				color = d3.scale.category20();
				height = data.nodes.length*ygap;
				svg = d3.select(".altui-route-d3chart")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			};
			function _updateChartRoutes2(data) {		
				var links = svg.selectAll(".link").data( data.links , function(d) { return d.id; } );
				links.exit().transition().duration(1000).style("opacity","0").remove();	
				links.enter()
					.insert("svg:path", ".node")		// so that node allways hide links
					.attr("class","link")
					// .attr("d", function(d) {
						// var M = (d.source.group != d.target.group) ? 0 : (60+Math.abs(d.target.y-d.source.y)/ygap*4);
						// return draw_curve(d.source.x, d.source.y, d.target.x, d.target.y, M);
					// })
					.style("stroke-opacity", 0)
					.style("stroke-dasharray", function(d) { return (d.manual_route)  ? "10,10" : null; } )
					.style("stroke", function(d) { return d.broken ? "red" : linkcolor(d.quality);} );

				var transition = links.transition().duration(1000)
					.style("stroke-opacity", function(d) { return ((d.source.group != d.target.group) ? 1 : 0.5); })
					.attr("d", function(d) {
						var M = (d.source.group != d.target.group) ? 0 : (60+Math.abs(d.target.y-d.source.y)/ygap*4);
						return draw_curve(d.source.x, d.source.y, d.target.x, d.target.y, M);
					});

				var nodes = svg.selectAll(".node").data( data.nodes , function(d) { return d.id; } );
				nodes.exit().transition().duration(1000).style("opacity","0").remove();		

				var groups = nodes.enter()
				.append("g")
				.attr("class", "node")
				.on("click", sglclick );
				
				groups.append("circle")					
					.attr("cx", function (d) { return d.x })					
					.attr("cy", function (d) { return d.y })
					.attr("r", 8 )
					.style("opacity", 0)
					.style("fill", function (d) { return color(d.color); });
					
				groups.append("text")					
					.attr("x", function (d) { return d.x })					
					.attr("y", function (d) { return d.y })
					.attr("dx", 15)
					.attr("dy", ".35em")
					.style("opacity", 0)
					.text(function (d) { return d.name; });
						
				var transition = nodes.transition().duration(1000);
				transition.select("circle")
					.style("opacity", 1)
					.attr("cx", function (d) { return d.x })					
					.attr("cy", function (d) { return d.y });
				transition.select("text")
					.style("opacity", 1)
					.attr("x", function (d) { return d.x })					
					.attr("y", function (d) { return d.y });

					};		
			data = _prepareDataRoutes2();
			_createChartRoutes2(data);
			_updateChartRoutes2(data);
		};
		
		UIManager.clearPage(_T('Quality'),_T("Network Quality"),UIManager.oneColumnLayout);
		
		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select'));
		$("#altui-controller-select").change(function() {
			$(".altui-route-d3chart").html("");
			MultiBox.getDevices(null,function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },function(arr) {
				devices = arr;
				_drawChart();
			})
		});
		$(".altui-mainpanel")
			.append(
				"<style>					\
				.altui-route-d3chart-container {\
				}							\
				.node {						\
				}							\
				.node circle {		\
					stroke: #fff;			\
					stroke-width: 1.5px;	\
				}							\
				.node text {				\
					fill: gray;				\
					pointer-events: none;	\
					font-size: 10px;		\
				}							\
				.link {						\
					stroke-opacity: .8;		\
					fill: none;				\
				}							\
				</style>" )
			.append("<div class='col-xs-12 altui-route-d3chart-container'><svg class='altui-route-d3chart'></svg></div>")
		var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
		width = $(".altui-route-d3chart-container").innerWidth() - margin.left - margin.right;
		height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
		UIManager.loadD3Script( function() {
			MultiBox.getDevices(null,function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },function(arr) {
				devices = arr;
				_drawChart();
			})
		});
	},
	
	pageChildren: function() {
		var height = null, width = null;
		var data = { root:[], nodes:[] , links:[] };
		var devices = null;
		
		// Returns a list of all nodes under the root.
		function _flatten(root) {
			var nodes = [], i = 0;
			function recurse(node) {
				if (node.children) node.children.forEach(recurse);
				// if (!node.id) node.id = ++i;
				nodes.push(node);
			}
			recurse(root);
			return nodes;
		};
		
		function _findNode( root, id ) {
			var found=null;
			if (root.id == id )
				return root;
			if (root.children)
				$.each( root.children, function (i,n) {
					found = _findNode( n, id );
					return ( found==null );
				});				
			return found;
		};
		
		function _addChildrenFromWaitList( node) {
			// search in wait list
			var children=[]
			// console.log("searching wait list for childs of {0}".format(node.id));
			for ( var i = data.wait.length-1; i>=0 ; i--) {
				if (data.wait[i].id_parent == node.id) {
					var child = data.wait.splice(i,1)[0];
					// console.log("found node :"+child.id);
					node.children.push(child);
					children.push(child);
				}
			}
			$.each(children, function(i,child) {
				_addChildrenFromWaitList( child);
			});
		};
		
		function _addNode( node ) {
			var parent = _findNode( data.root, node.id_parent );
			if (parent==null){	
				// console.log("could not find parent, putting in wait list");
				data.wait.push(node);
				return;
			}
			parent.children.push( node );
			_addChildrenFromWaitList(node);
		};
		
		function _prepareDataParents( ) {
			data = { root:[], nodes:[] , links:[] , wait:[] };
			var color = { "ctrl": 0 };
			var nColor = 1;
			// var devices = $.grep( MultiBox.getDevicesSync() , function(d) {return (MultiBox.controllerOf(d.altuiid).controller==0) } );
			data.root={ id:"0-0", name:"Main Controller", color:color["ctrl"], children:[] };
			$.each( MultiBox.getControllers(), function (idx,c) {
				if (idx>0) {					
					_addNode({ 
						id:"{0}-{1}".format(idx,0),
						name:"Controller "+c.ip, 
						color:color["ctrl"] ,
						id_parent: "0-0",
						children: []
					});
				}
			});

			if (devices) {
				$.each( devices /*.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)})*/, function( idx,device ) {
					if (color[device.device_type]==undefined)
						color[device.device_type]=nColor++;
					var controllerid = MultiBox.controllerOf(device.altuiid).controller;
					// console.log("device {0},{1} id_parent:{2}-{3}".format(device.name, device.altuiid,controllerid,device.id_parent));
					_addNode({ 
						id:device.altuiid, 
						name:device.name, 
						color:color[device.device_type] ,
						id_parent: "{0}-{1}".format(controllerid,device.id_parent || 0),
						children: []
						});
				});
				// $.each(data.wait, function(i, node) {
					// console.log( node.id );
				// });
			}
			return data;
		};
				
		function _drawChartParents() {
			function _updateDataParents( ) {
				data.nodes = _flatten(data.root);
				data.links = d3.layout.tree().links(data.nodes);
			};
				
			$(".altui-children-d3chart").replaceWith("<svg class='altui-children-d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 20, right: 10, bottom: 10, left: 20};
			width = $(".altui-children-d3chart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
			
			//Set up the colour scale
			var color = d3.scale.category20();

			var svg = d3.select(".altui-children-d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//Set up the force layout
			data = _prepareDataParents( );
			var force = d3.layout.force()
						.charge(function(d) { return -120 - (d.children ? 2*d.children.length : 0) } )
						.gravity(0.05)
						.linkDistance(function(d) { return  45+(d.source.children ? 2*d.source.children.length:0 ) })
						.size([width, height])
						.on("tick", function () {
						// avoid asynchronous tick when the user changed the page
						// this crashed d3
						if ($("#altui-pagetitle").html()==_T("Parent/Child Network")) 
						{
							d3.selectAll(".link")
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

							d3.selectAll("circle")
								.attr("cx", function (d) { return d.x; })
								.attr("cy", function (d) { return d.y; });
							d3.selectAll("text")
								.attr("x", function (d) { return d.x; })
								.attr("y", function (d) { return d.y; });
						}
					});
			var drag = force.drag().on("dragstart", dragstart);			

			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (d3.event.shiftKey) {
					d.fixed =  false;
					selection.classed("fixed", false  );
				}
				else {
					if (d.children) {
						if (d.children.length==0)
							return;	// non collapsible node
						d._children = d.children;
						d.children = null;
						selection.append("text")
							.text("+")
							.attr("class", "plussign")
							.attr("dx", 0)
							.attr("dy", ".35em")
					} else {
						if (d._children) {
							d.children = d._children;
							d._children = null;
						}
						selection.selectAll(".plussign").remove();
					}
					selection.classed("closed", d._children!=null );
				}
				_updateChart(data);
			};
			function dragstart(d) {
				// console.log('dragstart');
				d3.event.sourceEvent.stopPropagation(); // silence other listeners
				d3.select(this).classed("fixed", d.fixed = true);
			};				
			function _updateChart(data) {			
				function _countChildren(d) {
					var s = 0;
					if (d && d.children) 
						$.each(d.children, function(i,child) {
							s += ( 1 + _countChildren(child));
						})
					return s;
				};
				_updateDataParents();
				force
					.nodes( data.nodes )
					.links( data.links )
					.start();

				var link = svg.selectAll(".link").data( data.links , function(d) { return d.target.id; } );
				var node = svg.selectAll(".node").data( data.nodes , function(d) { return d.id; } );

				link.exit().transition().duration(500).style("opacity","0").remove();
				link.enter()
					.insert("line", ".node")		// so that node allways hide links
					.attr("class", "link")
					.style("stroke", function(d) { return (d.broken==true) ? "red": "" ; } )
					.style("stroke-width", 1 )
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });					

				node.exit().transition().duration(1000).style("opacity","0").remove();				
				node.classed("fixed", function(d) { 
						return d.fixed })
					.classed("closed", function(d) { 
						return d._children!=null } );

				var groups = node.enter().append("g")
							.attr("class", "node")
							.classed("fixed", function(d) { return d.fixed } )
							.classed("closed", function(d) { return d._children!=null } )
							// .on("dblclick", dblclick)
							.on("click", sglclick )
							.call( drag );
					groups.append("circle")					
						.attr("r", function(d) { 
							return 8+ ( Math.sqrt(_countChildren(d)) ) ;
							// return 8+ (d.children ? d.children.length/2 : 0);
						} )
						.style("fill", function (d) {
							return color(d._children ? "#3182bd" : d.color);
						});
					groups.append("text")					
						.attr("dx", 15)
						.attr("dy", ".35em")
						.text(function (d) { return d.name; });	
			};		
			_updateChart(data);
		};
		
		
		// prepare and load D3 then draw the chart
		UIManager.clearPage(_T('Parent/Child'),_T("Parent/Child Network"),UIManager.oneColumnLayout);
		PageMessage.message(_T("Drag and Drop to fix the position of a node. Simple Click to open or collapse a parent node, Shift Click to free a fixed node"),"info");
		var html="";
		$(".altui-mainpanel")
			.append(
				"<style>					\
				.node {						\
					cursor: move;			\
				}							\
				.node circle {		\
					stroke: #fff;			\
					stroke-width: 1.5px;	\
				}							\
				.node.fixed circle {		\
					stroke: #f00;			\
					stroke-width: 1.5px;	\
				}							\
				.node.closed circle {		\
					stroke: white;		\
					fill: white !important;			\
				}							\
				.node.closed.fixed circle {		\
					stroke: #f00;		\
					fill: white !important;			\
				}							\
				.node text.plussign {				\
					font-size: 18px;		\
					text-anchor: middle;	\
				}							\
				.node text {				\
					fill: gray;				\
					pointer-events: none;	\
					font-size: 10px;		\
				}							\
				.link {						\
					stroke: #999;			\
					stroke-opacity: .8;		\
				}							\
				</style>" )
			.append(html+"<div class='altui-children-d3chart-container'><svg class='altui-children-d3chart'></svg></div>")
		UIManager.loadD3Script( function() {
			MultiBox.getDevices(null,null,function(arr) {
				// console.log("received {0} devices:".format(arr.length));
				devices = arr;
				_drawChartParents();
			});
		});
	},
	
	pageRoutes: function() {
		var height = null, width = null;
		var data = { root:[], nodes:[] , links:[] };
		var devices = null;
		
		// Returns a list of all nodes under the root.
		function _flatten(root) {
			var nodes = [], i = 0;
			function recurse(node) {
				if (node.children) node.children.forEach(recurse);
				// if (!node.id) node.id = ++i;
				nodes.push(node);
			}
			recurse(root);
			return nodes;
		};
		
		function _findNode( root, id ) {
			var found=null;
			if (root.id == id )
				return root;
			if (root.children)
				$.each( root.children, function (i,n) {
					found = _findNode( n, id );
					return ( found==null );
				});				
			return found;
		};
		
		function _addNode( node ) {
			var parent = _findNode( data.root, node.id_parent );
			if (parent==null){	
				PageMessage.message("Error building node hierarchy","warning");
				return;
			}
			parent.children.push( node );
		};
				
		function _drawChartRoutes() {
			function _prepareDataRoutes(  ) {
				data = { root:[], nodes:[] , links:[] };
				var color = {};
				var nColor = 0;
				var devices = $.grep( MultiBox.getDevicesSync() , function(d) {return (MultiBox.controllerOf(d.altuiid).controller==$("#altui-controller-select").val());} );

				data.root={ id:0, zwid:0, name:"root", children:[] };
				if (devices) {
					var zwavenet = MultiBox.getDeviceByType("urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
					if (zwavenet) {
						color[zwavenet.device_type]=nColor++;
						data.nodes.push({ 
							x:width/2,
							y:height/2,
							id:parseInt(zwavenet.id), 
							zwid:0,
							name:zwavenet.name, 
							color:color[zwavenet.device_type] ,
							id_parent:null,
							routes: []
							});
						$.each( devices, function( idx,device ) {
							var ManualRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","ManualRoute");
							var AutoRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","AutoRoute");
							if ( ManualRoute || AutoRoute)
							{
								var route ="";
								var bManual = false;
								if ( ManualRoute && (ManualRoute!="undefined")) {
									route = ManualRoute; bManual = true;
								}
								else
									route = AutoRoute;
								if (color[device.device_type]==undefined)
									color[device.device_type]=nColor++;
								data.nodes.push({ 
									x:Math.random()*width,
									y:Math.random()*height,
									id:parseInt(device.id), 
									zwid:parseInt(device.altid),
									name:device.name+':'+device.id+'#'+device.altid, 
									children: [],
									color:color[device.device_type] ,
									id_parent:device.id_parent || 0,
									routes: route.split(","),
									manual_route: bManual
								});
							}
						});
					}
				}
				return data;
			};
			function _updateDataRoutes(data) {
				// data.nodes = _flatten(data.root);
				// enum devices and create a link per route  ManualRoute AutoRoute 
				// urn:micasaverde-com:serviceId:ZWaveDevice1
				// like this: "2-20x,7-59x,2.7-78"
				$.each(data.nodes,function( idx, node) {
					// insert a link for each route
					if (node.routes) {
						// console.log("node name:{0} zwid:{1} routes:{2}".format(node.name, node.zwid,node.routes));
						$.each(node.routes, function( idx,route) {
							var srcnode = node;
							var splits = route.split("-");
							var linkquality = splits[1] || '0';
							if (splits[0]) {
								var path = splits[0].split(".");
								var nroute = 1;
								$.each(path,function(idx,pathnode) {
									var targetnode = UIManager._findNodeByZwID(data,pathnode);
									if (targetnode) {
										// console.log("adding link {0}-{1}".format(srcnode.zwid,targetnode.zwid));
										// if ((nroute==1)) {
											data.links.push( {
												source: srcnode,
												target: targetnode,
												linkquality: parseInt(linkquality),
												nroute: nroute,
												broken: (linkquality.slice(-1)=="x"),
												manual_route: node.manual_route
											});
											srcnode = targetnode;
											nroute++;
										// }
									}
								});
							}
						});
					}
				});
			};
				
			$(".altui-children-d3chart").replaceWith("<svg class='altui-children-d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 20, right: 10, bottom: 10, left: 20};
			width = $(".altui-children-d3chart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
			
			//Set up the colour scale
			var color = d3.scale.category20();
			var linkscale = d3.scale.sqrt().domain([0, 500]).range([80, Math.min(width,height)]);

			var svg = d3.select(".altui-children-d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//Set up the force layout
			data = _prepareDataRoutes( );
			var force = d3.layout.force()
			force = force
				.charge(function(d) { return (d.zwid==0) ? -300 : -100 } )
				.gravity(0.015)
				.linkDistance(function(d) { 
					var dist = linkscale( d.linkquality );
					return  dist; /*   60+d.linkquality*15; */
					})
				.linkStrength( function(d) { 
					return 1/(1+d.linkquality/10); 
					})
				.size([width, height])
				.on("tick", function () {
					// avoid asynchronous tick when the user changed the page
					// this crashed d3
						d3.selectAll(".link")
							.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

						d3.selectAll("circle")
							.attr("cx", function (d) { return d.x; })
							.attr("cy", function (d) { return d.y; });
						d3.selectAll("text")
							.attr("x", function (d) { return d.x; })
							.attr("y", function (d) { return d.y; });
				});
			var drag = force.drag().on("dragstart", dragstart);			

			function dragstart(d) {
				// console.log('dragstart');
				d3.event.sourceEvent.stopPropagation(); // silence other listeners
				d3.select(this).classed("fixed", d.fixed = true);
			};				
			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (d3.event.shiftKey) {
					d.fixed =  false;
					selection.classed("fixed", false  );
				}
				else {
				}
				_updateChart(data);
			};
			function _updateChart(data) {			
				_updateDataRoutes(data);
				force
					.nodes( data.nodes )
					.links( data.links )
					.start();

				var link = svg.selectAll(".link");
				var node = svg.selectAll(".node");
				link = link.data( data.links , function(d) { return d.source.id+'-'+d.target.id; } );
				node = node.data( data.nodes , function(d) { return d.id; } );

				link.exit().transition().duration(500).style("opacity","0").remove();
				link.enter()
					.insert("line", ".node")		// so that node allways hide links
					.attr("class", "link")
					.style("stroke", function(d) { return (d.broken==true) ? "red": ((d.nroute>1)?"yellow":"") ; } )
					.style("stroke-dasharray", function(d) { return (d.manual_route)  ? "10,10" : null; } )
					.style("stroke-width", 1 )
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });					

				node.exit().transition().duration(1000).style("opacity","0").remove();				
				node.classed("fixed", function(d) { 
						return d.fixed })
					.classed("closed", function(d) { 
						return d._children!=null } );

				var groups = node.enter().append("g")
							.attr("class", "node")
							.classed("fixed", function(d) { return d.fixed } )
							.classed("closed", function(d) { return d._children!=null } )
							// .on("dblclick", dblclick)
							.on("click", sglclick )
							.call( drag );
					groups.append("circle")					
						.attr("r", function(d) { 
							return 6+ 2*d.routes.length;
						} )
						.style("fill", function (d) {
							return color(d._children ? "#3182bd" : d.color);
						});
					groups.append("text")					
						.attr("dx", 15)
						.attr("dy", ".35em")
						.text(function (d) { return d.name; });
			};		
			_updateChart(data);
		};
		
		// prepare and load D3 then draw the chart
		UIManager.clearPage(_T('zWaveRoutes'),_T("zWave Routes"),UIManager.oneColumnLayout);
		PageMessage.message(_T("Drag and Drop to fix the position of a node. Simple Click to open or collapse a parent node, Shift Click to free a fixed node"),"info");

		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select'));
		$("#altui-controller-select").change(function() {
			$(".altui-route-d3chart").html("");
			MultiBox.getDevices(
				null,
				function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },
				function(arr) {
					devices = arr;
					_drawChartRoutes();
				}
			);
		});
		$(".altui-mainpanel")
			.append(
				"<style>					\
				.node {						\
					cursor: move;			\
				}							\
				.node circle {		\
					stroke: #fff;			\
					stroke-width: 1.5px;	\
				}							\
				.node.fixed circle {		\
					stroke: #f00;			\
					stroke-width: 1.5px;	\
				}							\
				.node.closed circle {		\
					stroke: white;		\
					fill: white !important;			\
				}							\
				.node.closed.fixed circle {		\
					stroke: #f00;		\
					fill: white !important;			\
				}							\
				.node text.plussign {				\
					font-size: 18px;		\
					text-anchor: middle;	\
				}							\
				.node text {				\
					fill: gray;				\
					pointer-events: none;	\
					font-size: 10px;		\
				}							\
				.link {						\
					stroke: #999;			\
					stroke-opacity: .8;		\
				}							\
				</style>" )
			.append("<div class='altui-children-d3chart-container'><svg class='altui-children-d3chart'></svg></div>")
		UIManager.loadD3Script( function() { 			
			MultiBox.getDevices(
				null,
				function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },
				function(arr) {
					devices = arr;
					_drawChartRoutes();
				}
			);
		});
	},
	
	drawHouseMode: function ()
	{	
		// http://192.168.1.5/cmh/skins/default/img/other/spritemap_640_480_preset_modes_active.png
		// http://192.168.1.5/cmh/skins/default/img/other/spritemap_640_480_preset_modes.png

		var html = "";				
		html +="<div class='col-sm-6'>";
		html +="	<div class='altui-housemode row'>";

		if (_ui7Check==true) {
			html += "<div class='col-xs-12 btn-group' role='group' aria-label='...'>";
			$.each(_HouseModes, function(idx,mode) {
				html += (houseModeButtonTemplate.format(mode.id, mode.text, mode.cls , "preset_unselected"));
			});
			// html += "  <button type='button' class='btn btn-default altui-housemode'><div>Home</div><div id='altui-mode1' class='col-xs-3 preset_home preset_unselected housemode'></div></button>";
			// html += "  <button type='button' class='btn btn-default altui-housemode'><div>Away</div><div id='altui-mode2' class='col-xs-3 preset_away preset_unselected housemode'></div></button>";
			// html += "  <button type='button' class='btn btn-default altui-housemode'><div>Night</div><div id='altui-mode3' class='col-xs-3 preset_night preset_unselected housemode'></div></button>";
			// html += "  <button type='button' class='btn btn-default altui-housemode'><div>Vacation</div><div id='altui-mode4' class='col-xs-3 preset_vacation preset_unselected housemode'></div></button>";
			html += "</div>";
		} else {
			// html += "<p>No Housemode feature on UI5</p>";
		}		
		html +="	</div>";
		html +="</div>";
		$(".altui-mainpanel").append( html );
		UIManager.refreshModes();
		
		$("button.altui-housemode").click( function() {
			var id = $(this).find(".housemode").prop('id');
			var mode = id.substr("altui-mode".length);
			// console.log("set mode="+mode);
			MultiBox.setHouseMode(mode);
		});

	},
	pageLocalization: function() {
		UIManager.clearPage(_T('Localize'),_T("Localizations"),UIManager.oneColumnLayout);
		Localization.dump();
	},
	pageDebug: function() {
		var actions = [
			{title:_T("All devices"), id:"altui-debug-alldevices", onclick: onClickAllDevices},
			{title:_T("One Device's States"), id:"altui-debug-onedevices", onclick: onClickOneDevice},
			{title:_T("Variable search"), id:"altui-debug-searchvariable", onclick: onClickSearchVariable},
			{title:_T("Javascript code"), id:"altui-debug-javascript", onclick: onClickJavascript}
		];
		
		function _getParameter(name,label,cbfunc) {
			var dialog = DialogManager.registerDialog('dialogModal',
							defaultDialogModalTemplate.format( 
							_T('Command Parameters'),		// title
							"<form></form>"					// body
						));
			var lastOne = MyLocalStorage.getSettings("LastOne_"+name) || "";
			DialogManager.dlgAddLine(dialog, name, label, lastOne,"", {required:''} );
			DialogManager.dlgAddDialogButton(dialog, true, _T("Run"));
			$('div#dialogModal').modal();
			$('div#dialogs')
				.off('submit',"div#dialogModal")
				.on( 'submit',"div#dialogModal", function() {
					$('div#dialogModal').modal('hide');
					var val = $("#altui-widget-"+name).val();
					MyLocalStorage.setSettings("LastOne_"+name,val);
					if ($.isFunction(cbfunc))
						(cbfunc)( val );
				});
		};
		
		function onClickJavascript() {
			_getParameter('javascriptcode', _T('Javascript code'),function(code){
				var result =_T("an error happened during the execution");
				try {
					result = eval(code);
				}
				catch(err) { }
				$("#altui-oscommand-result").text(JSON.stringify(result,null,2));
			});
		};
		
		function onClickSearchVariable() {
			_getParameter('varnamepattern', _T('Variable Name Pattern'),function(name){
				var result=[];
				var pattern = new RegExp(name);
				var devices = MultiBox.getDevicesSync();
				$.each(devices, function(i,device){
					var states  = $.grep( MultiBox.getStatesByAltuiID(device.altuiid),function(state) {
						return pattern.test(state.variable);
					});
					$.each(states,function(i,state) {
						result.push({device:device.altuiid, name:device.name, state:state});
					});
				});
				$("#altui-oscommand-result").text(JSON.stringify(result,null,2));
			});			
		};
		function onClickOneDevice() {
			_getParameter('devaltuiid', _T('Altui ID'),function(altuiid){
				var result = {
					altuiid: altuiid,
					device_type:MultiBox.getDeviceByAltuiID(altuiid).device_type,
					states:MultiBox.getStatesByAltuiID(altuiid),
				};
				$("#altui-oscommand-result").text(JSON.stringify(result,null,2));	// pretty print
			});
		};
		function onClickAllDevices() {
			var devices = MultiBox.getDevicesSync();
			$("#altui-oscommand-result").text(JSON.stringify(devices,null,2));
		};

		UIManager.clearPage(_T('Debug'),_T("Debug Tools"),UIManager.oneColumnLayout);
		var html = "";
		html += "<div class='col-xs-12'>";
			html +="<div class='panel panel-default'>";
				html +="  <div class='panel-heading'>"+_T("Debug Actions")+"</div>";
				html +="  <div class='panel-body'>";
					$.each(actions, function(idx,action) {
						html +="<div class='btn-group' role='group' aria-label='Debug Tools'>";
						html += "<button class='btn btn-default {1}' type='button' >{0}</button>".format(action.title,action.id);
						html += "</div>";
					});
				html += "</div>";
			html +="  </div>";
		html +="</div>";
		html += "<div class='col-xs-12'>";
			html+="<h3>"+_T("Output");
			var glyph = glyphTemplate.format('save',_T("Copy to clipboard"), '');
			html += buttonTemplate.format( 'altui-debug-clipboard', 'altui-copy-clipboard', glyph,'default');
				// html += "<button class='btn btn-default altui-json-viewer' type='button' >{0}</button>".format(_T("Json Viewer"));
			html+="</h3>";
			html+="<pre id='altui-oscommand-result' class='pre-scrollable'></pre>";
		html +="</div>";
		
		// append HTML
		$(".altui-mainpanel").append(html);
		$("#altui-debug-clipboard").click( function() {
			Altui_SelectText( "altui-oscommand-result" );
			document.execCommand('copy');
		});
		
		// register callbacks
		$.each(actions, function(idx,action) {
			$("."+action.id).click( action.onclick );
		});
	},
	pageTblDevices : function() {
		UIManager.clearPage(_T('TblDevices'),_T("Table Devices"),UIManager.oneColumnLayout);

		MultiBox.getDevices( 
			null,	// per device callback not useful here
			
			null,	// no filter
			
			function (devices) {	// all devices are enumarated

				var viscols = MyLocalStorage.getSettings("DevicesVisibleCols") || [];
				if (viscols.length==0)
					viscols = [ 'id','name','manufacturer'];
				
				var cols = [ 
					{ name:'id', visible: $.inArray('id',viscols)!=-1, type:'numeric', identifier:true, width:50 },
					{ name:'altuiid', visible: $.inArray('altuiid',viscols)!=-1, type:'string', identifier:true, width:80 },
					{ name:'altid', visible: $.inArray('altid',viscols)!=-1, type:'string', identifier:true, width:50 },
					{ name:'id_parent', visible: $.inArray('id_parent',viscols)!=-1, type:'numeric', identifier:true, width:80 },
					{ name:'manufacturer', visible: $.inArray('manufacturer',viscols)!=-1, type:'string', identifier:true, width:120 },
					{ name:'model', visible: $.inArray('model',viscols)!=-1, type:'string', identifier:true, width:150 },
					{ name:'name', visible: $.inArray('name',viscols)!=-1, type:'string', identifier:true, width:150 }
				];				
				
				var obj = devices[0];
				$.each( Object.keys(obj), function (idx,key) {
					if ( !$.isArray(obj[key]) && !$.isPlainObject(obj[key]) && (key!='dirty') ) {
						if ($.inArray(key, $.map(cols,function(o) { return o.name } ))==-1)
							cols.push( { name:key, visible: ($.inArray(key,viscols)!=-1) } );
					}
				});
				var html = "";
				html+="<div class='col-xs-12'>";
				html+="<table id='altui-grid' class='table table-condensed table-hover table-striped'>";
				html+="    <thead>";
				html+="    <tr>";
				$.each(cols, function(idx,col) {
					html += "<th data-column-id='{0}' data-type='{1}' {2} {3} {4}>{0}</th>".format(
						col.name, 
						col.type,
						col.identifier ? "data-identifier='true'" : "",
						col.width ? "data-width='{0}'".format(col.width) : "",
						"data-visible='{0}'".format(col.visible)
						);
				});
				html+="    </tr>";
				html+="    </thead>";
				html+="    <tbody>";
				$.each(devices, function(idx, device) {
					html+="    <tr>";
					$.each(cols, function(i,col) {
						html += "<td>{0}</td>".format( _enhanceValue(device[col.name] || '') );
					});
					html+="    </tr>";
				});
				html+="    </tbody>";
				html+="</table>";
				html+="</div>";
				$(".altui-mainpanel").append( html );
				$("#altui-grid").bootgrid({
					caseSensitive: false,
					statusMapping: {}
				}).on("loaded.rs.jquery.bootgrid", function (e)
				{
					var settings = $("#altui-grid").bootgrid("getColumnSettings");
					viscols = $.map($.grep(settings, function (obj) { return obj.visible == true }),function(obj){ return obj.id;});
					MyLocalStorage.setSettings("DevicesVisibleCols",viscols);
					/* your code goes here */
				});	
				
				// Add CSV export button
				var glyph = glyphTemplate.format('save',_T("Copy to clipboard"), '');
				var csvButtonHtml = buttonTemplate.format( 'altui-grid-btn', 'altui-tbl2csv', glyph,'default');
				$(".actions.btn-group").append(csvButtonHtml);
				$("#altui-grid-btn").click( function() {
					$('#altui-grid').table2CSV({
						delivery : function(data) {
							UIManager.pageEditorForm("CSV text",data,_T("Copy to clipboard"),function(text,that) {
								$(that).prev(".form-group").find("#altui-editor-text").select();
								document.execCommand('copy');
								$(that).parents("form").remove();
								PageMessage.message( _T("Data copied in clipboard"), "info");
							});
						}
					});
				});
			}
		);
	},
	
	pageOptions: function() {
		UIManager.clearPage(_T('Options'),_T("Options"),UIManager.oneColumnLayout);

		var color = IconDB.isDB() ? "text-success" : "text-danger";
		var okGlyph = glyphTemplate.format( "ok-sign", "OK" , color );
		
		color = FileDB.isDB() ? "text-success" : "text-danger";
		var okGlyph2 = glyphTemplate.format( "ok-sign", "OK" , color );
		
		color = MultiBox.isUserDataCached(0) ? "text-success" : "text-danger";
		var okGlyph3 = glyphTemplate.format( "ok-sign", "OK" , color );
		
		color =  MyLocalStorage.get("Pages")!=null ? "text-success" : "text-danger";
		var okGlyph4 = glyphTemplate.format( "ok-sign", "OK" , color );
		
		var html = "";
		
		html += "<div class='col-xs-12'>";
		html +="<div class='panel panel-default'>";
		html +="  <div class='panel-heading'>"+_T("Options")+"</div>";
		html +="  <div class='panel-body'>";
		html += "<div class='row'>";
			$.each(_checkOptions, function(id,check) {
				var init =  (MyLocalStorage.getSettings(check.id)!=null) ? MyLocalStorage.getSettings(check.id) : check._default;
				html += "<div class='col-sm-6'>";
					switch( check.type ) {
						case 'select':
							html +="<label class='' for='altui-"+check.id+"'>"+_T(check.label)+"</label> : ";
							html +="<select id='altui-"+check.id+"'>";
							$.each(check.choices.split("|"),function(id,unit){
								html += "<option value='{0}' {1}>{0}</option>".format( unit , (unit==init) ? 'selected' : '' );	
							})
							html +="</select>";
							$(".altui-mainpanel").on("change","#altui-"+check.id,function(){ 
								MyLocalStorage.setSettings(check.id, $("#altui-"+check.id).val());
							});
							break;
						case 'checkbox':
							html +="<label class='checkbox-inline'>";
							html +=("  <input type='checkbox' id='altui-"+check.id+"' " + ( (init==true) ? 'checked' : '') +" value='"+init+"' title='"+check.id+"'>"+_T(check.label));
							html +="</label>";
							$(".altui-mainpanel").on("click","#altui-"+check.id,function(){ 
								MyLocalStorage.setSettings(check.id, $("#altui-"+check.id).is(':checked'));
							});
							break;
						case 'number':
							html +="<label class='' for='altui-"+check.id+"'>"+_T(check.label)+"</label>:";
							html +=("<input type='number' min='"+(check.min||0) +"' max='"+(check.max||999) +"' id='altui-"+check.id+"' " + ( (init==true) ? 'checked' : '') +" value='"+init+"' title='"+check.id+"'>");
							$(".altui-mainpanel").on("focusout","#altui-"+check.id,function(){ 
								MyLocalStorage.setSettings(check.id, parseInt($("#altui-"+check.id).val()));
							});
							break;
					}
				html += "</div>";
			});		
		html +="  </div>";
		html +="  </div>";
		html +="</div>";
		html +="</div>";
		
		html += "<div class='col-xs-12'>";
		html +="<div class='panel panel-default'>";
		html +="  <div class='panel-heading'>"+_T("Cache Control")+"</div>";
		html +="  <div class='panel-body'>";
			html +="<div class='btn-group' role='group' aria-label='Icon DB'>";
			html += "<button class='btn btn-default altui-save-IconDB' type='submit'>"+saveGlyph+" Save Icon DB</button>";
			html += "<button class='btn btn-default altui-clear-IconDB' type='submit'>"+okGlyph+" Clear Icon DB</button>";
			html += "</div>";
			html += "<div class='btn-group' role='group' aria-label='File DB'>";
			html += "<button class='btn btn-default altui-save-FileDB' type='submit'>"+saveGlyph+" Save File DB</button>";
			html += "<button class='btn btn-default altui-clear-FileDB' type='submit'>"+okGlyph2+" Clear File DB</button>";
			html += "</div>";
			html += "<div class='btn-group' role='group' aria-label='User Data DB'>";
			html += "<button class='btn btn-default altui-save-userdata' type='submit'>"+saveGlyph+"Save UserData</button>";
			html += "<button class='btn btn-default altui-clear-userdata' type='submit'>"+okGlyph3+" Clear UserData</button>";
			html += "</div>";
		html += "</div>";
		html +="  </div>";
		html +="</div>";
		
		html += "<div class='col-xs-12'>";
		html +="<div class='panel panel-default'>";
		html +="  <div class='panel-heading'>"+_T("Custom Pages Control")+"</div>";
		html +="  <div class='panel-body'>";
			html += "<div class='btn-group' role='group' aria-label='User Pages DB'>";
			html += "<button class='btn btn-default altui-save-userpage' type='submit'>"+saveGlyph+"Save User Pages</button>";
			html += "<button class='btn btn-default altui-restore-userpage' type='submit'>"+loadGlyph+"Restore From User Pages Cache</button>";
			html += "<button class='btn btn-default altui-clear-userpage' type='submit'>"+okGlyph4+" Clear User Pages Cache</button>";
			html += "</div>";
		html += "</div>";
		html +="  </div>";
		html +="</div>";

		$(".altui-mainpanel").append(html);
		
		$(".altui-save-IconDB").click( function() {
			IconDB.saveDB();
			UIManager.pageOptions();
		});
		$(".altui-clear-IconDB").click( function() {
			IconDB.resetDB();
			UIManager.pageOptions();
		});
		$(".altui-save-FileDB").click( function() {
			FileDB.saveDB();
			UIManager.pageOptions();
		});
		$(".altui-clear-FileDB").click( function() {
			FileDB.resetDB();
			UIManager.pageOptions();
		});
		$(".altui-save-userdata").click( function() {
			MultiBox.saveEngine();
			UIManager.pageOptions();
		});
		$(".altui-clear-userdata").click( function() {
			MultiBox.clearEngine();
			UIManager.pageOptions();
		});
		$(".altui-save-userpage").click( function() {
			PageManager.savePages();
		});
		$(".altui-restore-userpage").click( function() {
			PageManager.recoverFromStorage();
			UIManager.pageOptions();
		});
		$(".altui-clear-userpage").click( function() {
			PageManager.clearStorage();
			UIManager.pageOptions();
		});
	},
	reloadEngine: function() {
		MultiBox.reloadEngine(0).done(function(){
			PageMessage.message(_T("Reload is done"),"success");
		})
	},
	reboot: function() {
		MultiBox.reboot(0)
	},
	signal: function( eventname ) {
		switch (eventname) {
			case 'on_ui_initFinished':
				bUIReady =true;
				break;
			case 'on_ui_userDataLoaded':
				bEngineReady=true;
				break;
		}
		if ( (bEngineReady==true) && (bUIReady==true) ) {
			bUIReady=false;
			
			$(window).on('resize', function () {
			  /*if (window.innerWidth > tabletSize) */
			  $(".navbar-collapse").collapse('hide');
			  UIManager.refreshUI( true ,false  );	// full but not first time
			});			
			$( window ).unload(function() {
				// save state to accelerate the launch next time
				// UIManager.saveEngine();	
				MultiBox.saveEngine();
				AltuiDebug.debug("exiting");
			});
	
			$(".altui-debug-div").toggle(false);
	
			$( document )
				.on ("click", ".navbar-nav a", function() {		// collapse on click on small screens
					//	$(".navbar-toggle").click();
					if ($(this).data("toggle") != "dropdown")	// not for the More... button
						$(".navbar-collapse").collapse('hide');
				} )
				.on ("click touchend", ".imgLogo", UIManager.pageHome )
				// .on ("click", ".altui-savechanges-button", MultiBox.saveChangeCaches )
				.on ("click", "#menu_room", UIManager.pageRooms )
				.on ("click", "#menu_device", UIManager.pageDevices )
				.on ("click", "#menu_scene", UIManager.pageScenes )
				.on ("click", "#altui-scene-triggers", UIManager.pageTriggers )
				.on ("click", "#menu_plugins", UIManager.pagePlugins )
				.on ("click", "#altui-pages-see", UIManager.pageUsePages )
				.on ("click", "#altui-pages-edit", UIManager.pageEditPages )
				.on( "click", "#altui-reload", UIManager.reloadEngine )
				.on( "click", "#altui-reboot", UIManager.reboot )
				.on( "click", "#altui-remoteaccess", UIManager.pageRemoteAccess )
				.on( "click", "#altui-credits", UIManager.pageCredits )
				.on( "click", "#altui-oscommand", UIManager.pageOsCommand )
				.on( "click", "#altui-luastart", UIManager.pageLuaStart )
				.on( "click", "#altui-luatest", UIManager.pageLuaTest )
				.on( "click", "#altui-zwavenetwork", UIManager.pageZwave )		
				.on( "click", "#altui-childrennetwork", UIManager.pageChildren )		
				.on( "click", "#altui-zwaveroutes", UIManager.pageRoutes )		
				.on( "click", "#altui-quality", UIManager.pageQuality )		
				.on( "click", "#altui-energy", UIManager.pagePower )	
				.on( "click", "#altui-tbl-device", UIManager.pageTblDevices )
				.on( "click", "#altui-optimize", UIManager.pageOptions )
				.on( "click", "#altui-localize", UIManager.pageLocalization  )
				.on( "click", "#altui-debugtools", UIManager.pageDebug  )
				.on( "click", "#altui-debug-btn", function() {
					$(".altui-debug-div").toggle();
					$("#altui-debug-btn span.caret").toggleClass( "caret-reversed" );
				})
				.on("click",".altui-device-variables",function(){ 
					var altuiid = $(this).prop('id');
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					UIManager.deviceDrawVariables(device);
				})
				.on("click",".altui-device-actions",function(){ 
					var altuiid = $(this).prop('id');
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					UIManager.deviceDrawActions(device);
				});
				AltuiDebug.debug("init done");
				// console.log("start UIManager.run()");
				_refreshFooter();
				UIManager.run();
		}
	},
	
	run: function( eventname ) {
		var homepage = getQueryStringValue("home") || 'pageHome';
		// try {
			window["UIManager"][homepage]();	// call function by its name
		// }
		// catch (err) {
			// PageMessage.message("Exception occurred in "+homepage,"warning");
			// AltuiDebug.debug("Exception occurred in "+homepage);
			// AltuiDebug.debug("name: "+err.name);
			// AltuiDebug.debug("message: "+err.message);
			// console.log("Exception occurred in "+homepage);
			// console.log("name: "+err.name);// affiche 'Error'
			// console.log("message: "+err.message); // affiche 'mon message' ou un message d'erreur JavaScript
		// }
	}
  };	// end of return
})( window );

	
$(document).ready(function() {

	function _initLocalizedGlobals() {
		// console.log("_initLocalizedGlobals()");
		_HouseModes = [
			{id:1, text:_T("Home"), cls:"preset_home"},
			{id:2, text:_T("Away"), cls:"preset_away"},
			{id:3, text:_T("Night"), cls:"preset_night"},
			{id:4, text:_T("Vacation"), cls:"preset_vacation"}
		];
		// 0: table  1: devicename 2: id
		deviceModalTemplate = "<div id='deviceModal' class='modal fade'>";
		deviceModalTemplate += "  <div class='modal-dialog modal-lg'>";
		deviceModalTemplate += "    <div class='modal-content'>";
		deviceModalTemplate += "      <div class='modal-header'>";
		deviceModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		deviceModalTemplate += "        <h4 class='modal-title'>{1} <small>#{2}</small> - Variables</h4>";
		deviceModalTemplate += "      </div>";
		deviceModalTemplate += "      <div class='modal-body'>";
		deviceModalTemplate += "      <div class='row' >";
		deviceModalTemplate += "      <div class='col-xs-12' style='overflow-x: auto;'>";
		deviceModalTemplate += " <table class='table table-condensed'>";
		deviceModalTemplate += "       <thead>";
		deviceModalTemplate += "         <tr>";
		// deviceModalTemplate += "           <th>#</th>";
		deviceModalTemplate += "           <th>"+_T("Variable")+"</th>";
		deviceModalTemplate += "           <th></th>";
		deviceModalTemplate += "           <th>"+_T("Value")+"</th>";
		deviceModalTemplate += "         </tr>";
		deviceModalTemplate += "       </thead>";
		deviceModalTemplate += "       <tbody>";
		deviceModalTemplate += "       {0}";					// lines goes here
		deviceModalTemplate += "       </tbody>";
		deviceModalTemplate += "     </table>";
		deviceModalTemplate += "      </div>";	// col
		deviceModalTemplate += "      </div>";	// row
		deviceModalTemplate += "      </div>";	// body
		deviceModalTemplate += "      <div class='modal-footer'>";
		deviceModalTemplate += "        <button type='button' class='btn btn-primary' data-dismiss='modal'>"+_T("Close")+"</button>";
		// deviceModalTemplate += "        <button type='button' class='btn btn-primary'>Save changes</button>";
		deviceModalTemplate += "      </div>";
		deviceModalTemplate += "    </div><!-- /.modal-content -->";
		deviceModalTemplate += "  </div><!-- /.modal-dialog -->";
		deviceModalTemplate += "</div><!-- /.modal -->";

		// 0: table  1: devicename 2: id
		deviceActionModalTemplate = "<div id='deviceActionModal' class='modal fade'>";
		deviceActionModalTemplate += "  <div class='modal-dialog'>";
		deviceActionModalTemplate += "    <div class='modal-content'>";
		deviceActionModalTemplate += "      <div class='modal-header'>";
		deviceActionModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		deviceActionModalTemplate += "        <h4 class='modal-title'>{1} <small>#{2}</small> - Actions</h4>";
		deviceActionModalTemplate += "      </div>";
		deviceActionModalTemplate += "      <div class='modal-body'>";
		deviceActionModalTemplate += " 	<table class='table table-condensed' >";
		deviceActionModalTemplate += "       <thead>";
		deviceActionModalTemplate += "         <tr>";
		deviceActionModalTemplate += "           <th>"+_T("Action")+"</th>";
		deviceActionModalTemplate += "           <th>"+_T("Parameters")+"</th>";
		deviceActionModalTemplate += "         </tr>";
		deviceActionModalTemplate += "       </thead>";
		deviceActionModalTemplate += "       <tbody>";
		deviceActionModalTemplate += "       {0}";					// lines goes here
		deviceActionModalTemplate += "       </tbody>";
		deviceActionModalTemplate += "     </table>";
		deviceActionModalTemplate += "      </div>";
		deviceActionModalTemplate += "      <div class='modal-footer'>";
		deviceActionModalTemplate += "        {3}";					// extra buttons
		deviceActionModalTemplate += "        <button type='button' class='btn btn-primary' data-dismiss='modal'>"+_T("Close")+"</button>";
		deviceActionModalTemplate += "      </div>";
		deviceActionModalTemplate += "    </div><!-- /.modal-content -->";
		deviceActionModalTemplate += "  </div><!-- /.modal-dialog -->";
		deviceActionModalTemplate += "</div><!-- /.modal -->";

		// 0: title, 1: body, 2: primary button text like _T("Save Changes")
		defaultDialogModalTemplate = "<div id='dialogModal' class='modal fade'>";
		defaultDialogModalTemplate += "  <div class='modal-dialog modal-lg'>";
		defaultDialogModalTemplate += "    <form class='form' data-toggle='validator' onsubmit='return false;'>";
		defaultDialogModalTemplate += "    <div class='modal-content'>";
		defaultDialogModalTemplate += "      <div class='modal-header'>";
		defaultDialogModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		defaultDialogModalTemplate += "        <h4 class='modal-title'>{0} </h4>";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "      <div class='modal-body'>";
		defaultDialogModalTemplate += "      <div class='row-fluid'>";
		defaultDialogModalTemplate += "      {1}";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "      <div class='modal-footer'>";
		defaultDialogModalTemplate += "        <button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
		// defaultDialogModalTemplate += "        <button type='submit' class='btn btn-primary'>{2}</button>";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "    </div><!-- /.modal-content -->";
		defaultDialogModalTemplate += "    </form>";
		defaultDialogModalTemplate += "  </div><!-- /.modal-dialog -->";
		defaultDialogModalTemplate += "</div><!-- /.modal -->";

	//"<span class='glyphicon glyphicon-search' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Search'></span>"
		staremtpyGlyph =glyphTemplate.format( "star-empty", _T("Favorite"), "altui-favorite text-muted" );
		starGlyph = glyphTemplate.format( "star", _T("Favorite"), "altui-favorite text-warning" );
		questionGlyph=glyphTemplate.format( "question-sign", _T("Question"), "text-warning" );
		searchGlyph=glyphTemplate.format( "search", _T("Search"), "" );
		optHorGlyph=glyphTemplate.format( "option-horizontal", _T("Option"), "pull-left" );
		calendarGlyph=glyphTemplate.format( "calendar", _T("History"), "" );
		refreshGlyph=glyphTemplate.format( "refresh", _T("Refresh"), "text-warning" );
		removeGlyph=glyphTemplate.format( "remove", _T("Remove"), "" );
		loadGlyph = glyphTemplate.format( "open", _T("Load") , "");
		infoGlyph = glyphTemplate.format( "info-sign", _T("Info") , "");
		picGlyph = glyphTemplate.format( "picture", _T("Image") , "");
		upGlyph = glyphTemplate.format( "arrow-up", _T("More") , "");
		downGlyph = glyphTemplate.format( "arrow-down", _T("Less") , "");
		uncheckedGlyph= glyphTemplate.format( "unchecked", _T("Frame") , "");
		runGlyph = glyphTemplate.format( "play", _T("Run Scene") , "");
		editGlyph = glyphTemplate.format( "pencil", _T("Edit") , "");
		cameraGlyph = glyphTemplate.format( "facetime-video", _T("Camera") , "");
		onoffGlyph = glyphTemplate.format( "off", _T("On Off") , "");
		scaleGlyph = glyphTemplate.format( "scale", _T("Gauge") , "");
		homeGlyph = glyphTemplate.format( "home", _T("Rooms") , "");
		tagsGlyph = glyphTemplate.format( "tags", _T("Category") , "");
		helpGlyph = glyphTemplate.format( "question-sign", "" , "");
		
		UIManager.initLocalizedGlobals();
	
		var body = "";
		body+="<!-- Fixed navbar -->";
		body+="<div id='dialogs'></div>";
		body+="<nav class='navbar navbar-default navbar-fixed-top'>";
		body+=" <div class='container'>";
		body+="	<div class='navbar-header'>";
		body+="	  <button type='button' class='navbar-toggle collapsed pull-left' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>";
		body+="		<span class='sr-only'>Toggle navigation</span>";
		body+="		<span class='icon-bar'></span>";
		body+="		<span class='icon-bar'></span>";
		body+="		<span class='icon-bar'></span>";
		body+="	  </button>		  ";
		body+="	  <a class='navbar-brand' href='#'></a>";
		body+="	</div>";
		body+="	<div id='navbar' class='navbar-collapse collapse'>";
		body+="	  <ul class='nav navbar-nav'>";
		body+="		<li class='active'><div class='imgLogo'></div></li>";
		body+="		<li><a id='menu_device' href='#'  >"+_T("Devices")+"</a></li>";
		// body+="		<li><a id='menu_scene' href='#'  >"+_T("Scenes")+"</a></li>";
		body+="		<li><a id='menu_scene' href='#'  >"+_T("Scenes")+"</a></li>";
		body+="		<li class='dropdown'>";
		body+="			<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"+_T("More")+" <span class='caret'></span></a>";
		body+="			<ul class='dropdown-menu' role='menu'>";
		body+="				<li><a id='menu_room' href='#'  >"+_T("Rooms")+"</a></li>";
		body+="				<li><a id='menu_plugins' href='#'  >"+_T("Plugins")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="				<li class='dropdown-header'>Tables</li>";
		body+="				<li><a id='altui-tbl-device' href='#' >"+_T("Devices")+"</a></li>";
		body+="				<li><a id='altui-scene-triggers' href='#' >"+_T("Triggers")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="				<li class='dropdown-header'>Graphic</li>";
		body+="				<li><a id='altui-energy' href='#' >"+_T("Power Chart")+"</a></li>";
		body+="				<li><a id='altui-childrennetwork' href='#' >"+_T("Parent/Child Network")+"</a></li>";
		body+="				<li><a id='altui-zwavenetwork' href='#' >"+_T("zWave Network")+"</a></li>";
		body+="				<li><a id='altui-zwaveroutes' href='#' >"+_T("zWave Routes")+"</a></li>";
		body+="				<li><a id='altui-quality' href='#' >"+_T("Network Quality")+"</a></li>";
		body+="			</ul>";
		body+="		</li>";
		body+="		<li class='dropdown'>";
		body+="			<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"+_T("Panels")+" <span class='caret'></span></a>";
		body+="			<ul class='dropdown-menu' role='menu'>";
		body+="				<li><a id='altui-pages-see' href='#' >"+_T("Use Custom Pages")+"</a></li>";
		body+="				<li><a id='altui-pages-edit' href='#' >"+_T("Edit Custom Pages")+"</a></li>";
		body+="			</ul>";
		body+="		</li>";
		body+="		<li class='dropdown'>";
		body+="		  <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"+_T("Misc")+"<span class='caret'></span></a>";
		body+="		  <ul class='dropdown-menu' role='menu'>";
		body+="			<li class='dropdown-header'>Access</li>";
		body+="			<li><a id='altui-remoteaccess' href='#' >"+_T("Remote Access Login")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="			<li class='dropdown-header'>Lua</li>";
		body+="			<li><a id='altui-reload' href='#' >"+_T("Reload Luup Engine")+"</a></li>";
		body+="			<li><a id='altui-reboot' href='#' >"+_T("Reboot Vera")+"</a></li>";
		body+="			<li><a id='altui-luastart' href='#' >"+_T("Lua Startup Code")+"</a></li>";
		body+="			<li><a id='altui-luatest' href='#' >"+_T("Lua Test Code")+"</a></li>";
		body+="			<li><a id='altui-oscommand' href='#' >"+_T("OS Command")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="			<li class='dropdown-header'>Admin</li>";
		body+="			<li><a id='altui-optimize' href='#'>"+_T("Options")+"</a></li>";
		body+="			<li><a id='altui-localize' href='#'>"+_T("Localization")+"</a></li>";
		body+="			<li><a id='altui-debugtools' href='#'>"+_T("Debug")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="			<li class='dropdown-header'>About</li>";
		body+="			<li><a id='altui-credits' href='#'>"+_T("Credits")+"</a></li>";
		body+="			<li><a href='http://forum.micasaverde.com/index.php?board=78.0'>"+_T("Evolutions")+"</a></li>";
		body+="		  </ul>";
		body+="		</li>";
		body+="	  </ul>";
		body+="	</div><!--/.nav-collapse -->";
		body+="  </div>";
		body+="</nav>";
		body+="<div class='container-fluid theme-showcase' role='main'>";
		body+="</div> <!-- /container -->";
		body+="<div id='altui-background'></div>";
		$("body").prepend(body);
		
		UIManager.initEngine(styles.format(window.location.hostname), g_DeviceTypes, g_CustomTheme, function() {
			UIManager.initCustomPages(g_CustomPages);	
			MultiBox.initEngine(g_ExtraController,g_FirstUserData);
			EventBus.publishEvent("on_ui_initFinished");
		});
	};

	AltuiDebug.SetDebug( g_DeviceTypes.info["debug"] ) ;
	AltuiDebug.debug("starting engines");
	AltuiDebug.debug("Configuration: "+JSON.stringify(g_DeviceTypes));
	AltuiDebug.debug("Custom Pages: "+JSON.stringify(g_CustomPages));

	EventBus.registerEventHandler("on_ui_initFinished",UIManager,UIManager.signal);
	EventBus.registerEventHandler("on_ui_userDataLoaded",UIManager,UIManager.signal);
	EventBus.registerEventHandler("on_ui_deviceStatusChanged",UIManager,"refreshUIPerDevice");

	var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
	AltuiDebug.debug("language:"+language);
		

	// if lang is on the url, the js is already loaded by the LUA module. 
	if ( (language.substring(0, 2) != 'en') && (getQueryStringValue("lang")=="") ){
	// if (false) {
		var scriptLocationAndName = 'J_ALTUI_loc_'+ language.substring(0, 2) + '.js' ;
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = scriptLocationAndName;
		AltuiDebug.debug("loading script :"+scriptLocationAndName);
		// once script is loaded, we can call style function in it
		$(script).load(  function() {
			_initLocalizedGlobals();
		} );
		head.appendChild(script);
	} else {
		AltuiDebug.debug("Locale file not needed");
		_initLocalizedGlobals();
	}

});
