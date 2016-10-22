var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/search', function (req, res, next) {

        if (req.body.id == null) {
            //Query the crawler for an id
            res.send({ id: 1 });
        }
        else
        {
            //GetNewestCrawlerUpdate
            //if data is valid
                //Send updated data res.send({id: 1})
            //else send data response
        }
});

module.exports = router;
