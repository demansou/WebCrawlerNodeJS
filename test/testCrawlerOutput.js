var crawler = require('../crawler.js');
var crawlerFrontend = require('../public/javascripts/crawler/crawler-frontend.js');
var cache = require('memory-cache');

/* REQUEST OBJECTS */
var requestObj1 = {
    id: generateId(),
    parent: null,
    startPage: "http://www.google.com",
    searchType: "depth",
    keyword: "word",
    pageLimit: 10,
    depth: 0,
    depthLimit: 5
};

var requestObj2 = {
    id: generateId(),
    parent: null,
    startPage: "http://www.google.com",
    searchType: "breadth",
    keyword: "word",
    pageLimit: 10,
    depth: 0,
    depthLimit: 2
};

/* GRAPH OBJECTS */
var graphObj1 = new crawlerFrontend.CrawlerGraph();
var graphObj2 = new crawlerFrontend.CrawlerGraph();

/* CACHE GRAPH */
cache.put(requestObj1.id, graphObj1, 300000);
cache.put(requestObj2.id, graphObj2, 300000);

// depthCrawler(requestObj1);

breadthCrawler(requestObj2);

/**
 * function which performs crawlerTool in a depth crawling manner
 *
 * @param requestObj
 */
function depthCrawler(requestObj){
    crawler.crawlerTool(requestObj, function(err, callbackObj){
        if (err) {
            console.log(err);
        }
        else {
            // gets graphObj from memory
            var graphObj = cache.get(requestObj.id);
            // deletes current object stored at memory location
            cache.del(requestObj.id);
            // hashes callback object
            graphObj.addPacket(callbackObj);
            // puts in memory at key: request id for 5 minutes
            cache.put(requestObj.id, graphObj, 300000);
            requestObj.parent = {
                title: callbackObj.title,
                url: callbackObj.url
            };
            requestObj.startPage = callbackObj.children[0];
            requestObj.depth += 1;
            console.log(callbackObj);
            console.log(requestObj);
            depthCrawler(requestObj);
        }
    })
}

/**
 * function which performs crawlerTool in a breadth crawling manner
 *
 * @param requestObj
 */
function breadthCrawler(requestObj){
    crawler.crawlerTool(requestObj, function(err, callbackObj){
        if (err) {
            console.log(err);
        }
        else {
            // gets graphObj from memory
            var graphObj = cache.get(requestObj.id);
            // deletes current object stored at memory location
            cache.del(requestObj.id);
            // hashes callback object
            graphObj.addPacket(callbackObj);
            // puts in memory at key: request id for 5 minutes
            cache.put(requestObj.id, graphObj, 300000);
            var newDepth = requestObj.depth + 1;
            requestObj.parent = {
                title: callbackObj.title,
                url: callbackObj.url
            };
            for (var i = 0; i < callbackObj.children.length; i++) {
                requestObj.startPage = callbackObj.children[i];
                requestObj.depth = newDepth;
                console.log(callbackObj);
                console.log(requestObj);
                breadthCrawler(requestObj);
            }
        }
    })
}

/**
 * function returns a randomized string of length 16 containing
 * upper- and lower- alpha & num
 * 62^16 possible permutations
 *
 * @returns {string}
 */
function generateId(){
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var idLength = 16;
    var id = "";
    for (var i = 0; i < idLength; i++) {
        id += characters[Math.floor(Math.random() * characters.length)];
    }
    return id;
}