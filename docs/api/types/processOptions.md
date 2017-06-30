@parent bit-docs/types
@typedef {{}} bit-docs/types/processOptions processOptions

An options object passed to several process methods such as:
- [bit-docs-js/process/code]
- [bit-docs-js/process/codeAndComment]
- [bit-docs-process-tags/process-tags]

@option {bit-docs/types/tags} tags 

The tag collection to be used to process the comment.

@option {String} comment 

The comment to be converted

@option {documentjs.process.docObject} scope 

A docObject that can be a parent to the current docObject.

@option {documentjs.process.docMap} docMap 

The map of all docObjects.

@option {documentjs.process.docObject} [docObject] If provided, this will 
be used as the docObject.  This is useful for adding properties to an existing object.

@option {String} [code] The code immediately preceeding the comment.
