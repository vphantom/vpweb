/* eslint-env browser */
'use strict';

import { iter, iter_f } from './stdlib.js';

var np = Node.prototype;
var ep = Element.prototype;
var alias = f => Function.prototype.call.bind(f);

if (!ep.matches) {
	ep.matches =
		ep.matchesSelector || ep.msMatchesSelector || ep.webkitMatchesSelector;
}

var append = alias(np.appendChild);
var set = alias(ep.setAttribute);
var set_attr = (n, a) => iter(Object.keys(a), k => set(n, k, a[k]));

// Main element creation function
function h(tag, attrs, content) {
	let el = document.createElement(tag);

	if (attrs) set_attr(el, attrs);
	if (content) {
		if (typeof content === 'object') {
			iter(content, c => append(el, c));
		} else {
			append(el, document.createTextNode(content));
		}
	}
	return el;
}

// Aliases
//

// np.textContent
// ??.innerHTML

var parent = n => n.parentElement;
var prev = n => n.previousElementSibling;
var next = n => n.nextElementSibling;
var get = alias(ep.getAttribute);
var unset = alias(ep.removeAttribute);

// One-liners
//

var fragment = () => document.createDocumentFragment();
var prepend = (p, c) =>
	p.firstChild ? p.insertBefore(c, p.firstChild) : p.appendChild(c);
var empty = n => iter(n.children, c => n.removeChild(c));
var style = (e, o) => iter(Object.keys(o), k => e.style.setProperty(k, o[k]));

// TODO: show()/hide()/toggle() ?

// Larger and basics declared individually to allow them to be optimized away.
//

function find(n, sel) {
	if (typeof n === 'string') return find(document, n);
	return n.querySelector(sel);
}

function all(n, sel) {
	if (typeof n === 'string') return all(document, n);
	return n.querySelectorAll(sel);
}

function on(n, t, f, o) {
	if (typeof n === 'string') return on(document, n, t, f);
	return n.addEventListener(t, f, o);
}

// NOTE: addEventListener() "once" only in Edge 16+
function once(n, e, f) {
	if (typeof n === 'string') return once(document, n, e);
	function handler(ev) {
		n.removeEventListener(e, handler);
		f(ev);
	}
	on(n, e, handler);
}

function trigger(e, n, d) {
	if (typeof e === 'string') return trigger(document, e, n);
	return e.dispatchEvent(new CustomEvent(n, { detail: d }));
}

function ready(f) {
	document.readyState === 'loading'
		? on(document, 'DOMContentLoaded', f)
		: f();
}

// NOTE: Element.closest() is only in Edge 15+
function closest(el, sel) {
	while (el && el.parentNode && !el.matches(sel)) el = el.parentNode;
	// NOTE: this checks the final node twice
	return el && el.nodeType === Node.ELEMENT_NODE && el.matches(sel)
		? el
		: null;
}

function forall(base, sel, f) {
	if (typeof base === 'string') return forall(document, base, sel);
	iter(all(base, sel), f);
}

function forever(base, sel, f) {
	if (typeof base === 'string') return forever(document, base, sel);

	iter(all(base, sel), f);

	let mo = new MutationObserver(
		iter_f(m => {
			iter(m.addedNodes, n => {
				if (n.nodeType === Node.ELEMENT_NODE && n.matches(sel)) f(n);
			});
		})
	);
	mo.observe(base, { childList: true, subtree: true });
	return mo;
}

// NOTE: Fetch API only in Edge 14+
//
// If body is an object, it is serialized to JSON and the content type is set
// accordingly.
//
// Response type must be unset or one of "document", "json", "text" (default).
// Data is returned to ok() outside of XHR because IE/Edge < 79 don't support
// responseType "json".  If body is present and an object, defaults to "json"
// instead of "text".
//
// Properties supported in the arguments object, all optional including the
// object itself:
// headers   Object with additional headers to add to request
// username  HTTP Auth username
// password  HTTP Auth password
// ok        function(XHR, data)
// error     function(XHR)
//
function ajax(method, url, body, ctype, res_type, args) {
	let req = new XMLHttpRequest();
	args = args || {};
	let h = args.headers || {};
	let done = false;
	h['X-Requested-With'] = 'XMLHttpRequest';
	if (ctype) h['Content-Type'] = ctype;
	req.open(method, url, true, args.username || null, args.password || null);
	if (res_type && res_type !== 'json') req.responseType = res_type;
	iter(Object.keys(h), k => req.setRequestHeader(k, h[k]));
	req.send(body);

	req.onreadystatechange = function() {
		if (req.readyState === 4 && !done) {
			// NOTE: Some browsers fire twice
			done = true;
			if (req.status >= 200 && req.status < 300) {
				if (args.ok) {
					let data;
					if (res_type === 'document') data = req.responseXML;
					else if (res_type === 'json')
						data = JSON.parse(req.responseText);
					else data = req.responseText;
					args.ok(req, data);
				}
			} else {
				if (args.error) args.error(req);
			}
		}
	};
}

function fetch(url, res_type, args) {
	ajax('GET', url, null, null, res_type, args);
}

function post(url, body, res_type, args) {
	let ctype = 'application/x-www-form-urlencoded; charset=UTF-8';
	if (typeof body === 'object') {
		ctype = 'application/json';
		res_type = res_type || 'json';
		body = JSON.stringify(body);
	}
	ajax('POST', url, body, ctype, res_type, args);
}

export {
	all,
	append,
	closest,
	empty,
	fetch,
	find,
	forall,
	forever,
	fragment,
	get,
	h,
	next,
	on,
	once,
	parent,
	post,
	prepend,
	prev,
	ready,
	set,
	set_attr,
	style,
	trigger,
	unset,
};
