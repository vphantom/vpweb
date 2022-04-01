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
const get = alias(ep.getAttribute);
const next = n => n.nextElementSibling;
const parent = n => n.parentElement;
const prev = n => n.previousElementSibling;
const set = (n, a) => iter(Object.keys(a), k => n.setAttribute(k, a[k]));
const style = (e, o) => iter(Object.keys(o), k => e.style.setProperty(k, o[k]));
const text = t => document.createTextNode(String(t));
const unset = alias(ep.removeAttribute);

function empty(n) {
	while (n.firstChild) n.removeChild(n.firstChild);
}

function flatlist(l, acc) {
	acc = acc || [];
	const is_iter = i =>
		Array.isArray(i) ||
		i instanceof NodeList ||
		i instanceof HTMLCollection;
	iter(is_iter(l) ? l : [l], i => {
		if (is_iter(i)) return flatlist(i, acc);
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

function replace(parent, cl) {
	empty(parent);
	append(parent, cl);
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
	append(el.attachShadow({ mode: 'closed' }), arg);
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

// Our options in the second object:
// mute: ms to wait until we can be triggered again (default: 100)
// prevent: set true to preventDefault on all triggers
// stop: set true to stopPropagation on all triggers
// stopi: set true to stopImmediatePropagation on all triggers
function on(n, t, f, o, vpo) {
	if (typeof n === 'string') return on(document, n, t, f, o);
	vpo = vpo || {};
	let timeout = null;
	function handler(ev) {
		if (vpo.prevent) ev.preventDefault();
		if (vpo.stop) ev.stopPropagation();
		if (vpo.stopi) ev.stopImmediatePropagation();
		let newtimeout = setTimeout(() => (timeout = null), vpo.mute || 100);
		if (timeout) {
			clearTimeout(timeout);
			timeout = newtimeout;
			return;
		}
		timeout = newtimeout;
		f(ev);
	}
	return n.addEventListener(t, handler, o);
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
//
function ajax(method, url, body, ctype, res_type, args, ok, err) {
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
				if (ok) ok(req);
			} else {
				if (err) err(req);
			}
		}
	};
}

function fetch(url, res_type, args, ok, err) {
	ajax('GET', url, null, null, res_type, args, ok, err);
}

// ok(json)
// err(xhr)
function jsonscript(el, args, ok, err) {
	if (el.src) fetch(el.src, 'json', null, xhr => ok(xhr.response), err);
	else ok(JSON.parse(el.textContent));
}

function post(url, body, res_type, args, ok, err) {
	let ctype = 'application/x-www-form-urlencoded; charset=UTF-8';
	if (typeof body === 'object') {
		ctype = 'application/json';
		res_type = res_type || 'json';
		body = JSON.stringify(body);
	}
	ajax('POST', url, body, ctype, res_type, args, ok, err);
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
	text,
	trigger,
	unset,
};
