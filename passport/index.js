const local = require('./localStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    console.log('serializeUser 호출됨@@@@@@@@@@@@@@')
    done(null, user.user_uid);
  });
    
  passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser 호출됨!!!!!!!!!!!!')
    try{
        const user = await User.findOne({
        where: { user_uid:id }, 
      })
      return done(null, user); //req.user
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local(passport);


}