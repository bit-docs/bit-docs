var configure = require("./lib/configure/configure");
var generate = require("./lib/generate/generate");

module.exports = function(pathToPackageJSON, siteConfig){
	return configure(pathToPackageJSON, siteConfig).then(function(siteConfig){
		return generate(siteConfig);
	});
};
