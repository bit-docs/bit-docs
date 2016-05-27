var generate = require("../generate"),
	assert = require("assert");
	rmdir = require('rimraf'),
	Browser = require("zombie"),
	connect = require("connect"),
	path = require("path"),
	slash = require("../../slash"),
	EventEmitter = require("events")
	_ = require("lodash");

// Helpers
var find = function(browser, property, callback, done){
	var start = new Date();
	var check = function(){
		if(browser.window && browser.window[property]) {
			callback(browser.window[property]);
		} else if(new Date() - start < 2000){
			setTimeout(check, 20);
		} else {
			done("failed to find "+property);
		}
	};
	check();
};

var open = function(url, callback, done){
	var server = connect().use(connect.static(path.join(__dirname))).listen(8081);
	var browser = new Browser();
	browser.visit("http://localhost:8081/"+url)
		.then(function(){
			callback(browser, function(){
				server.close();
				done();
			})
		}).catch(function(e){
			server.close();
			done(e)
		});
};

describe("documentjs/lib/generate/generate",function(){

	it.only("basics", function(done){
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

	it("works",function(done){
		this.timeout(30000);
		rmdir(__dirname+"/out",function(error){

			generate({
				glob: slash( path.join(__dirname,"example") )+"/*.js",
				dest: path.join(__dirname,"out"),
				parent: "mylib",
				forceBuild: true,
				minifyBuild: false,
				processors: [function(){

				}]
			}).then(function(){
				open("out/Foo.html",function(browser, close){
					var code = browser.window.document.getElementsByTagName("code")[0];
					assert.ok( /prettyprinted/.test(code.className), "code blocks added" )
					close();
				},done);

			}, done);

		});

	});

	it("@outline works", function(done){
		generate({
			glob: __dirname+"/example/*.js",
			dest: __dirname+"/out",
			parent: "mylib",
			forceBuild: true,
			minifyBuild: false
		}).then(function(){
			open("out/index.html",function(browser, close){
				var code = browser.window.document.getElementsByClassName("contents")[0];
				var lis = code.getElementsByTagName("li")
				assert.equal( lis.length, 5, "outline added "+lis.length );
				close();
			},done);

		}, done);
	});

});
