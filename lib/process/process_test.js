var process = require("./process"),
	assert = require("assert"),
	fs = require("fs"),
	path = require("path"),
	EventEmitter = require("events"),
	_ = require("lodash");

	describe("documentjs/lib/process", function(){

		it("basics", function(done){
			var methodsCalled = [];

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

			var fileEventEmitter = new EventEmitter();
			setTimeout(function(){
				fileEventEmitter.emit('match', 'foo.js', "hello world");
				fileEventEmitter.emit('end');
			},10);
			var SITE_CONFIG = {
				processors: [processor],
				postProcessors: [postProcessor]
			};
			process(fileEventEmitter, SITE_CONFIG).then(function(docMap){
				assert.deepEqual(methodsCalled, ["processor","postProcessor"], "all 2 methods called")
				assert.deepEqual(docMap,
					{
						Foo: {name: "Foo"},
						expanded: {name: "expanded"}
					}, "postProcessor called with docMap");
					done();

			}).catch(done);

		});


	});
