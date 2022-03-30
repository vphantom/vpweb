/* eslint-env es2016 */
'use strict';

const ap = Array.prototype;

const alias = f => Function.prototype.call.bind(f);

// Generic iterator
function iter(list, f) {
	for (let i = 0, l_length = list.length; i < l_length; ++i) {
		f(list[i]);
	}
}

// Create a function which will iterate f() on its list argument
let iter_f = f => l => iter(l, f);

// Generic mapper to Array
function map(list, f) {
	const a = new Array(list.length);
	for (let i = 0, l_length = list.length; i < l_length; ++i) {
		a[i] = f(list[i]);
	}
	return a;
}

// Generic folder
function fold(list, acc, f) {
	for (let i = 0, l_length = list.length; i < l_length; ++i) {
		acc = f(acc, list[i]);
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
	map,
	shift,
	shifter,
};
