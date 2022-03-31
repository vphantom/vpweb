/* eslint-env es2016, browser */
'use strict';

// import * as $ from './browser.js';

/*

* form method="vp-json" will make a JSON POST from crawling the form's children manually:
	 if has property vpName:
		if has property vpValue:
			formData[vpName] = (typeof(vpValue) === 'function') ? vpValue() : vpValue;
		else:
			if input/select/textarea:
				if name ends with '[]' or select.multiple:
					formData[name] = []  // accumulate values in an array
				else:
					formData[name] = value  // overwrite as a scalar
			else:
				recurse for each child
	input/select/textarea outside of vpName-having elements collected
		names with [] will have that stripped and be stored as lists
		names without that found multiple times will be overwritten as found
	CAREFUL: even vpName may end with '[]'

* form vp-target="selector"
	if specified and found:
		if result is <html/>, replace target with the result's <body/>
		else the result is partial, replace the target with full result
	else:
		if result is <html/>, replace current title/body
		else the result is partial, replace the current <form/> with it
	Q. I guess we don't care whether the result is 2xx or not?

*/

// $.forever('form[method="vp-json"]');

export {};
