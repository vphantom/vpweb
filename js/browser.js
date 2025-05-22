/* eslint-env es2016, browser */
'use strict';

import {
	alias,
	shifter,
	iter,
	iter_f,
	iter_obj,
	isPlainObject,
} from './stdlib.js';

const ep = Element.prototype;

if (!ep.matches) {
	ep.matches =
		ep.matchesSelector || ep.msMatchesSelector || ep.webkitMatchesSelector;
}

// np.textContent
// ??.innerHTML
// show()/hide()/toggle() ?

/**
 * Alias of `HTMLElement.prototype.getAttribute()`
 */
const get = alias(ep.getAttribute);

/**
 * Alias of `Node.nextElementSibling`
 */
const next = (n) => n.nextElementSibling;

/**
 * Alias of `Node.parentElement`
 */
const parent = (n) => n.parentElement;

/**
 * Alias of `Node.previousElementSibling`
 */
const prev = (n) => n.previousElementSibling;

/**
 * Set multiple element attributes at once.  Wraps
 * `HTMLElement.setAttribute()`.
 *
 * @param {HTMLElement} el    Element
 * @param {Object}      attrs All attributes to set
 */
const set = (n, a) => iter_obj(a, (k, v) => n.setAttribute(k, v));

/**
 * Set multiple style properties at once. Wraps
 * `CSSStyleDeclaration.setProperty()`.
 *
 * @param {HTMLElement} el    Element
 * @param {Object}      attrs All attributes to set
 */
const style = (e, o) => iter_obj(o, (k, v) => e.style.setProperty(k, v));

/**
 * Add one or more classes to an element.
 * @param {HTMLElement} el - Element to modify
 * @param {...string} classes - One or more class names to add
 */
const add_class = (el, ...classes) => el.classList.add(...classes);

/**
 * Remove one or more classes from an element.
 * @param {HTMLElement} el - Element to modify
 * @param {...string} classes - One or more class names to remove
 */
const del_class = (el, ...classes) => el.classList.remove(...classes);

/**
 * Check if an element has a class.
 * @param {HTMLElement} el - Element to check
 * @param {string} cls - Class name to check for
 * @returns {boolean} True if element has the class
 */
const has_class = (el, cls) => el.classList.contains(cls);

/**
 * Replace a class in an element.
 * @param {HTMLElement} el - Element to modify
 * @param {string} oldCls - Class name to replace
 * @param {string} newCls - New class name
 */
const swap_class = (el, oldCls, newCls) => el.classList.replace(oldCls, newCls);

/**
 * Toggle a class in an element.
 * @param {HTMLElement} el - Element to modify
 * @param {string} cls - Class name to toggle
 * @param {boolean} [force] - Optional force parameter
 * @returns {boolean} Whether class is now present
 */
const toggle_class = (el, cls, force) => el.classList.toggle(cls, force);

/**
 * Create text node
 *
 * @param {string} str String
 *
 * @return {Text} Text node
 */
const text = (t) => document.createTextNode(String(t));

/**
 * Alias of `HTMLElement.removeAttribute()`
 */
const unset = alias(ep.removeAttribute);

/**
 * Remove all children of a node.
 *
 * @param {Node} node Node
 */
function empty(node) {
	while (node.firstChild) node.removeChild(node.firstChild);
}

function flatlist(l, acc) {
	acc = acc || [];
	const is_iter = (i) =>
		Array.isArray(i) ||
		i instanceof NodeList ||
		i instanceof HTMLCollection;
	iter(is_iter(l) ? l : [l], (i) => {
		if (is_iter(i)) return flatlist(i, acc);
		acc.push(typeof i === 'object' ? i : text(i));
	});
	return acc;
}

/**
 * Insert node(s) before another.  Node arrays may contain sub-arrays which will
 * be crawled recursively.
 *
 * @param {Node} orig Original
 * @param {Node|Node[]|NodeList|HTMLCollection} add New node(s) to insert
 */
function precede(orig, add) {
	iter(flatlist(add), (n) => orig.parentElement.insertBefore(n, orig));
}

/**
 * Append node(s) after another.  Node arrays may contain sub-arrays which will
 * be crawled recursively.
 *
 * @param {Node} parent Parent
 * @param {Node|Node[]|NodeList|HTMLCollection} add Node(s) to insert
 */
function append(parent, add) {
	parent.append.apply(parent, flatlist(add));
}

/**
 * Remove all children of a node and append others into it.  Shortcut to
 * `empty()` and `append()`.
 *
 * @param {Node} parent Parent
 * @param {Node|Node[]|NodeList|HTMLCollection} add Node(s) to insert
 */
function replace(parent, add) {
	empty(parent);
	append(parent, add);
}

/**
 * Prepend node(s) before another.  Node arrays may contain sub-arrays which
 * will be crawled recursively.
 *
 * @param {Node} parent Parent
 * @param {Node|Node[]|NodeList|HTMLCollection} add Node(s) to insert
 */
