jQuery inlog
======

See what your jQuery code does inside.
jQuery inlog is a passive plugin, which injects (js ftw!) console.log calls inside your jQuery core.
It makes debugging of selectors and chains a breeze.

The original idea was taken from https://github.com/fmsf/jQueryLog

Only tested in Firefox with Firebug. Nuff for me.


Example
========

```javascript
$obj.find('#foo').nextUntil('#bar');
```

Would output something like the following

```
find("#foo") ↷ +[div#foo]
is("#bar") ↷ true
nextUntil("#bar") ↷ +[]
```

Your can inspect return values, the this-value and even all parameters!


TODO
========

Special treatment for:

* ~~jQuery() function~~
* each
* map


Output nested calls nested with console.group()

e.g.:fadeOut() calls animate() which calls queue()

