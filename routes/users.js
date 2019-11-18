var express = require('express');
var router = express.Router();
const util = require('../util');


/* GET users listing. */
router.get('/', util.isLoggedin, function(req, res, next) {
  try{
    return res.json(true);
  }catch(e){
    console.error(e);
    return next(e);
  }
  
});

module.exports = router;
