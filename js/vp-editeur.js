/* eslint-env es2016, browser */
'use strict';

import {
	iter,
	iter_obj,
	map,
	map_obj,
	cmp,
	cmp_f,
	isPlainObject,
} from './stdlib.js';
import * as $ from './browser.js';

const H = $.H(
	'br',
	'datalist',
	'input',
	'label',
	'option',
	'style',
	'table',
	'td',
	'textarea',
	'th',
	'tr'
);

let registry = {};
let pending = {};

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
input:not([type=checkbox]), select, textarea {
	border: none;
	width: 100%;
	line-height: 2.33em;
}
	`);

function convert(ref, idx, conf, sch, label, keys) {
	sch = (sch && sch[idx] ? sch[idx].__schema : null) || sch;
	const d = idx !== null ? ref[idx] : ref;
	const get_type = (k, s) => (s || sch || {})[k] || {};
	const get_type_val = (n, k, s) => get_type(k, s)[n];

	function sort_keys(a, b) {
		const sa = sch && sch[a] && sch[a].sort;
		const sb = sch && sch[b] && sch[b].sort;
		return (
			(sa || sb ? (sa && !sb ? -1 : !sa && sb ? 1 : cmp(sa, sb)) : 0) ||
			cmp_f(Array.isArray, d[a], d[b]) ||
			cmp_f(isPlainObject, d[a], d[b]) ||
			cmp(a, b)
		);
	}

	function do_object() {
		if (keys) {
			return H.tr(
				map(keys, k => {
					const td = H.td(convert(d, k, conf, sch));
					if ((get_type_val('type', k) || typeof d[k]) === 'boolean')
						$.style(td, { 'text-align': 'center' });
					return td;
				})
			);
		} else {
			// TODO: templates: true if all keys are typed boolean
			let is_checklist = true;
			iter_obj(d, (k, v) => {
				if (typeof v !== 'boolean') is_checklist = false;
			});
			if (is_checklist) {
				return map(Object.keys(d).sort(sort_keys), k => [
					H.label([
						convert(d, k, conf, null, k),
						' ' + (get_type_val('label', k) || k),
					]),
					H.br(),
				]);
			} else {
				return H.table(
					map(Object.keys(d).sort(sort_keys), k => {
						const type = get_type(k);
						return H.tr([
							H.th({ title: type.tooltip || k }, type.label || k),
							H.td(convert(d, k, conf, sch)),
						]);
					})
				);
			}
		}
	}

	function do_array() {
		if (Array.isArray(d[0])) return [];
		if (d.length > 0 && typeof d[0] === 'object' && !Array.isArray(d[0])) {
			const table = H.table();
			const keymap = {};
			iter(d, dd => iter_obj(dd, k => (keymap[k] = true)));
			keys = Object.keys(keymap).sort(sort_keys);
			$.append(table, [
				H.tr(map(keys, k => H.th(get_type_val('label', k) || k))),
				map(d, (x, i) => convert(d, i, conf, sch, null, keys)),
			]);
			return table;
		} else {
			return map(d, (x, i) => convert(d, i, conf, sch));
		}
	}

	function do_bool() {
		const cb = H.input({ type: 'checkbox' });
		cb.checked = !!d;
		if (conf.edit) $.on(cb, 'change', () => (ref[idx] = cb.checked));
		else $.set(cb, { disabled: true });
		return cb;
	}

	function do_scalar(type) {
		if (conf.edit) {
			let input;
			if (type.type === 'textarea' || (d && /\r|\n/.test(d))) {
				input = H.textarea(d ? d : []);
			} else {
				input = H.input({ value: d ? d : '' });
				if (type.type === 'number' || typeof d === 'number') {
					$.set(input, { type: 'number' });
				} else {
					$.set(input, { type: 'text' });
				}
				if (type.combo) $.set(input, { list: type.combo });
			}
			$.on(input, 'change', () => (ref[idx] = input.value));
			return [input, H.br()];
		} else {
			return $.text(
				((type.combo &&
					conf.__lists[type.combo] &&
					conf.__lists[type.combo][d]) ||
					d) + ' '
			);
		}
	}

	const type = idx && typeof idx !== 'number' ? get_type(idx) : {};
	if (type.repeatable || Array.isArray(d)) return do_array();
	else if (type.__schema || typeof d === 'object') return do_object();
	else if ((type.type || typeof d) === 'boolean') return do_bool();
	else return do_scalar(type);
}

function component(edit, el, data, schema) {
	const content = [style];
	if (!schema.__lists) schema.__lists = {};
	iter_obj(schema.__lists, (n, l) =>
		content.push(
			H.datalist(
				{ id: n },
				map_obj(l, (v, t) => H.option({ value: v }, t))
			)
		)
	);
	const table = convert(data, null, { edit: edit, root: schema }, schema);
	content.push(table);
	const editeur = $.h('vp-editeur', { 'vp-widget': true }, [], content);
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
