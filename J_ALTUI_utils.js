//# sourceURL=J_ALTUI_utils.js
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

if (typeof RegExp.escape == 'undefined') {
	RegExp.escape = function(string) {
	  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	};
};

if (typeof String.prototype.escapeQuotes != 'function') {
  // see below for better implementation!
  String.prototype.escapeQuotes = function (){
	var content = this;
    return content.replace(/'/g, "\\'");
  };
};

if (typeof String.prototype.format == 'undefined') {
	String.prototype.format = function()
	{
	   var content = this;
	   for (var i=0; i < arguments.length; i++)
	   {
			var replacement = new RegExp('\\{' + i + '\\}', 'g');	// regex requires \ and assignment into string requires \\,
			// if ($.type(arguments[i]) === "string")
				// arguments[i] = arguments[i].replace(/\$/g,'$');
			content = content.replace(replacement, arguments[i]);  
	   }
	   return content;
	};
};

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
};

if (typeof String.prototype.htmlEncode == 'undefined') {
	String.prototype.htmlEncode = function()
	{
	   var value = this;
	   return $('<div/>').text(value).html();
	}
	 
	String.prototype.htmlDecode= function()
	{
		var value = this;
		return $('<div/>').html(value).text();
	}
};

function isInteger(data) {
    return (data === parseInt(data, 10));
};

var AltuiDebug = ( function (undefined) {
	var g_debug = false;
	
	function _debug(str) {
		if (g_debug==true)
			console.log(new Date().toISOString()+": ALTUI "+g_DeviceTypes.info["PluginVersion"]+":"+str);
	}
	
	return {
		SetDebug: function(bDebug)	{ g_debug=bDebug; },
		IsDebug : function()		{ return g_debug; },
		debug: _debug,
	}
})();

function formatAjaxErrorMessage(jqXHR, exception) {

	if (jqXHR.status === 0) {
		return ('Not connected. Please verify your network connection.');
	} else if (jqXHR.status == 404) {
		return ('The requested page not found. [404]');
	} else if (jqXHR.status == 500) {
		return ('Internal Server Error [500].');
	} else if (exception === 'parsererror') {
		return ('Requested JSON parse failed.');
	} else if (exception === 'timeout') {
		return ('Time out error.');
	} else if (exception === 'abort') {
		return ('Ajax request aborted.');
	} else {
		return ('Uncaught Error.\n' + jqXHR.responseText);
	}
};
	
var MyLocalStorage = ( function (undefined) {
		_set=  function(key, item) {
			if (key==undefined)
				return null;
			
			localStorage.setItem( key, JSON.stringify(item) );
			return item;
		};
		
		_get= function(key) {
			if (key==undefined)
				return null;
			var json = localStorage.getItem( key );
			return json != undefined ? JSON.parse(json) : null;
		};
		
		_clear= function(key) {
			if (key==undefined)
				return null;
			localStorage.removeItem(key);
		};
		
		_setSettings=function(key, val) {
			var settings = _get("ALTUI_Settings");
			if (settings==null) {
				settings = {};
			}
			settings[key] = val;
			return _set("ALTUI_Settings",settings);
		};
		
		_getSettings=function(key) {
			var settings = _get("ALTUI_Settings");
			return (settings) ? settings[key] : null;
		};
		
	return {
		set: _set,
		get: _get,
		setSettings: _setSettings,
		getSettings: _getSettings,
		clear: _clear,
	}
})( );

