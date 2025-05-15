# Browser Library

Convenience aliases and functions to minimize the boilerplate of using the DOM API.

Typical usage would be to import as `$` and to create an `H` for the HTML tags the current module would be using:

```js
import * as $ from 'vpweb/browser';
const H = $.H('input', 'label', 'div', 'span');
```

<!-- BEGIN DOC-COMMENT H2 js/browser.js -->
<!-- AUTOMATICALLY GENERATED, DO NOT EDIT -->
## `const get`

Alias of `HTMLElement.prototype.getAttribute()`

## `const next`

Alias of `Node.nextElementSibling`

## `const parent`

Alias of `Node.parentElement`

## `const prev`

Alias of `Node.previousElementSibling`

## `const set`

Set multiple element attributes at once.  Wraps `HTMLElement.setAttribute()`.

**Parameters:**

* `el` — `HTMLElement` — Element
* `attrs` — `Object` — All attributes to set

## `const style`

Set multiple style properties at once. Wraps `CSSStyleDeclaration.setProperty()`.

**Parameters:**

* `el` — `HTMLElement` — Element
* `attrs` — `Object` — All attributes to set

## `const add_class`

Add one or more classes to an element.
**Parameters:**

* `el` — `HTMLElement` — Element to modify
* `classes` — `...string` — One or more class names to add

## `const del_class`

Remove one or more classes from an element.
**Parameters:**

* `el` — `HTMLElement` — Element to modify
* `classes` — `...string` — One or more class names to remove

## `const has_class`

Check if an element has a class.
**Parameters:**

* `el` — `HTMLElement` — Element to check
* `cls` — `string` — Class name to check for

**Returns:** `boolean` — True if element has the class

## `const swap_class`

Replace a class in an element.
**Parameters:**

* `el` — `HTMLElement` — Element to modify
* `oldCls` — `string` — Class name to replace
* `newCls` — `string` — New class name

## `const toggle_class`

Toggle a class in an element.
**Parameters:**

* `el` — `HTMLElement` — Element to modify
* `cls` — `string` — Class name to toggle
* `[force]` — `boolean` — Optional force parameter

**Returns:** `boolean` — Whether class is now present

## `const text`

Create text node

**Parameters:**

* `str` — `string` — String

**Returns:** `Text` — Text node

## `const unset`

Alias of `HTMLElement.removeAttribute()`

## `function empty(node)`

Remove all children of a node.

**Parameters:**

* `node` — `Node` — Node

## `function precede(orig, add)`

Insert node(s) before another.  Node arrays may contain sub-arrays which will be crawled recursively.

**Parameters:**

* `orig` — `Node` — Original
* `add` — `Node|Node[]|NodeList|HTMLCollection` — New node(s) to insert

## `function append(parent, add)`

Append node(s) after another.  Node arrays may contain sub-arrays which will be crawled recursively.

**Parameters:**

* `parent` — `Node` — Parent
* `add` — `Node|Node[]|NodeList|HTMLCollection` — Node(s) to insert

## `function replace(parent, add)`

Remove all children of a node and append others into it.  Shortcut to `empty()` and `append()`.

**Parameters:**

* `parent` — `Node` — Parent
* `add` — `Node|Node[]|NodeList|HTMLCollection` — Node(s) to insert

## `function prepend(parent, cl)`

Prepend node(s) before another.  Node arrays may contain sub-arrays which will be crawled recursively.

**Parameters:**

* `parent` — `Node` — Parent
* `add` — `Node|Node[]|NodeList|HTMLCollection` — Node(s) to insert

## `function h()`

Create an element.  Note that while `attrs` is fully optional, `children` must be specified in order to specify `shadow`.

**Parameters:**

* `tag` — `string` — Tag name (i.e. "div")
* `[attrs]` — `Object` — Attributes to set (uses `set()`)
* `[children]` — `string|Node|Node[]|NodeList|HTMLCollection` — Children to add
* `[shadow]` — `string|Node|Node[]|NodeList|HTMLCollection` — Children to add as a shadow DOM

**Returns:** `HTMLElement` — Element

## `function H()`

Create a module of element creators.  For example:

`const H = Browser.H('div','span');`

...would return an object with `div()` and `span()` being aliases to `h()` with the first argument curried to their tag name.  Creating an empty element then becomes i.e. `H.div()`.

**Parameters:**

* `tag` — `...string` — Tag names

**Returns:** `Object` — Module

## `function find(node, sel)`

Wrapper for `querySelector()` which makes the subject optional.

**Parameters:**

