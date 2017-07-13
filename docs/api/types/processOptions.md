@parent bit-docs/types
@typedef {{}} bit-docs/types/processOptions ProcessOptions

An options object passed to several process methods.

@option {bit-docs/types/tagCollection} tags 

The tag collection to be used to process the comment.

@option {String} comment 

The comment to be converted.

@option {bit-docs/types/docObject} scope 

A [bit-docs/types/docObject] that can be a parent to the current
[bit-docs/types/docObject].

@option {bit-docs/types/docMap} docMap 

The map of all [bit-docs/types/docObject]s.

@option {bit-docs/types/docObject} [docObject] If provided, this will be used
as the [bit-docs/types/docObject]. This is useful for adding properties to an
existing object.

@option {String} [code] The code immediately preceeding the comment.

@body

Some process methods that [bit-docs/types/processOptions] is passed to:
- [bit-docs-js/process/code]
- [bit-docs-js/process/codeAndComment]
- [bit-docs-process-tags/process-tags]
