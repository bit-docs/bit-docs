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

Technically you could write "finder" and "generator" plugins for the `bit-docs` tool to orchestrate that are geared towards static site generation (such as a blog or generic website), but `bit-docs` is particularly useful for generating documention websites for your code projects.

### Usage 

To use `bit-docs`, you add it to the `package.json` of the project you want to use it with.

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

Under the hood, when you run the `bit-docs` command, it uses `npm` to install the dependencies defined under `bit-docs` configuration in `package.json`. Instead of installing the packages into your project's top-level `node_modules`, it installs the packages to, for example:

```
./your-project/node_modules/bit-docs/lib/configure/node_modules
```

Notice that bit-docs is maintaining it's own `node_modules` directory.

This is so that `bit-docs` has complete control over this subset of plugin packages, for when we need to do things like use the `-f` flag to completely delete and reinstall the plugins. It is particularly necessary to use the force flag after removing a package from the dependency list, to clear it out.

To drive home this point, look at the `.gitignore` of this repo; you'll notice an entry for `lib/configure/node_modules/`, as well as entries for many other files that will be generated on the fly and stored within when `bit-docs` is run.

You can use the npm `file://` syntax in the `bit-docs` configuration for `dependencies` thanks to the fact that it uses npm under the hood. This is an important point for local debugging of your bit-docs plugins.

### Types of Plugins

There are two types of plugins; "finders" and "generators".

#### Finders

Finder plugins find files to slurp in. See the default finder:

- <https://github.com/bit-docs/bit-docs-glob-finder>

#### Generators

Generators work together creating new files to spit out:

- <https://github.com/bit-docs/bit-docs-generate-html>
- <https://github.com/bit-docs/bit-docs-html-toc>
- <https://github.com/bit-docs/bit-docs-generate-readme>

#### Supplemental Plugins

There are also plugins that add non-critical functionality such as:

- <https://github.com/bit-docs/bit-docs-prettify>
- <https://github.com/bit-docs/bit-docs-html-highlight-line>
