var express = require('express');
var cache = require('memory-cache');
var cookieParser = require('cookie');
var router = express.Router();

var crawler = require('../crawler.js');
var crawlerFrontend = require('../public/javascripts/crawler/crawler-frontend.js');


/* EXPORTS */
module.exports = router;

/* TEST EXPORTS COMMENT OUT WHEN FINISHED TESTING */
// module.depthCrawler = depthCrawler;
// module.breadthCrawler = breadthCrawler;


/* GET home page. */
router.post('/', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');


    if (req.body['id'] == null)
    {
        if (req.body['startPage'] == null || req.body['startPage'].indexOf("http") !== 0)
        {
            res.json({ success: false, message: "Error: startPage was not included as a parameter or didn't have a valid http starting prefix.", data: null });
            return;
        }

        if (req.body['searchType'] == null || (req.body['searchType'] !== "depth" && req.body['searchType'] !== "breadth"))
        {
            res.json({ success: false, message: "Error: searchType was either null or an invalid type. should be 'depth' or 'breadth'", data: null });
            return;
        }

        var page = parseInt(req.body['pageLimit']);
        if (isNaN(page) || page <= 0)
        {
            res.json({ success: false, message: "Error: pageLimit was not a valid number or is not greater than 0.", data: null });
            return;
        }

        var depth = parseInt(req.body['depthLimit']);
        if (isNaN(page) || depth <= 0)
        {
            res.json({ success: false, message: "Error: depth limit is not a valid number or is not greater than 0.", data: null });
            return;
        }

        /* generate object for crawler iteration */
        var requestObj = {
            id: generateId(),
            parent: null,
            startPage: req.body['startPage'],
            searchType: req.body['searchType'],
            keyword: req.body['keyword'],
            pageLimit: parseInt(req.body['pageLimit']),
            depth: 0,
            depthLimit: parseInt(req.body['depthLimit'])
        };

        /* update header with latest cookie bit */
        res.header("Set-Cookie", cookieParser.serialize(requestObj.id, requestObj.startPage, {
            /* sets max age for 1 hour */
            maxAge: 60 * 60
        }));

        /* initialize cache object at memory location denoted by unique id */
        var graphObj = new crawlerFrontend.CrawlerGraph();
        cache.put(requestObj.id, graphObj, 300000);

        /* iterate crawler */
        if (requestObj.searchType === "breadth") {
            breadthCrawler(requestObj);
        }
        else if (requestObj.searchType === "depth") {
            depthCrawler(requestObj);
        }

        /* respond to client request */
        res.json({
            success: true,
            message: "crawl initiated",
            data: {
                id: requestObj.id,
                startPage: requestObj.startPage,
                searchType: requestObj.searchType,
                keyword: requestObj.keyword,
                pageLimit: requestObj.pageLimit,
                depthLimit: requestObj.depthLimit
            }
        });
    }
});

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