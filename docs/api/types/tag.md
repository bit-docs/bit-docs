@parent bit-docs/types
@typedef {{}} bit-docs/types/tag Tag

@description

The interface that [bit-docs/types/tagCollection] implements.

Used for [bit-docs-js/process/codeAndComment] and [bit-docs-js/process/code].

Note: This is very likely to change to something better.

@option {function(String):Boolean} codeMatch(codeLine) Returns `true` if this
tag should process this line of code.

[bit-docs-js/process/code] passes the line of code after a comment block to
each tag's `codeMatch` function. The first tag whose `codeMatch` returns true
will have its `code` method called with the same line.

@option {function(String, bit-docs/types/docObject, bit-docs/types/docMap):bit-docs/types/docObject} code(codeLine, scope, docMap)
Returns properties that should be set on the comment's [bit-docs/types/docObject].

@option {Boolean} [codeScope=false] If `code(codeLine)` returns a
[bit-docs/types/docObject], set this object as the new scope.

@option {function(this:bit-docs/types/docObject,String,Object,bit-docs/types/docObject, bit-docs/types/docMap,String,DocumentJS.siteConfig):} add(line, curData,scope, docMap, currentWrite, options)

The `add` function is called when a comment line starts with `@` followed by
the tag name.

An `add` function can do things like:
 - Add directly to the [bit-docs/types/docObject].
 - Push something onto the stack:
   - `['push', data]`
 - Pop some data off the stack:
   - `['pop', String]`
 - Change the default property lines are written to
   - `['default', propName]`
 - Add to [bit-docs/types/docMap]:
   - `['add', docObject]`. 
 - Change the scope:
   - `['scope', scopeDocObject]`
 - Change the scope and the [bit-docs/types/docObject] being added to:
   - `['scope', scopeDocObject, docObject]`

The stack is used to handle tags that might be nested, for example
`@codestart` and `@codeend`. It provides something to collect data until the
closing tag, and have the compiled data "popped" to the parent.

@option {function(this:bit-docs/types/docObject,String,Object,bit-docs/types/docObject, bit-docs/types/docMap):} addMore(line, curData,scope, docMap)

`addMore` is called if `add` returns an object.

@option {function(this:bit-docs/types/docObject,String,Object,bit-docs/types/docObject, bit-docs/types/docMap):} end(line, curData,scope, docMap)

`end` is called on a tag when the comment switches to another tag.
