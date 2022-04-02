/* eslint-env es2016, browser */
'use strict';

const logger = console.log;

import { iter, iter_f, iter_obj, map, fold } from './stdlib.js';
iter([], logger);
iter_f(logger);
iter_obj({}, logger);
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
	const X = H('b');
	style(e, { color: 'black' });
	let t = X.span('T');
	append(e, t);
	prepend(e, t);
	set(e, { x: 'x' });
	let x = get(e, 'x');
	unset(e, 'x');
	next(x);
	prev(x);
	empty(e);
	parent(e);
	append(find('b'), e);
	on(e, 'c', () => 0);
	trigger(find('b'), 'x');
	all(e, 'K');
	forall(e, 'r', () => 0);
	forever(e, 'r', () => 0);
	fetch('data:,0');
	post('data:,0', {});
});
