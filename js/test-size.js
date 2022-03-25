/* eslint-env browser */
'use strict';

import { iter, map, fold } from './stdlib.js';
iter([], i => console.log(i));
map([], i => '<' + i + '>');
fold([], 0, (a, i) => a + i);

import { H, ready, once, forall_class, forall_tag, forall } from './browser.js';
once(document, 'e', () => undefined);
ready(() => {
	H('a');
	forall_class('r', () => undefined);
	forall_tag('r', () => undefined);
	forall('r', () => undefined);
});
