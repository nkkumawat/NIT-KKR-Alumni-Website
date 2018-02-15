jQuery.AjaxCFC = function( s ) {

	// polimorphic invocation
	if (s.require) { // if including files
		jQuery.AjaxCFCHelper.require( s.require );
		return;
	} // if (s.require)

	s = jQuery.extend({ // default attributes
		type: "POST",
		data: null,
		method: null,
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		unnamedargs: false,
		serialization: jQuery.AjaxCFCHelper.getSerialization(),
		useDefaultErrorHandler: jQuery.AjaxCFCHelper.getUseDefaultErrorHandler(),
		blockUI: jQuery.AjaxCFCHelper.getBlockUI(),
		blockMessage: null
	}, s); // s = jQuery.extend
	
	// this is not working yet, when the extension is included from here it doesnt find jQuery
	if (s.blockUI && typeof jQuery().blockUI == "undefined") {
		jQuery.AjaxCFCHelper.require('blockUI');
		return;
	} // if (s.blockUI && typeof jQuery().blockUI == "undefined") {

	var data = s.data;
	s.data = {};
	s.data['engine'] = "jquery";
	s.data['serialization'] = s.serialization;
	s.data['c0-id'] = (Math.floor(Math.random() * 10001) + "_" + new Date().getTime()).toString(),
	s.data['method'] = "__initialize_AjaxCFC";
	s.data['c0-methodName'] = s.method;
	s.data['c0-serialization0'] = "string";
	s.data['c0-param0'] = data;
	
	var ____success = s.success;
	s.success = function(data) {
		data = jQuery.AjaxCFCHelper.trim(data);
		if (data.substring(0,9) == '__json__:') {
			data = eval('(' + data.slice(9) + ')');
		} else if (data.substring(0,7) == '__js__:') {
			data = eval( data.slice(7) );
		} else if (data.substring(0,9) == '__wddx__:') {
			var oWddx = new WddxDeserializer();
			data = oWddx.deserialize(data.slice(9));
		} // if (data.substring(0,9) == '__json__:'
		____success(data);
	}; // s.success = function
	
	if (s.useDefaultErrorHandler) {
		s.error = function(xml) {
			var displayError = confirm('A critical error has occurred. Press OK to view it or Cancel to discard it');
			if (displayError) {
				var win = window.open(null, null, 'status=0,toolbar=0,location=0,menubar=0,directories=0,resizable=1,scrollbars=1,height=600,width=750');
				win.document.write(xml.responseText);
			} // if (displayError) {
		} // s.error = function(xml) {
	} // if (s.criticalerror) {
	
	if (jQuery.AjaxCFCHelper.getDebug())
		log.info('invoking method: ' + s.method)

	if ( data ) { // encode data
		if (s.processData && s.unnamedargs && typeof data == 'object' && data instanceof Array) { // if an array was sent as unnamed arguments -- mostly for back compatibility
			for (var i = 0; i < data.length; i++) { // loop over unnamed arguments
				if (typeof data == 'string') { // choose whether to serialize or not
					s.data['c0-serialization' + i.toString()] = "string";
					s.data['c0-param' + i.toString()] = data[i];
				} else {
					s.data['c0-serialization' + i.toString()] = s.serialization.toLowerCase();
					s.data['c0-param' + i.toString()] = jQuery.AjaxCFCHelper.serialize(data[i], s.serialization);
				} // if (typeof data == 'string')

				if (jQuery.AjaxCFCHelper.getDebug())
					log.info('unnamed argument '+  i.toString() + ': ' + s.data['c0-param' + i.toString()])

			} // for (var i = 0; i < data.length - 1; i++)
		} else { // any other case serialize
			if (s.processData && typeof data != 'string') {
				data = jQuery.AjaxCFCHelper.serialize(data, s.serialization);
				s.data['c0-serialization0'] = s.serialization.toLowerCase();
				s.data['c0-param0'] = data;
			} // s.processData && typeof data != 'string')

			if (jQuery.AjaxCFCHelper.getDebug())
				log.info('data: ' + data)

		} // if (typeof data == 'object' && data instanceof Array)
	

	} // if ( data )
	
	if (s.blockUI) {
		jQuery().blockUI(s.blockMessage);
	    // global hook - unblock UI when ajax request completes
	    jQuery().ajaxComplete(function() {
	        jQuery().unblockUI();
	    });					
	}

	
	jQuery.ajax( s );	
}

