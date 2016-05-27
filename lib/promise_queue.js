
var Q = require("q");

module.exports = function(functions, args){
	var promise = Q(functions.shift()(args));

	while(func = functions.shift()) {
		promise = promise.then(func);
	}
	return promise;
};
