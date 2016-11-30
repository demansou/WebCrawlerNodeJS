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
        var startPage = req.body['startPage'];
        if (startPage == null || startPage.indexOf("http") !== 0)
        {
            res.json({ success: false, message: "Error: startPage was not included as a parameter or didn't have a valid http starting prefix.", data: null });
            return;
        } 

        var searchType = req.body['searchType'];
        if (searchType == null || (searchType !== "depth" && searchType !== "breadth")) {
            res.json({ success: false, message: "Error: searchType was either null or an invalid type. should be 'depth' or 'breadth'", data: null });
            return;
        }

        var keyword = req.body['keyword'];
        if (keyword === null || keyword === undefined) {
            keyword = "";
        }

        var pageLimit = parseInt(req.body['pageLimit']);
        if (isNaN(pageLimit) || pageLimit <= 0)
        {
            res.json({ success: false, message: "Error: pageLimit was not a valid number or is not greater than 0.", data: null });
            return;
        }

        var depthLimit = parseInt(req.body['depthLimit']);
        if (isNaN(depthLimit) || depthLimit <= 0)
        {
            res.json({ success: false, message: "Error: depth limit is not a valid number or is not greater than 0.", data: null });
            return;
        }

        id = crawler.CreateCrawlInstance(startPage, searchType, keyword, pageLimit, depthLimit);
    }

    //Terminate the crawl if it makes sense
    if(req.body['terminate'] != null && req.body['terminate'] == true)
    {
        crawler.EndCrawl(id);
        res.json({ success: true, message: "Crawl has been terminated", data: null });
        return;
    }

    //Increment the crawl and get the next set of data
    crawler.IncrementCrawl(id, function (err, result) {

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