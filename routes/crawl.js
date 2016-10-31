var express = require('express');
var router = express.Router();
var crawler = require('../crawler.js');

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
            depthLimit: parseInt(req.body['depthLimit'])
        };

        crawler.crawlerTool(requestObj, function (err, result) {
            if (err) {
                res.send({
                    success: false, message: "The crawler had an unexpected failure.", data: null
                });
            }
            else {
                result['success'] = true;
                result['message'] = "crawler successfully returned value";
                res.send(result);
                if (requestObj.searchType === "breadth") {

                }
                else if (requestObj.searchType === "depth") {

                }
                else {

                }
            }
        });
    }

});

module.exports = router;