@parent bit-docs/types
@typedef {function()} bit-docs/types/generator Generator

A generator module should produce a function that takes the following shape.
Generator modules are used to produce some form of documentation output.
[bit-docs-generate-html] is the default and currently only generator
packaged with bit-docs.

@param {Promise<bit-docs/types/docMap>} docMapPromise A promise that will
resolve with a map of all [bit-docs/types/docObject] keyed by their name.

@param {options} options The options object passed to
[bit-docs/lib/generate/generate]. 

@return {Promise} A module that resolves when the output has been built.

@body

## Use

The following exports a generator function that builds a JSON output of the
[bit-docs/types/docObject]:

    var Q = require('q'),
        fs = require('fs'),
        writeFile = Q.denodify(fs.writeFile),
        path = require('path');
        
    module.exports = function(docMapPromise, options){
       return docMapPromise.then(function(docMap){
         return writeFile(
             path.join(options.dest,'docMap.json'), 
             JSON.stringify(docMap) );
       });
    };
