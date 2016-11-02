/**
 * Created by Daniel Mansour on 10/31/2016.
 */

var crawler = require('../crawler.js');

var requestObj1 = {
    id: "testerror1",
    parent: null,
    startPage: "http://www.google.com/",
    searchType: "depth",
    keyword: "a_keyword",
    pageLimit: 10,
    depthLimit: 5
};

function depthCrawler(requestObj){
    if (requestObj.depthLimit > 0) {
        crawler.crawlerTool(requestObj, function(err, callbackObj){
            if (err) {
                console.log(err);
            }
            else {
                console.log(callbackObj);
                requestObj.parent = {
                    title: callbackObj.title,
                    url: callbackObj.url
                };
                requestObj.startPage = callbackObj.children[0];
                requestObj.depthLimit -= 1;
                depthCrawler(requestObj);
            }
        })
    }
}

depthCrawler(requestObj1);

var requestObj2 = {
    id: "testerror1",
    parent: null,
    startPage: "http://www.google.com/",
    searchType: "breadth",
    keyword: "a_keyword",
    pageLimit: 10,
    depthLimit: 5
};

function breadthCrawler(requestObj){
    if (requestObj.depthLimit > 0) {
        crawler.crawlerTool(requestObj, function(err, callbackObj){
            if (err) {
                console.log(err);
            }
            else {
                console.log(callbackObj);
                var newDepth = requestObj.depthLimit - 1;
                requestObj.parent = {
                    title: callbackObj.title,
                    url: callbackObj.url
                };
                for (var i = 0; i < callbackObj.children.length; i++) {
                    requestObj.startPage = callbackObj.children[i];
                    requestObj.depthLimit = newDepth;
                    depthCrawler(requestObj);
                }
            }
        })
    }
}

breadthCrawler(requestObj2);