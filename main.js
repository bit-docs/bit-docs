var configure = require("./lib/configure/configure");
var generate = require("./lib/generate/generate");

module.exports = function(pathToPackageJSON, options){
	return configure(pathToPackageJSON, options).then(function(siteConfig){
		return generate(siteConfig);
	});
};
