/* eslint-env es2016, browser */
'use strict';

import * as $ from './browser.js';

// Trigger clicks on mousedown.
// Saves ~100ms on desktops where clicks are triggered on mouseup.
// Not interfering with touch devices as a precaution.
// Click event is fired twice, so we're restricting the feature to cases which
// should not suffer from it.

// Anchors: a second 'click' is harmless
$.forever('[vp-fast] a[href], a[href][vp-fast]', el => {
	$.on(el, 'mousedown', ev => {
		if (ev.button !== 0) return;
		ev.target.click();
	});
});

// Forms: all inputs/buttons disabled after our click event, ahead of
// Browser's.
// TODO: is there ANY way to cancel the browser's second click?
$.forever('form[vp-fast] [type=submit], form [vp-fast][type=submit]', el => {
	$.on(el, 'mousedown', ev => {
		const form = ev.target.closest('form');
		if (!form || ev.button !== 0) return;
		ev.target.click();
		$.forall(form, 'button, input, select, textarea', e => {
			$.set(e, { disabled: true });
		});
	});
});

export {};
