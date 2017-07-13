@parent bit-docs/types
@typedef {{}} bit-docs/types/docObject DocObject

@description

An object that represents something that is documented.

Any property added to a [bit-docs/types/docObject] is available to the
templates and the client.

The following lists the important, near universal properties:

@option {String} name The unique name of the object being documented.

@option {String} type The type of the DocType. This typically represents the
type of the object being documented:

 - `constructor`
 - `prototype`
 - `static`
 - `function`
 - `property`
 - `typedef`
 - `module`

@option {String} parent The name of the parent [bit-docs/types/docObject].

@option {String} description The description html content specified by
[bit-docs-process-tags/tags/description]. This should typically be one or two
sentences.

@option {String} body The body html content specified by
[bit-docs-process-tags/tags/body].

@option {Array.<String>} children An array of children names. This typically
gets added by the system based on the `parent` property.

@option {Array<{version: String, description: String}>} deprecated An array of
deprecated warnings created by [bit-docs-dev/tags/deprecated].

@body

## Use

You can see a page's [bit-docs/types/docObject] by typing `docObject` in the
console.

Here is an example of the `docObject` for this page:

```js
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
```
