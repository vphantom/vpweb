# Fast Clicks

Activate clicks on `mousedown` to save at least ~100ms in response times. This being a pointer trick, it does not apply to touch devices.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/fast';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/fast.min.js"></script>
```

* Any anchor (`<a>`) in a block with the `vp-fast` attribute or with the attribute directly will trigger early on `mousedown`.

* Any button or submit input element with `vp-fast` attribute, or in a form with `vp-fast`, will trigger early on `mousedown`.

<!-- BEGIN DOC-COMMENT H2 js/fast.js -->
<!-- AUTOMATICALLY GENERATED, DO NOT EDIT -->
## `function preclick(el)`

Manually make an element trigger clicks on mousedown events. Prevents double-firing by tracking mousedown state.

**Parameters:**

* `el` — `HTMLElement` — Element to monitor

<!-- END DOC-COMMENT -->
