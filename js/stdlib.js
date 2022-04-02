/* eslint-env es2016 */
'use strict';

const ap = Array.prototype;

const alias = f => Function.prototype.call.bind(f);

// Generic iterator
function iter(list, f) {
	for (let i = 0, len = list.length; i < len; ++i) {
		f(list[i], i);
	}
}

// Create a function which will iterate f() on its list argument
const iter_f = f => list => iter(list, f);

// Iterate over object
const iter_obj = (obj, f) => iter(Object.keys(obj), k => f(k, obj[k]));
// function iter_obj(obj, f) {
// 	const list = Object.keys(obj);
// 	for (let i = 0, len = list.length; i < len; ++i) {
// 		f(list[i], obj[list[i]]);
// 	}
// }

// Generic mapper to Array
function map(list, f) {
	const a = new Array(list.length);
	for (let i = 0, len = list.length; i < len; ++i) {
		a[i] = f(list[i], i);
	}
	return a;
}

// Map object
const map_obj = (obj, f) => map(Object.keys(obj), k => f(k, obj[k]));
// function map_obj(obj, f) {
// 	const list = Object.keys(obj);
// 	const a = new Array(list.length);
// 	for (let i = 0, len = list.length; i < len; ++i) {
// 		a[i] = f(list[i], obj[list[i]]);
// 	}
// 	return a;
// }

// Generic folder
function fold(list, acc, f) {
	for (let i = 0, len = list.length; i < len; ++i) {
		acc = f(acc, list[i], i);
	}
	return acc;
}

// Shift array-like things
const shift = alias(ap.shift);

// Create a function which will shift this array-like thing
const shifter = l => Function.prototype.call.bind(ap.shift, l);

function cmp(a, b) {
	return a == b ? 0 : a > b ? 1 : -1;
}

function cmp_f(f, a, b) {
	const fa = f(a),
		fb = f(b);
	if (fa && !fb) return 1;
	if (!fa && fb) return -1;
	return 0;
}

function isPlainObject(o) {
	if (!o) return false;
	const op = Object.getPrototypeOf(o);
	return (
		(op === null || op === Object.prototype) &&
		Object.prototype.toString.call(o) === '[object Object]'
	);
}

export {
	alias,
	cmp,
	cmp_f,
	fold,
	isPlainObject,
	iter,
	iter_f,
	iter_obj,
	map,
	map_obj,
	shift,
	shifter,
};
