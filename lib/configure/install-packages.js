var path = require("path");
var npm = require("enpeem");
var Q = require("q");
var _ = require("lodash");

module.exports = function(siteConfig){

	if(siteConfig.debug) {
		console.log("BUILD: Installing packages",path.join(__dirname, "temp") );
	}
	var deferred = Q.defer();
	var dependencies = siteConfig.dependencies;

	npm.install({
		dir: __dirname,
		dependencies: _.map(dependencies, function(version, name){
			return name+"@"+version
		}),
		loglevel: siteConfig.debug ? "info" : "silent",
		production: true
	}, function(err){
		if(err) {
			deferred.reject(err)
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise
}
