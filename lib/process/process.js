var Q = require("q"),
	fs = require("fs"),
	processFile = require("../process/file"),
	path = require("path"),
	postProcess = require("./post_process"),
	startsWith = require("lodash/startsWith");

/**
 * @function documentjs.process.fileEventEmitter
 * @parent documentjs.process.methods
 *
 * Processes a file's source.  Adds created [documentjs.process.docObject docObjects] to docMap.
 *
 * @signature `documentjs.process.file(source, docMap, [filename])`
 *
 * Processes files "matched" from a file event emitter into a [documentjs.process.docMap docMap].
 *
 *
 *
 * @param {documentjs.process.types.FileEventEmitter} fileEventEmitter An event emitter that dispatches events
 * with files to process.
 *
 * @param {Object} siteConfig An siteConfig object used to configure the behavior of documentjs.
 *
 * @option {String} [tags] If `tags` is a string, that file will be required.  It should
 * export a function that takes the default [documentjs.tags] object and returns
 * the tags that will be used.  Example module:
 *
 * ```
 * module.exports = function(tags) {
 * 	   tags = _.extend({},tags);
 *     tags.customTag = {add: function(){}, ...}
 *     return tags;
 * };
 * ```
 *
 * @return {Promise<documentjs.process.docMap>} A docMap that contains the docObjects
 * created from the matched files.
 *
 *
 *
 * @body
 */
module.exports = function processEventEmitter(fileEventEmitter, siteConfig) {
	var docMap = {},
		deferred = Q.defer(),
		matchedFilesPromises = [];

	fileEventEmitter.on("match", function(filePath, fileSource){
		if(siteConfig.testFinder) {
			console.log("MATCHED: "+path.relative(process.cwd(),filePath));
			return;
		}

		filePath = path.normalize(filePath);

		var processFilePromise;
		var readSrc = fileEventEmitter.cwd && !startsWith(filePath, fileEventEmitter.cwd) ?
			path.join(fileEventEmitter.cwd, filePath) :
			filePath;

		if (fileSource) {
			// make sure this promise rejects if `processFile` throws
			processFilePromise = Q().then(function() {
				processFile(filePath, fileSource.toString(), docMap, siteConfig);
			});
		} else {
			processFilePromise = Q.denodeify(fs.stat)(readSrc)
				.then(function(stat) {
					if (stat.isDirectory()) {
						console.warn([
							"Unable to process directory " + readSrc,
							"Make sure docConfig.pattern matches individual source files",
							"See https://documentjs.com/docs/DocumentJS.siteConfig.html#section_Use"
						].join("\n"));
					} else {
						return Q.denodeify(fs.readFile)(readSrc)
							.then(function(data) {
								processFile(filePath, data.toString(), docMap, siteConfig);
							});
					}
				});
		}

		matchedFilesPromises.push(processFilePromise);
	});

	fileEventEmitter.on("end", function() {
		Promise.all(matchedFilesPromises)
			.then(function() {
				postProcess(docMap, siteConfig);
				deferred.resolve(docMap);
			})
			.catch(deferred.reject);
	});

	return deferred.promise;
};
