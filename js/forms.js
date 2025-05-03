/* eslint-env es2016, browser */
'use strict';

import { iter } from './stdlib.js';
import * as $ from './browser.js';

function gatherFormData(form) {
    // Create a FormData but don't populate from form yet
    const formData = new FormData();

    // Handle all form controls manually to properly handle multiple selects
    $.forall(form, 'input, textarea', el => {
        if (el.name) formData.append(el.name, el.value);
    });

    $.forall(form, 'select', el => {
        if (!el.name) return;
        // For multiple selects, always use array syntax
        const name = el.multiple ? `${el.name}[]` : el.name;
        iter(el.selectedOptions, opt => formData.append(name, opt.value));
    });

    // Handle custom vp-widget elements
    $.forall(form, '[vp-widget]', wg => {
        if (!(wg.vpName && wg.vpValue)) return;
        const value = typeof wg.vpValue === 'function' ? wg.vpValue() : wg.vpValue;
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
    const targetSel = isJsonPost ? ($.get(form, 'vp-target') || 'body') : $.get(form, 'vp-target');

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
 * Manually make auto-expanding inputs.  Types `email`, `number`, `password`,
 * `search`, `text`, `url` are supported.
 *
 * @param {HTMLInputElement} input The input to squeeze
 */
function expanding(input) {
    if (/^(email|number|password|search|text|url)$/.test(input.type)) {
        const small = input.type === 'number' ? '32px' : '16px';
        $.style(input, { width: small });
        $.on(input, ['blur', 'change', 'input', 'keydown'], () => {
            input.style.width = small;
            input.style.width = `${input.scrollWidth + 10}px`;
        });
    }
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

$.forever('form[method="json-post"], form[vp-target]', enhance);
$.forever('input[vp-expanding]', expanding);
$.forever('input[vp-name], select[vp-name], textarea[vp-name]', ghost);

export { expanding, ghost, enhance };
