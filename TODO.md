## Components

### Editeur

- [ ] Repeatable: add entries/rows and remove existing entries/rows

- [ ] For select and select multiple, we'll wait until we have Select and then revisit "combo" for something more general.  (One or multiple, allow arbitrary or not.)

### Select

Evaluate if we can be an order of magnitude smaller than existing stand-alone options for our specific needs.

- [ ] Test prototype with Merino CMS list and with PyriteView user list to confirm performance vs native datalist.

### DateRange

More or less a port/cleanup of the old Merino jQuery widget, which had some serious usability issues.

### Fast Click

- [ ] Figure out a way to avoid `click` triggering twice, so we could make it available to anything clickable.

### Forms

- [ ] Support the `formaction` attribute of clicked elements.

## CSS

Full refactor before going any further.  It's too heavy, the SVG-in-CSS choice has unpleasant drawbacks to re-evaluate, and relying on bits of JS for the more interactive components is now perfectly acceptable.

- [ ] https://caniuse.com/css-writing-mode

- [ ] https://caniuse.com/css-grid

- [ ] https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio

- [ ] PureCSS vs PicoCSS philosophy

- [ ] We dropped MSIE 11 support. We can refactor to save space and use:
    * CSS Variables
	* calc()
	* mix-blend-mode
	* filter()

