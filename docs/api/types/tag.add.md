
@typedef {function(this:bit-docs/types/docObject)} bit-docs-process-tags/types/tag.add Tag.add
@parent bit-docs-process-tags/types/tag

@description Called for lines starting with `@`.

@param {String} line `@` until newline.
@param {(bit-docs/types/docObject|Object)} curData [bit-docs/types/docObject]
or custom object.
@param {bit-docs/types/docObject} scope [bit-docs/types/docObject]
representing current scope.
@param {bit-docs/types/docMap} docMap [bit-docs/types/docMap] being added to.
@param {String} currentWrite HTML element to write to, such as `body`.
@param {DocumentJS.siteConfig} options Global site options.

@return {?(bit-docs-process-tags/types/processTagsCommand|Object)} Command or
custom object.

@body

## Use

A stack is used to handle tags that might be nested, for example `@codestart`
and `@codeend`. It provides something to collect data until the closing tag,
and have the compiled data "popped" to the parent.

Return an array matching a [bit-docs-process-tags/types/processTagsCommand] to run
a command on the stack. You can also return an object of your choosing to be
used later by the [bit-docs-process-tags/types/tag.addMore tag `addMore` method] to
accumulate strings for example like [bit-docs-js/tags/codestart].

`curData` might be a custom object in the case of for example
[bit-docs-js/tags/codeend] where the custom data object was hydrated by
[bit-docs-js/tags/codestart].
