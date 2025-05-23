/* eslint-env es2016, browser */
'use strict';

import { iter } from './stdlib.js';

import * as $ from './browser.js';

// Counter to ensure unique IDs across multiple tab instances
let tabIdCounter = 0;

/**
 * Manually make an element tabbable.
 * Requires a tab list and matching tab panels inside.
 *
 * @param {HTMLElement} el Element to manage
 */
function tabs(el) {
	const handlebar = el.children[0];
	const handles = handlebar.children;
	const panels = el.children[1].children;
	const tabSetId = `vp-tabs-${tabIdCounter++}`;

	const activate = (handle, i) => {
		iter(handles, (h, idx) =>
			$.set(h, {
				tabindex: idx === i ? 0 : -1,
				'aria-selected': idx === i,
			})
		);
		iter(panels, (panel, j) => $.set(panel, { 'aria-selected': i === j }));
	};

	$.set(handlebar, {
		role: 'tablist',
		'aria-orientation': 'horizontal',
	});

	iter(handles, (handle, i) => {
		const handleId = `${tabSetId}t${i}`;
		const panelId = `${tabSetId}p${i}`;

		$.set(handle, {
			'aria-controls': panelId,
			id: handleId,
			role: 'tab',
			tabindex: -1,
		});

		$.set(panels[i], {
			'aria-labelledby': handleId,
			id: panelId,
			role: 'tabpanel',
		});

		$.on(handle, ['click', 'focus'], () => activate(handle, i));

		$.on(handle, 'keydown', (e) => {
			let nextIndex;

			switch (e.key) {
				case 'ArrowRight':
					nextIndex = (i + 1) % handles.length;
					break;
				case 'ArrowLeft':
					nextIndex = (i + handles.length - 1) % handles.length;
					break;
				case 'Home':
					nextIndex = 0;
					break;
				case 'End':
					nextIndex = handles.length - 1;
					break;
			}

			if (nextIndex !== undefined) {
				e.preventDefault();
				handles[nextIndex].focus();
			}
		});
	});

	const initial = Math.max(
		0,
		Math.min(
			handles.length - 1,
			parseInt($.get(el, 'vp-current') || '0', 10) || 0
		)
	);
	activate(handles[initial], initial);
}
$.forever('vp-tabs', tabs);

export { tabs };
