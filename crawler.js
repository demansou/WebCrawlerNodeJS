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

////////////////////////////////////////////////////////////////
//
//  INCOMING DATA:
//  var requestObj = {
//      "parent": {
//          "title": title,
//          "url": url
//      } || null,
//      "startPage": url,
//      "searchType": "breadth" || "depth"
//      "keyword": keyword,
//      "pageLimit": pageLimit,
//      "depth": depth,
//      "depthLimit": depthLimit
//  }
//
////////////////////////////////////////////////////////////////
//
//  RETURN DATA:
//  var callbackObj = {
//      "id": id,
//      "parent": {
//          "title": title,
//          "url": url
//      }||null,
//      "title": title,
//      "url": url,
//      "children": [
//          http://array.com,
//          http://of.com,
//          http://links.com,
//          http://to.com,
//          http://add.com,
//          http://to.com,
//          http://queue.com,
//          http://or.com,
//          http://stack.com,
//      ]
// }
//
////////////////////////////////////////////////////////////////
//
//  NEW RETURN OBJECT
//  var parentObj = CrawlerTools.CrawlerPacketParent(title, url);
//  parentObj.title
//  parentObj.url
//
//  var urlObj = CrawlerTools.CrawlerNode(parentObj, title, url);
//  urlObj.parent.title
//  urlObj.parent.url
//  urlObj.title
//  urlObj.url
//  urlObj.children[]
//  urlObj.children.length
//
////////////////////////////////////////////////////////////////

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
    crawlUrl(requestObj.startPage, function (err, callbackObj) {
        if (err) {
            callback(err);
        }
        else {
            if(callbackObj.children.length <= 0) {
                callback("Error: Children for " + callbackObj.url + " not found.");
            }
            else {
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
                for (var i = 0; i < callbackObj.children.length; i++) {
                    if (isValidChild(callbackObj.children[i].attribs.href, urlObj.url)) {
                        urlObj.children.push(callbackObj.children[i].attribs.href);
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
 * defined, not previously visited, not the local domain,
 * not a `mailto` link, not a `javascript` link,
 * not a relative link, not a hash link, and not a file
 * unless it's a HTML file
 * function returns false if it meets any of those criteria
 *
 * @param child
 * @param url
 * @returns {boolean}
 */
function isValidChild(child, url){
    if (child != undefined) {
        // filers out local absolute urls
        if (child.search(parser.parse(url).hostname) !== -1) {
            return false;
        }
        // filters out mailto links
        else if (child.startsWith("mailto:")) {
            return false;
        }
        // filters out javascript links
        else if (child.startsWith("javascript:")) {
            return false;
        }
        // filters out relative urls (link to same site)
        else if (child.startsWith("/")) {
            return false;
        }
        // filters out hash links
        else if (child.startsWith("#")) {
            return false;
        }
        // filters out files unless it's an HTML file
        // other files have no possible links
        // must be placed after other filters so that it doesn't catch local urls
        else if (parser.parse(child).pathname !== undefined && parser.parse(child).pathname !== null) {
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