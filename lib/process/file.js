var processTags = require("bit-docs-process-tags"),
	addDocObjectToDocMap = require("./add_doc_object_to_doc_map"),
	_ = require('lodash');

var ignoreCheck = new RegExp("@"+"documentjs-ignore");
/**
 * @function documentjs.process.file
 * @parent documentjs.process.methods
 *
 * Processes a file's source.  Adds created [documentjs.process.docObject docObjects] to docMap.
 *
 * @signature `documentjs.process.file(source, docMap, [filename])`
 *
 * Processes a file's source and calls [documentjs.process.codeAndComment] accordingly. If
 * the file ends with `.js`, each comment will be processed individually.  Otherwise,
 * it treats the entire source as one big comment.
 *
 *
 * @param {String} source A files source
 * @param {documentjs.process.docMap} docMap A map of the name of each DocObject to the DocObject
 *
 * @param {String} [filename] The filename.  If a filename is not provided,
 * the entire file is treated as one big comment block.  If a filename is provided
 * and is not a .md or .markdown file, it is assumed to be a source file.
 *
 * @param {{}} [siteConfig] An siteConfig object. Currently only the `tags` option is used.
 *
 * @option {Object} tags A collection of tags.  If `siteConfig` or `siteConfig.tags` is not
 * provided, the default tags will be used.
 *
 * @body
 *
 * ## Use
 *
 *     var docMap = {};
 *     documentjs.process.file("import $ from 'jquery' ... ",
 *          docMap,
 *          "myproject.js");
 *
 */
module.exports = function processFile(filename, source, docMap, siteConfig ) {
	if (ignoreCheck.test(source)) {
		return;
	}
	var scope = {
			type: "script",
			name: filename + ""
		},
		addToDocMapCalled = false,
		addToDocMap = function(docObject, newScope){
			addToDocMapCalled = true;
			docObject && addDocObjectToDocMap(docObject, docMap, filename);
			if (newScope) {
				scope = newScope;
			}
		};
	// loop through registered processors ... if processor doesn't call `addDocObjectToDocMap`
	// we call the next processor

	var processed = siteConfig.processors.some(function(processor){
		processor(filename, source, docMap, siteConfig, addToDocMap);
		if(addToDocMapCalled) {
			return true;
		}
	});
	if(!processed) {
		processTags({
			comment: source,
			docMap: docMap,
			scope: scope,
			docObject: {src: {path: filename}},
			tags: siteConfig.tags
		}, addToDocMap);
	}

};
