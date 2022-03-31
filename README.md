# Vanilla+

<!--
[![license](https://img.shields.io/github/license/vphantom/vpweb.svg?style=plastic)]()
[![GitHub release](https://img.shields.io/github/release/vphantom/vpweb.svg?style=plastic)]()
-->

Vanilla+ is a minimalistic web interface development library.  It adds no abstraction layers and thus allows you to use only the portions you need without bloat from the rest.  It is divided in 3 main parts:

* A basic CSS framework
* A JS library
* A collection of web components

The components make use of the library and aim to be otherwise stand-alone, triggered by CSS classes, custom HTML attributes and tags.  Whenever possible, they are meant to be progressive enhancements.


**CURRENTLY IN EARLY STAGE OF DEVELOPMENT!**

## CSS Framework

See documentation in `docs/css.html`.

## Library

The minimalistic library aims to make "Vanilla JS" development more expressive without masking the native objects or impeding run-time performance.  More specifically:

- 100% compatible with plain JS, every function is independently opt-in
- Compatibility down to Chrome/Edge/Opera 80, Safari 12, Firefox 78
- Abstract away boilerplate and alias frequently used long-named symbols
- Cooperate with tree-shaking bundlers
- Tiny: stay under 4KB minified non-compressed

Specifically avoided are:

- To alias or wrap the entire DOM API
- Developer comforts which would incur run-time overhead (i.e. a `$()`)

### Stdlib

Usage: `import { ... } from 'vpweb/stdlib';`

TODO: JSDoc

### Browser

Usage: `import { ... } from 'vpweb/browser';`

TODO: JSDoc

## All Components

If you want to use the whole thing in one line:

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vpweb';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vpweb.min.js"></script>
```

## Fast Clicks

Activate clicks on `mousedown` to save ~100ms in response times.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vp-fast';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vp-fast.min.js"></script>
```

* Anchors in a block with the `vp-fast` attribute or with the attribute directly are triggered on `mousedown` instead of the browser's `mouseup`.  Limited to anchors with `href` to avoid side effects from the `click` event triggering twice.

* Submit inputs/buttons with `vp-fast` attribute, or in forms with `vp-fast`, trigger on `mousedown`.  Limited to `[type=submit]` because of the double `click` triggering.

## Forms

Submit forms as a JSON POST and replace part of the DOM with the response.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vp-forms';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vp-forms.min.js"></script>
```

### JSON Encoding

Activated by `<form method="vp-json">`

Names with `[]` suffix have that suffix stripped and are accumulated as arrays.  Without the suffix, only one instance of each name is kept.

Elements with properties `vpName` and `vpValue` are treated as inputs and their children are not inspected.  If `vpValue` is a function, it is called to get the value.  Since we're serializing to JSON, objects and arrays are allowed in addition to scalars.

### Response Display

Available only with JSON forms above, if `<form vp-target="selector">` is specified and found, its content will be replaced with the POST's response.  If the result is `<html>`, only the contents of its `<body>` will be used.  With invalid selector or without `vp-target`, the current page's `<title>` and `<body>` will be replaced with the POST response's.

## Editeur

Viewer and optionally editor for arbitrary JSON blobs.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vp-editeur';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vp-editeur.min.js"></script>
```

Watches for `<script>` tags with `[type="application/json"]` and either `vp-view` or `vp-edit` attributes, to view or edit respectively.  Inserts a `<vp-editeur>` before each such script.

In editor mode, the `<vp-editeur>` has Promeneur-friendly properties `vpName` (the value of `vp-edit`) and `vpValue` (the data object).  The component uses a shadow DOM so its content do not affect forms directly.

TODO: optional schema for I18N labels, select choices, etc.

## DateRange

Upgrades a pair of date selection inputs into a date range widget, complete with shortcuts to change by various increments (i.e. weekly, monthly, quarterly).

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vp-daterange';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vp-daterange.min.js"></script>
```

Wrap any pair of `<input type="date">` inside a `<div _daterange="true">` or a `<date-range>` block.  Any other mark-up inside that block will be removed.  The first input will be used as the beginning date, and the second input as the end date.

The component monitors the DOM for changes and handles new blocks added dynamically to the page.  The input names are preserved, so the form data is unaffected.

## LICENSE AND COPYRIGHT

Copyright (c) 2019-2022 Stéphane Lavergne <https://github.com/vphantom>

Distributed under the MIT (X11) License:
http://www.opensource.org/licenses/mit-license.php

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

