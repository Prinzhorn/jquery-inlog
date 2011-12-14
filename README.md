jQuery inlog
======

See what your jQuery code does inside.
jQuery inlog is a plugin, which injects (js ftw!) console.log calls inside your jQuery core.
It makes debugging of selectors and chains a breeze.

This is just the result of a one hour proof of concept hacking.

The original idea was taken from https://github.com/fmsf/jQueryLog

Only tested in Firefox with Firebug. Works for me.


Example
========

```javascript
$obj.find('#foo').nextUntil('#bar');
```

Would output something like the following,
where each second line can be inspected in your browser console.

```
find("#foo")
+[div#foo]
is("#bar")
true
nextUntil("#bar")
+[]
```

TODO
========

Special treatment for:

~~jQuery() function~~

each

map