function prepend(parent, cl) {
	parent.prepend.apply(parent, flatlist(cl));
}

// h(tag, [attrs], [content, [shadow]])

/**
 * Create an element.  Note that while `attrs` is fully optional, `children`
 * must be specified in order to specify `shadow`.
 *
 * @param {string} tag Tag name (i.e. "div")
 * @param {Object} [attrs] Attributes to set (uses `set()`)
 * @param {string|Node|Node[]|NodeList|HTMLCollection} [children] Children to add
 * @param {string|Node|Node[]|NodeList|HTMLCollection} [shadow] Children to add as a shadow DOM
 *
 * @return {HTMLElement} Element
 */
function h() {
	const shift = shifter(arguments);
	const el = document.createElement(shift());
	let arg;
	if (!(arg = shift())) return el;
	if (isPlainObject(arg)) {
		set(el, arg);
		if (!(arg = shift())) return el;
	}
	append(el, arg);
	if (!(arg = shift())) return el;
	append(el.attachShadow({ mode: 'open' }), arg);
	return el;
}

// Create an object with specified shortcuts to h()

/**
 * Create a module of element creators.  For example:
 *
 * `const H = Browser.H('div','span');`
 *
 * ...would return an object with `div()` and `span()` being aliases to `h()`
 * with the first argument curried to their tag name.  Creating an empty element
 * then becomes i.e. `H.div()`.
 *
 * @param {...string} tag Tag names
 *
 * @return {Object} Module
 */
function H() {
	const dict = {};
	iter(arguments, (tag) => (dict[tag] = h.bind(null, tag)));
	return dict;
}

/**
 * Wrapper for `querySelector()` which makes the subject optional.
 *
 * @param {Node}   [node] Node (default: `document`)
 * @param {string} sel    Selector
 *
 * @return {HTMLElement|null} Result
 */
function find(node, sel) {
	if (typeof node === 'string') return find(document, node);
	return node.querySelector(sel);
}

/**
 * Wrapper for `querySelectorAll()` which makes the subject optional.
 *
 * @param {Node}   [node] Node (default: `document`)
 * @param {string} sel    Selector
 *
 * @return {NodeList} Results (static)
 */
function all(n, sel) {
	if (typeof n === 'string') return all(document, n);
	return n.querySelectorAll(sel);
}

/**
 * Iterate over all matching elements.
 *
 * @param {Node}   [base] Node (default: `document`)
 * @param {string} sel    Selector
 * @param {function(HTMLElement):void} f Operation to perform
 */
function forall(base, sel, f) {
	if (typeof base === 'string') return forall(document, base, sel);
	iter(all(base, sel), f);
}

/**
 * Add event listener.  Note that even though `opts` is optional, it must be
 * specified in order to specify `vpo`.  Valid `vpo` parameters are:
 *
 *   - **mute**: ms to wait until we can be triggered again (debouncer)
 *   - **prevent**: set true to `preventDefault()` automatically
 *   - **stop**: set true to `stopPropagation()` automatically
 *   - **stopi**: set true to `stopImmediatePropagation()` automatically
 *
 * @param {Node}                 [node]   Node (default: `document`)
 * @param {string|string[]}      name     Name(s) of the event(s)
 * @param {function(event):void} f        Operation to perform
 * @param {Object}               [opts]   Options to pass to `addEventListener()`
 * @param {Object}               [vpo] Additional options
 */
function on(node, name, f, opts, vpo) {
	if (typeof node === 'string' || Array.isArray(node))
		return on(document, node, name, f, opts);
	vpo = vpo || {};
	let timeout = null;
	function handler(ev) {
		if (vpo.prevent) ev.preventDefault();
		if (vpo.stop) ev.stopPropagation();
		if (vpo.stopi) ev.stopImmediatePropagation();
		if (vpo.mute) {
			let newtimeout = setTimeout(() => (timeout = null), vpo.mute);
			if (timeout) {
				clearTimeout(timeout);
				timeout = newtimeout;
				return;
			}
			timeout = newtimeout;
		}
		f(ev);
	}
	iter(Array.isArray(name) ? name : [name], (tt) =>
		node.addEventListener(tt, handler, opts)
	);
}

/**
 * Trigger an event using `dispatchEvent(customEvent())`.
 *
 * @param {HTMLElement} [el]     Element (default: `document`)
 * @param {string}      name     Event name
 * @param {*}           [detail] Details to pass to `CustomEvent()`
 */
function trigger(el, n, detail) {
	if (typeof el === 'string') return trigger(document, el, n);
	return el.dispatchEvent(new CustomEvent(n, { detail: detail }));
}

/**
 * Delay execution until document is loaded, or now if it already is.
 *
 * @param {function():void} f Task to perform exactly once
 */
