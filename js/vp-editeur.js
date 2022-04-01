/* eslint-env es2016, browser */
'use strict';

import { iter, map, cmp, cmp_f, isPlainObject } from './stdlib.js';
import * as $ from './browser.js';

const H = $.H('br', 'input', 'label', 'style', 'table', 'td', 'th', 'tr');

let registry = {};
let pending = {};

function convert(ref, idx, edit, schema, label, keys) {
	const d = idx !== null ? ref[idx] : ref;

	function schema_label(k, s) {
		s = s || schema;
		return s && s[k] && s[k]['label'] ? s[k]['label'] : k;
	}

	function sub_schema(k) {
		return schema && schema[k] ? schema[k]['__schema'] : null;
	}

	function do_object() {
		const sort_keys = (a, b) =>
			cmp_f(Array.isArray, d[a], d[b]) ||
			cmp_f(isPlainObject, d[a], d[b]) ||
			cmp(a, b);

		if (keys) {
			return H.tr(
				map(keys, k => {
					const td = H.td(convert(d, k, edit, sub_schema(k)));
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
					H.label([
						convert(d, k, edit, sub_schema(k), k),
						' ' + schema_label(k),
					]),
					H.br(),
				]);
			} else {
				return H.table(
					map(Object.keys(d).sort(sort_keys), k =>
						H.tr([
							H.th(schema_label(k)),
							H.td(convert(d, k, edit, sub_schema(k))),
						])
					)
				);
			}
		}
	}

	function do_array() {
		if (d.length > 0 && typeof d[0] === 'object' && !Array.isArray(d[0])) {
			const table = H.table();
			const keymap = {};
			const localSchema = sub_schema(idx);
			iter(d, dd => iter(Object.keys(dd), k => (keymap[k] = true)));
			keys = Object.keys(keymap).sort();
			$.append(table, [
				H.tr(map(keys, k => H.th(schema_label(k, localSchema)))),
				map(d, (x, i) => convert(d, i, edit, localSchema, null, keys)),
			]);
			return table;
		} else {
			return map(d, (x, i) => convert(d, i, edit));
		}
	}

	function do_bool() {
		const cb = H.input({ type: 'checkbox' });
		cb.checked = !!d;
		if (edit) $.on(cb, 'change', () => (ref[idx] = cb.checked));
		else $.set(cb, { disabled: true });
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
			if (edit) {
				const input = H.input({
					class: 'roger',
					type: typeof d === 'string' ? 'text' : 'number',
					value: d,
				});
				$.on(input, 'change', () => (ref[idx] = input.value));
				return [input, $.h('br')];
			} else {
				return $.text(d + ' ');
			}
	}
}

function component(edit, el, data, schema) {
	const style = H.style(`
table {
	font-size: 0.875rem;
	border-collapse: collapse;
	border-spacing: 0;
	border: none;
}
table.edit table {
	margin: 0.5em;
}
th {
	background-color: #f0f0f0;
}
th, td {
	border: 1px solid #d0d0d0;
	padding: 0.5em;
	text-align: left;
	white-space: nowrap;
}
.edit td {
	padding: 0 !important;
}
.edit td:empty {
	background-color: #f8f8f8;
}
input:not([type=checkbox]), select {
	border: none;
	width: 100%;
	line-height: 2.33em;
}
	`);
	const table = convert(data, null, edit, schema);
	const editeur = $.h(
		'vp-editeur',
		{ 'vp-widget': true },
		[],
		[style, table]
	);
	if (edit) {
		table.classList.add('edit');
		editeur.vpName = $.get(el, 'vp-name');
		editeur.vpValue = data;
	}
	$.precede(el, editeur);
}

function queue(edit, el, s, data) {
	if (!s) component(edit, el, data);
	if (registry[s]) {
		component(edit, el, data, registry[s]);
	} else {
		(pending[s] || (pending[s] = [])).push(
			component.bind(null, edit, el, data)
		);
	}
}

function register_schema(name, data) {
	registry[name] = data;
	if (pending[name]) iter(pending[name], f => f(data));
}

$.forever('script[type="application/json"][vp-schema]', el =>
	$.jsonscript(el, null, s => register_schema($.get(el, 'vp-schema'), s))
);
$.forever('script[type="application/json"][vp-view]', el => {
	$.jsonscript(el, null, queue.bind(null, false, el, $.get(el, 'vp-view')));
});
$.forever('script[type="application/json"][vp-edit]', el => {
	$.jsonscript(el, null, queue.bind(null, true, el, $.get(el, 'vp-edit')));
});

export {};
