var Q = require('q');
var processEventEmitter = require("../process/process");
var promiseQueue = require("../promise_queue");
var _ = require("lodash");
var minimatch = require("minimatch");
var fs = require("fs");
var chokidar = require("chokidar");
var path = require("path");
var writeFile = Q.denodeify(fs.writeFile);

/**
 * @parent bit-docs/modules
 * @module {function} bit-docs/lib/generate/generate
 *
 * @signature `generate(siteConfig)`
 *
 * Generates documentation using specified generators.
 *
 * @param {Object} siteConfig
 *
 * siteConfig that configures the [bit-docs-glob-finder files] processed, how
 * they are [bit-docs/lib/process/process processed], and how the output is
 * generated.
 *
 *   @option {moduleName|Array<moduleName>} [generators]
 *
 *   Generators specifies a generator module or array of modules used to create
 *   an output for documentation. The default generator is "html" which is
 *   handled by [bit-docs-generate-html].
 *
 *   You can specify other modules which will be passed a promise containing the
 *   [bit-docs/types/docMap] and the `siteConfig` and be expected to return a
 *   promise that resolves when they are complete.
 *
 *   @option {Boolean} [watch=false] If true, regenerates all generators when a
 *   file matched by `siteConfig.glob` is changed.
 *
 * @return {Promise} A promise that resolves when the documentation has been
 * successfully created.
 *
 * @body
 */
function generateOne(siteConfig){
	var fileEventEmitter = siteConfig.finder(siteConfig);
	var docMapPromise = processEventEmitter(fileEventEmitter, siteConfig);

	if(siteConfig.testFinder) {
		return docMapPromise;
	}
	if( siteConfig.makeDocMap ) {
		return docMapPromise.then(function(docMap){
			return writeFile(
				path.join(process.cwd(),"docMap.json"),
				JSON.stringify(docMap, null, 2));
		})
	}

	var functions = siteConfig.generators.map(function(generator){
		return function(){
			if(typeof generator.generate === "function" ) {
				return generator.generate(docMapPromise, siteConfig);
			} else {
				return generator(docMapPromise, siteConfig);
			}

		};
	});

	return promiseQueue(functions);
}

function generateAndWatch(siteConfig){
	if(!siteConfig.watch) {
		return generateOne(siteConfig);
	} else {
		var original = siteConfig;
		var copy = _.cloneDeep(siteConfig);
		var scheduledRegeneration = false;

		var promise = generateOne(copy);

		var pattern = [siteConfig.glob.pattern];
		if(siteConfig.glob.ignore) {
			pattern.push("!"+siteConfig.glob.ignore);
		}
		var chokidarsiteConfig = _.omit(siteConfig.glob,"pattern");

		var regenerate = function(event, filepath){

			// check if we haven't already re-scheduled this generate
			if(!scheduledRegeneration) {

				// Try to abort the existing project
				copy.isAborted = function(){
					throw new Error("Aborted by filesystem chagne");
				};
				// this should only be done with one project

				// wait for existing to finish or abort
				scheduledRegeneration = true;
				promise.then(function(){
					scheduledRegeneration = false;
					promise = generateOne(  _.cloneDeep(siteConfig) );
				}, function(){
					scheduledRegeneration = false;
					promise = generateOne(  _.cloneDeep(siteConfig) );
				});

			}

		};

		chokidar.watch(pattern, chokidarsiteConfig).on('all', regenerate);

		if(siteConfig.templates) {
			chokidar.watch(path.join(siteConfig.templates,'*.{js,mustache}'), chokidarsiteConfig)
				.on('all', regenerate);
		}
		if(siteConfig['static']) {
			chokidar.watch(path.join(siteConfig['static'],'**/*'), chokidarsiteConfig)
				.on('all', regenerate);
		}

		return promise;
	}
}

module.exports = generateAndWatch;
