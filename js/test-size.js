/* eslint-env browser */
'use strict';

import { iter, map, fold } from './stdlib.js';
iter([], i => console.log(i));
map([], i => '<' + i + '>');
fold([], 0, (a, i) => a + i);

import {
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
} from './browser.js';
ready(() => {
	var e = h('a');
	style(e, { 'background-color': 'black' });
	var t = h('span', null, 'This is text.');
	append(e, t);
	prepend(e, t);
	set(e, 'x', 'x');
	var x = get(e, 'x');
	var f = fragment();
	unset(e, 'x');
	next(x);
	prev(x);
	empty(e);
	parent(e);
	set_attr({}, {});
	append(find('body'), e);
	on(e, 'click', () => 0);
	trigger(find('body'), 'x');
	once(e, 'e', () => 0);
	closest(e, 'J');
	all(e, 'K');
	forall(e, 'r', () => 0);
	forever(e, 'r', () => 0);
	fetch('data:,0');
	post('data:,0', {});
});

import * as Promeneur from './promeneur.js';
Promeneur.all();

import * as Editeur from './editeur.js';
Editeur.init();
