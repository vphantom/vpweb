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

$.forever('form[method="vp-json"]', form =>
	$.on(form, 'submit', submit, {}, { prevent: true, mute: 1000 })
);

export {};
