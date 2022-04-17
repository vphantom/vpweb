# Forms

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

Activated with `<form method="vp-json">` or `forms.json(formElement)`

Names with `[]` suffix have that suffix stripped and are accumulated as arrays.  Without the suffix, only one value for each name is stored.

Inside the form, elements with attribute `vp-widget` and properties `vpName` and `vpValue` are treated as inputs.  If `vpValue` is a function, it is called and its result stored.  Since we're serializing to JSON, objects and arrays are allowed in addition to scalars.

### Response Display

Activated with `<form vp-target="selector">`

Available only with JSON forms above, if this selector is specified and found, its content will be replaced with the POST's response.  With invalid selector or without `vp-target` at all, the whole page's body will be replaced.  If the result is `<html>`, only the contents of its `<body>` will be used.

### Inline inputs

Activated with `<input vp-expanding>` or `forms.expanding(element)`

Inputs of type `email`, `number`, `password`, `search`, `text` and `url` with this attribute shrink to a small minimum size (about 16px for regular fields and 32px for number fields).  As text is added/removed, their width is adjusted interactively.

### Ghost fields

Activated with attribute `vp-name` or `forms.ghost(element)`

Valid for `<input>`, `<select>` and `<textarea>` elements, creates an actual `name` attribute from `vp-name` when the value is changed.  Thus, using `vp-name` instead of `name` has the effect of only including modified fields in form submissions.

<!-- BEGIN DOC-COMMENT H2 js/forms.js -->

## `function json(form)`

Take over a form for JSON out, HTML in.

**Parameters:**

* `form` — `HTMLFormElement` — The form to take over

## `function expanding(input)`

Manually make auto-expanding inputs.  Types `email`, `number`, `password`, `search`, `text`, `url` are supported.

**Parameters:**

* `input` — `HTMLInputElement` — The input to squeeze

## `function ghost(input, name)`

Manually make a field be included form data only once it will be modified.

**Parameters:**

* `input` — `HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement` — Field
* `[name]` — `string` — Name to use (overrides `vp-name`)

<!-- END DOC-COMMENT -->

