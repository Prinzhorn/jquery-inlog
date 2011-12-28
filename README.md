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

Would output something like the following

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

or with this-value enabled

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

You can not only inspect the multiple levels of nested function calls,
but also every single parameter!


TODO
========

* include/run the jQuery core tests to ensure that we don't cause any side effects
* ~~Not all functions are included (right now only http://api.jquery.com/category/traversing/)~~
* Special treatment for:
	* ~~jQuery() function~~
	* each
	* map
	* find more functions in need of special treatments
* ~~Do the same for Sizzle (jQuery.find)~~
	* Add an option to enable Sizzle debugging (really needed?)
* ~~Output nested calls nested with console.group(), e.g.: fadeOut() calls animate() which calls queue()~~
	* ~~Right now, the output for nested calls is in "wrong" order (inner most first)~~

