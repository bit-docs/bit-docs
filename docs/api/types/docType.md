@parent bit-docs/types
@typedef {String} bit-docs/types/docType DocType

@description

A string denoting the "type" of a [bit-docs/types/docObject].

@body

## Use

Some examples values:

- `page`
- `group`
- `module`
- `static`
- `typedef`
- `property`
- `function`
- `prototype`

Knowing the [bit-docs/types/docType]s of [bit-docs/types/docObject] might be
useful in styling [bit-docs/types/docObject] pages of the same type by using
the [bit-docs/types/docType] value to set class names on attributes in your
`.mustache` templates, or you can use the [bit-docs/types/docType] value in
`.mustache` template helpers.

For instance, the page you're looking at right now was generated using a
template that prints the [bit-docs/types/docObject] "type" to the right of
the page title.

That's the `typedef` in the "__DocObject__ `typedef`" the you see at the top
of this page.

Other pages print out different [bit-docs/types/docType] "type" values, some
from the list above.

For example, the [bit-docs/types/docType] of [bit-docs/lib/process/process]
is "module" and the `.mustache` template prints `module` in the title like
"__bit-docs/lib/process/process__ `module`".

 <!-- TODO: How else are DocTypes used in bit-docs? -->
 <!-- TODO: Do all examples DocType values from plugins? -->
 <!-- TODO: Where does "type" get set to f.ex "group" ? -->
 <!-- TODO: What is "static"? ? -->
