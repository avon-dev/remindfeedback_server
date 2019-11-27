exports.isLoggedIn = (req, res, next) => {
    console.log(req.user)
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
