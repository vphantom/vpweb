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

### Growing/shrinking inputs

Activated with `<input class="vp-growing">` or `forms.auto_width(element)`

Inputs with this class will shrink to `3em`.  As characters are added/removed, their width adapts.

### Growing/shrinking textareas

Activated with `<textarea class="vp-growing">` or `forms.auto_height(element)`

Textareas with this class will expand vertically as new lines are added, but will not shrink to less than their original height.

### Field validity

Adds/removes the `.has-invalid` class to `.vp-field` or `label` immediate parents of `<input>`, `<select>` and `<textarea>` elements based on their changing validity state.

### Email validation

Activated with `<input type="email">` or `forms.email_pattern(element)`

Validates email addresses using a simple regex pattern to at least forbid whitespace and require some characters, `@`, some characters, at least one `.` and at least two characters after the last `.`.

### Ghost fields

Activated with attribute `vp-name` or `forms.ghost(element)`

Valid for `<input>`, `<select>` and `<textarea>` elements, creates an actual `name` attribute from `vp-name` when the value is changed.  Thus, using `vp-name` instead of `name` has the effect of only including modified fields in form submissions, keeping request sizes down.

<!-- BEGIN DOC-COMMENT H2 js/forms.js -->
<!-- AUTOMATICALLY GENERATED, DO NOT EDIT -->
## `function enhance(form)`

Take over a form for either XHR loading or JSON submission

**Parameters:**

* `form` — `HTMLFormElement` — The form to take over

## `function email_pattern(input)`

Add a pattern attribute to validate email addresses Only sets the pattern if one is not already defined

**Parameters:**

* `input` — `HTMLInputElement` — The input to validate

## `function ghost(input, name)`

Manually make a field be included form data only once it will be modified.

**Parameters:**

* `input` — `HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement` — Field
* `[name]` — `string` — Name to use (overrides `vp-name`)

## `function auto_width(input)`

Make an input grow and shrink with its contents.

**Parameters:**

* `input` — `HTMLInputElement` — The input to grow

## `function auto_height(textarea)`

Make a textarea grow and shrink with its contents.

**Parameters:**

* `textarea` — `HTMLTextAreaElement` — The textarea to grow

## `function update_validity(input)`

Update field validity hints.

If the field has a parent label or .vp-field, it gets .invalid when its child field is invalid.

Fields themselves get .touched after an initial interaction.

**Parameters:**

* `input` — `HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement` — Form field

## `function delegate_dropdown_clicks(dropdown)`

Delegate .vp-field clicks to its inner dropdown element.

Support as of 2025 is spotty, so consider this a graceful improvement only.

**Parameters:**

* `dropdown` — `HTMLElement` — The select or input[list] element

<!-- END DOC-COMMENT -->
