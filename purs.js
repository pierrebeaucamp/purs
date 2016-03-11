#! /usr/bin/env node
require('shelljs/make');
var napa    = require('napa/cli.js');
var request = require('request');

/*
 * Super simple help-text
 */
target.all = function() {
    echo("Usage: purs <command>");
    echo("");
    echo("Commands:");
    echo("    build    Build the project.");
    echo("    get      Install dependencies");
    echo("    init     Initiates an empty PureScript project");
};

/*
 * purs build - invokes the PureScript compiler
 */
target.build = function() {
    var tmp = tempdir();
    rm("-rf", "./bin");
    exec("psc './**/*.purs' -f './**/*.js' -o '" + tmp + "'");
    exec("psc-bundle -o ./bin/main.js --main Main '" + tmp + "./**/*.js'");
    rm("-rf", tmp);
};

/*
 * purs get - gets dependencies and installs them
 */
target.get = function(args) {
    if (!args) {
        napa.cli("");
        args = [""];
    }

    exec("npm install --save " + args[0], function(code, stdout, stderr) {
        if (code != 0) napa.cli([args[0], "--save"]);
        if (args.length > 1) target.get(args.slice(1));
    });
};

/*
 * purs init - initiates an empty purs project
 */
target.init = function() {
    echo("Initializing new project...");
    request("https://www.gitignore.io/api/node", function(err, resp, body) {
        if (!err && resp.statusCode == 200) body.to(".gitignore");
    });
    exec("npm init -y", {silent:true});
};

