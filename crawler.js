var request = require('request');
var cheerio = require('cheerio');
var parser = require('url');

////////////////////////////////////////////////////////////////
//  Function for crawler.
//  Must include request object.
//  Returns value via callback.
//  Import (Uses relative path):
//      var crawler = require('./crawler.js');
////////////////////////////////////////////////////////////////

exports.crawlerTool = crawlerTool;

/* For testing, comment out when done */
exports.isRelativeUrl = isRelativeUrl;

/**
 * Translates a crawler request into crawler parameters
 * and begins crawling
 *
 * @param requestObj
 * @param callback
 */
function crawlerTool(requestObj, callback){
    // only calls function if depth < depthLimit
    if (requestObj.depth < requestObj.depthLimit) {
        // for now, just testing ability to callback correct data
        if (requestObj.searchType === "breadth") {
            crawlerWrapper(requestObj, function (err, callbackObj) {
                if (err) {
                    return callback(err);
                }
                else {
                    callback(null, callbackObj);
                }

            });
        }
        else if (requestObj.searchType === "depth") {
            crawlerWrapper(requestObj, function (err, callbackObj) {
                if (err) {
                    callback(err)
                }
                else {
                    var randomChild = [];
                    randomChild.push(callbackObj.children[Math.floor((Math.random() * callbackObj.children.length))]);
                    callbackObj.children = randomChild;
                    callback(null, callbackObj);
                }
            });
        }
        else {
            callback("Error: Invalid search type parameters")
        }
    }
    else {
        console.log("End of crawl reached");
        callback("Success: End of crawl reached");
    }
}

/**
 * function filters DOM anchor elements for href attributes
 * and returns href attributes that meet requirements of
 * function isValidAnchor()
 *
 * @param requestObj
 * @param callback
 */
function crawlerWrapper(requestObj, callback){
    /* crawlUrl */
    crawlUrl(requestObj.startPage, function (err, callbackObj) {
        if (err) {
            callback(err);
        }
        else {
            /* CREATE CALLBACK OBJECT FOR CACHE */
            var parentObj;
            if (requestObj.parent === null) {
                parentObj = null;
            }
            else {
                parentObj = {
                    title: requestObj.parent.title,
                    url: requestObj.parent.url
                };
            }
            var urlObj = {
                parent: parentObj,
                title: callbackObj.title,
                url: callbackObj.url,
                children: []
            };
            /* GIVE EMPTY CHILD LIST IF NO CHILDREN */
            if(callbackObj.children.length <= 0) {
                /*
                callback("Error: Children for " + callbackObj.url + " not found.");
                */
                callback(null, urlObj);
            }
            /* FILL CHILD LIST WITH CHILDREN IF CHILDREN OF URL PRESENT */
            else {
                for (var i = 0; i < callbackObj.children.length; i++) {
                    if (isValidChild(callbackObj.children[i].attribs.href)) {
                        var tempUrl = "";
                        /* BUILD ABSOLUTE URL IF RELATIVE URL */
                        if (isRelativeUrl(callbackObj.children[i].attribs.href)) {
                            /* PATHNAME CAN BE `/` SO FILTER MUST BE FOR LENGTH > 1 */
                            if (parser.parse(requestObj.startPage).pathname.length >= 2) {
                                /* REMOVES PATHNAME FROM PARENT ABSOLUTE URL */
                                var host = requestObj.startPage.replace(parser.parse(requestObj.startPage).pathname, "") ;
                                tempUrl = host + callbackObj.children[i].attribs.href;
                                // console.log(parser.parse(requestObj.startPage).pathname);
                                // console.log(tempUrl);
                            }



                        }
                        /* DO NOT CHANGE ABSOLUTE URL */
                        else if (isAbsoluteUrl(callbackObj.children[i].attribs.href)) {
                            tempUrl = callbackObj.children[i].attribs.href;
                        }
                        /* IF NOT VALID URL, SKIP */
                        else {
                            continue;
                        }
                        urlObj.children.push(tempUrl);
                    }
                }
                callback(null, urlObj);
            }
        }
    })
}

/**
 * function sends http request to designated url and if
 * successful response (200), uses Cheerio JS to load the
 * DOM object into memory and filters anchor elements from
 * the DOM tree
 *
 * @param url
 * @param callback
 */
function crawlUrl(url, callback){
   request(url, function (err, res, html) {
        if (err) {
            callback(err);
        }
        else if (res.statusCode !== 200) {
            var responseErr = "Error: HTTP Response " + res.statusCode;
            callback(responseErr);
        }
        else {
            var $ = cheerio.load(html);
            var title = $("title").text();
            var children = $("html > body").find("a");
            var callbackObj = {
                title: title,
                url: url,
                children: children
            };
            callback(null, callbackObj);
        }
    })
}

/**
 * function returns true if anchor href attribute is:
 * defined, not a `mailto` link, not a `javascript` link,
 * not a relative link, not a hash link, and not a file
 * unless it's a HTML file
 * function returns false if it meets any of those criteria
 *
 * @param child
 * @returns {boolean}
 */
function isValidChild(child){
    if (child != undefined) {
        // filters out mailto links
        if (child.startsWith("mailto:")) {
            return false;
        }
        // filters out javascript links
        if (child.startsWith("javascript:")) {
            return false;
        }
        // filters out hash links
        if (child.startsWith("#")) {
            return false;
        }
        // filters out files unless it's an HTML file
        // other files have no possible links
        // must be placed after other filters so that it doesn't catch local urls
        if (parser.parse(child).pathname !== undefined && parser.parse(child).pathname !== null) {
            if (parser.parse(child).pathname.search(".") !== -1) {
                if (parser.parse(child).pathname.lastIndexOf(".") > 0) {
                    if (!parser.parse(child).pathname.substr(parser.parse(child).pathname.lastIndexOf(".") + 1).startsWith("html")) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    return false;
}

/**
 * Function takes an anchor href attribute value
 * and
 *
 * child undefined check happens in isValidChild
 * @param child
 * @returns {boolean}
 */
function isRelativeUrl(child){
    if (child != undefined) {
        /* Special cases where links begin with `/` */
        if (child.startsWith("/")) {
            if (/\/\//.test(child)) {
                return false;
            }
        }
        /* Most cases where links don't begin with `/` */
        if (!child.startsWith("/")) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * Function takes an anchor href attribute value and compares
 * the protocol with
 * @param child
 */
function isAbsoluteUrl(child){
    if (child != undefined) {
        if(!child.startsWith("http") || !child.startsWith("https")){
            return false;
        }
        /* protocol is http or https */
        return true;
    }
}