var path = require("path");
var Q = require('q');
var	fs = require('fs-extra');
var _ = require("lodash");
var stat = Q.denodeify(fs.stat);

module.exports = function(siteConfig){
	var promises = _.map(siteConfig.dependencies, function(version, name){
		return stat(path.join(__dirname, "node_modules", name, "package.json"));
	});
	return Q.all(promises);
};
