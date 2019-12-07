var express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
    res.json('백엔드 정상 동작');
});

module.exports = router;
