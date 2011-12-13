;(function() {
	/**
	 * Outputs a function call with all parameters passed.
	 * Parameters are inspectable if objects. Or linked if DOM elements.
	 * @param name The name of the function called
	 * @param arguments The original "arguments" property inside the function
	 * */
	function logFunctionCall(name, arguments) {
		var params = [], paramFormatStrings = [];

		for(var i = 0; i < arguments.length; i++) {
			params.push(arguments[i]);
			paramFormatStrings.push('%o');
		}

		//First argument of console.log is the format string.
		params.unshift(name + '(' + paramFormatStrings.join(', ') + ')');

		console.log.apply(null, params);
	};

	//List of functions which will get code injected
	var names = [
		'add', 'andSelf', 'children', 'closest', 'contents',
		'end', 'eq', 'filter', 'find', 'first', 'has', 'is',
		'last', 'next', 'nextAll', 'nextUntil', 'not', 'offsetParent',
		'parent', 'parents', 'parentsUntil', 'prev', 'prevAll',
		'prevUntil', 'siblings', 'slice'];

	//Iterate over all functions and overwrite them
	for(var i = 0, tmp; i < names.length; i++) {

		//Create a new scope to conserve variables until the function is called
		(function(name) {
			//Keep track of the original function
			var tmp = jQuery.fn[name];

			//Overwrite that thing
			jQuery.fn[name] = function() {
				//Call the original function
				var ret = tmp.apply(this, arguments);

				//Log the shit out of it
				logFunctionCall(name, arguments);
				console.log(ret);

				//Return the original return value as if nothing happened
				return ret;
			};
		})(names[i]);
	}
})();
