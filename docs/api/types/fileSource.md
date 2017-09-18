@parent bit-docs/types
@typedef {String} bit-docs/types/fileSource FileSource

@description A file's serialized source as a string with characters escaped
like `\n`.

@body

## Use

[bit-docs/types/fileSource] is received by [bit-docs/lib/process/process]
from [bit-docs/types/FileEventEmitter] and passed to
[bit-docs/lib/process/file] which passes [bit-docs/types/fileSource] to the
processors in plugins like [bit-docs-process-tags] and [bit-docs-js] that do
the work of splitting on newlines as they see fit to convert
[bit-docs/types/fileSource] into [bit-docs-process-tags/types/tagBlock] or
[bit-docs-js/types/codeTagBlock]s. Processors you make might choose to do
something completely different with [bit-docs/types/fileSource].
