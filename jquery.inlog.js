;(function() {
	var defaults = {
		enabled: true,
		thisValue: false
	};

	var settings = jQuery.extend({}, defaults);

	/*
	 * Allows for controlling from outside.
	 */
	jQuery.inlog = function(param) {
		//Is param a boolean?
		if(param === true || param === false) {
			settings.enabled = param;
		}
		//Must be an object
		else {
			settings = jQuery.extend({}, defaults, param);
		}
	};

	/**
	 * Outputs a function call with all parameters passed.
	 *
	 * @param funcName A human readable name of the function called
	 * @param origArguments The original "arguments" property inside the function
	 * @param origReturn The original return value of the function
	 * @param origThis The original context the function was running in
	 * @returns undefined
	 * */
	function logFunctionCall(funcName, origArguments, origReturn, origThis) {
		var params = [], paramFormatStrings = [], formatString = '';

		for(var i = 0; i < origArguments.length; i++) {
			params.push(origArguments[i]);
			paramFormatStrings.push('%o');
		}

		//Print this-value?
		if(settings.thisValue) {
			formatString = '(%o).';
			params.unshift(origThis);
		}

		//First argument of console.log is the format string.
		params.unshift(formatString + funcName + '(' + paramFormatStrings.join(', ') + ') ↷ %o');

		//Last format string value is the return value
		params.push(origReturn);

		console.log.apply(null, params);
	};


	/**
	 * Creates a Function which calls the "originalFunction"
	 * and logs the call with the function as called "name".
	 *
	 * @param funcName The name of the original function. Human readable.
	 * @param origFunction A reference to the original function getting wrapped.
	 * @returns A function, which calls the original function sourended by log calls.
	 * */
	function createReplacementFunction(funcName, origFunction) {
		return function() {
			//Call the original function
			var ret = origFunction.apply(this, arguments);

			//Log the shit out of it
			if(settings.enabled === true) {
				logFunctionCall(funcName, arguments, ret, this);
			}

			//Return the original return value as if nothing happened
			return ret;
		};
	};


	/*
	 * Injection for the core jQuery function.
	 * Needs some special treatment.
	 */
	(function() {
		//Keep track of the original function
		var tmp = jQuery;

		//Overwrite that thing
		jQuery = createReplacementFunction('jQuery', tmp);

		tmp.extend(jQuery, tmp);
		$ = jQuery;
	})();


	/*
	 * Generic injections for most functions.
	 */
	(function() {
		//List of functions which will get code injected
		var names = [
			'add', 'andSelf', 'children', 'closest', 'contents',
			'end', 'eq', 'filter', 'find', 'first', 'has', 'is',
			'last', 'next', 'nextAll', 'nextUntil', 'not', 'offsetParent',
			'parent', 'parents', 'parentsUntil', 'prev', 'prevAll',
			'prevUntil', 'siblings', 'slice',

			'animate', 'clearQueue', 'delay', 'dequeue', 'fadeIn',
			'fadeOut', 'fadeTo', 'fadeToggle', 'hide', 'queue', 'show',
			'slideDown', 'slideToggle', 'slideUp', 'stop', 'toggle'];


		//Iterate over all functions and overwrite them
		for(var i = 0, tmp; i < names.length; i++) {
			//Keep track of the original function
			var tmp = jQuery.fn[names[i]];

			//Overwrite that thing
			jQuery.fn[names[i]] = createReplacementFunction(names[i], tmp);
		}
	})();
})();