function ready(f) {
	document.readyState === 'loading'
		? on(document, 'DOMContentLoaded', f)
		: f();
}

/**
 * Iterate over all matching elements now and in the future as they appear in
 * the DOM.  Similar to `forall()` but adds a mutation observer.
 *
 * @param {Node}              [base] Base (default: `document`)
 * @param {string}            sel    Selector
 * @param {function(el):void} f      Operation to perform
 *
 * @return {MutationObserver} The observer which you may cancel later
 */
function forever(base, sel, f) {
	if (typeof base === 'string') return forever(document, base, sel);

	iter(all(base, sel), f);

	const mo = new MutationObserver(
		iter_f((m) => {
			iter(m.addedNodes, (n) => {
				if (n.nodeType === Node.ELEMENT_NODE && n.matches(sel)) f(n);
			});
		})
	);
	mo.observe(base, { childList: true, subtree: true });
	return mo;
}

/**
 * Perform async HTTP request.  Valid `args` parameters are:
 *
 *   - **headers**: Object with additional HTTP headers to send
 *   - **username**: HTTP Auth username
 *   - **password**: HTTP Auth password
 *
 * @param {string} method  HTTP method (usually "GET" or "POST")
 * @param {string} url     URL
 * @param {string|Object} [body] Content
 * @param {string} [ctype] Content-Type of `body`
 * @param {string} [rtype] Type expected in response ("text", "json", "document")
 * @param {Object} [args]  Additional options
 * @param {function(XMLHttpRequest):void} [ok]  Callback on success
 * @param {function(XMLHttpRequest):void} [err] Callback on failure
 */
function ajax(method, url, body, ctype, rtype, args, ok, err) {
	const req = new XMLHttpRequest();
	args = args || {};
	const h = args.headers || {};
	let done = false;
	h['X-Requested-With'] = 'XMLHttpRequest';
	if (ctype) h['Content-Type'] = ctype;
	req.open(method, url, true, args.username || null, args.password || null);
	if (rtype) req.responseType = rtype;
	iter_obj(h, (k, v) => req.setRequestHeader(k, v));
	req.send(body);

	req.onreadystatechange = function () {
		if (req.readyState === 4 && !done) {
			// NOTE: Some browsers fire twice
			done = true;
			if (req.status >= 200 && req.status < 300) {
				if (ok) ok(req);
			} else {
				if (err) err(req);
			}
		}
	};
}

/**
 * Simple async HTTP "GET" request.  Wraps `ajax()`.
 *
 * @param {string} url     URL
 * @param {string} [rtype] Type expected in response ("text", "json", "document")
 * @param {Object} [args]  Additional options (see `ajax()`)
 * @param {function(XMLHttpRequest):void} [ok]  Callback on success
 * @param {function(XMLHttpRequest):void} [err] Callback on failure
 */
function fetch(url, rtype, args, ok, err) {
	ajax('GET', url, null, null, rtype, args, ok, err);
}

/**
 * Simple async HTTP "POST" request.  Wraps `ajax()`.
 *
 * If `body` is present and an `Object`, it will be serialized as JSON, the
 * content type will be set accordingly and the response type will default to
 * "json" instead of "text".
 *
 * @param {string} url URL
 * @param {string|Object} body Content
 * @param {string} [rtype] Type expected in response ("text", "json", "document")
 * @param {Object} [args]  Additional options (see `ajax()`)
 * @param {function(XMLHttpRequest):void} [ok]  Callback on success
 * @param {function(XMLHttpRequest):void} [err] Callback on failure
 */
function post(url, body, rtype, args, ok, err) {
	let ctype = 'application/x-www-form-urlencoded; charset=UTF-8';
	if (typeof body === 'object') {
		ctype = 'application/json';
		rtype = rtype || 'json';
		body = JSON.stringify(body);
	}
	ajax('POST', url, body, ctype, rtype, args, ok, err);
}

/**
 * Load a JSON resource asynchronously.  If the script has an `src` attribute,
 * the URL is loaded and the result parsed as JSON.  Otherwise, the content of
 * the script block is parsed as JSON.
 *
 * @param {HTMLElement} el     Script
 * @param {Object}      [args] Additional options (see `ajax()`)
 * @param {function(Object):void} [ok] Callback on success
 * @param {function(XMLHttpRequest):void} [err] Callback on failure
 */
function jsonscript(el, args, ok, err) {
	if (el.src) fetch(el.src, 'json', args, (xhr) => ok(xhr.response), err);
	else ok(JSON.parse(el.textContent));
}

export {
	H,
	add_class,
	all,
	append,
	del_class,
	empty,
	fetch,
	find,
	forall,
	forever,
	get,
	h,
	has_class,
	jsonscript,
	next,
	on,
	parent,
	post,
	precede,
	prepend,
	prev,
	ready,
	replace,
	set,
	style,
	swap_class,
	text,
	toggle_class,
	trigger,
	unset,
};
