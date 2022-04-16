/* eslint-env es2016, browser */
'use strict';

import { iter } from './stdlib.js';
import * as $ from './browser.js';

function submit(ev) {
	const form = ev.target;
	const target = $.find($.get(form, 'vp-target') || 'body') || $.find('body');
	let data = {};
	function gather(k, v, mm) {
		if (!k) return;
		const [, name, mult] = k.match(/^([^[\]]+)(\[\])?$/);
		if (mm || mult) (data[name] || (data[name] = [])).push(v);
		else data[name] = v;
	}
	$.forall(form, 'input, textarea', el => gather(el.name, el.value));
	$.forall(form, 'select', el =>
		iter(el.selectedOptions, opt => gather(el.name, opt.value, el.multiple))
	);
	$.forall(form, '[vp-widget]', wg => {
		if (!(wg.vpName && wg.vpValue)) return;
		if (typeof wg.vpValue === 'function') gather(wg.vpName, wg.vpValue());
		else gather(wg.vpName, wg.vpValue);
	});

	function display(xhr) {
		if (!(xhr && xhr.response)) return;
		const el = $.find(xhr.response, 'body') || xhr.response;
		$.replace(
			target,
			el.tagName.toLowerCase() === 'body' ? el.children : el
		);
	}

	$.post(form.action, data, 'document', null, display, display);
}

/**
 * Take over a form for JSON out, HTML in.
 *
 * @param {HTMLFormElement} form The form to take over
 */
function json(form) {
	return $.on(form, 'submit', submit, {}, { prevent: true, mute: 1000 });
}
$.forever('form[method="vp-json"]', json);

/**
 * Auto-expanding inputs.  Types `email`, `number`, `password`, `search`,
 * `text`, `url` are supported.
 *
 * @param {HTMLInputElement} input The input to squeeze
 */
function expanding(input) {
	if (/^(email|number|password|search|text|url)$/.test(input.type)) {
		const small = input.type === 'number' ? '32px' : '16px';
		$.style(input, { width: small });
		$.on(input, ['blur', 'change', 'input', 'keydown'], () => {
			input.style.width = small;
			input.style.width = `${input.scrollWidth + 10}px`;
		});
	}
}
$.forever('input[vp-expanding]', expanding);

/**
 * Include field in form data once it will be modified.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input Field
 * @param {string} [name] Name to use (overrides `vp-name`)
 */
function ghost(input, name) {
	name = name || $.get(input, 'vp-name');
	return $.on(input, 'change', () => $.set(input, { name: name }));
}
$.forever('input[vp-name], select[vp-name], textarea[vp-name]', ghost);

export { expanding, ghost, json };
