## Components

### Editeur

- [ ] Repeatable: add entries/rows via additional disabled entry until clicked

- [ ] Repeatable: remove existing entries/rows (mark for deletion with `null`)

- [ ] For select and select multiple, we'll wait until we have Select and then revisit "combo" for something more general.  (One or multiple, allow arbitrary or not.)  Single selects up to X items should be radio buttons, above should be a select, and multiple should be a `<vp-select>`.

- [ ] When CSS table will be (re-)done, consider using it here.

- [ ] Add an alternate "send changes only" edit mode.

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

### Clean up

Full refactor before going any further.  It's too heavy, the SVG-in-CSS choice has unpleasant drawbacks to re-evaluate, and relying on bits of JS for the more interactive components is now perfectly acceptable.

- [ ] We dropped MSIE 11 support. We can refactor to save space and use:
    * CSS Variables
	* calc()
	* mix-blend-mode
	* filter()

- [ ] https://caniuse.com/css-writing-mode

- [ ] https://caniuse.com/css-grid

- [ ] https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio

- [ ] PureCSS vs PicoCSS philosophy

- [ ] Labels inside inputs is battle-tested, but is it still the best mechanism for lists of identical inputs?  Do they happen enough that we should study this case?

### Tables

- [ ] Easy to use mechanism so that `<thead>`/`<tfoot>` stay in the parent viewport while `<tbody>` scrolls vertically if height is constrained.  All 3 scroll horizontally if width is constrained (perhaps keep column 1 sticky on the left?)

- [ ] Explore non-repetitive means to transform tables into zebra cards on phone widths via JS.

