@parent bit-docs/types
@typedef {{}} bit-docs/types/docObject DocObject

@description

An object that represents something that is documented.

@option {String} name The unique name of the object being documented.

@option {bit-docs/types/docType} type The "type" of [bit-docs/types/docObject].

@option {String} parent The name of the parent [bit-docs/types/docObject].

@option {String} description Markdown content specified by
[bit-docs-process-tags/tags/description]. Used in link title attributes so
keep it short.

@option {String} body Markdown content specified by
[bit-docs-process-tags/tags/body]. Can be as many lines as needed.

@option {Array.<String>} children An array of children names. This typically
gets added by the system based on the `parent` property.

@option {Array<{version: String, description: String}>} deprecated An array of
deprecated warnings specified by [bit-docs-dev/tags/deprecated].

@body

## Use

Any property added to a [bit-docs/types/docObject] is available to the
templates and the client.

Plugins add arbitrary properties to the [bit-docs/types/docObject] so it's not
possible to document them all.

The options documented above are the properties [bit-docs/types/docObject] is
most likely to have.

You can see a page's [bit-docs/types/docObject] by typing `docObject` in the
console.

Here is an example of the `docObject` for this page:

@codestart javascript
{
  "src":{
    "path":"docs/modules/bit-docs/docs/api/types/docObject.md"
  },
  "description":"\nAn object that represents something that is documented...\n",
  "parent":"bit-docs/types",
  "type":"typedef",
  "title":"DocObject",
  "types":[
    {
      "type":"Object",
      "options":[
        {
          "name":"name",
          "description":"The unique name of the object being documented.\n",
          "types":[
            {
              "type":"String"
            }
          ]
        },
        {
          "name":"type",
          "description":"The type of the DocType...\n",
          "types":[
            {
              "type":"String"
            }
          ]
        },
        {
          "name":"parent",
          "description":"The name of the parent [bit-docs/types/docObject].\n",
          "types":[
            {
              "type":"String"
            }
          ]
        },
        {
          "name":"description",
          "description":"The description html content specified by\n[bit-docs-process-tags/tags/description]...\n",
          "types":[
            {
              "type":"String"
            }
          ]
        },
        {
          "name":"body",
          "description":"The body html content specified by\n[bit-docs-process-tags/tags/body].\n",
          "types":[
            {
              "type":"String"
            }
          ]
        },
        {
          "name":"children",
          "description":"An array of children names...\n",
          "types":[
            {
              "type":"Array",
              "template":[
                {
                  "types":[
                    {
                      "type":"String"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "name":"deprecated",
          "description":"An array of\ndeprecated warnings created by [bit-docs-dev/tags/deprecated].\n",
          "types":[
            {
              "type":"Array",
              "template":[
                {
                  "types":[
                    {
                      "type":"Object",
                      "options":[
                        {
                          "name":"version",
                          "types":[
                            {
                              "type":"String"
                            }
                          ]
                        },
                        {
                          "name":"description",
                          "types":[
                            {
                              "type":"String"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "name":"bit-docs/types/docObject",
  "comment":" ",
  "pathToRoot":"../../.."
}
@codeend
