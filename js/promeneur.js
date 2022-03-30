/* eslint-env es2016, browser */
'use strict';

import * as $ from './browser.js';

/*

* form method="vp-json" will make a JSON POST from crawling the form's children manually:
	 if has property vpName:
		if has property vpValue:
			formData[vpName] = (typeof(vpValue) === 'function') ? vpValue() : vpValue;
		else:
			if input/select/textarea:
				if name ends with '[]' or select.multiple:
					formData[name] = []  // accumulate values in an array
				else:
					formData[name] = value  // overwrite as a scalar
			else:
				recurse for each child
	input/select/textarea outside of vpName-having elements collected
		names with [] will have that stripped and be stored as lists
		names without that found multiple times will be overwritten as found

* form vp-target="selector"
	if specified and found:
		if result is <html/>, replace target with the result's <body/>
		else the result is partial, replace the target with full result
	else:
		if result is <html/>, replace current title/body
		else the result is partial, replace the current <form/> with it
	Q. I guess we don't care whether the result is 2xx or not?

*/

function form() {
	// $.forever('form[method="vp-json"]');
}

// Trigger clicks on mousedown.
// Saves ~100ms on desktops where clicks are triggered on mouseup.
// Not interfering with touch devices as a precaution.
// Click event is fired twice, so we're restricting the feature to cases which
// should not suffer from it.
function fast() {
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
	$.forever(
		'form[vp-fast] [type=submit], form [vp-fast][type=submit]',
		el => {
			$.on(el, 'mousedown', ev => {
				const form = ev.target.closest('form');
				if (!form || ev.button !== 0) return;
				ev.target.click();
				$.forall(form, 'button, input, select, textarea', e => {
					$.set(e, { disabled: true });
				});
			});
		}
	);
}

fast();
form();

export {};
