const requestIp = require('request-ip');
 
// inside middleware handler
exports.clientIp = (req, res, next) => {
    req.clientIp = requestIp.getClientIp(req); 
    next();
};

exports.isLoggedIn = (req, res, next) => {
    // console.log('쿠키다쿠키',req.cookies)
    console.log('로그인 여부',req.isAuthenticated());
      if (req.isAuthenticated()) {
        next();
      } else {
        let result ={
          success: false,
          data: '',
          massage: '로그인 요망'
        }
        res.status(403).send(result);
      }
    };
    
exports.isNotLoggedIn = (req, res, next) => {
    console.log('로그인 여부',req.isAuthenticated());
    if (!req.isAuthenticated()) { 
        next();
    } else {
        res.status(403).send(false);
    }
};