/* eslint-env es2016, browser */
'use strict';

import * as $ from './browser.js';

// Trigger clicks on mousedown.
// Saves ~100ms on desktops where clicks are triggered on mouseup.
// Not interfering with touch devices as a precaution.
// Click event is fired twice, so we're restricting the feature to cases which
// should not suffer from it.
// TODO: is there ANY way to cancel the browser's second click?

$.forever(
	'[vp-fast] a[href], a[href][vp-fast], form[vp-fast] [type=submit], form [type=submit][vp-fast]',
	el => {
		$.on(el, 'mousedown', ev => {
			if (ev.button !== 0) return;
			ev.target.click();
		});
	}
);

export {};
