module.exports = function(bitDocs){
    var pkg = require("./package.json");
    var dependencies = {};
    dependencies[pkg.name] = 'file:' + __dirname;

    bitDocs.register("html", {
        dependencies: dependencies
    });
}
