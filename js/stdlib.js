/* eslint-env es2016 */
'use strict';

const ap = Array.prototype;

const alias = f => Function.prototype.call.bind(f);

/**
 * Iterator of anything indexable with a length.  Skips undefined items.
 *
 * @param {*} list What to iterate over
 * @param {function(*,number):void} f(item,i) Operation to perform
 *
 */
function iter(list, f) {
	for (let i = 0, len = list.length; i < len; ++i) {
		if (list[i] !== undefined) f(list[i], i);
	}
}

/**
 * Create an iterator which will skip undefined items.
 *
 * @param {function(*,number):void} f(item,i) Operation to perform
 *
 * @return {function(*):void} Function which will iterate over its argument
 */
function iter_f(f) {
	return list => iter(list, f);
}

/**
 * Iterate over all keys of an object.  Does not filter.
 *
 * @param {Object} obj What to iterate over
 * @param {function(string,*):void} f(key,value) Operation to perform on each key
 */
function iter_obj(obj, f) {
	iter(Object.keys(obj), k => f(k, obj[k]));
}

/**
 * Filtering mapper of anything indexable with a length, skipping undefined
 * items and undefined callback results.
 *
 * @param {*} list What to iterate over
 * @param {function(*,number):*} f(item,i) Map an item into another value
 *
 * @return {Array} All non-undefined results of f()
 */
function map(list, f) {
	const a = [];
	for (let i = 0, len = list.length; i < len; ++i) {
		if (list[i] !== undefined) {
			const add = f(list[i], i);
			if (add !== undefined) a.push(add);
		}
	}
	return a;
}

/**
 * Map an object by key to an array.
 *
 * @param {Object} obj What to iterate over
 * @param {function(string,*):*} f(key,value) Map a key to another value
 *
 * @return {Array} All results of f()
 */
function map_obj(obj, f) {
	return map(Object.keys(obj), k => f(k, obj[k]));
}

/**
 * Fold anything indexable with a length.
 *
 * @param {*} list What to iterate over
 * @param {*} acc  Initial value for your accumulator
 * @param {function(*,*,number):*} f(acc,item,i) Update accumulator with new value
 */
function fold(list, acc, f) {
	for (let i = 0, len = list.length; i < len; ++i) {
		acc = f(acc, list[i], i);
	}
	return acc;
}

/**
 * Shift operation for Array-like objects
 *
 * Alias of `Array.prototype.shift()`
 */
const shift = alias(ap.shift);

/**
 * Create a function which will shift this array-like thing
 *
 * @param {Object} list Anything
 *
 * @return {function():*} Function which will shift list at each call
 */
const shifter = l => Function.prototype.call.bind(ap.shift, l);

/**
 * Compare two scalars, returning 1, 0 or -1 depending on whether A is greater
 * than, equal to or less than B.
 *
 * @param {string|number} a
 * @param {string|number} b
 *
 * @return {number} Result
 */
function cmp(a, b) {
	return a == b ? 0 : a > b ? 1 : -1;
}

/**
 * Compare two things with a callback, returning 1, 0 or -1 depending on whether
 * f(a), both or f(b) are true.
 *
 * @param {function(*):boolean} f Evaluator
 *
 * @result {number} Result
 */
function cmp_bool(f, a, b) {
	const fa = f(a),
		fb = f(b);
	if (fa && !fb) return 1;
	if (!fa && fb) return -1;
	return 0;
}

/**
 * Tests whether something is a plain object (a.k.a. "object literal").
 *
 * @param {*} o Anything
 *
 * @return {boolean} Result
 */
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
	cmp_bool,
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
