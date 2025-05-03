# Forms

Various form-related behaviors.

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

* Submitting the form ignores subsequent submissions within the next second to help avoid double clicks a.k.a. "bounces".

### JSON Encoding

Activated with `<form method="json-post">` or `forms.json(formElement)`

Submit forms as a JSON POST. Form fields are converted to JSON with the following rules:

1. Basic fields are stored as single values:
```html
<input name="title" value="Hello">  <!-- {"title": "Hello"} -->
```

2. Multiple values for the same field name are automatically collected into arrays:
```html
<input name="colors" value="red">   <!-- {"colors": ["red", "blue"]} -->
<input name="colors" value="blue">
```

3. Arrays can be guaranteed by adding a `[]` suffix to the field name:
```html
<input name="colors[]" value="red">  <!-- {"colors": ["red"]} -->
```

4. `<select multiple>` fields are always treated as arrays:
```html
<select name="colors" multiple>  <!-- {"colors": ["red"]} -->
  <option>red</option>
</select>
```

Inside the form, elements with attribute `vp-widget` and properties `vpName` and `vpValue` are treated as inputs. If `vpValue` is a function, it is called and its result stored. Since we're serializing to JSON, objects and arrays are allowed in addition to scalars.

Note: Forms using `method="json-post"` will always be submitted via XHR and will update the page content. If no `vp-target` is specified, the entire `<body>` will be updated with the response.

### Response Display

Activated with `<form vp-target="selector">`

Replace part of the DOM with an HTML response. The form will be submitted as a background request. The response will be displayed in the specified selector, or if it is missing, in the `<body>` of the document. If the result is `<html>`, only the contents of its `<body>` will be used.

You can combine both features:
- `method="json-post"` without `vp-target`: Submits as JSON and updates the entire page
- `method="json-post" vp-target="selector"`: Submits as JSON and updates the specified element
- `vp-target="selector"` alone: Submits normally via XHR and updates the specified element

### Shrinking/expanding inputs

Activated with `<input vp-expanding>` or `forms.expanding(element)`

Inputs of type `email`, `number`, `password`, `search`, `text` and `url` with this attribute shrink to a small minimum size (about 16px for regular fields and 32px for number fields).  As text is added/removed, their width is adjusted interactively.

### Ghost fields

Activated with attribute `vp-name` or `forms.ghost(element)`

Valid for `<input>`, `<select>` and `<textarea>` elements, creates an actual `name` attribute from `vp-name` when the value is changed.  Thus, using `vp-name` instead of `name` has the effect of only including modified fields in form submissions, keeping request sizes down.

<!-- BEGIN DOC-COMMENT H2 js/forms.js -->

## `function enhance(form)`

Take over a form for either XHR loading or JSON submission

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
