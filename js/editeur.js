/* eslint-env es2016, browser */
'use strict';

import { iter, map, cmp, cmp_f, isPlainObject } from './stdlib.js';
import * as $ from './browser.js';

const H = $.H('br', 'input', 'label', 'table', 'td', 'th', 'tr');

/*

<script type="application/json" vp-view | vp-edit="name" >{...}</script>

We need to add our component's DIV immediately before each such script.

If we're editable, that DIV will get vpName and vpValue() properties for
Promeneur to use at sumbit time.

Read-only view is finished.
TODO: make editable

*/

function convert(d, edit, label, keys) {
	function do_object() {
		const sort_keys = (a, b) =>
			cmp_f(Array.isArray, d[a], d[b]) ||
			cmp_f(isPlainObject, d[a], d[b]) ||
			cmp(a, b);

		if (keys) {
			return H.tr(
				map(keys, k => {
					const td = H.td(convert(d[k], edit));
					if (typeof d[k] === 'boolean')
						$.style(td, { 'text-align': 'center' });
					return td;
				})
			);
		} else {
			let is_checklist = true;
			iter(Object.keys(d), k => {
				if (typeof d[k] !== 'boolean') is_checklist = false;
			});
			if (is_checklist) {
				return map(Object.keys(d).sort(), k => [
					H.label([convert(d[k], edit, k), ' ' + k]),
					H.br(),
				]);
			} else {
				return H.table(
					map(Object.keys(d).sort(sort_keys), k =>
						H.tr([H.th(k), H.td(convert(d[k], edit))])
					)
				);
			}
		}
	}

	function do_array() {
		if (d.length > 0 && typeof d[0] === 'object' && !Array.isArray(d[0])) {
			const table = H.table();
			const keymap = {};
			iter(d, dd => iter(Object.keys(dd), k => (keymap[k] = true)));
			keys = Object.keys(keymap).sort();
			$.append(table, [
				H.tr(map(keys, k => H.th(k))),
				map(d, dd => convert(dd, edit, null, keys)),
			]);
			return table;
		} else {
			return map(d, dd => convert(dd, edit));
		}
	}

	function do_bool() {
		const cb = H.input({
			type: 'checkbox',
			disabled: true,
			name: label,
			value: '1',
		});
		if (d) $.set(cb, { checked: true });
		return cb;
	}

	switch (typeof d) {
		case 'object':
			if (Array.isArray(d)) return do_array();
			else return do_object();
		case 'boolean':
			return do_bool();
		case 'string':
		case 'number':
		case 'bigint':
			return $.text(d + ' ');
	}
}

function component(edit, el) {
	$.precede(el, $.h('vp-editeur', convert(JSON.parse(el.textContent), edit)));
}
$.forever(
	'script[type="application/json"][vp-view]',
	component.bind(null, false)
);
$.forever(
	'script[type="application/json"][vp-edit]',
	component.bind(null, true)
);

export {};
