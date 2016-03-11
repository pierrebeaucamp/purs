### What am I looking at?
A build tool for PureScript, based on npm.

### Can I use this yet?
No, there is still work in progress. But hopefully, it should be usable soon.

### Why are you creating this? Why aren't you simply using Bower?
I still haven't found any good explanation on why I should use Bower over npm.
To be completely honest, I don't know why Bower still exists - npm 3 has flat
trees now. There is even an [issue](https://github.com/bower/bower/issues/1520)
for bower to merge with npm.

Also, I am somewhat fed up to have a `bower.json` file alongside a
`package.json` file where 80% of the contents are exactly the same. And some
NodeJS packages aren't on Bower, so you have to use npm to fetch them anyways.
This breaks the browserify configuration for pulp - great.

### Ok, so you don't like Bower, why does this still depend on it then?
PureScripts default dependency system is Bower. Therefor, lots of packages
only list their dependencies in `bower.json`. Purs uses the Bower API to
parse the dependencies into `package.json`.

### Why are you using JavaScript and not PureScript? Functional programming rules!
While I love PureScript, this choice was due to *purely functional* reasons
(sorry). Purs started as nothing more than a Shell script. To keep
compatibility with Windows, I couldn't use Bash and PureScript requires
NodeJS anyways - so the logical choice was to use NodeJS for this tool.

### Purs is a stupid name
Yes, but I don't want to spend all my time looking for something better. I'll
probably change the name before I publish this on npm though...

