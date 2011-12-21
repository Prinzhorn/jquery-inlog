;(function(undefined) {
	var defaults = {
		enabled: false,//Enable logging
		thisValue: false,//Output this-value
		returnValue: true,//Output return-value
		indent: true,//Indent nested calls
		maxDepth: -1//Max depth of nested calls
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


	/*
	 * Since nothing runs parallel,
	 * we can keep track of the stack trace in a global variable.
	 */
	var maintrace, subtrace, tracedepth = 0;

	//Example content of maintrace
	/*
	{
		"function": "jQuery",
		"this": "<some pointer>",
		"arguments": ["<some values or pointers>"],
		"return": "<some value or pointer>",
		"sub"://One or multiple function calls on the same depth
		[
			{
				"function": "parents",
				"this": "<some pointer>",
				"arguments": ["<some values or pointers>"],
				"return": "<some value or pointer>",
				"sub":
				[
					{
						"function": "pushStack",
						"this": "<some pointer>",
						"arguments": ["<some values or pointers>"],
						"return": "<some value or pointer>",
						"sub": []
					}
				]
			}
		]
	}
	*/


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
			//You may pass "undefined" explicitely to a function.
			//foo() ist something else than foo(undefined)
			if(origArguments[i] === undefined) {
				break;
			}

			params.push(origArguments[i]);
			paramFormatStrings.push('%o');
		}

		//Print this-value?
		if(settings.thisValue) {
			formatString = '(%o).';
			params.unshift(origThis);
		}

		//First argument of console.log is the format string.
		params.unshift(formatString + funcName + '(' + paramFormatStrings.join(', ') + ')');

		if(settings.returnValue) {
			params[0] += ' ↷ %o';

			params.push(origReturn);
		}

		console.log.apply(console, params);
	};


	function logTrace(trace) {
		logFunctionCall(trace["function"], trace["arguments"], trace["return"], trace["this"]);

		//Has sub calls?
		if(trace["sub"].length) {
			if(settings.indent) {
				console.groupCollapsed();
			}

			for(var i = 0; i < trace["sub"].length; i++) {
				logTrace(trace["sub"][i]);
			}

			if(settings.indent) {
				console.groupEnd();
			}
		}
	}


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
			//Boring. Scroll down for the fun part.
			if(settings.enabled === false) {
				return origFunction.apply(this, arguments);
			}

			//Create new trace and keep track of it
			var _trace = {
				"function": funcName,
				"this": this,
				"arguments": arguments,
				"sub": []
			};

			//Keep track of out parent trace, if any.
			var parenttrace;

			//Keep track if this was the first call
			var isFirst = (tracedepth === 0);

			tracedepth++;

			//Check if this is the first call or if already deeper
			if(isFirst) {
				//Set everything to the newly created trace
				maintrace = subtrace = _trace;
			} else {
				parenttrace = subtrace;

				//Push the new trace to the path of the parent trace
				subtrace["sub"].push(_trace);
				subtrace = _trace;
			}

			//Call the original function
			var ret = origFunction.apply(this, arguments);

			//Trace the return value (unknown before this point)
			_trace["return"] = ret;

			//Reset tracing if this function call was the top most
			if(isFirst) {
				tracedepth = 0;

				//Log the shit out of it
				logTrace(maintrace);
			} else {
				//Reset to parent trace,
				//because there may be calls on the same level as we are
				subtrace = parenttrace;
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
		var rx_ignore = /^constructor|jquery|init$/;

		//Iterate over all function and replace most of them
		for(var name in jQuery.fn) {
			if(jQuery.fn.hasOwnProperty(name) && jQuery.isFunction(jQuery.fn[name]) && !rx_ignore.test(name)) {
				//Keep track of the original function
				var tmp = jQuery.fn[name];

				//Overwrite that thing
				jQuery.fn[name] = createReplacementFunction(name, tmp);
			}
		}
	})();
})();
