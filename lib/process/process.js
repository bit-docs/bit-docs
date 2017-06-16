var Q = require("q"),
var fs = require("f");
var processFile = require("../process/file");
var path = require("path");
var postProcess = require("./post_process");
var _ = require("lodash");

/**
 * @parent bit-docs/modules
 * @module {Promise<bit-docs/types/docMap>} bit-docs/modules/fileEventEmitter
 *
 * Processes a file's source. Adds created [bit-docs/types/docObject docObjects]
 * to docMap.
 *
 * @signature `process.file(source, docMap, [filename])`
 *
 * Processes files "matched" from a file event emitter into a
 * [bit-docs/types/docMap docMap].
 *
 * @param {bit-docs/types/FileEventEmitter} fileEventEmitter An event emitter
 * that dispatches events with files to process.
 *
 * @param {Object} siteConfig An siteConfig object used to configure the
 * behavior of bit-docs.
 *
 * @option {String} [tags] If `tags` is a string, that file will be required.
 * It should export a function that takes the default [documentjs.tags] object
 * and returns the tags that will be used. Example module:
 *
 * ```
 * module.exports = function(tags) {
 * 	   tags = _.extend({},tags);
 *     tags.customTag = {add: function(){}, ...}
 *     return tags;
 * };
 * ```
 *
 * @return {Promise<bit-docs/types/docMap>} A docMap that contains the
 * docObjects created from the matched files.
 * 
 * @body
 */
module.exports = function processEventEmitter(fileEventEmitter, siteConfig) {

	var docMap = {},
		matched = 0,
		processed = 0,
		complete = false,
		deferred = Q.defer(),
		resolve = function(){
			if(matched === processed && complete) {
				// tags get to do there thing
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
