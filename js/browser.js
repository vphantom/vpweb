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

var $find = alias(ep.querySelector);
var $all = alias(ep.querySelectorAll);

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
		n.removeEventListener(e, handler);
		f(ev);
	}
	on(n, e, handler);
}

// NOTE: Element.closest() is only in Edge 15+
function $closest(el, sel) {
	while (el && el.parentNode && !el.matches(sel)) el = el.parentNode;
	// NOTE: this checks the final node twice
	return el && el.matches(sel) ? el : null;
}

function $forall(base, sel, f) {
	iter($all(base, sel), f);

	let mo = new MutationObserver(mutations => {
		iter(mutations, m => {
			iter(m.addedNodes, n => {
				if (n.nodeType === Node.ELEMENT_NODE) {
					if (n.matches(sel)) return f(n);
					iter($all(n, sel), f);
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

function xget(url, res_type, args) {
	ajax('GET', url, null, null, res_type, args);
}

function xpost(url, body, res_type, args) {
	let ctype = 'application/x-www-form-urlencoded; charset=UTF-8';
	if (typeof body === 'object') {
		ctype = 'application/json';
		res_type = res_type || 'json';
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
	$closest,
	$all,
	$forall,
	xget,
	xpost,
};
