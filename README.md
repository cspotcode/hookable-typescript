Experiment to make extremely minimal changes to Typescript's codebase which add
extra APIs for hooking into the compiler.

See also:
https://github.com/TypeStrong/discussions/issues/5

## Motivation

Enable the creation of `pluggable-typescript`, which will be a drop-in replacement for the `typescript` package, providing language service, compiler API, CLI tool, the whole thing.

One-stop-shop for augmenting the compiler.  So many tools reinvent the wheel, supporting transformers, compiler
behavior changes, etc.  I think it would be helpful to the community if all these use-cases could be implemented on top
of a single plugin API.  hookable-typescript is *not* such a plugin API, but it *enables* one to be written, like the
hypothetical `pluggable-typescript`.

## Potential use-cases

Plugins might be written to do the following:

* yarn-pnp support: `"moduleResolution": "yarn-pnp"`
* `ttypescript`-style transformers support
* Custom diagnostic filtering.  Strip diagnostic codes that are annoying, or
change their severity.

## What is `hookable-typescript` vs `pluggable-typescript`?

`hookable-typescript` is a patched copy of `typescript` with hooks.  We can publish a new `hookable-typescript`
for each new release of `typescript`.

`pluggable-typescript` (hypothetical; does not exist yet) is a drop-in replacement for `typescript`
that supports a plugin system. (very different and more powerful than language service plugins)
It uses `hookable-typescript` as the underlying TypeScript implementation.

Most users will use `pluggable-typescript` and configure it with plugins via their `tsconfig.json`.  They will not know
or care about `hookable-typescript`.  For example, they install `pluggable-typescript@3.6.3`, which depends on `hookable-typescript@3.6.3`,
and behaves identically to `typescript@3.6.3`. (but with added plugin behaviors)

Tools like `ts-loader` support alternate compiler implementations.  These tools can be told to use `pluggable-typescript`.
In this way, `ts-loader` does not need to support custom transformers or diagnostics filtering because plugins can handle that.
`ts-loader` can be simpler and focus solely on being a good webpack loader.

## Why this approach?  Why 2 modules?

Not everything can be accomplished by monkey-patching the official typescript module.
Some things require code changes.  Hence `hookable-typescript` is necessary.

However, I think it would get very messy making large changes to the Typescript codebase, since we
want to keep up-to-date with all upstream changes.

By keeping the code changes as tiny as possible, we hopefully avoid painful merges with upstream
TypeScript releases.  When a new release of Typescript comes out, we should be able
to merge and publish a new version of `hookable-typescript` almost immediately.

Additionally, implementing larges changes in that same codebase means carrying around the
full weight of TypeScript's massive git history, coding standards, and build process.

`pluggable-typescript` should live in its own repository with a much lighter
test harness, coding standards, etc.  The bulk of development work will happen here.
It will be built against `hookable-typescript`'s API.

## Example usage

Suppose you want to implement `pluggable-typescript`, a drop-in replacement for the `typescript` module that
supports a plugin API.  To be a true drop-in replacement, it needs to:

* a) Implement the typescript library: `require('my-pluggable-typescript')` should expose the same API as `require('typescript')`
* b) Provide a `tsserver` executable so that editors like VSCode can use it as a language service
* c) Provide a `tsc`-compatible CLI tool.

Step 1: Your package should contain boilerplate that looks very similar to our examples: `hookable-bin` and `hookable-lib`
This is the minimum amount of code required to load hookable-typescript and delegate to it.  Without hooks installed,
this will function identically to vanilla Typescript.

Step 2: Modify the boilerplate files to install hooks by setting `ts.__hooks__`
Whatever behavioral changes you want to implement -- in this case, a custom plugin architecture --
should all be implemented using the hooks provided.

If the hooks aren't sufficient for your use-case, we should add additional hooks.

*Because this is such an early proof-of-concept, there are very few hooks.  We will need to add more.*
