@parent plugins
@module {function} bit-docs
@group bit-docs/types types
@group bit-docs/modules modules

@description

This package provides the command-line interface and and plugin framework for
bit-docs.

@signature `bitDocs(pathToPackageJSON, options)`

Bootstraps a command-line interface and plugin framework that provides the
necessary scaffolding for an ecosystem of plugins that find files to read in
as [bit-docs/types/fileSource], process [bit-docs/types/fileSource] to make a
[bit-docs/types/docMap] from [bit-docs/types/docObject]s, or take a
[bit-docs/types/docMap] and generate a static distributable.

@body
