var crawler = require('../crawler.js');

var child = [];

/* Test strings */
child.push("/hello-world");
child.push("http://www.google.com/");
child.push("//hello-world");
child.push("hello-world");

for (var i = 0; i < child.length; i++) {
    console.log(child[i] + ":\t" + crawler.isRelativeUrl(child[i]));
}


