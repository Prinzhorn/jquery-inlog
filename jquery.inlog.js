;(function() {
	//Three functions just for proof of concept
	for(var i = 0, tmp, names = ['children', 'siblings', 'next']; i < names.length; i++) {
		(function(name) {
			var tmp = jQuery.fn[name];

			jQuery.fn[name] = function() {
				var ret = tmp.apply(this, arguments);

				console.log(name + '(' + Array.prototype.join.call(arguments) + ')');
				console.log(ret);

				return ret;
			};
		})(names[i]);
	}
})();
