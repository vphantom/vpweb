/* eslint-env es2016, browser */
'use strict';

import { iter } from './stdlib.js';
import * as $ from './browser.js';

function gatherFormData(form) {
	// Create a FormData but don't populate from form yet
	const formData = new FormData();

	// Handle all form controls manually to properly handle multiple selects
	$.forall(form, 'input, textarea', (el) => {
		if (el.name) formData.append(el.name, el.value);
	});

	$.forall(form, 'select', (el) => {
		if (!el.name) return;
		// For multiple selects, always use array syntax
		const name = el.multiple ? `${el.name}[]` : el.name;
		iter(el.selectedOptions, (opt) => formData.append(name, opt.value));
	});

	// Handle custom vp-widget elements
	$.forall(form, '[vp-widget]', (wg) => {
		if (!(wg.vpName && wg.vpValue)) return;
		const value =
			typeof wg.vpValue === 'function' ? wg.vpValue() : wg.vpValue;
		formData.append(wg.vpName, value);
	});

	return formData;
}

function formDataToJson(formData) {
	const data = {};

	for (const [key, value] of formData.entries()) {
		// Check for [] suffix
		const [, name, mult] = key.match(/^([^[\]]+)(\[\])?$/);

		if (mult || (name in data && Array.isArray(data[name]))) {
			// Handle explicit arrays ([] suffix) and continued arrays (multiple values for same key)
			(data[name] || (data[name] = [])).push(value);
		} else if (name in data) {
			// Convert to array when we see a duplicate key
			data[name] = [data[name], value];
		} else {
			// First occurrence of this key
			data[name] = value;
		}
	}
	return data;
}

function submitForm(ev) {
	const form = ev.target;
	const isJsonPost = form.method.toLowerCase() === 'json-post';
	// Default to "body" target for JSON forms, otherwise use explicit target
	const targetSel = isJsonPost
		? $.get(form, 'vp-target') || 'body'
		: $.get(form, 'vp-target');

	// Regular form submission if neither JSON nor XHR requested
	if (!isJsonPost && !targetSel) return;

	const formData = gatherFormData(form);
	const target = $.find(targetSel) || $.find('body');

	function display(xhr) {
		if (!(xhr && xhr.response)) return;
		const el = $.find(xhr.response, 'body') || xhr.response;
		if (el.tagName.toLowerCase() === 'body') {
			$.replace(target, el.children);
			window.scrollTo(0, 0);
		} else {
			$.replace(target, el);
		}
	}

	// Handle the different submission types
	if (isJsonPost) {
		const jsonData = formDataToJson(formData);
		$.post(form.action, jsonData, 'document', null, display, display);
	} else if (form.method.toLowerCase() === 'get') {
		const params = new URLSearchParams(formData);
		const url = `${form.action}?${params.toString()}`;
		$.get(url, 'document', null, display, display);
	} else {
		// Regular POST with FormData
		$.post(form.action, formData, 'document', null, display, display);
	}

	ev.preventDefault();
}

/**
 * Take over a form for either XHR loading or JSON submission
 *
 * @param {HTMLFormElement} form The form to take over
 */
function enhance(form) {
	$.on(form, 'submit', submitForm, {}, { prevent: false, mute: 1000 });
}

/**
 * Add a pattern attribute to validate email addresses
 * Only sets the pattern if one is not already defined
 *
 * @param {HTMLInputElement} input The input to validate
 */
function email_pattern(input) {
	$.set_def(input, { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$' });
}

/**
 * Manually make a field be included form data only once it will be modified.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input Field
 * @param {string} [name] Name to use (overrides `vp-name`)
 */
function ghost(input, name) {
	name = name || $.get(input, 'vp-name');
	return $.on(input, 'change', () => $.set(input, { name: name }));
}

/**
 * Make an input grow and shrink with its contents.
 *
 * @param {HTMLInputElement} input The input to grow
 */
function auto_width(input) {
	const initialWidth = input.scrollWidth;
	$.on(input, ['change', 'input'], () => {
		input.style.width = `${initialWidth + 4}px`; // Don't shrink all the way to zero
		input.style.width = `${input.scrollWidth + 4}px`; // Pad variations
	});
	input.style.width = `${initialWidth + 4}px`;
}

/**
 * Make a textarea grow and shrink with its contents.
 *
 * @param {HTMLTextAreaElement} textarea The textarea to grow
 */
function auto_height(textarea) {
	const initialHeight = textarea.scrollHeight;
	$.on(textarea, ['change', 'input'], () => {
		textarea.style.height = `${initialHeight + 4}px`; // Reset to initial height
		textarea.style.height = `${textarea.scrollHeight + 4}px`; // Expand to content
	});
	textarea.style.height = `${initialHeight + 4}px`;
}

/**
 * Update field validity hints.
 *
 * If the field has a parent label or .vp-field, it gets .invalid when its
 * child field is invalid.
 *
 * Fields themselves get .touched after an initial interaction.
 *
 * @param {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} input Form field
 */
function update_validity(input) {
	function update_class(container, input, force = false) {
		if (!force && !input._vpInteracted) return;
		if (input.validity.valid) {
			$.del_class(container, 'invalid');
		} else {
			$.add_class(container, 'invalid');
		}
	}

	const container = input.closest('label, .vp-field');
	input._vpInteracted = false;
	$.on(input, 'blur', () => {
		input._vpInteracted = true;
		$.add_class(input, 'touched');
		if (container) {
			$.add_class(container, 'touched');
			update_class(container, input);
		}
	});

	if (!container) return;
	$.on(input, 'invalid', () => update_class(container, input, true));
	$.on(input, ['change', 'input'], () => update_class(container, input));
}

/**
 * Delegate .vp-field clicks to its inner dropdown element.
 *
 * Support as of 2025 is spotty, so consider this a graceful improvement only.
 *
 * @param {HTMLElement} dropdown The select or input[list] element
 */
function delegate_dropdown_clicks(dropdown) {
	const field = dropdown.closest('.vp-field');
	if (!field) return;

	$.on(field, 'click', (ev) => {
		if (ev.target !== dropdown) {
			if (
				dropdown instanceof HTMLSelectElement &&
				typeof dropdown.showPicker === 'function'
			) {
				dropdown.showPicker();
			} else {
				// Shot in the dark, in case it helps anybody...
				dropdown.focus();
				dropdown.click();
			}
		}
	});
}

$.forever('form[method="json-post"], form[vp-target]', enhance);
$.forever('input[vp-name], select[vp-name], textarea[vp-name]', ghost);
$.forever(
	'input[type="email"]:is(.vp, .vp *):not(.xvp, .xvp *)',
	email_pattern
);
$.forever('input.vp-growing', auto_width);
$.forever('textarea.vp-growing', auto_height);
$.forever(
	'input[required], input[pattern], input[min], input[max], input[type="email"], input[type="url"], select[required], textarea[required]',
	update_validity
);
$.forever('.vp-field :is(select, input[list])', delegate_dropdown_clicks);

export {
	auto_height,
	auto_width,
	delegate_dropdown_clicks,
	email_pattern,
	enhance,
	ghost,
	update_validity,
};
