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
function H(tag, attrs, content) {
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

// Property aliases
H.root = document.documentElement;
// np.textContent
// ??.innerHTML

// Function aliases
H.parent = n => n.parentElement;
H.prev = n => n.previousElementSibling;
H.next = n => n.nextElementSibling;
H.fragment = alias(dp.createDocumentFragment);
H.set = set_a;
H.get = alias(ep.getAttribute);
H.unset = alias(ep.removeAttribute);
H.prepend = alias(np.prependChild);
H.append = append;

// One-liner functions
H.empty = n => iter(n.children, c => n.removeChild(c));
H.set_attr = set_attr;
H.style = (e, o) => iter(Object.keys(o), k => e.style.setProperty(k, o[k]));

// TODO: show()/hide()/toggle() ?

// Larger and basics declared individually to allow them to be optimized away.
//

var on = alias(ep.addEventListener);

var trigger = (e, n, d) => e.dispatchEvent(new CustomEvent(n, { detail: d }));

function ready(f) {
	document.readyState === 'loading'
		? H.on(document, 'DOMContentLoaded', f)
		: f();
}

// NOTE: addEventListener() "once" only in Edge 16+
function once(n, e, f) {
	function handler(ev) {
		f(ev);
		n.removeEventListener(e, handler);
	}
	H.on(n, e, handler);
}

function parse_selector(sel) {
	return sel.match(/^([#.]?)([^\s,:.]+)([\s,:.])?.*$/g);
}

function find(base, sel, as) {
	as = as || parse_selector(sel);
	if (!as[3]) {
		if (as[1] === '#') return base.getElementById(as[2]);
		if (as[1] === '.') return base.getElementsByClassName(as[2]);
		return base.getElementsByTagName(as[2]);
	} else {
		return document.querySelectorAll(sel);
	}
}

function forall(base, sel, f) {
	let as = parse_selector(sel);

	iter(find(base, sel, as), f);

	let check = el => el.matches(sel);
	if (!as[3]) {
		if (as[1] === '#') check = el => el.id === as[2];
		else if (as[1] === '.') check = el => el.classList.contains(as[2]);
		else check = el => el.tagName.toUpperCase === as[2].toUpperCase;
	}
	let mo = new MutationObserver(mutations => {
		iter(mutations, m => {
			iter(m.addedNodes, n => {
				if (n.nodeType === Node.ELEMENT_NODE) {
					if (check(n)) return f(n);
					iter(find(n, sel, as), f);
				}
			});
		});
	});
	mo.observe(H.root, { childList: true, subtree: true });
	return mo;
}

// NOTE: Fetch API only in Edge 14+

export { H, on, trigger, ready, once, find, forall };
