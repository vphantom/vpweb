/* eslint-env es2016, browser */
'use strict';

import {
	iter,
	iter_obj,
	map,
	map_obj,
	cmp,
	cmp_bool,
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

let schemas = {};
let datas = {};
let pending = [];

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

	const sort_keys = (d) => (a, b) => {
		const sa = sch && sch[a] && sch[a].sort;
		const sb = sch && sch[b] && sch[b].sort;
		return (
			(sa || sb ? (sa && !sb ? -1 : !sa && sb ? 1 : cmp(sa, sb)) : 0) ||
			cmp_bool(Array.isArray, d[a], d[b]) ||
			cmp_bool(isPlainObject, d[a], d[b]) ||
			cmp(a, b)
		);
	};

	function do_object(type, d) {
		if (idx && !d) ref[idx] = d = {};
		if (keys) {
			return H.tr(
				map(keys, (k) => {
					const inner =
						(sch || {})[k] || d[k] !== undefined
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
				return map(Object.keys(sch || d).sort(sort_keys(d)), (k) => [
					H.label([
						convert(d, k, conf, sch, k),
						' ' + (get_type_val('label', k) || k),
					]),
					H.br(),
				]);
			} else {
				return H.table(
					map(Object.keys(sch || d).sort(sort_keys(d)), (k) => {
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
			const setk = (k) => (keymap[k] = true);
			iter(Object.keys(sch || {}), setk);
			iter(d, (dd) => iter_obj(dd, setk));
			keys = Object.keys(keymap).sort(sort_keys(d));
			$.append(table, [
				H.tr(map(keys, (k) => H.th(get_type_val('label', k) || k))),
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
		if (conf.e) $.on(cb, 'change', () => (ref[idx] = cb.checked));
		else $.set(cb, { disabled: true });
		return cb;
	}

	function do_scalar(type, d) {
		if (conf.e) {
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
						conf.s.__lists[type.combo] &&
						conf.s.__lists[type.combo][d]) ||
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

function launch(conf) {
	const content = [style];
	if (conf.s) {
		if (!conf.s.__lists) conf.s.__lists = {};
		iter_obj(conf.s.__lists, (n, l) =>
			content.push(
				H.datalist(
					{ id: n },
					map_obj(l, (v, t) => H.option({ value: v }, t))
				)
			)
		);
	}
	const table = convert(conf.d, null, conf, conf.s);
	if (!table || table.length < 1) return;
	content.push(table);
	if (conf.e) {
		table.add_class('edit');
		$.set(conf.w, { 'vp-widget': true });
		conf.w.vpName = conf.n;
		conf.w.vpValue = conf.d;
	}
	$.append(conf.w.attachShadow({ mode: 'open' }), content);
}

function launch_if_ready(conf, i) {
	const sname = conf.sn;
	const dname = conf.dn;
	if ((sname ? schemas[sname] : true) && (dname ? datas[dname] : true)) {
		conf.s = sname ? schemas[sname] : null;
		conf.d = dname ? datas[dname] : {};
		if (typeof i === 'number') pending[i] = undefined;
		launch(conf);
		return true;
	}
	return false;
}

function register(type, data, el) {
	const registry = type === 0 ? datas : schemas;
	const name = $.get(
		el,
		type === 0 ? 'vp-editeur-data' : 'vp-editeur-schema'
	);
	registry[name] = data;
	iter(pending, launch_if_ready);
}

// Async load schemas
$.forever('script[type$="/json"][vp-editeur-schema]', (el) =>
	$.jsonscript(el, null, (s) => register(1, s, el))
);

// Async load datas (sic)
$.forever('script[type$="/json"][vp-editeur-data]', (el) =>
	$.jsonscript(el, null, (s) => register(0, s, el))
);

// Queue up editors
class Editeur extends HTMLElement {
	connectedCallback() {
		const name = $.get(this, 'vp-name');
		const conf = {
			w: this,
			e: !!name,
			sn: $.get(this, 'vp-schema') || null,
			dn: $.get(this, 'vp-data') || null,
			n: name || null,
		};
		if (!launch_if_ready(conf)) pending.push(conf);
	}
}
customElements.define('vp-editeur', Editeur);

export {};
