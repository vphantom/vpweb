# Editeur

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

This is a custom element and is thus available inside shadow DOMs.

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

<!-- BEGIN DOC-COMMENT H2 js/editeur.js -->
<!-- END DOC-COMMENT -->

