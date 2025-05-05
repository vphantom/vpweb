# BROWSER SUPPORT

Interesting modern CSS features according to <https://web.dev/baseline> as of 2024-12-14 which we're not yet utilizing fully here.

## Widely Available

### At-Rules

* `@layer` — cascade layers
* `@media` — rule
* `@supports` — feature query
* Media queries: `pointer`, `any-pointer`, `hover`, `any-hover`

### Pseudo-Elements

* `::file-selector-button`
* `::placeholder`

### Pseudo-Classes

* `:default`
* `:empty`
* `:focus-visible`
* `:focus-within`
* `:lang()` — functional
* `:link`, `:visited`, `:any-link`
* `:placeholder-shown`
* `:target`

### Properties

* System colors: `ButtonBorder`, `LinkText` etc.
* User action: `:active`, `:focus` and `:hover`
* `appearance`
* `aspect-ratio`
* `clamp()`, `min()`, `max()`
* `color-scheme`
* `column-fill` — multi-column layout
* `filter()`
* `fit-content` — keyword
* `font-optical-sizing`
* `grid` — how is it vs flex?
* `isolation`
* `min-content`, `max-content` — keywords
* `overflow-wrap` — (word-wrap?)
* `pointer-events`
* `sticky` — position keyword
* `text-indent`
* `vh, vw` — units relative to viewport
* `will-change`
* `word-break`
* `writing-mode` — for vertical text

### Forms

* Elements: `:checked`, `:disabled`, `:enabled`
* Validity: `:valid`, `:invalid`, `:in-range`, `:out-of-range`, `:optional`, `:required`

## Newly Available

This is slightly risky but acceptable for non-essential features.

### Media Queries

Smartphones would match `hover:none` and `pointer:coarse`.

### Functions

* `calc()` keywords
* `round()`, `mod()`, `rem()`

### Pseudo-classes

* `:has()` — from C105 FF121 S15.4, will graduate in June 2026
* `:use-valid`, `:user-invalid` — from C119 FF88 S16.5

```css
/* Creating a fallback for browsers without :has() */
@supports not selector(:has(a)) { ... }
```

### Properties

`content-visibility: auto` delays rendering until close to viewport, which is harmless if ignored so we can use it now, for example for `.grid .cell`.

### Nesting

Nesting would be great but the spec changed part-way, so C120 F117 S17.2 seems too risky for 2025.  It only appears in FF ESR 128.
