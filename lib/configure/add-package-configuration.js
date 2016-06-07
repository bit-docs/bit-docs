var _ = require("lodash");
var Q = require("q");

module.exports = function addPackageConfiguration(siteConfig, bitDocs) {
	var dependencies = siteConfig.dependencies;

	var promises = _.map(dependencies, function(version, name){
		return Q( require("./node_modules/"+name+"/bit-docs")(bitDocs, siteConfig) );
	});

	return Q.all(promises);
};
