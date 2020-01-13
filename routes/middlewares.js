const { result_ok, result_err} = require('./response');
exports.isLoggedIn = (req, res, next) => {
    // console.log('쿠키다쿠키',req.cookies)
    console.log('로그인 여부',req.isAuthenticated());
      if (req.isAuthenticated()) {
        next();
      } else {
        result_err.massage = '[401 UNAUTHRIZED] 로그인한 유저만 접근할 수 있습니다.';
        res.status(403).send(result_err);
      }
    };
    
exports.isNotLoggedIn = (req, res, next) => {
    console.log('로그인 여부',req.isAuthenticated());
    if (!req.isAuthenticated()) { 
        next();
    } else {
      result_err.massage = '[403 FORBIDDEN] 로그아웃 후 접근 가능합니다.';
        res.status(403).send(result_err);
    }
};
