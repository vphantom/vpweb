# CONTRIBUTING

## CSS Organization

* We do not use any CSS pre-processing, thanks to excellent support for variables, `calc()`, etc.
* CSS is organized into layers: `vp.core`, `vp.layouts`, `vp.components`, and `vp.util`.
* Each layer has a specific purpose:
  * `vp.core`: Base variables, resets, and foundational styles
  * `vp.layouts`: Layout patterns like grids and containers
  * `vp.components`: UI components like forms, tables, and tabs
  * `vp.util`: Helper classes and utilities

## CSS Rules

* Custom elements and attributes should be prefixed with `vp-`.
* All names should be as short as possible without losing meaning. (i.e. `.vp-msg` remains obvious while `.vp-m` would not.)
* Class names may omit the `vp-` prefix where it helps with syntax, but in this case the selectors must be suffixed with `:is(.vp, .vp *):not(.xvp, .xvp *)` to minimize conflicts with other frameworks.
* When a selector should naturally have an argument, use a custom attribute instead of a class, like `vp-grid="12"`.
* Use `:where()` for selectors that should have lower specificity and `:is()` for those that need higher specificity.

## Variables

* All CSS variables should be prefixed with `--vp-`.
* Use semantic naming for variables (e.g., `--vp-corner` for border radius, `--vp-pad` for padding).
* Color variables should follow the pattern `--vp-color` for RGB values and `--vp-color-opacity` for RGBA variants.

## Media Queries

* Use consistent breakpoint naming throughout: `mobile`, `tablet`, `desktop`.
* Desktop-first is acceptable, provided that all sizes and pointers are fully supported.
* Standard breakpoints:
  * Mobile: below 768px
  * Tablet: 768px to 992px
  * Desktop: 992px and above
  * Large desktop: 1200px and above
  * Touch: `any-pointer: coarse`

## Code Style

* Use Prettier with our `.prettierrc` for consistency.
* Group related properties together.
* Include helpful comments for complex code sections or calculations.
* Note future improvements with `/* TODO: ... */` format.
* Do not use features not yet available in Baseline's "Widely Available" as of 2025-01-01. (See `BROWSER_SUPPORT.md`.) The only exceptions are for graceful non-essential upgrades like `content-visibility`.

## JavaScript

TBD
