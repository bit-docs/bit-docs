var process = require("./process"),
	assert = require("assert"),
	fs = require("fs"),
	path = require("path"),
	EventEmitter = require("events"),
	isEmpty = require("lodash/isEmpty"),
	noop = require("lodash/noop");

describe("documentjs/lib/process", function(){
	it("basics", function() {
		var methodsCalled = [];

		var SITE_CONFIG = {
			processors: [
				function(filename, source, docMap, siteConfig, addToDocMap) {
					methodsCalled.push("processor");
					assert.equal(filename, "foo.js", "processor called with filename");
					assert.equal(source, "hello world", "processor called with source");
					assert.ok(isEmpty(docMap), "processor called with docMap as an empty object");
					assert.equal(siteConfig, SITE_CONFIG, "processor called with siteConfig");
					addToDocMap({name: "Foo"});
				}
			],
			postProcessors: [
				function(docMap, siteConfig) {
					methodsCalled.push("postProcessor");
					assert.deepEqual(docMap, {Foo: {name: "Foo"}}, "postProcessor called with docMap");
					assert.equal(siteConfig, SITE_CONFIG, "postProcessor called with siteConfig");
					docMap.expanded = {name: "expanded"};
				}
			]
		};

		var fileEventEmitter = new EventEmitter();

		setTimeout(function(){
			fileEventEmitter.emit("match", "foo.js", "hello world");
			fileEventEmitter.emit("end");
		}, 10);

		return process(fileEventEmitter, SITE_CONFIG).then(function(docMap) {
			assert.deepEqual(
				methodsCalled,
				["processor", "postProcessor"],
				"all 2 methods called"
			);
			assert.deepEqual(
				docMap,
				{
					Foo: {name: "Foo"},
					expanded: {name: "expanded"}
				},
				"postProcessor called with docMap"
			);
		});
	});

	// some packages include extensions in the folder name, e.g
	// https://www.npmjs.com/package/asn1.js; process should check if
	// the match is a directory, otherwise `readFile` will throw
	it("it skips directories", function() {
		var siteConfig = {
			processors: [noop],
			postProcessors: [noop]
		};

		var emitter = new EventEmitter();

		// point the emitter to the test folder, so `fs.readFile` can find
		// the fixture folder named "foo.js"
		emitter.cwd = path.join(__dirname, "..", "..", "test");

		setTimeout(function() {
			emitter.emit("match", "foo.js");
			// emitter.emit("match", "foo.js/main.js", "hello world");
			emitter.emit("end");
		}, 10);

		return process(emitter, siteConfig);
	});
});
