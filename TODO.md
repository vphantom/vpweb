## CSS

### Tables

- [ ] Horizontal without outside borders, maybe not even TH grey, "simple"
- [ ] Make a no-wrap column type, with and without truncation
- [ ] Guaranteed smallest cell: width:1px no-wrap
- [ ] Easy to use mechanism so that `<thead>`/`<tfoot>` stay in the parent viewport while `<tbody>` scrolls vertically if height is constrained.  All 3 scroll horizontally if width is constrained (perhaps keep column 1 sticky on the left?)
- [ ] Explore non-repetitive means to transform tables into zebra cards on phone widths via JS.

### Forms

- [ ] BUG: a `.vp-group` with hidden elements on either edge will make the corners on that edge sharp instead of rounded. This might not be fixable.
- [ ] Labels inside inputs is battle-tested, but is it still the best mechanism for lists of identical inputs?  Do they happen enough that we should study this case?
- [ ] Pure CSS mobile-style toggle switches (later)
- [ ] Refactor `<form action="json-post">` so that XHR loading is independent of JSON feature.
- [ ] Grab titles in addition to body.
- [ ] Document how to nest objects in JSON output.
- [ ] `formaction` attribute on submit buttons.

## Components

### Tabs

- [ ] Load content on demand

### Forms

- [ ] Support the `formaction` attribute of clicked elements.
- [ ] Add an attribute which will make the initial load save an input's value, then on submit compare so that the variable is not sent unchanged. A numeric specialization could send the difference instead of the new value. (Helps multiple users editing the same thing without conflict and moves the burden of identifying changes to the client side. Delta should use a suffix or something so that non-JS users submitting the form won't distort data.)

### Browser

- [ ] WebSocket helper (as we already have XHR helper)
- [ ] Server-Sent Events (SSE) helper

### Editeur

- [ ] Add a 4th type "Bool" mapping to JSON boolean for Y/N fields
- [ ] Repeatable: add entries/rows via additional disabled entry until clicked
- [ ] Repeatable: remove existing entries/rows (mark for deletion with `null`)
- [ ] For select and select multiple, we'll wait until we have Selecteur and then revisit "combo" for something more general.  (One or multiple, allow arbitrary or not.)  Single selects up to X items should be radio buttons, above should be a select, and multiple should be a `<vp-select>`.
- [ ] When CSS table will be (re-)done, consider using it here.
- [ ] Add an alternate "send changes only" edit mode.

### Selecteur

Evaluate if we can be an order of magnitude smaller than existing stand-alone options for our specific needs.

- [ ] Test prototype with Merino CMS list and with PyriteView user list to confirm performance vs native datalist.

### DateRange

More or less a port/cleanup of the old Merino jQuery widget, which had some serious usability issues.
