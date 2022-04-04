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
	'pre',
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
	border: 1px solid transparent;
	width: 100%;
}
input:not([type=checkbox]), select {
	line-height: 2.33em;
}
	`);

function convert(ref, idx, conf, sch, label, keys) {
	const get_type = (k, s) => (s || sch || {})[k] || {};
	const get_type_val = (n, k, s) => get_type(k, s)[n];

	const sort_keys = d => (a, b) => {
		const sa = sch && sch[a] && sch[a].sort;
		const sb = sch && sch[b] && sch[b].sort;
		return (
			(sa || sb ? (sa && !sb ? -1 : !sa && sb ? 1 : cmp(sa, sb)) : 0) ||
			cmp_f(Array.isArray, d[a], d[b]) ||
			cmp_f(isPlainObject, d[a], d[b]) ||
			cmp(a, b)
		);
	};

	function do_object(type, d) {
		if (idx && !d) ref[idx] = d = {};
		if (keys) {
			return H.tr(
				map(keys, k => {
					const inner =
						(sch || {})[k] || typeof d[k] !== 'undefined'
							? convert(d, k, conf, sch)
							: undefined;
					const td = H.td(inner);
					if ((get_type_val('type', k) || typeof d[k]) === 'boolean')
						$.style(td, { 'text-align': 'center' });
					return td;
				})
			);
		} else {
			let is_checklist = true;
			if (sch) {
				iter_obj(sch, (k, v) => {
					if (v.type !== 'boolean') is_checklist = false;
				});
			} else {
				iter_obj(d, (k, v) => {
					if (typeof v !== 'boolean') is_checklist = false;
				});
			}
			if (is_checklist) {
				return map(Object.keys(sch || d).sort(sort_keys(d)), k => [
					H.label([
						convert(d, k, conf, sch, k),
						' ' + (get_type_val('label', k) || k),
					]),
					H.br(),
				]);
			} else {
				return H.table(
					map(Object.keys(sch || d).sort(sort_keys(d)), k => {
						if (/^__/.test(k)) return;
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

	function do_array(type, d) {
		if (idx && !d) ref[idx] = d = [];
		if (Array.isArray(d[0])) return;
		if (
			type.__schema ||
			(d.length > 0 && typeof d[0] === 'object' && !Array.isArray(d[0]))
		) {
			const table = H.table();

			// Collect keys from schema and all rows, to be safe
			const keymap = {};
			const setk = k => (keymap[k] = true);
			iter(Object.keys(sch || {}), setk);
			iter(d, dd => iter_obj(dd, setk));
			keys = Object.keys(keymap).sort(sort_keys(d));
			$.append(table, [
				H.tr(map(keys, k => H.th(get_type_val('label', k) || k))),
				map(d, (x, i) => convert(d, i, conf, sch, null, keys)),
			]);
			return table;
		} else {
			return map(d, (x, i) => convert(d, i, conf, sch));
		}
	}

	function do_bool(type, d) {
		const cb = H.input({ type: 'checkbox' });
		cb.checked = !!d;
		if (conf.edit) $.on(cb, 'change', () => (ref[idx] = cb.checked));
		else $.set(cb, { disabled: true });
		return cb;
	}

	function do_scalar(type, d) {
		if (conf.edit) {
			const is_num = (type.type || typeof d) === 'number';
			let input;
			if (
				type.type === 'textarea' ||
				(!type.type && d && /\r|\n/.test(d))
			) {
				input = H.textarea(d || undefined);
			} else {
				input = H.input({
					type: is_num ? 'number' : 'text',
					value: d ? d : '',
				});
				if (type.combo) $.set(input, { list: type.combo });
			}
			$.on(
				input,
				'change',
				() => (ref[idx] = is_num ? Number(input.value) : input.value)
			);
			return [input, H.br()];
		} else {
			if (d !== undefined) {
				if (/\r|\n/.test(d)) {
					return H.pre(d);
				}
				return $.text(
					((type.combo &&
						conf.root.__lists[type.combo] &&
						conf.root.__lists[type.combo][d]) ||
						d) + ' '
				);
			}
		}
	}

	const d = idx !== null ? ref[idx] : ref;
	const type = idx && typeof idx !== 'number' ? get_type(idx) : {};
	sch = (sch && sch[idx] ? sch[idx].__schema : null) || sch;
	if (type.repeatable || Array.isArray(d)) return do_array(type, d);
	else if (type.__schema || typeof d === 'object') return do_object(type, d);
	else if ((type.type || typeof d) === 'boolean') return do_bool(type, d);
	else return do_scalar(type, d);
}

function component(edit, el, data, schema) {
	const content = [style];
	if (schema) {
		if (!schema.__lists) schema.__lists = {};
		iter_obj(schema.__lists, (n, l) =>
			content.push(
				H.datalist(
					{ id: n },
					map_obj(l, (v, t) => H.option({ value: v }, t))
				)
			)
		);
	}
	const table = convert(
		data,
		null,
		{ edit: edit, root: schema || {} },
		schema
	);
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
