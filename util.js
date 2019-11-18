//util.js


const jwt = require('jsonwebtoken');

let util = {};

/* Authentication Success
 * @param {string} token
 * @returns {string} decoded
 */
util.successTrue = (data) => { //1 
  return {
    success:true,
    message:null,
    errors:null,
    data:data
  };
};

/* Authentication Fail
 * @param {string} token
 * @returns {string} decoded
 */
util.successFalse = (err, message) => { //2
  if(!err&&!message) message = 'data not found';
  return {
    success:false,
    message:message,
    errors:(err)? util.parseError(err): null,
    data:null
  };
};

/* Authentication ErrorMessage
 * @param {string} token
 * @returns {string} decoded
 */
util.parseError = (errors) => { //3
  let parsed = {};
  if(errors.name == 'ValidationError'){
    for(let name in errors.errors){
      let validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  } else if(errors.code == '11000' && errors.errmsg.indexOf('email') > 0) {
    parsed.email = { message:'This email already exists!' };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
};


/* Authentication middlewares
 * @param {string} token
 * @returns {string} decoded
 */
util.isLoggedin = (req,res,next) => { //4
  let token = req.headers['x-access-token'];
  if (!token) return res.json(util.successFalse(null,'token is required!'));
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) return res.json(util.successFalse(err));
      else{
        req.decoded = decoded;
        next();
      }
    });
  }
};

module.exports = util;