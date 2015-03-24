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

	
function _sortByVariableName(a,b)
{
	if (a.variable > b.variable)
		return 1;
	if (a.variable < b.variable)
		return -1;
	// a doit être égale à b
	return 0;
};
	
/* ========================================================================
 * Bootstrap (plugin): validator.js v0.8.0
 * ========================================================================
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Cina Saffary.
 * Made by @1000hz in the style of Bootstrap 3 era @fat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ======================================================================== */


+function ($) {
  'use strict';

  // VALIDATOR CLASS DEFINITION
  // ==========================

  var Validator = function (element, options) {
    this.$element = $(element)
    this.options  = options

    options.errors = $.extend({}, Validator.DEFAULTS.errors, options.errors)

    for (var custom in options.custom) {
      if (!options.errors[custom]) throw new Error('Missing default error message for custom validator: ' + custom)
    }

    $.extend(Validator.VALIDATORS, options.custom)

    this.$element.attr('novalidate', true) // disable automatic native validation
    this.toggleSubmit()

    this.$element.on('input.bs.validator change.bs.validator focusout.bs.validator', $.proxy(this.validateInput, this))
    this.$element.on('submit.bs.validator', $.proxy(this.onSubmit, this))

    this.$element.find('[data-match]').each(function () {
      var $this  = $(this)
      var target = $this.data('match')

      $(target).on('input.bs.validator', function (e) {
        $this.val() && $this.trigger('input.bs.validator')
      })
    })
  }

  Validator.DEFAULTS = {
    delay: 500,
    html: false,
    disable: true,
    custom: {},
    errors: {
      match: 'Does not match',
      minlength: 'Not long enough'
    }
  }

  Validator.VALIDATORS = {
    native: function ($el) {
      var el = $el[0]
      return el.checkValidity ? el.checkValidity() : true
    },
    match: function ($el) {
      var target = $el.data('match')
      return !$el.val() || $el.val() === $(target).val()
    },
    minlength: function ($el) {
      var minlength = $el.data('minlength')
      return !$el.val() || $el.val().length >= minlength
    }
  }

  Validator.prototype.validateInput = function (e) {
    var $el        = $(e.target)
    var prevErrors = $el.data('bs.validator.errors')
    var errors

    if ($el.is('[type="radio"]')) $el = this.$element.find('input[name="' + $el.attr('name') + '"]')

    this.$element.trigger(e = $.Event('validate.bs.validator', {relatedTarget: $el[0]}))

    if (e.isDefaultPrevented()) return

    var self = this

    this.runValidators($el).done(function (errors) {
      $el.data('bs.validator.errors', errors)

      errors.length ? self.showErrors($el) : self.clearErrors($el)

      if (!prevErrors || errors.toString() !== prevErrors.toString()) {
        e = errors.length
          ? $.Event('invalid.bs.validator', {relatedTarget: $el[0], detail: errors})
          : $.Event('valid.bs.validator', {relatedTarget: $el[0], detail: prevErrors})

        self.$element.trigger(e)
      }

      self.toggleSubmit()

      self.$element.trigger($.Event('validated.bs.validator', {relatedTarget: $el[0]}))
    })
  }


  Validator.prototype.runValidators = function ($el) {
    var errors   = []
    var deferred = $.Deferred()
    var options  = this.options

    $el.data('bs.validator.deferred') && $el.data('bs.validator.deferred').reject()
    $el.data('bs.validator.deferred', deferred)

    function getErrorMessage(key) {
      return $el.data(key + '-error')
        || $el.data('error')
        || key == 'native' && $el[0].validationMessage
        || options.errors[key]
    }

    $.each(Validator.VALIDATORS, $.proxy(function (key, validator) {
      if (($el.data(key) || key == 'native') && !validator.call(this, $el)) {
        var error = getErrorMessage(key)
        !~errors.indexOf(error) && errors.push(error)
      }
    }, this))

    if (!errors.length && $el.val() && $el.data('remote')) {
      this.defer($el, function () {
        var data = {}
        data[$el.attr('name')] = $el.val()
        $.get($el.data('remote'), data)
          .fail(function (jqXHR, textStatus, error) { errors.push(getErrorMessage('remote') || error) })
          .always(function () { deferred.resolve(errors)})
      })
    } else deferred.resolve(errors)

    return deferred.promise()
  }

  Validator.prototype.validate = function () {
    var delay = this.options.delay

    this.options.delay = 0
    this.$element.find(':input:not([type="hidden"])').trigger('input.bs.validator')
    this.options.delay = delay

    return this
  }

  Validator.prototype.showErrors = function ($el) {
    var method = this.options.html ? 'html' : 'text'

    this.defer($el, function () {
      var $group = $el.closest('.form-group')
      var $block = $group.find('.help-block.with-errors')
      var $feedback = $group.find('.form-control-feedback')
      var errors = $el.data('bs.validator.errors')

      if (!errors.length) return

      errors = $('<ul/>')
        .addClass('list-unstyled')
        .append($.map(errors, function (error) { return $('<li/>')[method](error) }))

      $block.data('bs.validator.originalContent') === undefined && $block.data('bs.validator.originalContent', $block.html())
      $block.empty().append(errors)
      $group.addClass('has-error')

      $feedback.length
        && $feedback.removeClass('glyphicon-ok')
        && $feedback.addClass('glyphicon-warning-sign')
        && $group.removeClass('has-success')
    })
  }

  Validator.prototype.clearErrors = function ($el) {
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')
    var $feedback = $group.find('.form-control-feedback')

    $block.html($block.data('bs.validator.originalContent'))
    $group.removeClass('has-error')

    $feedback.length
      && $feedback.removeClass('glyphicon-warning-sign')
      && $feedback.addClass('glyphicon-ok')
      && $group.addClass('has-success')
  }

  Validator.prototype.hasErrors = function () {
    function fieldErrors() {
      return !!($(this).data('bs.validator.errors') || []).length
    }

    return !!this.$element.find(':input:enabled').filter(fieldErrors).length
  }

  Validator.prototype.isIncomplete = function () {
    function fieldIncomplete() {
      return this.type === 'checkbox' ? !this.checked                                   :
             this.type === 'radio'    ? !$('[name="' + this.name + '"]:checked').length :
                                        $.trim(this.value) === ''
    }

    return !!this.$element.find(':input[required]:enabled').filter(fieldIncomplete).length
  }

  Validator.prototype.onSubmit = function (e) {
    this.validate()
    if (this.isIncomplete() || this.hasErrors()) e.preventDefault()
  }

  Validator.prototype.toggleSubmit = function () {
    if(!this.options.disable) return
    var $btn = this.$element.find('input[type="submit"], button[type="submit"]')
    $btn.toggleClass('disabled', this.isIncomplete() || this.hasErrors())
      .css({'pointer-events': 'all', 'cursor': 'pointer'})
  }

  Validator.prototype.defer = function ($el, callback) {
    if (!this.options.delay) return callback()
    window.clearTimeout($el.data('bs.validator.timeout'))
    $el.data('bs.validator.timeout', window.setTimeout(callback, this.options.delay))
  }

  Validator.prototype.destroy = function () {
    this.$element
      .removeAttr('novalidate')
      .removeData('bs.validator')
      .off('.bs.validator')

    this.$element.find(':input')
      .off('.bs.validator')
      .removeData(['bs.validator.errors', 'bs.validator.deferred'])
      .each(function () {
        var $this = $(this)
        var timeout = $this.data('bs.validator.timeout')
        window.clearTimeout(timeout) && $this.removeData('bs.validator.timeout')
      })

    this.$element.find('.help-block.with-errors').each(function () {
      var $this = $(this)
      var originalContent = $this.data('bs.validator.originalContent')

      $this
        .removeData('bs.validator.originalContent')
        .html(originalContent)
    })

    this.$element.find('input[type="submit"], button[type="submit"]').removeClass('disabled')

    this.$element.find('.has-error').removeClass('has-error')

    return this
  }

  // VALIDATOR PLUGIN DEFINITION
  // ===========================


  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var options = $.extend({}, Validator.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var data    = $this.data('bs.validator')

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.validator', (data = new Validator(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.validator

  $.fn.validator             = Plugin
  $.fn.validator.Constructor = Validator


  // VALIDATOR NO CONFLICT
  // =====================

  $.fn.validator.noConflict = function () {
    $.fn.validator = old
    return this
  }


  // VALIDATOR DATA-API
  // ==================

  $(window).on('load', function () {
    $('form[data-toggle="validator"]').each(function () {
      var $form = $(this)
      Plugin.call($form, $form.data())
    })
  })

}(jQuery);
