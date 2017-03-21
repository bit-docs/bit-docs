# bit-docs

Loosely based on ideas and lessons learned from [DocumentJS](http://documentjs.com), bit-docs is an evolving set of tools that allow you to:

 - Write documentation inline or in markdown files.
 - Specify your code's behavior precisely with JSDoc
   and [Google Closure Compiler](https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler)
   annotations.

## Projects currently using bit-docs

 - [CanJS](https://github.com/canjs/canjs)
 - [StealJS](https://github.com/stealjs/stealjs)
 - [DoneJS](https://github.com/donejs/donejs)

## High-Level Overview

Fundamentally, the `bit-docs` tool (this repo) orchestrates "finder" plugins that help "suck in" raw data and "generator" plugins that help "spit out" structured documents from that data. The `bit-docs` tool sits happily between such plugins.

Depending on what plugins are used, input may be in the form of inline code comments, markdown files, or anything else you could imagine; output may be in the form of HTML, or any other format.

You could write "finder" and "generator" plugins for the `bit-docs` tool to orchestrate that are geared towards static site generation (such as a blog or generic website), but `bit-docs` is particularly useful for generating documention websites from your code projects.

### Usage 

To use bit-docs, you add it to the `package.json` of the project you want to use it with.

Next, in your project's `package.json`, you add a section called `bit-docs`, like:

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

Under the hood, bit-docs uses `npm` to install the `dependencies` defined under the `bit-docs` configuration in `package.json`. However, instead of installing packages into your project's top-level `node_modules`, bit-docs uses npm to install plugin packages to it's own directory:

```
./your-project/node_modules/bit-docs/lib/configure/node_modules
```

Maintaining this nested `node_modules` directory gives `bit-docs` complete control over this subset of plugin packages, enabling you to do things like use the `-f` flag to completely delete and reinstall the plugin packages. The force flag is particularly useful after updating the dependency list to remove a plugin package (it must be removed from `node_modules` to not be included).

Look at the `.gitignore` of this repo; you'll notice an entry for `lib/configure/node_modules/`, and entries for many other files that will be generated on the fly when `bit-docs` is run.

Using npm under the hood means things like the `file://` syntax in the `bit-docs` configuration for `dependencies` is fair game, which can be useful for local debugging of bit-docs plugins.

### Types of Plugins

There are two primary types of plugins: "finders" and "generators".

#### Finders

Finder plugins find files to slurp in; see the default finder:

- <https://github.com/bit-docs/bit-docs-glob-finder>

#### Generators

Generators work in tandem building finalized files to spit out:

- <https://github.com/bit-docs/bit-docs-generate-html>
- <https://github.com/bit-docs/bit-docs-html-toc>
- <https://github.com/bit-docs/bit-docs-generate-readme>

#### Modifiers

Modifier plugins add non-critical functionality, such as making the output pretty:

- <https://github.com/bit-docs/bit-docs-prettify>
- <https://github.com/bit-docs/bit-docs-html-highlight-line>

Find more plugins at the [bit-docs organization on GitHub](https://github.com/bit-docs).
