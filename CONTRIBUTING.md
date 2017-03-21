# Contributing

For general contributing guidelines, see the [Contributing Guide on DoneJS.com](https://donejs.com/contributing.html).

## Code Organization

    bit-docs
    └── package.json

## Program Flow

When bit-docs gets run, the following flow happens:

- `bit-docs/bin/bit-docs` is triggered, and passed command flags are parsed as options.
	- Next, the module export in `main.js` is called with the `package.json` path and options.
- `main.js` uses `lib/configure/configure.js` to get a `siteConfig` which is passed to `lib/generate/generate.js`.
	- `configure.js` will install plugin packages defined in the `bit-docs` section of `package.json`.
	- Next, `configure.js` will allow each installed plugin to register itself to whatever handlers.
- `generate.js` takes that configuration and passes it to those plugins registered as "generator" plugins.

## Developing Locally

### Setup

Fork and clone this repository. See [Fork A Repo](https://help.github.com/articles/fork-a-repo) and [Cloning a repository](https://help.github.com/articles/cloning-a-repository) for help.

Install the packages defined in [`package.json`][]:

```shell
npm install
```

### Build

There is no build step for this repo.

### Test

Tests are located in [`test.js`][], at the root of this repo.

## Getting Help

[Our forums](http://forums.donejs.com) and [Gitter chat](https://gitter.im/donejs/donejs) are the best places to ask questions.

[`package.json`]: package.json
[`test.js`]: test.js
