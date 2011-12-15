jQuery inlog
======

See what your jQuery code does inside like a boss.
jQuery inlog is a passive plugin, which injects (js ftw!) console.log calls inside your jQuery core.
It makes debugging of selectors and chains a breeze.

The original idea was taken from https://github.com/fmsf/jQueryLog

Only tested in Firefox with Firebug. Nuff for me.


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
jQuery("#foo") ↷ [div#foo]
parents(".bar") ↷ [div.bar, div.bar]
next() ↷ [div#bacon]
prev() ↷ [div.bar]
parent() ↷ [body]
find(".foo:last") ↷ []
```

or with this-value enabled

```
(Window index.html).jQuery("#foo") ↷ [div#foo]
([div#foo]).parents(".bar") ↷ [div.bar, div.bar]
([div.bar, div.bar]).next() ↷ [div#bacon]
([div#bacon]).prev() ↷ [div.bar]
([div.bar]).parent() ↷ [body]
([body]).find(".foo:last") ↷ []
```

Your can inspect return values, the this-value and even all parameters! WOOOOT!


TODO
========

* Not all functions are included (right now only http://api.jquery.com/category/traversing/)
	* Should be easy for most cases
* Special treatment for:
	* ~~jQuery() function~~
	* each
	* map
	* find more functions in need of special treatments
* Do the same for Sizzle (jQuery.find)
	* Add an option to enable Sizzle debugging
* Output nested calls nested with console.group(), e.g.: fadeOut() calls animate() which calls queue()
	* Right now, the output for nested calls is in "wrong" order (inner most first)

