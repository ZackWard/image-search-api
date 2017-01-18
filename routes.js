var express = require('express');
var router = express.Router();
var db = require('./db');
var getGoogleResults = require('./query-google');

router.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/syntax.html");
});

router.get('/api/imagesearch/:query', function (req, res) {
    var offset = 1;
    if (req.query.offset !== undefined) {
        // The free version of the Google Custom Search API limits searches to the first 100 results, so our max offset will be 90.       
        offset = Number(req.query.offset) > 90 ? 90 : Number(req.query.offset);
    }

    getGoogleResults(req.params.query, offset)
        .then((json) => {
            db.addSearchRecord(String(req.params.query));
            res.json(json)
        })
        .catch((e) => {
            console.log(e);
            res.status(500).end("Error: " + e);
        });
});

router.get('/api/latest/imagesearch', function (req, res) {
    db.getSearchHistory()
        .then((history) => {
            res.json(history);
        })
        .catch((e) => {
            res.status(500).end("Error: " + e);
        });
});

module.exports = router;