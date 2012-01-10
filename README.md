jQuery inlog
======

See what your jQuery code does inside like a boss.
jQuery inlog is a passive plugin, which injects (js ftw!) console.log calls inside your jQuery core.
It makes debugging of selectors and chains a breeze.

I call it black-box magic. Or short: black magic. Or even shorter: js

The original idea was taken from https://github.com/fmsf/jQueryLog

Only tested in Firefox with Firebug. Who doesn't use those in dev env?


Example
========

Imagine the following markup

```html
<body>
	<div class="bar">
		<div class="bar">
			<div id="foo"></div>
		</div>
	</div>
	<div id="bacon"></div>
</body>
```

and the following jQuery calls

```javascript
$("#foo").parents(".bar").next().prev().parent().find(".foo:last").text("test");
```

will result in the following output with default settings

```
$("#foo") ↷ [div#foo]
parents(".bar") ↷ [div.bar, div.bar]
next() ↷ [div#bacon]
prev() ↷ [div.bar]
parent() ↷ [body]
fadeOut() ↷ [body]
```

or if you want to know what's really happening, set ```maxDepth: -1``` (last branch expanded exemplarily)

```
+ $("#foo") ↷ [div#foo]
+ parents(".bar") ↷ [div.bar, div.bar]
+ next() ↷ [div#bacon]
+ prev() ↷ [div.bar]
+ parent() ↷ [body]
- fadeOut() ↷ [body]
	- animate(Object { opacity="hide"}) ↷ [body]
		- queue("fx", g()) ↷ [body]
			- each(function()) ↷ [body]
				- is(":hidden") ↷ false
				- matchesSelector(<body style="opacity: 0.920047;">, ":hidden") ↷ false
					  isXML(<body style="opacity: 0.920047;">) ↷ false
					  isXML(Document index.html) ↷ false
					- filter(":hidden", [body]) ↷ []
						isXML(<body style="opacity: 0.920047;">) ↷ false
```

or even verbose with ```thisValue: true```

```
+ (Window index.html).$("#foo") ↷ [div#foo]
+ ([div#foo]).parents(".bar") ↷ [div.bar, div.bar]
+ ([div.bar, div.bar]).next() ↷ [div#bacon]
+ ([div#bacon]).prev() ↷ [div.bar]
+ ([div.bar]).parent() ↷ [body]
- ([body]).fadeOut() ↷ [body]
	- ([body]).animate(Object { opacity="hide"}) ↷ [body]
		- ([body]).queue("fx", g()) ↷ [body]
			- ([body]).each(function()) ↷ [body]
				- ([body]).is(":hidden") ↷ false
				- (function()).matchesSelector(<body style="opacity: 0.920047;">, ":hidden") ↷ false
					  (function()).isXML(<body style="opacity: 0.920047;">) ↷ false
					  (function()).isXML(Document index.html) ↷ false
					- (function()).filter(":hidden", [body]) ↷ []
						(function()).isXML(<body style="opacity: 0.920047;">) ↷ false
```

or if you're hardcore, you can set ```rawOutput: true``` to get the raw stackt race object created by the plugin

```
arguments
	[".bar"]

function
	"parents"

return
	[div.bar, div.bar]

sub
	[Object { function="matches", arguments=[2], sub=[2], more...}, Object { function="pushStack", this=[1], arguments=[3], more...}]

this
	[div#foo]
```


Documentation / Reference
========

Include jquery.inlog.js after jQuery core and enable it by calling $.inlog(true) or $.inlog(options).

Options:

```
var defaults = {
	enabled: false,//Enable logging
	thisValue: false,//Output this-value
	returnValue: true,//Output return-value
	indent: true,//Indent nested calls (makes sense for maxDepth !== 0)
	maxDepth: 0,//Max depth of nested calls
	rawOutput: false//If true, the raw stack trace objects will be printed (thisValue, returnValue and indent are all included for free)
};
```


TODO
========

* include/run the jQuery core tests to ensure that we don't cause any side effects
	* They basically succeed. But the test for noConflict fails,
		because it compares references and jQuery-inlog creates his own jQuery function.
* Special treatment (on request) for:
	* each
	* map
	* find more functions in need of special treatments

