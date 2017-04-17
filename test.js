/*require("./lib/process/process_test");

require("./lib/generate/test/generate_test");

require("./lib/configure/configure_test");

require("./lib/configured/npm/npm_test");*/

var assert = require("assert");
var docjs = require("./main.js");
var path = require("path");
var fs = require("fs");


describe("bit-docs/main",function(){
    it("supports the basics", function(done){
        this.timeout(60000);
        // make sure test/package.json's packages are ready
        //
        docjs(
            path.join(__dirname, "test", "package.json"),
            {
                forceBuild: true,
                debug: true
            }).then(function(){
            done();
        }).catch(done);
    });

    it("makes file: paths absolute", function(done){
		var testProj = path.join(__dirname, "test", "file-pathed-deps", "test-project");
        this.timeout(60000);
        docjs(path.join(testProj, "package.json"), {
			forceBuild: true,
			debug: true
		}).then(function(){
			var check = path.join(testProj, "doc", "static", "bundles", "bit-docs-site", "static.css");
			fs.readFile(check, function (err, data) {
				if (err) throw err;
				if (data.indexOf('local-pretty') >= 0) {
					done();
				} else {
					throw new Error('expected to find local-pretty in css');
				}
			});
        }).catch(done);
    });

});
