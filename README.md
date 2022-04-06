# Vanilla+

**WARNING: PROOF OF CONCEPT ONLY!**  An eventual version 1.0 is expected by 2023.  This is a back-burner project for me as of 2022.

[![license](https://img.shields.io/github/license/vphantom/vpweb.svg?style=plastic)]()
[![GitHub release](https://img.shields.io/github/release/vphantom/vpweb.svg?style=plastic)]()

Vanilla+ is a minimalistic web interface development library.  It adds no abstraction layers and thus allows you to use only the portions you need without bloat from the rest.  It is divided in 3 main parts:

* A basic CSS library
* A JS library
* A collection of web components

The components make use of the JS library and aim to be otherwise stand-alone.  They don't even depend on the CSS library, which only serves to theme them.  When possible, components are meant to be progressive enhancements.

### Installation

```sh
npm install vpweb
```

## CSS Framework

See documentation in `docs/css.html`.

## JS Library

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

Activate clicks on `mousedown` to save at least ~100ms in response times.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/fast';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/fast.min.js"></script>
```

* Anchors in a block with the `vp-fast` attribute or with the attribute directly are triggered on `mousedown` instead of the browser's `mouseup`.  Limited to anchors with `href` to avoid side effects from the `click` event triggering twice.

* Submit inputs/buttons with `vp-fast` attribute, or in forms with `vp-fast`, trigger on `mousedown`.  Limited to `[type=submit]` because of the double `click` triggering.

## Forms

Submit forms as a JSON POST and replace part of the DOM with the HTML response.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/forms';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/forms.min.js"></script>
```

Notes:

* Submitting the form ignores subsequent submissions within the next second to help avoid double clicks a.k.a. "bounces" (from users and `vp-fast`).

* Currently ignores the `formaction` attribute on submit buttons.

### JSON Encoding

Activated by `<form method="vp-json">`

Names with `[]` suffix have that suffix stripped and are accumulated as arrays.  Without the suffix, only one value for each name is stored.

Inside the form, elements with attribute `vp-widget` and properties `vpName` and `vpValue` are treated as inputs.  If `vpValue` is a function, it is called and its result stored.  Since we're serializing to JSON, objects and arrays are allowed in addition to scalars.

### Response Display

Activated by `<form vp-target="selector">`

Available only with JSON forms above, if this selector is specified and found, its content will be replaced with the POST's response.  With invalid selector or without `vp-target` at all, the whole page's body will be replaced.  If the result is `<html>`, only the contents of its `<body>` will be used.

## Editeur

Viewer and optionally editor for arbitrary JSON blobs.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/editeur';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/editeur.min.js"></script>
```

Example usage:

```html
<form method="vp-json">
  <vp-editeur
    vp-schema="schema_name"
    vp-data="data_name"
    vp-name="form_field_name"
  ></vp-editeur>
  <script type="application/json" vp-editeur-schema="schema_name"></script>
  <script type="application/json" vp-editeur-data="data_name"></script>
</form>
```

The optional JSON scripts may be inline or referenced with `src`, in which case they will be loaded asynchronously.  Without `vp-name` is read-only mode, in which case `<form>` is not necessary.  At least one of `vp-schema` or `vp-data` must be specified in order to display anything.  Attributes:

* **`vp-schema`** Name of schema definition to apply (optional)
* **`vp-data`** Name of data content to use (optional)
* **`vp-name`** Name of form field to represent (optional)

In editor mode, the `<vp-editeur>` has Promeneur-friendly properties `vpName` and `vpValue`.  The component uses a shadow DOM so its content do not interfere with regular forms.

### Schema

Using a schema is useful to customize the display and to allow starting without data.  A schema is a JSON object with one key for each root-level key of the JSON data it overlays.  Each key is an object with the following possible keys, all optional:

* **`__schema`** For objects or lists of objects, schema of the contained object(s)
* **`sort`** Number or string to use as field sorting key. (default: scalars, then objects, then arrays)
* **`label`** Localized string, HTML allowed but not recommended (default: property key)
* **`tooltip`** Localized string, HTML not allowed (default: property key)
* **`combo`** Identifier of list to use as a `<datalist>` (see below)
* **`repeatable`** This key should be a list, not a scalar/object (default: `false`)
* **`type`** For scalars, one of: `boolean`, `number`, `string`, `textarea` (default: `string`)

At the root level only, an additional `__lists` key may be set with an object defining various lists.  Each item is a value followed by its localized label.

Example:

```json
{
  "__lists": {
    "list1": {
      "val1": "Label One",
      ...
    }
  },
  "key_one": {
    "label": "First Key",
    "tooltip": "This field contains something",
    "sort": 23,
    "combo": "list1"
  },
  ...
}
```

## ACKNOWLEDGEMENTS

Graph X Design Inc. https://www.gxd.ca/ sponsored this project.

## LICENSE AND COPYRIGHT

Copyright (c) 2019-2022 Stéphane Lavergne <https://github.com/vphantom>

Distributed under the MIT (X11) License:
http://www.opensource.org/licenses/mit-license.php

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

