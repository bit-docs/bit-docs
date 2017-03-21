# bit-docs

Loosely based on ideas and lessons learned from [DocumentJS](http://documentjs.com), bit-docs is an evolving set of tools that allow you to:

 - Write documentation inline, or in markdown files.
 - Specify your code's behavior precisely with JSDoc
   and [Google Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)
   annotations.
- Generate a ready-to-publish website from that documentation.

## High-Level Overview

Fundamentally, the `bit-docs` tool (this repo) orchestrates "finder" plugins that help "suck in" raw data and "generator" plugins that help "spit out" structured documents from that data. The `bit-docs` tool sits happily between such plugins.

Depending on what plugins are used, input may be in the form of inline code comments, markdown files, or anything else you could imagine; output may be in the form of HTML, or any other format.

You could write "finder" and "generator" plugins for the `bit-docs` tool to orchestrate that are geared towards static site generation (such as a blog or generic website), but `bit-docs` is particularly useful for generating documention websites from your code projects.

### Projects currently using bit-docs

 - [CanJS](https://github.com/canjs/canjs) — [Generated website](http://canjs.com)
 - [StealJS](https://github.com/stealjs/stealjs) — [Generated website](http://stealjs.com)
 - [DoneJS](https://github.com/donejs/donejs-next) — [Generated website](https://donejs.github.io/donejs-next)

### Usage 

It is possible to add bit-docs as a dependency to the actual repo you wish to document, but we have found creating an entirely new repo that will pull in the repo(s) that you wish to document is a better paradigm. It is especially useful to have a repository dedicated to generating documentation with bit-docs when pulling in multiple codebases, perhaps including their multiple versions, and wishing to generate a unified website. This is the strategy used by StealJS and DoneJS.

To use bit-docs, add it to the `package.json` of the project you want to use it in:

```
npm install bit-docs --save-dev
```

Next, in your project's `package.json`, add a section called `bit-docs`, like:

```
  "bit-docs": {
    "dependencies": {
      "bit-docs-glob-finder": "*",
      "bit-docs-dev": "*",
      "bit-docs-js": "*",
      "bit-docs-generate-html": "*"
    },
    "glob": {
      "pattern": "docs/**/*.{js,md}"
    },
    "parent": "indexfile",
    "minifyBuild": false
  }
```

If you created a new repo specifically to hold this bit-docs stuff, you may wish to add the codebases you will be documenting as normal `package.json` dependencies at this time. You will need to update the `bit-docs` glob pattern to be similar to what the StealJS website repo does:

```
    "glob": {
      "pattern": "{node_modules,doc}/{steal,grunt-steal,steal-*}/**/*.{js,md}",
      "ignore": [
        "node_modules/steal/test/**/*",
        "node_modules/steal-tools/test/**/*",
        "node_modules/steal-conditional/{demo,test,node_modules}/**/*"
      ]
	},
```

Under the hood, bit-docs uses `npm` to install the `dependencies` defined under the `bit-docs` configuration in `package.json`. However, instead of installing packages into your project's top-level `node_modules`, bit-docs uses npm to install plugin packages to it's own directory:

```
./your-project/node_modules/bit-docs/lib/configure/node_modules
```

Maintaining this nested `node_modules` directory gives `bit-docs` complete control over this subset of plugin packages, enabling you to do things like use the `-f` flag to completely delete and reinstall the plugin packages. The force flag is particularly useful after updating the dependency list to remove a plugin package (it must be removed from `node_modules` to not be included).

Look at the `.gitignore` of this repo; you'll notice an entry for `lib/configure/node_modules/`, and entries for many other files that will be generated on the fly when `bit-docs` is run.

Using npm under the hood means things like the `file://` syntax in the `bit-docs` configuration for `dependencies` is fair game, which can be useful for local debugging of bit-docs plugins.

### Plugins

There are four handlers that any given bit-docs plugin can hook into, and a plugin could hook into all of these actions at once, but following the unix philosophy, bit-docs plugins should strive to do one thing only, and do it well. Therefore, most plugins will only hook into one or two of these handlers to accomplish their intended task.

#### Finder

Plugins that hook into the `finder` handler affect how bit-docs searches for source files.

The default finder supports glob syntax, and should be sufficient for most use-cases:

- <https://github.com/bit-docs/bit-docs-glob-finder>

You might need to create a plugin that hooks into the `finder` handler if you're pulling source from a database or some other location not on the working filesystem.

### Processor

Plugins that hook into the `processor` handler augment how found files are processed.

By default, the following plugin is included by default in the core of bit-docs:

- <https://github.com/bit-docs/bit-docs-process-tags>

This is because that plugin provides the extremely common task of processing "tags". A tag is an identifier, usually embedded in source code comments, that provides documentation or information about some functionality, inline in the source code itself. Some default tags are:

- `@add`
- `@body`
- `@description`
- `@hide`
- `@parent`

For an example of a processor plugin that's not included by default, see:

- <https://github.com/bit-docs/bit-docs-process-mustache>

#### Generator

Plugins that hook into the `generator` handler output something from the processed data.

For example, see these bit-docs plugins that output HTML files:

- <https://github.com/bit-docs/bit-docs-generate-html>
- <https://github.com/bit-docs/bit-docs-html-toc>
- <https://github.com/bit-docs/bit-docs-generate-readme>

#### Tag

Plugins that hook into the "tag" handler add new tags like `@yourtag` to the default processing that bit-docs already does to source file comments.

For example, see these bit-docs plugins for prettifying source-code snippets:

- <https://github.com/bit-docs/bit-docs-prettify>
- <https://github.com/bit-docs/bit-docs-html-highlight-line>

Find more plugins at the [bit-docs organization on GitHub](https://github.com/bit-docs).

## Program Flow

When bit-docs gets run, the following flow happens:

- `bit-docs/bin/bit-docs` is triggered, and passed command flags are parsed as options.
	- Next, the module export in `main.js` is called with the `package.json` path and options.
- `main.js` uses `lib/configure/configure.js` to get a `siteConfig` which is passed to `lib/generate/generate.js`.
	- `configure.js` will install plugin packages defined in the `bit-docs` section of `package.json`.
	- Next, `configure.js` will allow each installed plugin to register itself to whatever handlers.
- `generate.js` takes that configuration and passes it to those plugins registered as "generator" plugins.

## Contributing

Want to help make `bit-docs` even better? See [`CONTRIBUTING.md`](CONTRIBUTING.md).

Looking for a changelog? Try the [releases page on GitHub](https://github.com/bit-docs/bit-docs/releases).
