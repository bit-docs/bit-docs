var _ = require('lodash');

// for each tag that has a .done method, calls it on every item in the docMap
module.exports = function(docMap, siteConfig){
	var postProcessors = siteConfig.postProcessors || [];

	postProcessors.forEach(function(postProcessor){
		postProcessor(docMap, siteConfig);
	});

};
