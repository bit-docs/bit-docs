var Q = require("q");
var fs = require("f");
var processFile = require("../process/file");
var path = require("path");
var postProcess = require("./post_process");
var _ = require("lodash");

/**
 * @parent bit-docs/modules
 * @module {function} bit-docs/lib/process/process
 *
 * Processes a [bit-docs/types/FileEventEmitter] and returns a promise.
 *
 * @signature `process(fileEventEmitter, siteConfig)`
 *
 * Handles file match events from the [bit-docs/types/FileEventEmitter] by
 * passing file source to [bit-docs/lib/process/file] which adds new
 * [bit-docs/types/docObject]s to the [bit-docs/types/docMap].
 *
 * @param {bit-docs/types/FileEventEmitter} fileEventEmitter An event emitter
 * that dispatches events with files to process.
 *
 * @param {Object} siteConfig An siteConfig object used to configure the
 * behavior of bit-docs.
 *
 * @option {String} [tags] If `tags` is a string, that file will be required.
 * It should export a function that takes the default
 * [bit-docs-process-tags/types/tagCollection] object and returns the tags that will be
 * used. Example module:
 *
 * ```js
 * module.exports = function(tags) {
 * 	   tags = _.extend({},tags);
 *     tags.customTag = {add: function(){}, ...}
 *     return tags;
 * };
 * ```
 *
 * @return {Promise<bit-docs/types/docMap>} A [bit-docs/types/docMap] that
 * contains the [bit-docs/types/docObject]s created from the processed files.
 * 
 * @body
 */
module.exports = function processEventEmitter(fileEventEmitter, siteConfig) {

	var docMap = {};
	var matched = 0;
	var processed = 0;
	var complete = false;
	var deferred = Q.defer();
	var resolve = function(){
			if(matched === processed && complete) {
				// tags get to do their thing
				try{
					postProcess(docMap, siteConfig);
				} catch (e){
					deferred.reject(e);
				}

				deferred.resolve(docMap);
			}
		};

	fileEventEmitter.on("match",function(filePath, fileSource){
		if(siteConfig.testFinder) {
			console.log("MATCHED: "+path.relative(process.cwd(),filePath))
			return;
		}

		matched++;

		filePath = path.normalize(filePath);

		if(fileEventEmitter.cwd && filePath.indexOf(fileEventEmitter.cwd) !== 0 ) {
			var readSrc = path.join(fileEventEmitter.cwd, filePath);
		} else {
			var readSrc = filePath;
		}
		if(fileSource) {
			processFile(filePath, fileSource.toString(), docMap, siteConfig);
			processed++;
			resolve();
		} else {
			fs.readFile(readSrc, function(err, data){
				if(err) {
					console.log(err);
				}
				processFile(filePath, data.toString(), docMap, siteConfig);
				processed++;
				resolve();
			});
		}
	});
	fileEventEmitter.on("end", function(){
		complete = true;
		resolve();
	});

	return deferred.promise;
}
