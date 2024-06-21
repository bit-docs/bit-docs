var checkDependencies = require("./check-dependencies");
var installPackages = require("./install-packages");
var addPackageConfiguration = require("./add-package-configuration");
var fsx = require("../fs_extras");
var _ = require("lodash");
var path = require("path");

module.exports = function(pathToPackageJSON, siteConfig){
	// find package.json .. make site-config
	var pkg = require(pathToPackageJSON);

	var siteConfig = _.defaultsDeep(siteConfig || {}, pkg["bit-docs"], {
		cwd: path.dirname(pathToPackageJSON),
		dest: "./doc"
	});

	if( ! path.isAbsolute(siteConfig.dest) ) {
		siteConfig.dest = path.join( path.dirname(pathToPackageJSON), siteConfig.dest );
	}

	var bitDocs = makeBitDocs(siteConfig);

	var installedPackages;
	if(!siteConfig.forceBuild || siteConfig.skipInstall) {
		installedPackages = checkDependencies(siteConfig).then(function(){

		}, function(){
			return installPackages(siteConfig);
		});
	} else {
		installedPackages = installPackages(siteConfig);
	}
	// go to each dependency's bit-docs.js and call
	return installedPackages.then(function(){
		return addPackageConfiguration(siteConfig, bitDocs);
	}).then(function(){
		return siteConfig;
	});
};

var makeBitDocs = function(siteConfig){
	return {
		handlers: {
			finder: function(siteConfig, finder){
				siteConfig.finder = finder;
			},
			processor: function(siteConfig, processor){
				if(!siteConfig.processors) {
					siteConfig.processors = [];
				}
				siteConfig.processors.push(processor);
			},
			generator: function(siteConfig, generator){
				if(!siteConfig.generators) {
					siteConfig.generators = [];
				}
				siteConfig.generators.push(generator);
			},
			tags: function(siteConfig, tags){
				var tagFn;
				if(typeof siteConfig.tags === "string") {
					tagFn = require(fsx.smartJoin(siteConfig.cwd, siteConfig.tags));
					tags = tagFn(tags);
					siteConfig.tags = null;
				}
				siteConfig.tags = _.assign(siteConfig.tags || {}, tags);
			}
		},
		register: function(name){
			if(this.handlers[name]) {
				return this.handlers[name].apply(this, [siteConfig].concat(Array.from(arguments).slice(1)) )
			} else {
				if(!this.unhandled[name]) {
					this.unhandled[name] = [];
				}
				this.unhandled[name].push(arguments);
			}
		},
		handle: function(name, callback) {
			this.handlers[name] = callback;
			var self = this;
			if(this.unhandled[name]) {
				this.unhandled[name].forEach(function(args){
					self.handlers[name].apply(self, [siteConfig].concat(Array.from(args)) )
				});
			}
		},
		unhandled: {}
	}
};
