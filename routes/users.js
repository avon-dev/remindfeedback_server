var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  try{
    return res.json(true);
  }catch(e){
    console.error(e);
    return next(e);
  }
  
});

module.exports = router;
