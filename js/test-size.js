/* eslint-env browser */
'use strict';

import { iter, map, fold } from './stdlib.js';
iter([], i => console.log(i));
map([], i => '<' + i + '>');
fold([], 0, (a, i) => a + i);

import {
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
} from './browser.js';
ready(() => {
	var e = $('a');
	on(e, 'click', () => 0);
	trigger($find($.root, 'body'), 'x');
	once(e, 'e', () => 0);
	$closest(e, 'J');
	$all(e, 'K');
	$forall(e, 'r', () => 0);
	xget('data:,0');
	xpost('data:,0', {});
});
