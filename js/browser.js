/* eslint-env es2016, browser */
'use strict';

import { alias, shifter, iter, iter_f, isPlainObject } from './stdlib.js';

const ep = Element.prototype;

if (!ep.matches) {
	ep.matches =
		ep.matchesSelector || ep.msMatchesSelector || ep.webkitMatchesSelector;
}

// np.textContent
// ??.innerHTML
// show()/hide()/toggle() ?
const empty = n => iter(n.children, c => c.remove());
const get = alias(ep.getAttribute);
const next = n => n.nextElementSibling;
const parent = n => n.parentElement;
const prev = n => n.previousElementSibling;
const set = (n, a) => iter(Object.keys(a), k => n.setAttribute(k, a[k]));
const style = (e, o) => iter(Object.keys(o), k => e.style.setProperty(k, o[k]));
const text = t => document.createTextNode(String(t));
const unset = alias(ep.removeAttribute);

function flatlist(l, acc) {
	acc = acc || [];
	iter(Array.isArray(l) ? l : [l], i => {
		if (Array.isArray(i)) return flatlist(i, acc);
		acc.push(typeof i === 'object' ? i : text(i));
	});
	return acc;
}

function precede(o, nl) {
	iter(flatlist(nl), n => o.parentElement.insertBefore(n, o));
}

function append(parent, cl) {
	parent.append.apply(parent, flatlist(cl));
}

function prepend(parent, cl) {
	parent.prepend.apply(parent, flatlist(cl));
}

// h(tag, [attrs], [content, [shadow]])
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
function H() {
	const dict = {};
	iter(arguments, tag => (dict[tag] = h.bind(null, tag)));
	return dict;
}

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

function trigger(e, n, d) {
	if (typeof e === 'string') return trigger(document, e, n);
	return e.dispatchEvent(new CustomEvent(n, { detail: d }));
}

function ready(f) {
	document.readyState === 'loading'
		? on(document, 'DOMContentLoaded', f)
		: f();
}

function forall(base, sel, f) {
	if (typeof base === 'string') return forall(document, base, sel);
	iter(all(base, sel), f);
}

function forever(base, sel, f) {
	if (typeof base === 'string') return forever(document, base, sel);

	iter(all(base, sel), f);

	const mo = new MutationObserver(
		iter_f(m => {
			iter(m.addedNodes, n => {
				if (n.nodeType === Node.ELEMENT_NODE && n.matches(sel)) f(n);
			});
		})
	);
	mo.observe(base, { childList: true, subtree: true });
	return mo;
}

// If body is an object, it is serialized to JSON and the content type is set
// accordingly.
//
// If body is present and an object, response type defaults to "json" instead of
// "text".
//
// Properties supported in the arguments object, all optional including the
// object itself:
// headers   Object with additional headers to add to request
// username  HTTP Auth username
// password  HTTP Auth password
// ok        function(XHR)
// error     function(XHR)
//
function ajax(method, url, body, ctype, res_type, args) {
	const req = new XMLHttpRequest();
	args = args || {};
	const h = args.headers || {};
	let done = false;
	h['X-Requested-With'] = 'XMLHttpRequest';
	if (ctype) h['Content-Type'] = ctype;
	req.open(method, url, true, args.username || null, args.password || null);
	if (res_type) req.responseType = res_type;
	iter(Object.keys(h), k => req.setRequestHeader(k, h[k]));
	req.send(body);

	req.onreadystatechange = function() {
		if (req.readyState === 4 && !done) {
			// NOTE: Some browsers fire twice
			done = true;
			if (req.status >= 200 && req.status < 300) {
				if (args.ok) args.ok(req);
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
	H,
	all,
	append,
	empty,
	fetch,
	find,
	forall,
	forever,
	get,
	h,
	next,
	on,
	parent,
	post,
	precede,
	prepend,
	prev,
	ready,
	set,
	style,
	text,
	trigger,
	unset,
};
