/* eslint-env es2016, browser */
'use strict';

import * as $ from './browser.js';

// Not interfering with touch devices as a precaution.
// TODO: is there ANY way to cancel the browser's second click?

/**
 * Trigger clicks on mousedown events.  Click event is fired twice, so be
 * careful when adding this behavior to new elements.
 *
 * @param {HTMLElement} el Element to monitor
 */
function preclick(el) {
	const fire = ev => (ev.button === 0 ? ev.target.click() : null);
	$.on(el, 'mousedown', fire, null, { mute: 1000 });
}
$.forever(
	'[vp-fast] a[href], a[href][vp-fast], form[vp-fast] [type=submit], form [type=submit][vp-fast]',
	preclick
);

export { preclick };
