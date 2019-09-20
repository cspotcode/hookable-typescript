Experiment to make extremely minimal changes to Typescript's codebase which add
extra APIs for hooking into the compiler.

See also:
https://github.com/TypeStrong/discussions/issues/5

---

By keeping the code changes minimal, we hopefully avoid painful merges with upstream
TypeScript changes.  When a new release of Typescript comes out, we should be able
to publish a new hookable-typescript immediately.

These hooks are meant to be used by an external module to implement a more extensive
plugin system on top of the compiler.

## Potential use-cases:

* yarn pnp support
* `ttypescript`-style transformers support
* Custom diagnostic filtering.  Strip diagnostics that are annoying, or
change their severity.

## Goals:

Facilitate drop-in replacements for the `typescript` package from npm. (language service, compiler API, CLI tool, the whole thing)

One-stop-shop for augmenting the compiler.  So many tools reinvent the wheel, supporting transformers, compiler
behavior changes, etc.  I think it would be helpful to the community if all these use-cases could be implemented on top
of a single plugin API.  hookable-typescript is *not* such a plugin API, but it *enables* one to be written.

---

## Example usage

Suppose you want to implement a drop-in replacement for the `typescript` module that
supports a plugin API.  To be a true drop-in replacement, it needs to:

* a) Implement the typescript library: `require('my-pluggable-typescript')` should expose the same API as `require('typescript')`
* b) Provide a `tsserver` executable so that editors like VSCode can use it as a language service
* c) Provide a `tsc`-compatible CLI tool.

Step 1: Your package should contain boilerplate that looks very similar to our examples: `hookable-bin` and `hookable-lib`
This is the minimum amount of code required to load hookable-typescript and delegate to it.  Without hooks installed,
this will function identically to vanilla Typescript.

Step 2: Modify the boilerplate files to install hooks by setting `ts.__hooks__`
Whatever behavioral changes you want to implement: a custom plugin architecture, support for custom transformers,
diagnostic filtering, etc... it should all be implemented using the hooks provided.

If the hooks aren't sufficient for your use-case, we should add additional hooks.

*Because this is such an early proof-of-concept, there are very few hooks.  We will need to add more.*