* `[node]` — `Node` — Node (default: `document`)
* `sel` — `string` — Selector

**Returns:** `HTMLElement|null` — Result

## `function all(n, sel)`

Wrapper for `querySelectorAll()` which makes the subject optional.

**Parameters:**

* `[node]` — `Node` — Node (default: `document`)
* `sel` — `string` — Selector

**Returns:** `NodeList` — Results (static)

## `function forall(base, sel, f)`

Iterate over all matching elements.

**Parameters:**

* `[base]` — `Node` — Node (default: `document`)
* `sel` — `string` — Selector
* `f` — `function(HTMLElement):void` — Operation to perform

## `function on(node, name, f, opts, vpo)`

Add event listener.  Note that even though `opts` is optional, it must be specified in order to specify `vpo`.  Valid `vpo` parameters are:

  - **mute**: ms to wait until we can be triggered again (debouncer)
  - **prevent**: set true to `preventDefault()` automatically
  - **stop**: set true to `stopPropagation()` automatically
  - **stopi**: set true to `stopImmediatePropagation()` automatically

**Parameters:**

* `[node]` — `Node` — Node (default: `document`)
* `name` — `string|string[]` — Name(s) of the event(s)
* `f` — `function(event):void` — Operation to perform
* `[opts]` — `Object` — Options to pass to `addEventListener()`
* `[vpo]` — `Object` — Additional options

## `function trigger(el, n, detail)`

Trigger an event using `dispatchEvent(customEvent())`.

**Parameters:**

* `[el]` — `HTMLElement` — Element (default: `document`)
* `name` — `string` — Event name
* `[detail]` — `*` — Details to pass to `CustomEvent()`

## `function ready(f)`

Delay execution until document is loaded, or now if it already is.

**Parameters:**

* `f` — `function():void` — Task to perform exactly once

## `function forever(base, sel, f)`

Iterate over all matching elements now and in the future as they appear in the DOM.  Similar to `forall()` but adds a mutation observer.

**Parameters:**

* `[base]` — `Node` — Base (default: `document`)
* `sel` — `string` — Selector
* `f` — `function(el):void` — Operation to perform

**Returns:** `MutationObserver` — The observer which you may cancel later

## `function ajax(method, url, body, ctype, rtype, args, ok, err)`

Perform async HTTP request.  Valid `args` parameters are:

  - **headers**: Object with additional HTTP headers to send
  - **username**: HTTP Auth username
  - **password**: HTTP Auth password

**Parameters:**

* `method` — `string` — HTTP method (usually "GET" or "POST")
* `url` — `string` — URL
* `[body]` — `string|Object` — Content
* `[ctype]` — `string` — Content-Type of `body`
* `[rtype]` — `string` — Type expected in response ("text", "json", "document")
* `[args]` — `Object` — Additional options
* `[ok]` — `function(XMLHttpRequest):void` — Callback on success
* `[err]` — `function(XMLHttpRequest):void` — Callback on failure

## `function fetch(url, rtype, args, ok, err)`

Simple async HTTP "GET" request.  Wraps `ajax()`.

**Parameters:**

* `url` — `string` — URL
* `[rtype]` — `string` — Type expected in response ("text", "json", "document")
* `[args]` — `Object` — Additional options (see `ajax()`)
* `[ok]` — `function(XMLHttpRequest):void` — Callback on success
* `[err]` — `function(XMLHttpRequest):void` — Callback on failure

## `function post(url, body, rtype, args, ok, err)`

Simple async HTTP "POST" request.  Wraps `ajax()`.

If `body` is present and an `Object`, it will be serialized as JSON, the content type will be set accordingly and the response type will default to "json" instead of "text".

**Parameters:**

* `url` — `string` — URL
* `body` — `string|Object` — Content
* `[rtype]` — `string` — Type expected in response ("text", "json", "document")
* `[args]` — `Object` — Additional options (see `ajax()`)
* `[ok]` — `function(XMLHttpRequest):void` — Callback on success
* `[err]` — `function(XMLHttpRequest):void` — Callback on failure

## `function jsonscript(el, args, ok, err)`

Load a JSON resource asynchronously.  If the script has an `src` attribute, the URL is loaded and the result parsed as JSON.  Otherwise, the content of the script block is parsed as JSON.

**Parameters:**

* `el` — `HTMLElement` — Script
* `[args]` — `Object` — Additional options (see `ajax()`)
* `[ok]` — `function(Object):void` — Callback on success
* `[err]` — `function(XMLHttpRequest):void` — Callback on failure

<!-- END DOC-COMMENT -->

