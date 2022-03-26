# Vanilla+

<!--
[![license](https://img.shields.io/github/license/vphantom/vpweb.svg?style=plastic)]()
[![GitHub release](https://img.shields.io/github/release/vphantom/vpweb.svg?style=plastic)]()
-->

Vanilla+ is a minimalistic web interface development library: a basic CSS framework, a JS library and some web components.  No abstraction layers and only use the portions need without bloat from the rest.

**CURRENTLY IN EARLY STAGE OF DEVELOPMENT!**

## CSS Framework

FIXME

## Library

The minimalistic library aims to make "Vanilla JS" development more expressive without masking the native objects or impeding run-time performance.  More specifically:

- 100% compatible with plain JS, every function is independently opt-in
- Compatibility down to Microsoft Edge 12 (as of 2022)
- Abstract away boilerplate and alias frequently used long-named symbols
- Cooperate with tree-shaking bundlers
- Tiny: stay under 4KB minified non-compressed

Specifically avoided are:

- To alias or wrap the entire DOM API
- Developer comforts which would incur run-time overhead (i.e. a `$()`)

### Stdlib

Usage: `import { ... } from 'vpweb/stdlib';`

### Browser

Usage: `import { ... } from 'vpweb/browser';`

## Components

The components make use of the library and aim to be otherwise stand-alone, triggered by CSS classes, custom HTML attributes and tags.  Whenever possible, they are meant to be progressive enhancements; for example `DateRange` upgrades a pair of standard date inputs which are fully functional if the component fails to load.

### Promeneur

I/O kernel for web sites.

ES5: `import * as Promeneur from 'vpweb/promeneur'; Promeneur.init();`

Self-contained script: `dist/promeneur.min.js`

* Similarly to [Instant Click](http://instantclick.io/), captures some events on links and buttons to load contents in the background, replacing the page upon receipt.  This tends to make pages more responsive.

* Adds new form method `json-post` to post a JSON representation of form data to the server.

* Adds new form method `callback` to pass the object representation of form data back to the form's `data-promeneur-callback` function instead of sending to a server.

* Adds `target` attribute to forms, which replace the selected DOM node's contents, instead of the whole page, with the response.

### DateRange

Upgrades a pair of date selection inputs into a date range widget, complete with shortcuts to change by various increments (i.e. weekly, monthly, quarterly).

Usage: `import * as Daterange from 'vpweb/daterange'; DateRange.init();`

Self-contained script: `dist/daterange.min.js`

Wrap any pair of `<input type="date">` inside a `<div _daterange="true">` or a `<date-range>` block.  Any other mark-up inside that block will be removed.  The first input will be used as the beginning date, and the second input as the end date.

The component monitors the DOM for changes and handles new blocks added dynamically to the page.  The input names are preserved, so the form data is unaffected.

## LICENSE AND COPYRIGHT

Copyright (c) 2019-2022 Stéphane Lavergne <https://github.com/vphantom>

Distributed under the MIT (X11) License:
http://www.opensource.org/licenses/mit-license.php

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

