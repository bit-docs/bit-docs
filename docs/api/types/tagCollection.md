@parent bit-docs/types
@typedef {{}} bit-docs/types/tagCollection TagCollection

@option {Object<String,bit-docs/types/tag>}

A collection of tags to be used by [bit-docs/lib/process/file] to process
comments and code.

@body

## Use

A tag adds additional information to the comment being processed.

For example, if you want the current comment to include the author, include
an [bit-docs-dev/tags/author] tag.

## Creating your own tag

To create a tag, you need to add to register on the `tags` hook in your
plugins `bit-docs.js` file an object with your tag containing an add and an
optional `addMore` method like:

    var tags = {
        "mytag": {
            addMore: function (line, last) { ... },
            add: function (line) { ... }
        }
    };

    for(var name in tags) {
        tags[name].name = name;
    }

    bitDocs.register("tags", tags);
