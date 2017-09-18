@parent bit-docs/types
@typedef {function()} bit-docs/types/processorCallback ProcessorCallback

@description Callback passed to processors that can be used to add a new
[bit-docs/types/docObject] to the [bit-docs/types/docMap].

@option {bit-docs/types/docObject} newDoc
  
[bit-docs/types/docObject] created from processing the block.

@option {bit-docs/types/docObject} newScope

[bit-docs/types/docObject] that will be used for scoping the next block.
