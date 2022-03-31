/* eslint-env es2016, browser */
'use strict';

import { iter, map, fold } from './stdlib.js';
iter([], i => console.log(i));
map([], i => '<' + i + '>');
fold([], 0, (a, i) => a + i);

import {
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
	prepend,
	prev,
	ready,
	set,
	style,
	trigger,
	unset,
} from './browser.js';
ready(() => {
	let e = h('a');
	const X = H('span');
	style(e, { 'background-color': 'black' });
	let t = X.span('This is text.');
	append(e, t);
	prepend(e, t);
	set(e, { x: 'x' });
	let x = get(e, 'x');
	unset(e, 'x');
	next(x);
	prev(x);
	empty(e);
	parent(e);
	append(find('body'), e);
	on(e, 'click', () => 0);
	trigger(find('body'), 'x');
	all(e, 'K');
	forall(e, 'r', () => 0);
	forever(e, 'r', () => 0);
	fetch('data:,0');
	post('data:,0', {});
});

import './vp-editeur.js';
import './vp-fast.js';
import './vp-forms.js';
