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
function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 
	
function isIE11() {
	var ie11andabove = navigator.userAgent.indexOf('Trident') != -1 && navigator.userAgent.indexOf('MSIE') == -1 // IE11 or above Boolean
	return ie11andabove;
}

var Localization = ( function (undefined) {
	var _unknown_terms = {};
	var _terms = {};
	
	__T =  function(t) {
		var v =_terms[t]
		if (v)
			return v;
		_unknown_terms[t] = t;
		return t;
	};
	
	_initTerms = function(terms) {
		_terms = $.extend({},terms);
		_unknown_terms = {};
	};
	
	_dumpTerms = function() {
		if (AltuiDebug.IsDebug()) {
			console.log( JSON.stringify(_unknown_terms) );
			console.log( JSON.stringify(_terms) );
		}
		var text = "browser query:{3} userlanguage:{0} language:{1}\n Unknown terms:{2}".format(
			window.navigator.userLanguage || "",
			window.navigator.language || "",
			JSON.stringify(_unknown_terms),
			getQueryStringValue("lang")
		);
		UIManager.pageEditorForm(_T("Localization information"),text,_T("Close"),function() {
			UIManager.pageHome();
		});
	};
	
	return {
		_T : __T,
		init : _initTerms,
		dump : _dumpTerms
	}
})();

_T = Localization._T;

if (typeof RegExp.escape == 'undefined') {
	RegExp.escape = function(string) {
	  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	};
};

if (typeof Array.prototype.in_array != 'function') {
	Array.prototype.in_array = function ( obj ) {
		var len = this.length;
		for ( var x = 0 ; x <= len ; x++ ) {
			if ( this[x] == obj ) return true;
		}
		return false;
	}
};

if (typeof Number.prototype.toPaddedString != 'function') {
	function toPaddedString(number, length, radix) {
		var string = number.toString(radix || 10),
			slength = string.length;
		for (var i=0; i<(length - slength); i++) string = '0' + string;
		return string;
	}

	Number.prototype.toPaddedString = function(length, radix) {
		var number = this;
		return toPaddedString(number, length, radix);
	}
};

if (typeof String.prototype.toHHMMSS != 'function') {
	String.prototype.toHHMMSS = function () {
		var sec_num = parseInt(this, 10); // don't forget the second param
		if ( isNaN(sec_num) )
			sec_num=0;
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = hours+':'+minutes+':'+seconds;
		return time;
	}
	String.prototype.fromHHMMSS = function () {
		var hms = this;
		var a = hms.split(':'); // split it at the colons

		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var seconds = (+a[0] || 0) * 60 * 60 + (+a[1] || 0) * 60 + (+a[2] || 0 ); 
		return seconds;
	}
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

function _format2Digits(d) {
	return ("0"+d).substr(-2);
};	

function _toIso(date,sep) {
	sep = sep || 'T';
	var iso = "{0}-{1}-{2}{6}{3}:{4}:{5}".format(
		date.getFullYear(),
		_format2Digits(date.getMonth()+1),
		_format2Digits(date.getDate()),
		_format2Digits(date.getHours()),
		_format2Digits(date.getMinutes()),
		_format2Digits(date.getSeconds()),
		sep		);
	return iso;
};

function isInteger(data) {
    return (data === parseInt(data, 10));
};

function isNullOrEmpty(value) {
	return (value == null || value.length === 0);	// undefined == null also
};

var getCSS = function (prop, fromClass) {
    var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
    $("body").append($inspector); // add to DOM, in order to read the CSS property
    try {
        return $inspector.css(prop);
    } finally {
        $inspector.remove(); // and remove from DOM
    }
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
		function _set(key, item) {
			if (key==undefined)
				return null;
			
			localStorage.setItem( key, JSON.stringify(item) );
			return item;
		};
		
		function _get(key) {
			if (key==undefined)
				return null;
			var json = localStorage.getItem( key );
			return json != undefined ? JSON.parse(json) : null;
		};
		
		function _clear(key) {
			if (key==undefined)
				return null;
			localStorage.removeItem(key);
		};
		
		function _setSettings(key, val) {
			var settings = _get("ALTUI_Settings");
			if (settings==null) {
				settings = {};
			}
			settings[key] = val;
			return _set("ALTUI_Settings",settings);
		};
		
		function _getSettings(key) {
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

var Favorites = ( function (undefined) {
	var _favorites = $.extend( {'device':{}, 'scene':{} }, MyLocalStorage.getSettings("Favorites") );
	MyLocalStorage.setSettings("Favorites",_favorites);
	
	function _set(type, id, bFavorite) {
		_favorites[type][id]=bFavorite;
		MyLocalStorage.setSettings("Favorites",_favorites);
	};		
	function _get(type, id) {
		return _favorites[type][id] || false;
	};
	
	function _save() {
		MyLocalStorage.setSettings("Favorites",_favorites);
	};
	
	return {
		set: _set,
		get: _get,
		save: _save
	}
})( );

var EventBus = ( function (undefined) {
	var _subscriptions = {
		"on_ui_deviceStatusChanged" : [],	// table of { func, object }
		// "on_ui_userDataFirstLoaded" : [],
		"on_ui_userDataLoaded" : [],
		"on_ui_initFinished": [],
	};
	function _registerEventHandler(eventname, object, funcname ) {
		if (_subscriptions[eventname] == undefined)
			_subscriptions[eventname] = [];
		var bFound = false;
		$.each(_subscriptions[eventname], function (idx,sub) {
			if ((sub.object==object) && (sub.funcname==funcname)) {
				bFound = true;
				return false;
			}
		});
		if (bFound==false)
			_subscriptions[eventname].push( {object: object , funcname: funcname} );
	};
	function _publishEvent(eventname/*, args */) {
		if (_subscriptions[eventname]) {
			var theArgs = [].slice.call(arguments, 1);	// remove first argument
			$.each(_subscriptions[eventname], function (idx,sub) {
				var func = sub.object[sub.funcname];
				func.apply( sub.object , theArgs );
			});
		}
	};
	return {
		registerEventHandler : _registerEventHandler,	//(eventname, object, funcname ) 
		publishEvent : _publishEvent,	//(eventname, args)
		getEventSupported : function() {
			return Object.keys(_subscriptions);
		},
	}
})();
// function myFunc(device) {
	// console.log("Device {0} state changed".format(device.id));
// }
//on_ui_initFinished
// EventBus.registerEventHandler("on_ui_deviceStatusChanged",window,"myFunc");
	
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

//http://www.kunalbabre.com/projects/table2CSV.php
jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        $(el).filter(':visible').find('th').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    $(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
		if ($.isFunction(options.delivery)) {
			(options.delivery)(mydata);
		}
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with â€œ
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "â€œ");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';
        return '"' + output + '"';
    }
    function popup(data) {
		
		// $("<textarea id='altui-divtemp'></textarea>").appendTo("body");
		// $("textarea#altui-divtemp").focus();
		// $("textarea#altui-divtemp").text(data)
		// $("textarea#altui-divtemp").select();
		// document.execCommand('copy');
		// $("textarea#altui-divtemp").remove();
		// alert(_T("Data copied in clipboard"));

        var generator = window.open('', 'csv', 'height=400,width=600');
        generator.document.write('<html><head><title>CSV</title>');
        generator.document.write('</head><body >');
        generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
        generator.document.write(data);
        generator.document.write('</textArea>');
        generator.document.write('</body></html>');
        generator.document.close();
        return true;
    }
};
