var processTags = require("bit-docs-process-tags");
var addDocObjectToDocMap = require("./add_doc_object_to_doc_map");
var _ = require('lodash');
var path = require("path");

var ignoreCheck = new RegExp("@"+"documentjs-ignore");

/**
 * @parent bit-docs/modules
 * @module {function} bit-docs/lib/process/file
 *
 * Processes a file's source. Adds created [bit-docs/types/docObject]s to the
 * [bit-docs/types/docMap].
 *
 * @signature `processFile(filename, source, docMap, siteConfig)`
 *
 * Processes a file's source and calls [bit-docs-js/process/codeAndComment]
 * accordingly. If the file ends with `.js`, each comment will be processed
 * individually. Otherwise, it treats the entire source as one big comment.
 *
 * @param {String} filename The filename. If a filename is not provided, the
 * entire file is treated as one big comment block. If a filename is provided
 * and is not a `.md` or `.markdown` file, it is assumed to be a source file.
 *
 * @param {String} source A files source.
 * 
 * @param {bit-docs/types/docMap} docMap A map of the name of each
 * [bit-docs/types/docObject] to the [bit-docs/types/docObject].
 *
 * @param {{}} [siteConfig] An siteConfig object. Currently only the `tags`
 * option is used.
 *
 *   @option {Object} tags A collection of tags. If `siteConfig` or
 *   `siteConfig.tags` is not provided, the default tags will be used.
 *
 * @body
 *
 * ## Use
 *
 *     var processFile = require('bit-docs/lib/process/file');
 *     var docMap = {};
 *     var siteConfig = {};
 *     processFile(
 *       "myproject.js",
 *       "import $ from 'jquery' ... ",
 *       docMap,
 *       siteConfig
 *     );
 */
module.exports = function processFile(filename, source, docMap, siteConfig) {
	if(siteConfig.debug) {
		console.log("PROCESSING:", path.relative(process.cwd(),filename));
	}

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
		var handled = processor(filename, source, docMap, siteConfig, addToDocMap);
		if(addToDocMapCalled || handled) {
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
