var glob = require("glob"),
	_ = require("lodash"),
	minimatch = require("minimatch");

/**
 * @function documentjs.find.files
 *
 * @parent documentjs.find.methods
 *
 * @signature `.find.files(siteConfig)`
 *
 * @param {Object} siteConfig Options that configure the behavior of the
 * files that will be processed.
 *
 * @option {String|documentjs.find.globObject} glob The glob
 * option either specifies a [minmatch](https://github.com/isaacs/minimatch)
 * pattern like:
 *
 *     documentjs.find.files({glob: "*.js"})
 *
 * Or a [documentjs.find.globObject GlobObject] that specifies the
 * a [minmatch](https://github.com/isaacs/minimatch) pattern and
 * other siteConfig like:
 *
 *     documentjs.find.files({
 *       glob: {
 *         pattern: "*.js",
 *         cwd: __dirname
 *       }
 *     })
 *
 * @return {documentjs.process.types.FileEventEmitter} An event emitter that
 * emits events for matched files.
 */
module.exports = function(siteConfig){
	var pattern;
	var globOptions;

	if(typeof siteConfig.glob === "string"){
		var pattern = siteConfig.glob;
		globOptions = {};
	} else {
		pattern = siteConfig.glob.pattern;
		globOptions = _.extend({}, siteConfig.glob);
		delete globOptions.pattern;
	}

	var glb = new glob.Glob(pattern, globOptions);
	var ignore = siteConfig.glob.ignore;

	if(typeof ignore === "string") {
		ignore = [ignore];
	}
	if(ignore) {
		// weave in ignore behavior
		var oldOn = glb.on;
		glb.on = function(event, listener) {
			if(event === "match") {
				var handler = function(filepath){
					for(var i = 0; i < ignore.length; i++) {
						if( minimatch(filepath, ignore[i]) ) {
							return;
						}
					}
					listener.apply(this, arguments);
				};

				return oldOn.call(this, event, handler);
			} else {
				return oldOn.apply(this, arguments);
			}
		};
	}


	return glb;
};
