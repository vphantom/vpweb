/* eslint-env browser */
'use strict';

import * as $ from './browser.js';

/*

<script type="application/json" vp-view | vp-edit vp-name="...">{...}</script>

We need to add our component's DIV immediately before each such script.

If we're editable, that DIV will get vpName and vpValue() properties for
Promeneur to use at sumbit time.



*/

function component(edit, el) {
	var data = JSON.parse(el.textContent);
	el.parentElement.insertBefore($.h('div', {}, 'JSON'), el);
	console.log(data);
}

function init() {
	$.ready(() => {
		$.forever(
			'script[type="application/json"][vp-view]',
			component.bind(null, false)
		);
		$.forever(
			'script[type="application/json"][vp-edit]',
			component.bind(null, true)
		);
	});
}

export { init };
