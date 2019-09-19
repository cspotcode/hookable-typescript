Experiment to make extremely minimal changes to Typescript's codebase to add
extra APIs for hooking into the compiler.

By keeping the code changes minimal, we hopefully avoid painful merges with upstream
TypeScript changes.

These hooks can be used by an external module to implement a more extensive
plugin system on top of the compiler.

## Potential use-cases:
* yarn pnp support
* integrate ttypescript

## Goals:

Drop-in replacement for the `typescript` package from npm. (language service, compiler API, CLI tool, the whole thing)

One-stop-shop for augmenting the compiler.  So many tools reinvent the wheel, supporting transformers, compiler
behavior changes, etc.  I think it would be helpful to the community if all these use-cases could be implemented on top
of a single plugin API.