jQuery.AjaxCFCHelper = {
	__debug: false,
	__blockUI: false,
	__useDefaultErrorHandler: true,
	__serialization: 'json',
	
	include: function (script_filename) {
	    document.write('<' + 'script');
	    document.write(' language="javascript"');
	    document.write(' type="text/javascript"');
	    document.write(' src="' + script_filename + '">');
	    document.write('</' + 'script' + '>');
	}, // include: function
	
	findPath: function () {
		var path;
		jQuery('script', document).each(function() {
			if (this.src.match(/jquery\.AjaxCFC\.js(\?.*)?$/)) {
				path = this.src.replace(/jquery\.AjaxCFC\.js(\?.*)?$/,'');
			} // if (this.src.match
		}); // jQuery('script', document).each
		return path;
	}, // findPath: function
	
	require: function (files) {
		var filesArray = files.split(',');
		var JSpath = this.findPath();
		for (var i = 0; i < filesArray.length; i++) {
			switch (filesArray[i]) {
				case 'DWRSyntax':
					this.include(JSpath + 'jquery.AjaxCFC.DWRSyntaxCompatibility.js');
					break;
				case 'wddx':
					this.include(JSpath + 'wddx.js');
					this.include(JSpath + 'wddxDes.js');
					break;
				case 'log4j':
					this.include(JSpath + 'log4javascript.js');
					this.include(JSpath + 'log4javascriptSetup.js');
					break;
				case 'blockUI':
					this.include(JSpath + 'jquery.block.js');
					break;
				default:
					this.include(JSpath + filesArray[i] + '.js');
					break;
			}
		} // for (var i
	}, // require: function
	
	trim: function (str) {
	   return str.replace(/^\s*|\s*$/g,"");
	}, // trim: function 

	serialize: function (data, type) {

		if ( type.toLowerCase() == 'json' ) {
			return JSON.stringify(data);
		} else if ( type.toLowerCase() == 'wddx' ) {
			var oWddx = new WddxSerializer();
			return oWddx.serialize(data);
		} else {
			return data;
		} // if ( type.toLowerCase() == 'json' )
	}, // serialize: function
	
	setDebug: function ( v ) {
		this.__debug = v;
		if (v && typeof window.log == "undefined") this.require('log4j');
	}, // setDebug: function
	
	getDebug: function () {
		return this.__debug;
	}, // getDebug: function

	setBlockUI: function ( v ) {
		this.__blockUI = v;
		if (v && typeof jQuery().blockUI == "undefined") this.require('blockUI');
	}, // setBlockUI: function
	
	getBlockUI: function () {
		return this.__blockUI;
	}, // getBlockUI: function

	setUseDefaultErrorHandler: function ( v ) {
		this.__useDefaultErrorHandler = v;
	}, // setUseDefaultErrorHandler: function
	
	getUseDefaultErrorHandler: function () {
		return this.__useDefaultErrorHandler;
	}, // getUseDefaultErrorHandler: function

	setSerialization: function ( v ) {
		this.__serialization = v;
		if (v == 'json' && typeof window.JSON == "undefined") this.require('json');
		if (v == 'wddx' && typeof window.WddxSerializer == "undefined") this.require('wddx');
	}, // setUseDefaultErrorHandler: function
	
	getSerialization: function () {
		return this.__serialization;
	} // getUseDefaultErrorHandler: function
}
