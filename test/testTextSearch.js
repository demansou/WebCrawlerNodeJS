var request = require('request');
var cheerio = require('cheerio');

function crawlUrl(url, keyword, callback) {
    request(url, function (err, res, html) {
        if (err)
        {
            callback(err);
        }
        else if (res.statusCode !== 200)
        {
            var responseErr = "Error: HTTP Response " + res.statusCode;
            callback(responseErr);
        }
        else {
            var $ = cheerio.load(html);
            var htmlBodyText = $("html > body").text();
            if (containsText(htmlBodyText, keyword)) {
                callback(null, keyword + ":\t" + "true");
            }
            else {
                callback(null, keyword + ":\t" + "false");
            }
        }
    })
}

function containsText(htmlBodyText, keyword) {
    if (htmlBodyText.search(keyword) === -1) {
        return false;
    }
    return true;
}

crawlUrl("https://github.com/cheeriojs/cheerio", "cheerio", function (err, callback) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

crawlUrl("https://github.com/cheeriojs/cheerio", "wheaties", function (err, callback) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

crawlUrl("http://zombo.com", "zombo", function (err, callback) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

crawlUrl("http://google.com", "google", function (err, callback) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

crawlUrl("http://google.com", "howdy", function (err, callback) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(callback);
    }
});