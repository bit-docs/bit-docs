@parent bit-docs/types
@typedef {Object<String,bit-docs/types/docObject>} bit-docs/types/docMap DocMap

An object that contains every [bit-docs/types/docObject] keyed by the
[bit-docs/types/docObject]'s name.

Example of a docMap:

```js
{
  "api": {
    "src": {
      "path": "docs/api.md"
    },
    "body": "...",
    "description": "...",
    "name": "api",
    "title": "API",
    "type": "page",
    "parent": "homepage",
    "order": 1
  },
  "my-module": {
    "name": "my-module",
    "type": "module",
    "parent": "api",
    "src": {
      "line": 0,
      "codeLine": 10,
      "path": "docs/my-module/index.js"
    },
    "body": "...",
    "description": "...",
    "title": "",
    "types": [
      {
        "type": "function",
        "returns": {
          "types": [
            {
              "type": "undefined"
            }
          ]
        },
        "params": []
      }
    ],
    "comment": " "
  },
  "my-module/components": {
    "name": "my-module/components",
    "title": "components",
    "type": "group",
    "parent": "my-module",
    "description": "",
    "order": 0
  },
  "my-module/a-component": {
    "type": "module",
    "name": "my-module/a-component",
    "parent": "my-module/components",
    "src": {
      "line": 8,
      "codeLine": 24,
      "path": "docs/my-module/a-component.js"
    },
    "body": "...",
    "description": "...",
    "title": "",
    "types": [
      {
        "type": "function",
        "returns": {
          "types": [
            {
              "type": "undefined"
            }
          ]
        },
        "params": []
      }
    ],
    "signatures": [
      {
        "code": "aComponent(aPromise, aConfig)",
        "description": "...",
        "params": [
          {
            "types": [
              {
                "type": "Promise",
                "template": [
                  {
                    "types": [
                      {
                        "type": "String"
                      }
                    ]
                  }
                ]
              }
            ],
            "name": "aPromise",
            "description": "..."
          },
          {
            "types": [
              {
                "type": "Object",
                "options": []
              }
            ],
            "name": "aConfig",
            "description": "..."
          }
        ],
        "returns": {
          "types": [
            {
              "type": "Promise"
            }
          ],
          "description": "..."
        }
      }
    ],
    ...
```
