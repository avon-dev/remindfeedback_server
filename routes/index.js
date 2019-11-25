var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('백엔드 정상 동작');
    return res.json(true);
});

module.exports = router;
