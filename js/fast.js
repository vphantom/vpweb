/* eslint-env es2016, browser */
'use strict';

import * as $ from './browser.js';

// Not interfering with touch devices as a precaution.

/**
 * Manually make an element trigger clicks on mousedown events.
 * Prevents double-firing by tracking mousedown state.
 *
 * @param {HTMLElement} el Element to monitor
 */
function preclick(el) {
	let blockNextClick = false;

	const handleMouseDown = ev => {
		if (ev.button === 0) {
			ev.target.click();
			blockNextClick = true;
		}
	};

	const handleClick = ev => {
		if (blockNextClick) {
			ev.preventDefault();
			ev.stopImmediatePropagation();
			blockNextClick = false;
		}
	};

	$.on(el, 'mousedown', handleMouseDown, null, { mute: 1000 });
	$.on(el, 'click', handleClick, { capture: true });
}
$.forever(
	'[vp-fast] a, a[vp-fast], form[vp-fast] button, form[vp-fast] input[type=submit], button[vp-fast], input[type=submit][vp-fast]',
	preclick
);

export { preclick };
