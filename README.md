jQuery inlog
======

See what your jQuery code does inside.
jQuery inlog is a plugin, which injects (js ftw!) console.log calls inside your jQuery core.
It makes debugging of selectors and chains a breeze.

This is just the result of a one hour proof of concept hacking.

Example
========

``js
$elem.children('div').next('p');
``

Would output something like the following,
where each second line can be inspected in your browser console.

``
children(div)
[div#foo, div#bar]
next(p)
[p#bacon, p, p.wooooot, p.rockstar]
``
