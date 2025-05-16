# Tabs

Tabs behavior.

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/tabs';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/tabs.min.js"></script>
```

### Usage

By default, tabs are activated for `.vp-tabbed` elements, but you can also
activate them manually:

```js
tabbed(el);
```

Regardless, the element must contain two children, each with a matching number of children themselves.  The first child is considered a list of tab handles and the second as tab panels.  Necessary ARIA attributes are added and managed automatically.  For instance, if you want to style the active handle or panel, both become `[aria-selected="true"]` when active.

If you want a specific tab to be active by default instead of the first one, add the `vp-current="n"` attribute to your wrapper element, where `n` is the index of the tab you want to be active starting from 0.

```html
<div class="vp-tabbed" vp-current="1">
	<div>
		<span>Tab 1 (inactive)</span>
		<span>Tab 2 (active)</span>
	</div>
	<div>
		<div>Panel 1 (hidden)</div>
		<div>Panel 2 (visible)</div>
	</div>
</div>
```

<!-- BEGIN DOC-COMMENT H2 js/tabs.js -->
<!-- AUTOMATICALLY GENERATED, DO NOT EDIT -->
## `function tabs(el)`

Manually make an element tabbable. Requires a tab list and matching tab panels inside.

**Parameters:**

* `el` — `HTMLElement` — Element to manage

<!-- END DOC-COMMENT -->
