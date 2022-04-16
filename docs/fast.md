# Fast Clicks

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

<!-- BEGIN DOC-COMMENT H2 js/fast.js -->

## `function preclick(el)`

Trigger clicks on mousedown events.  Click event is fired twice, so be careful when adding this behavior to new elements.

**Parameters:**

* `el` — `HTMLElement` — Element to monitor

<!-- END DOC-COMMENT -->

