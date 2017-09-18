var processTags = require("bit-docs-process-tags");
var addDocObjectToDocMap = require("./add_doc_object_to_doc_map");
var _ = require('lodash');
var path = require("path");

var ignoreCheck = new RegExp("@"+"documentjs-ignore");

/**
 * @parent bit-docs/modules
 * @module {function} bit-docs/lib/process/file
 *
 * @description Processes a file's source using any registered processors.
 *
 * @signature `processFile(filename, source, docMap, siteConfig)`
 *
 * Passes the file source (and other data) to any registered processors like:
 * - [bit-docs-js/process/codeAndComment]
 * - [bit-docs-process-mustache/process-mustache]
 * 
 * Also passes a [bit-docs/types/processorCallback] that processors can use
 * to add [bit-docs/types/docObject]s to the [bit-docs/types/docMap].
 * 
 * @param {String} filename The filename.
 *
 * @param {bit-docs/types/fileSource} source The file's source.
 * 
 * @param {bit-docs/types/docMap} docMap [bit-docs/types/docMap] being added to.
 *
 * @param {{}} [siteConfig] Global site config.
 *
 *   @option {bit-docs-process-tags/types/tagCollection} tags If `siteConfig` or
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
 * 
 * Falls back to default processor [bit-docs-process-tags] if no processor was
 * able to process.
 * 
 * For `.js` code files, each block will be processed individually by
 * [bit-docs-js/process/codeAndComment].
 * 
 * For other files like `.md`, processors will process the file source as one
 * big block.
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
	// loop through registered processors ... if processor doesn't call
	// `addToDocMap` we call the next processor
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
