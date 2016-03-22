#! /usr/bin/env node
require("shelljs/make");
var napa  = require("napa/cli.js");
var spawn = require("child_process").spawn;

/*
 * _install - gets dependencies and installs them
 */
function _install(rootDir, args) {
    // If no arguments are provided, we just install missing dependencies
    // according to package.json. We populate args with an empty string so
    // we can later safely call args[0].
    if (!args) {
        napa.cli("");
        args = [""];
    }

    cd(rootDir);
    console.log("Installing " + args[0])

    // We install a single dependency at a time as we need to check if a package
    // is on npm before falling back to napa.
    // Also, I would love to avoid using a callback here, but npm install spawns
    // further child processes which are decoupled from the main thread. Using
    // an async callback is the only way to get the right exit code.
    // I looked into using 'async' but as for right now, it's cleaner to use
    // callbacks, as we only have a single one. Gotta love JS.
    exec("npm install --save " + args[0], {silent: true},
        function(code, stdout, stderr) {
        if (code !== 0) {
            console.log(args[0]);
            exec(__dirname + "/node_modules/.bin/napa " + args[0] + " --save");
        }

        // Quit if we didn't install new dependencies
        if (args === [""]) return;

        // Most PureScript libraries only list their dependencies in bower.json.
        // Thus, we scan the newly fetched package for this file and install
        // look for dependencies.
        var target = rootDir + "/node_modules/" + args[0];
        if (!test("-e", target)) {
            target = rootDir + "/node_modules/" + napa.args(args[0])[1];
        }

        console.log("Installed to " + target);
        console.log("Resolving dependencies")

        cd(target);
        var stdout = exec(__dirname + "/node_modules/.bin/bower list --json",
                      {silent: true}).stdout;

        for (var name in JSON.parse(stdout).dependencies) {
            var result = exec(__dirname + "/node_modules/.bin/bower lookup " +
                         name, {silent: true}).stdout.split(" ");

            // In case of an error, bower still returns exit code 0, so we check
            // the length of the message instead.
            if (result.lenght > 2) continue;
            args.push(result[1].replace(/\n/g, ""));
        }

        // Runs this function again if we have some dependencies left to fetch
        if (args.length > 1) _install(rootDir, args.slice(1));
    });
}

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
    echo("    shell    Invokes the PureScript shell");
};

/*
 * purs build - invokes the PureScript compiler
 */
target.build = function() {
    var tmp = tempdir();

    // Pre build cleanup
    rm("-rf", "./bin");

    exec(__dirname + "/node_modules/.bin/psc './**/*.purs' './*.purs' " +
         "-f './**/*.js' -f './*.js' -o '" + tmp + "'");
    exec(__dirname + "/node_modules/.bin/psc-bundle -o './bin/main.js' " +
         "--module Main --main Main '" + tmp + "/*/*.js'");

    // Post build cleanup
    rm("-rf", tmp);
};

/*
 * purs get - calls _install.
 */
target.get = function(args) {
    _install(process.cwd(), args);
}

/*
 * purs init - initiates an empty purs project
 */
target.init = function() {
    echo("Initializing new project...");
    cp(__dirname + "/.gitignore", ".gitignore");
    exec("npm init -y", {silent: true});
};

/*
 * purs shell - invokes the PureScript shell.
 * This is a simple alias for 'psci' so the end user doesn't need to have
 * PureScript installed globally.
 */
target.shell = function() {
    spawn(__dirname + "/node_modules/.bin/psci", [], {stdio: 'inherit'});
}