/*
// double tap event from https://gist.github.com/asgeo1/1652946
//based on blog post that I saw here: http://www.sanraul.com/2010/08/01/implementing-doubletap-on-iphones-and-ipads/
(function($){
    $.fn.doubletap = function(fn) {
        return fn ? this.bind('doubletap', fn) : this.trigger('doubletap');
    };
 
	$.attrFn = $.attrFn || {};
    $.attrFn.doubletap = true;
 
    $.event.special.doubletap = {
        setup: function(data, namespaces){
            $(this).bind('touchstart', $.event.special.doubletap.handler);
        },
 
        teardown: function(namespaces){
            $(this).unbind('touchstart', $.event.special.doubletap.handler);
        },
 
        handler: function(event){
			if (event.targetTouches.length <= 1) {
				var action;
	 
				clearTimeout(action);
	 
				var now       = new Date().getTime();
				//the first time this will make delta a negative number
				var lastTouch = $(this).data('lastTouch') || now + 1;
				var delta     = now - lastTouch;
				var delay     = delay == null? 500 : delay;
	 
				if(delta < delay && delta > 0){
					// After we detct a doubletap, start over
					$(this).data('lastTouch', null);
	 
					// set event type to 'doubletap'
					event.type = 'doubletap';
	 
					// let jQuery handle the triggering of "doubletap" event handlers
					$.event.handle.apply(this, arguments);
				}else{
					$(this).data('lastTouch', now);
	 
					action = setTimeout(function(evt){
						// set event type to 'doubletap'
						event.type = 'tap';
	 
						// let jQuery handle the triggering of "doubletap" event handlers
						$.event.handle.apply(this, arguments);
	 
						clearTimeout(action); // clear the timeout
					}, delay, [event]);
				}
			}
        }
    };
})(jQuery);
*/

