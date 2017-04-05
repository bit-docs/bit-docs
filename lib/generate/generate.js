var Q = require('q');
var processEventEmitter = require("../process/process"),
	promiseQueue = require("../promise_queue"),
	_ = require("lodash"),
	minimatch = require("minimatch"),
	fs = require("fs"),
	chokidar = require("chokidar"),
	path = require("path"),
	writeFile = Q.denodeify(fs.writeFile);



/**
 * @function documentjs.generate generate
 * @parent DocumentJS.apis.internal
 *
 * @signature `.generate(siteConfig)`
 *
 * Generates documenation using specified generators.
 *
 * @param {Object} siteConfig
 *
 * siteConfig that configure the [documentjs.find.files files]
 * processed, how they are [documentjs.process procssed], and
 * how the output is generated.
 *
 * @option {moduleName|Array<moduleName>} [generators]
 *
 * Generators specifies a generator module or array of modules used to create an
 * output for documentation. The default generator is "html" which maps
 * to documentjs's internal [documentjs.generators.html html generator].
 *
 * You can specify other modules which will be passed a promise containing
 * the [documentjs.process.docMap docMap] and the `siteConfig` and be expected
 * to return a promise that resolves when they are complete.
 *
 * @option {Boolean} [watch=false] If true, regenerates all generators when
 * a file matched  by `siteConfig.glob` is changed.
 *
 * @return {Promise} A promise that resolves when the documentation
 * has been successfully created.
 *
 * @body
 *
 * ## Use
 */
function generateOne(siteConfig){

	var fileEventEmitter = siteConfig.finder(siteConfig),
		docMapPromise = processEventEmitter(fileEventEmitter, siteConfig);

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
		var original = siteConfig,
			copy = _.cloneDeep(siteConfig),
			scheduledRegeneration = false;

		var promise = generateOne(copy);

		var chokidarsiteConfig = _.omit(siteConfig.glob, ["pattern","ignore"]);

		// the chokidar API looks for an "ignored" key on the options object
		chokidarsiteConfig.ignored = siteConfig.glob.ignore;

		var regenerate = function(event, filepath){

			// check if we haven't already re-scheduled this generate
			if(!scheduledRegeneration) {

				// Try to abort the existing project
				copy.isAborted = function(){
					throw new Error("Aborted by filesystem change");
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

		chokidar.watch(siteConfig.glob.pattern, chokidarsiteConfig).on('all', regenerate);

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
