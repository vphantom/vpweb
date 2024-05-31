# Vanilla+

[![license](https://img.shields.io/github/license/vphantom/vpweb.svg?style=plastic)]()
<!-- [![GitHub release](https://img.shields.io/github/release/vphantom/vpweb.svg?style=plastic)]() -->

Vanilla+ is a minimalistic web interface development library.  It adds no abstraction layers and thus allows you to use only the portions you need without bloat from the rest.  It is divided in 3 main parts:

* A basic CSS library
* A JS library
* A collection of web components

The components make use of the JS library and aim to be otherwise stand-alone.  They don't even depend on the CSS library, which only serves to theme them.  When possible, components are meant to be progressive enhancements.

### Status

**WORKING PROTOTYPE** "It works for me." The APIs may still change significantly, bugs and browser incompatibilities may still abound.

A stable version 1.0 is expected by the end of 2024.

See [TODO](TODO.md) for details of what's coming up.

### Installation

```sh
npm install vpweb
```

## CSS FRAMEWORK

Main objectives:

- Responsive, but with **desktop as a first-class citizen**
- Nearly pure CSS, using JS only where it helps significantly
- Usable as a package or as a set of SCSS include files
- Unique selectors to minimize conflicts with other frameworks
- Forego advanced concepts in favor of small size and high performance

Documentation: `docs/css.html`

## JS LIBRARY

**Docs:** [Stdlib](docs/stdlib.md) | [Browser](docs/browser.md)

The minimalistic library aims to make "Vanilla JS" development more expressive without masking the native objects or impeding run-time performance.  More specifically:

- 100% compatible with plain JS, every function is independently opt-in
- Compatibility down to Chrome/Edge/Opera 79, Safari 12, Firefox 78
- Abstract away boilerplate, alias frequently used long-named symbols
- Cooperate with tree-shaking bundlers
- Tiny: stay **under 4KB minified** (not compressed)

Specifically avoided are:

- To wrap native objects (i.e. `HTMLElement`)
- To alias or wrap the entire DOM API
- Other development comforts which would cost run-time overhead (i.e. a universal `$()`)

## COMPONENTS

**Docs:** [Editeur](docs/editeur.md) | [Fast Clicks](docs/fast.md) | [Forms](docs/forms.md)

If you want to use the whole thing in one line without need to activate manually on shadowed elements:

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vpweb';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vpweb.min.js"></script>
```

You may also use individual components, although if you use more than one as stand-alone scripts, there will be some redundancy.

Note that components triggered by attributes or class names cannot self-activate inside shadow DOMs.  If you want to use Vanilla+ components inside those, you'll need to activate them manually (for example, with `fast.preclick(element)`).  See each component's documentation for manual activation usage.


## ACKNOWLEDGEMENTS

Graph X Design Inc. https://www.gxd.ca/ sponsored this project.

## LICENSE AND COPYRIGHT

Copyright (c) 2019-2024 Stéphane Lavergne <https://github.com/vphantom>

Distributed under the MIT (X11) License:
http://www.opensource.org/licenses/mit-license.php

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

