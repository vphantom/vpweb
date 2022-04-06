/* eslint-env es2016, browser */
'use strict';

/*

## DateRange

Upgrades a pair of date selection inputs into a date range widget, complete with shortcuts to change by various increments (i.e. weekly, monthly, quarterly).

```js
// Option 1 (recommended): include in your build.
// No configuration options
import 'vpweb/vp-daterange';
```

```html
<!-- Option 2: load as stand-alone script -->
<script src="dist/vp-daterange.min.js"></script>
```

Wrap any pair of `<input type="date">` inside a `<div _daterange="true">` or a `<date-range>` block.  Any other mark-up inside that block will be removed.  The first input will be used as the beginning date, and the second input as the end date.

The component monitors the DOM for changes and handles new blocks added dynamically to the page.  The input names are preserved, so the form data is unaffected.

*/

export {};
