exports.isLoggedIn = (req, res, next) => {
    // console.log('쿠키다쿠키',req.cookies)
    console.log('로그인 여부',req.isAuthenticated());
      if (req.isAuthenticated()) {
        next();
      } else {
        res.status(403).send(false);
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
