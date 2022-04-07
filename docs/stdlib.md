# Standard Library

Add-on conveniences to make writing Vanilla JavaScript more expressive.

<!-- BEGIN DOC-COMMENT H2 js/stdlib.js -->

## `function iter(list, f)`

Iterator of anything indexable with a length.  Skips undefined items. 


**Parameters:**

* `list` — `*` — What to iterate over
* `f(item,i)` — `function(*,number):void` — Operation to perform


## `function iter_f(f)`

Create an iterator which will skip undefined items. 


**Parameters:**

* `f(item,i)` — `function(*,number):void` — Operation to perform

**Returns:** `function(*):void` — Function which will iterate over its argument


## `function iter_obj(obj, f)`

Iterate over all keys of an object.  Does not filter. 


**Parameters:**

* `obj` — `Object` — What to iterate over
* `f(key,value)` — `function(string,*):void` — Operation to perform on each key


## `function map(list, f)`

Filtering mapper of anything indexable with a length, skipping undefined items and undefined callback results. 


**Parameters:**

* `list` — `*` — What to iterate over
* `f(item,i)` — `function(*,number):*` — Map an item into another value

**Returns:** `Array` — All non-undefined results of f()


## `function map_obj(obj, f)`

Map an object by key to an array. 


**Parameters:**

* `obj` — `Object` — What to iterate over
* `f(key,value)` — `function(string,*):*` — Map a key to another value

**Returns:** `Array` — All results of f()


## `function fold(list, acc, f)`

Fold anything indexable with a length. 


**Parameters:**

* `list` — `*` — What to iterate over
* `acc` — `*` — Initial value for your accumulator
* `f(acc,item,i)` — `function(*,*,number):*` — Update accumulator with new value


## `const shift`

Shift operation for Array-like objects 

Alias of `Array.prototype.shift()` 



## `const shifter`

Create a function which will shift this array-like thing 


**Parameters:**

* `list` — `Object` — Anything

**Returns:** `function():*` — Function which will shift list at each call


## `function cmp(a, b)`

Compare two scalars, returning 1, 0 or -1 depending on whether A is greater than, equal to or less than B. 


**Parameters:**

* `a` — `string|number`
* `b` — `string|number`

**Returns:** `number` — Result


## `function cmp_bool(f, a, b)`

Compare two things with a callback, returning 1, 0 or -1 depending on whether f(a), both or f(b) are true. 


**Parameters:**

* `f` — `function(*):boolean` — Evaluator


## `function isPlainObject(o)`

Tests whether something is a plain object (a.k.a. "object literal"). 


**Parameters:**

* `o` — `*` — Anything

**Returns:** `boolean` — Result

<!-- END DOC-COMMENT -->