//=======================================================================
//	HTML Builder classes
//=======================================================================
var HtmlBuilder = ( function (undefined) {
	return {
		Tag 			: function (tag,id,cls,attrs,content,children) {
			var _children = [];
			var _id = (id!=undefined) ? id : '';
			var _cls = (cls!=undefined) ? cls : '';
			var _tag = tag;
			var _attrs = attrs || {};
			var _content = (content!=undefined) ? content : '';
			
			_addChild = function( child ) {
				_children.push(child);
			};
			
			_getHtml=  function() {
				var _Html="";
				var attr_tbl = [];
				$.each( _attrs, function(key,val) {
					attr_tbl.push("{0}='{1}'".format(key,val)); 
				});
					
				_Html += "<{0} id='{1}' class='{2}' {3}>\n".format(_tag,_id,_cls,attr_tbl.join(' '));
				_Html += _content;
				$.each(_children, function(idx,child){
					_Html+= child.getHtml();
				});
				_Html += "</{0}>\n".format(_tag);
				return _Html;
			};
			
			if 	(children!=undefined)
			{
				if ($.isArray(children))
					$.each(children, function(idx,child){
						_addChild(child);
					});
				else
					_addChild(children);
			}
			
			return {
				addChild: _addChild,
				getHtml: _getHtml,
			}
		},
		Div 			: function (id,cls,attrs,content,children) {
			return HtmlBuilder.Tag('div',id,cls,attrs,content,children);		//(tag,id,cls,attrs,content,children)
		},
		P 				: function(id,cls,attrs,content,children) {
			//<p class="form-control-static">email@example.com</p>			
			return HtmlBuilder.Tag('p',id,cls,attrs,content,children);
		},
		Row 			: function (id,cls,attrs,children) {
			cls = cls || '';
			return HtmlBuilder.Div(id,'row '+cls,attrs,null,children);
		},
		Col 			: function (id,cls,attrs,children) {
			return HtmlBuilder.Div(id,cls,attrs,null,children);
		},
		Form 			: function (id,cls,children) {
			return HtmlBuilder.Tag('form',id,cls,null,null,children); 
		},
		FormGroup 		: function (id,cls,children) {
			cls = cls || '';
			return HtmlBuilder.Div(id,'form-group '+cls,null,null,children);			//(tag,id,cls,attrs,content,children)
		},
		FormLabel 		: function (id,cls,labelfor,content,children) {
			//<label for="exampleInputName2">Name</label>
			labelfor = labelfor ||'';
			cls = 'control-label ' + (cls || '');
			return HtmlBuilder.Tag('label',id,cls,{for:labelfor},content,children);		//(tag,id,cls,attrs,content,children)
		},
		FormStatic		: function(id,cls,attr,content,children)
		{
			cls = 'form-control-static '+ (cls||'');
			return HtmlBuilder.P(id,cls,attr,content,children);
		},
		FormInput 		: function (id,cls,typ, placeholder, attrs,content,children) {
			//<input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
			cls = 'form-control ' + (cls || '');
			typ = typ || "text ";
			placeholder = placeholder || "";
			var attributes = {type: typ, placeholder: placeholder};
			$.extend(attributes,attrs);
			return HtmlBuilder.Input(	// id,cls,typ, attrs,content,children)
				id,cls,
				typ,
				attributes,
				content,
				children);		//(tag,id,cls,attrs,content,children)
		},	
		TextArea 		: function (id,cls,rows, attrs,content,children) {
			//<textarea class="form-control" rows="3"></textarea>
			var attributes = {rows: rows};
			cls = cls || '';
			$.extend(attributes,attrs);
			return HtmlBuilder.Tag('textarea',		//(tag,id,cls,attrs,content,children)
				id,cls,
				attributes,
				content,
				children);		
		},	
		FormTextArea	: function (id,cls,rows, attrs,content,children) {
			cls = 'form-control ' + (cls || '');
			return HtmlBuilder.TextArea(id,cls,rows, attrs,content,children);
		},
		Input 			: function (id,cls,typ, attrs,content,children) {
			//<input type="email" class="" id="exampleInputEmail1" placeholder="Enter email">
			cls = (cls || '');
			typ = typ || "text ";
			var attributes = {type: typ};
			$.extend(attributes,attrs);
			return HtmlBuilder.Tag('input',
				id,cls,
				attributes,
				content,
				children);		//(tag,id,cls,attrs,content,children)
		},			
		FormCheckbox 	: function (id,cls,attrs,content) {
			// <div class="checkbox">
			// <label>
			// <input type="checkbox"> Remember me
			// </label>
			// </div>
			var div = HtmlBuilder.Div(null,null,attrs);
			var label = HtmlBuilder.FormLabel();
			var input = HtmlBuilder.Input(id,cls,'checkbox',attrs, content,null);
			label.addChild(input);
			div.addChild(label);
			return div;
		},
		Button 			: function( id,cls, typ, attrs, content ) {
			// <button type="submit" class="btn btn-default">Send invitation</button>
			cls = cls || "btn btn-default";
			var attributes = {type: typ};
			return HtmlBuilder.Tag( 'button',	//(tag,id,cls,attrs,content,children)
				id,cls,
				attributes,
				content,
				null
			);
		},
		Panel 			: function( id, cls, bodycls, attrs, content, heading, footer, children) {
			// <div class="panel panel-default">
			// <div class="panel-body">
			// Basic panel example
			// </div>
			// </div>
			cls = "panel " + (cls || "panel-default ");
			bodycls = bodycls || '';
			var panel = HtmlBuilder.Div(id,cls,attrs,'');
			var body = HtmlBuilder.Div('','panel-body '+bodycls,null,content,children);
			if (heading)
				panel.addChild( HtmlBuilder.PanelHeading('','',null, heading ) );
			panel.addChild( body );
			if (footer)
				panel.addChild( HtmlBuilder.PanelFooter('','',null, footer ) );
			return $.extend( panel, { 
				addChild : function( child ) {		// override addChild to add child to panel Body
					return body.addChild( child );
				}
			});
		},
		PanelHeading 	: function( id, cls, attrs, content) {
			cls = "panel-heading " + (cls || "");
			return HtmlBuilder.Div(id,cls,attrs,content,null);
		},
		PanelFooter		: function( id, cls, attrs, content) {
			cls = "panel-footer " + (cls || "");
			return HtmlBuilder.Div(id,cls,attrs,content,null);
		},
	}
})( );


// var col = new HtmlBuilder.Col();
// var form = new HtmlBuilder.Form();
// var group = new HtmlBuilder.FormGroup();
// var label = new HtmlBuilder.FormLabel('','','exampleInputName2','toto');
// var input = new HtmlBuilder.FormInput('','','email','enter email', {},'tutu');
// var checkbox = new HtmlBuilder.FormCheckbox('','',null,'test checkbox');
// var textarea = new HtmlBuilder.FormTextArea('','',4, null,'test');
// col.addChild(form);
// form.addChild(group);
// group.addChild(label);
// group.addChild(input);
// group.addChild(checkbox);
// group.addChild(textarea);
// var row = new HtmlBuilder.Row('','',null,col);
// var html = row.getHtml();
// $("body").append(html);
// alert(html);
