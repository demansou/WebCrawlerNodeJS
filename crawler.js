var request = require('request');
var cheerio = require('cheerio');
var parser = require('url');
var async = require('async');

////////////////////////////////////////////////////////////////
//  Functions for crawler.
//  Use crawlerWrapper right now to get data.
////////////////////////////////////////////////////////////////
//
//  INCOMING DATA:
//  var requestObj = {
//      "startPage": url,
//      "searchType": "breadth"|"depth"
//      "keyword": keyword,
//      "pageLimit": pageLimit,
//      "depthLimit": depthLimit
//  }
//
////////////////////////////////////////////////////////////////
//
//  RETURN DATA:
//  var callbackObj = {
//      "parent": {
//          "title": title,
//          "url": url
//      }
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
////////////////////////////////////////////////////////////////

/**
 * Translates a crawler request into crawler parameters
 * and begins crawling
 *
 * @param requestObj
 * @param callback
 */

function crawlerTool(requestObj, callback){
    // for now, just testing ability to callback correct data
    if (requestObj.searchType === "breadth") {
        crawlerWrapper(null, requestObj.startPage, requestObj.keyword, function(err, callbackObj){
            if (err) {
                callback(err)
            }
            else {
                callback(null, callbackObj)
            }
        });
    }
    else if (requestObj.searchType === "depth") {
        crawlerWrapper(null, requestObj.startPage, requestObj.keyword, function(err, callbackObj){
            if (err) {
                callback(err)
            }
            else {
                callback(null, callbackObj)
            }
        });
    }
    else{
        callback("Error: Invalid search type parameters")
    }
}

/**
 * wrapper function for assembling final return object
 * does not start async function with no url as cannot
 * complete request
 *
 * @param parent
 * @param url
 * @param callback
 */

function crawlerWrapper(parent, url, keyword, callback){
    // since process not asynchronous, will return a null value instead
    // need to accept null as returnable
    // OR process data beforehand to ensure url is never null or undefined
    if (url === null || url === undefined) {
        console.log("Error: No URL received for crawling.")
        return null;
    }
    else {
        filterChildren(url, function (err, callbackObj) {
            if (err) {
                callback(err);
            }
            else {
                var parentObj;
                if (parent === null) {
                    parentObj = null;
                }
                else {
                    parentObj = {
                        title: parent.title,
                        url: parent.url
                    };
                }
                var crawlerReturnObj = {
                    parent: parentObj,
                    title: callbackObj.title,
                    url: callbackObj.url,
                    children: callbackObj.children
                };
                callback(null, crawlerReturnObj);
            }
        })
    }
}

/**
 * function filters DOM anchor elements for href attributes
 * and returns href attributes that meet requirements of
 * function isValidAnchor()
 *
 * @param url
 * @param linksCrawled
 * @param callback
 */

function filterChildren(url, callback) {
    crawlURL(url, function (err, callbackObj) {
        if (err) {
            callback(err);
        }
        else {
            if(callbackObj.children.length <= 0) {
                callback("Error: Children for " + url + " not found.");
            }
            else {
                var listValidChildren = [];
                for (var i = 0; i < callbackObj.children.length; i++) {
                    if (isValidChild(callbackObj.children[i].attribs.href, url)) {
                        listValidChildren.push(callbackObj.children[i].attribs.href);
                    }
                }
                var filteredCallbackObj = {
                    title: callbackObj.title,
                    url: url,
                    children: listValidChildren
                };
                callback(null, filteredCallbackObj);
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

function crawlURL(url, callback){
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
 * not a relative link, not a hash link, and not a file.
 * function returns false if it meets any of those criteria
 *
 * @param child
 * @param url
 * @returns {boolean}
 */

function isValidChild(child, url){
    if (child != undefined) {
        if (child.search(parser.parse(url).hostname) != -1) {
            return false;
        }
        else if (child.startsWith("mailto:")) {
            return false;
        }
        else if (child.startsWith("javascript:")) {
            return false;
        }
        else if (child.startsWith("/")) {
            return false;
        }
        else if (child.startsWith("#")) {
            return false;
        }
        return true;
    }
    return false;
}

////////////////////////////////////////////////////////////////
// EXAMPLE USAGE
// crawlerTool
////////////////////////////////////////////////////////////////
/*
var requestObj1 = {
    startPage: "http://facebook.com",
    searchType: "breadth",
    keyword: "",
    pageLimit: 10,
    depthLimit: 1
};

crawlerTool(requestObj1, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else{
        console.log(JSON.stringify(callbackObj));
    }
});

var requestObj2 = {
    startPage: "http://google.com",
    searchType: "depth",
    keyword: "shouldn't do anything",
    pageLimit: 1,
    depthLimit: 2
}

crawlerTool(requestObj2, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else{
        console.log(JSON.stringify(callbackObj));
    }
});

var requestObj3 = {
    startPage: "http://reddit.com",
    searchType: "breadth",
    keyword: "test",
    pageLimit: 1,
    depthLimit: 2
};

crawlerTool(requestObj3, function(err, callbackObj){
    if (err) {
        console.log(err);
    }
    else{
        console.log(JSON.stringify(callbackObj));
    }
});
*/
////////////////////////////////////////////////////////////////
// EXAMPLE USAGE
// crawlerWrapper
////////////////////////////////////////////////////////////////
/*
// test with a webpage with a lot of external links
crawlerWrapper(parent=null, url="http://reddit.com", null, function(err, callback){
    if(err){
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

// test with a webpage with few or no external links
crawlerWrapper(parent=null, url="http://google.com", null, function(err, callback){
    if(err){
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

// create parent object
var obj1 = {
    url: "http://houstontexans.org",
    title: "Home of the Houston Texans"
};
// test with parent
// test should display object with both parent and url object data
crawlerWrapper(parent=obj1, url="http://arstechnica.com", null, function(err, callback){
    if(err){
        console.log(err);
    }
    else {
        console.log(callback);
    }
});

// test with flash -> page has no off-site links
// test should return error
crawlerWrapper(parent=null, url="http://zombo.com", null, function(err, callback){
    if(err) {
        console.log(err);
    }
    else{
        console.log(callback);
    }
});

// do not send url to crawler
// test should return error
crawlerWrapper(parent=null, url=null, function(err, callback){
    if(err){
        console.log(err);
    }
    else{
        console.log(callback);
    }
});
*/

exports.crawlerTool = crawlerTool;