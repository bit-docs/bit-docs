var generate = require("../generate"),
	assert = require("assert");
	rmdir = require('rimraf'),
	connect = require("connect"),
	path = require("path"),
	slash = require("../../slash"),
	EventEmitter = require("events")
	_ = require("lodash");

describe("documentjs/lib/generate/generate",function(){

	it("basics", function(done){
		var methodsCalled = [];

		var finder = function(siteConfig){
			methodsCalled.push("finder");
			assert.equal(siteConfig, SITE_CONFIG, "finder called with siteConfig");
			var ee = new EventEmitter();
			setTimeout(function(){
				ee.emit('match', 'foo.js', "hello world");
				ee.emit('end');
			},10);
			return ee;

		};
		var processor = function(filename, source, docMap, siteConfig, addToDocMap){
			methodsCalled.push("processor");
			assert.equal(filename, "foo.js", "processor called with filename");
			assert.equal(source, "hello world", "processor called with source");
			assert.ok(_.isEmpty(docMap), "processor called with docMap as an empty object");
			assert.equal(siteConfig, SITE_CONFIG, "processor called with siteConfig");
			addToDocMap({name: "Foo"});
		};

		var postProcessor = function(docMap, siteConfig) {
			methodsCalled.push("postProcessor");
			assert.deepEqual(docMap, {Foo: {name: "Foo"}}, "postProcessor called with docMap");
			assert.equal(siteConfig, SITE_CONFIG, "postProcessor called with siteConfig");
			docMap.expanded = {name: "expanded"}
		};
		var generator = function(docMapPromise, siteConfig){
			methodsCalled.push("generator");
			assert.equal(siteConfig, SITE_CONFIG, "generator called with siteConfig");

			return docMapPromise.then(function(docMap){
				methodsCalled.push("generator-ready");
				assert.deepEqual(docMap,
					{
						Foo: {name: "Foo"},
						expanded: {name: "expanded"}
					}, "postProcessor called with docMap");
			});
		};

		var SITE_CONFIG = {
			finder: finder,
			processors: [processor],
			postProcessors: [postProcessor],
			generators: [generator]
		};

		generate(SITE_CONFIG).then(function(){

			assert.deepEqual(methodsCalled, ["finder","generator","processor","postProcessor","generator-ready"], "all 4 methods called")
			done();
		}).catch(done);

	});

});
