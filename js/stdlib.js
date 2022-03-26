'use strict';

// Generic iterator
function iter(list, f) {
	for (let i = 0, l_length = list.length; i < l_length; ++i) {
		f(list[i]);
	}
}

// Generic mapper to Array
function map(list, f) {
	let a = new Array(list.length);
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

export { iter, map, fold };
