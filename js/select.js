/*

<vp-select name="form_field_name"></vp-select>

Where will the list come from?

Selectize approach for editing seems most versatile: a 4px text input at the
insertion location, disappears when not in focus. Backspace when empty deletes
previous selection.  Left/Right arrows select previous/next selection (for
possible deletion with Backspace or Delete).  Clicking also focuses a selection
for possible deletion.  Clicking before first, between or after last inserts the
4px input there.  The input auto-grows as typed (we have this in
Merino/staff.js).  Selections and the input are inline-blocks so they wrap.

Possible selections are a full-width box below (we have an example in
Merino/staff.js).  Selectize also has this right with arrows, enter and mouse
control.  Typed characters appear in the input and filter the suggestions with
highlighting.

Enter on non-empty input only adds a selection if there was exactly one match or
if arbitrary is allowed (as in a combobox).

Optionally keep the suggestions open until taken out of focus.

No '&times;' closing mechanism, click or arrows and backspace/delete suffices
because clicking either focuses visually or makes a text cursor appear.

If anything inside has focus, the whole thing needs to show focus aura.

No shadow DOM: creates hidden inputs with selected values, no need to force the
use of Promeneur.

*/

/* eslint-env es2016, browser */
'use strict';

export {};
