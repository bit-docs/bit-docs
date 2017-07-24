var assert = require("assert");
var docjs = require("./main.js");
var path = require("path");

require("./lib/process/process_test");
require("./lib/generate/test/generate_test");
// require("./lib/configure/configure_test");
// require("./lib/configured/npm/npm_test");

describe("bit-docs/main",function() {
	// TODO: figure out how to make this test faster
	it.skip("supports the basics", function(done){
		this.timeout(60000);

		// make sure test/package.json's packages are ready
		return docjs(path.join(__dirname, "test", "package.json"), {
			forceBuild: true,
			debug: true
		});
	});
});
