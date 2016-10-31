var express = require('express');
var router = express.Router();
var crawler = require('../crawler.js');

/* EXPORTS */
module.exports = router;

/* GET home page. */
router.post('/', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.body['id'] == null)
    {
        if (req.body['startPage'] == null || req.body['startPage'].indexOf("http") !== 0)
        {
            res.json({ success: false, message: "startPage was not included as a parameter or didn't have a valid http starting prefix.", data: null });
            return;
        } 

        if (req.body['searchType'] == null || (req.body['searchType'] !== "depth" && req.body['searchType'] !== "breadth"))
        {
            res.json({ success: false, message: "searchType was either null or an invalid type. should be 'depth' or 'breadth'", data: null });
            return;
        }

        var page = parseInt(req.body['pageLimit']);
        if (isNaN(page) || page <= 0)
        {
            res.json({ success: false, message: "pageLimit was not a valid number or is not greater than 0.", data: null });
            return;
        }

        var depth = parseInt(req.body['depthLimit']);
        if (isNaN(page) || depth <= 0)
        {
            res.json({ success: false, message: "depth limit is not a valid number or is not greater than 0.", data: null });
            return;
        }

        var requestObj = {
            id: null,
            parent: null,
            startPage: req.body['startPage'],
            searchType: req.body['searchType'],
            keyword: req.body['keyword'],
            pageLimit: parseInt(req.body['pageLimit']),
            depthLimit: 1
            //depthLimit: parseInt(req.body['depthLimit'])
        };

        if (requestObj.searchType === "breadth") {
            breadthCrawler(requestObj, res);
        }
        else if (requestObj.searchType === "depth") {
            depthCrawler(requestObj, res);
        }
        else {
            res.send({
                success: false,
                message: "Error: invalid search type",
                data: null
            });
        }
    }
});

function depthCrawler(requestObj, res){
    if (requestObj.depthLimit > 0) {
        crawler.crawlerTool(requestObj, function(err, callbackObj){
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: err,
                    data: null
                });
            }
            else {
                res.send({
                    success: true,
                    message: "crawler successfully returned depth crawl",
                    data: callbackObj
                });
                requestObj.parent = {
                    title: callbackObj.title,
                    url: callbackObj.url
                };
                requestObj.startPage = callbackObj.children[0];
                requestObj.depthLimit -= 1;
                depthCrawler(requestObj, res);
            }
        })
    }
}

function breadthCrawler(requestObj, res){
    if (requestObj.depthLimit > 0) {
        crawler.crawlerTool(requestObj, function(err, callbackObj){
            if (err) {
                console.log(err);
                res.send({
                    success: false,
                    message: err,
                    data: null
                });
            }
            else {
                res.send({
                    success: true,
                    message: "crawler successfully returned depth crawl",
                    data: callbackObj
                });
                var newDepth = requestObj.depthLimit - 1;
                requestObj.parent = {
                    title: callbackObj.title,
                    url: callbackObj.url
                };
                for (var i = 0; i < callbackObj.children.length; i++) {
                    requestObj.startPage = callbackObj.children[i];
                    requestObj.depthLimit = newDepth;
                    depthCrawler(requestObj, res);
                }
            }
        })
    }
}