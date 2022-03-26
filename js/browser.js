/* eslint-env browser */
'use strict';

import { iter } from './stdlib.js';

var np = Node.prototype;
var dp = Document.prototype;
var ep = Element.prototype;
var alias = f => Function.prototype.call.bind(f);

if (!ep.matches) {
	ep.matches =
		ep.matchesSelector || ep.msMatchesSelector || ep.webkitMatchesSelector;
}

var append = alias(np.appendChild);
var set_a = alias(ep.setAttribute);
var set_attr = (n, a) => iter(Object.keys(a), k => set_a(n, k, a[k]));

// Main element creation function
function $(tag, attrs, content) {
	let el = document.createElement(tag);

	if (attrs !== undefined) set_attr(el, attrs);
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

$.root = document.documentElement;
// np.textContent
// ??.innerHTML

$.parent = n => n.parentElement;
$.prev = n => n.previousElementSibling;
$.next = n => n.nextElementSibling;
$.fragment = alias(dp.createDocumentFragment);
$.set = set_a;
$.get = alias(ep.getAttribute);
$.unset = alias(ep.removeAttribute);
$.append = append;

// One-liners
//

$.prepend = (p, c) =>
	p.firstChild ? p.insertBefore(c, p.firstChild) : p.appendChild(c);
$.empty = n => iter(n.children, c => n.removeChild(c));
$.set_attr = set_attr;
$.style = (e, o) => iter(Object.keys(o), k => e.style.setProperty(k, o[k]));

// TODO: show()/hide()/toggle() ?

// Larger and basics declared individually to allow them to be optimized away.
//

var on = alias(ep.addEventListener);

var trigger = (e, n, d) => e.dispatchEvent(new CustomEvent(n, { detail: d }));

function ready(f) {
	document.readyState === 'loading'
		? on(document, 'DOMContentLoaded', f)
		: f();
}

// NOTE: addEventListener() "once" only in Edge 16+
function once(n, e, f) {
	function handler(ev) {
		f(ev);
		n.removeEventListener(e, handler);
	}
	on(n, e, handler);
}

function parse_selector(sel) {
	return sel.match(/^([#.]?)([^\s,:.]+)([\s,:.])?.*$/);
}

function $all(base, sel, as) {
	as = as || parse_selector(sel);
	if (!as[3]) {
		if (as[1] === '#') return [base.getElementById(as[2])];
		if (as[1] === '.') return base.getElementsByClassName(as[2]);
		return base.getElementsByTagName(as[2]);
	} else {
		return base.querySelectorAll(sel);
	}
}

// NOTE: useless array wrapping for ById, tolerable
var $find = (base, sel) => {
	let res = $all(base, sel);
	return res[0];
};

function el_matcher(as) {
	let f = el => el.matches(as[0]);
	if (!as[3]) {
		if (as[1] === '#') f = el => el.id === as[2];
		else if (as[1] === '.') f = el => el.classList.contains(as[2]);
		else f = el => el.tagName.toUpperCase() === as[2].toUpperCase();
	}
	return f;
}

function $upfind(el, sel) {
	let check = el_matcher(parse_selector(sel));
	while (el && el.parentNode && !check(el)) el = el.parentNode;
	// NOTE: this checks the final node twice
	return el && check(el) ? el : null;
}

function $forall(base, sel, f) {
	let as = parse_selector(sel);

	iter($all(base, sel, as), f);

	let check = el_matcher(as);
	let mo = new MutationObserver(mutations => {
		iter(mutations, m => {
			iter(m.addedNodes, n => {
				if (n.nodeType === Node.ELEMENT_NODE) {
					if (check(n)) return f(n);
					iter($all(n, sel, as), f);
				}
			});
		});
	});
	mo.observe($.root, { childList: true, subtree: true });
	return mo;
}

// NOTE: Fetch API only in Edge 14+
//
// If body is an object, it is serialized to JSON and the content type is set
// accordingly.
//
// Response type must be unset or one of "document", "json", "text".  Data is
// returned to ok() outside of XHR because IE/Edge < 79 don't support
// responseType "json".
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

function xget(url, res_type, args) {
	ajax('GET', url, null, null, res_type, args);
}

function xpost(url, body, res_type, args) {
	let ctype = 'application/x-www-form-urlencoded; charset=UTF-8';
	if (typeof body === 'object') {
		ctype = 'application/json';
		body = JSON.stringify(body);
	}
	ajax('POST', url, body, ctype, res_type, args);
}

export {
	$,
	on,
	trigger,
	ready,
	once,
	$find,
	$upfind,
	$all,
	$forall,
	xget,
	xpost,
};
