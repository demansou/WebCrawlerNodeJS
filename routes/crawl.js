var express = require('express');
var router = express.Router();
var crawler = require('../crawler.js');

/* GET home page. */
router.post('/', function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var id = req.body['id'];

    if (id == null)
    {
        if (req.body['startPage'] == null || req.body['startPage'].indexOf("http") !== 0)
        {
            res.json({ success: false, message: "Error: startPage was not included as a parameter or didn't have a valid http starting prefix.", data: null });
            return;
        } 

        if (req.body['searchType'] == null || (req.body['searchType'] !== "depth" && req.body['searchType'] !== "breadth")) {
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


        id = crawler.CreateCrawlInstance(req.body['startPage'], req.body['searchType'], req.body['keyword'], req.body['pageLimit'], req.body['depth'], req.body['depthLimit']);
    }

    //Terminate the crawl if it makes sense
    if(req.body['terminate'] != null && req.body['terminate'] == true)
    {
        crawler.EndCrawl(id);
        res.json({ success: true, message: "Crawl has been terminated", data: null });
        return;
    }

    //Increment the crawl and get the next set of data
    crawler.IncrementCrawl(id, req.body['depth'], function (err, result) {

        if (err)
        {
            res.json(err);
        }
        else
        {
            res.json(result);
        }
    });
});

module.exports = router;