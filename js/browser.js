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
	var el = document.createElement(tag);

	if (attrs !== undefined) {
		set_attr(el, attrs);
	}
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
H.on = alias(ep.addEventListener);
H.get_id = alias(dp.getElementById);
H.get_first = alias(dp.querySelector);
H.set = set_a;
H.get = alias(ep.getAttribute);
H.unset = alias(ep.removeAttribute);
H.all = alias(ep.querySelectorAll);
H.all_class = alias(ep.getElementsByClassName);
H.all_tag = alias(ep.getElementsByTagName);
H.prepend = alias(np.prependChild);
H.append = append;

// One-liner functions
H.empty = n => iter(n.children, c => n.removeChild(c));
H.set_attr = set_attr;
H.style = (e, o) => iter(Object.keys(o), k => e.style.setProperty(k, o[k]));
H.trigger = (e, n, d) => e.dispatchEvent(new CustomEvent(n, { detail: d }));

// Larger functions declared individually to allow them to be optimized away.
//

function ready(f) {
	document.readyState === 'loading'
		? H.on(document, 'DOMContentLoaded', f)
		: f();
}

// addEventListener() "once" only in Edge 16+
function once(n, e, f) {
	function handler(ev) {
		f(ev);
		n.removeEventListener(e, handler);
	}
	H.on(n, e, handler);
}

function watch_dom(f) {
	var mo = new MutationObserver(mutations => {
		iter(mutations, m => {
			iter(m.addedNodes, n => n.nodeType === Node.ELEMENT_NODE && f(n));
		});
	});
	mo.observe(H.root, {
		childList: true,
		subtree: true,
	});
	return mo;
}

function forall_class(cname, f) {
	iter(H.all_class(H.root, cname), f);
	return watch_dom(el => {
		if (el.classList.contains(cname)) {
			return f(el);
		}
		iter(H.all_class(el, cname), f);
	});
}

function forall_tag(tag, f) {
	iter(H.all_tag(H.root, tag), f);
	return watch_dom(el => {
		if (el.tagName === tag) {
			return f(el);
		}
		iter(H.all_tag(el, tag), f);
	});
}

// Caution: slower
function forall(sel, f) {
	iter(H.all(H.root, sel), f);
	return watch_dom(el => {
		if (el.matches(sel)) {
			return f(el);
		}
		iter(H.all(el, sel), f);
	});
}

export { H, ready, once, forall_class, forall_tag, forall };
