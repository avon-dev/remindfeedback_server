const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({ //첫번째 인자
    usernameField: 'email', 
    passwordField: 'password',
    session: true, //세션에 저장여부
  }, async (email, password, done) => { 
  
  console.log('12번째줄까지 탐');
    try { 
      const exUser = await User.findOne({ where: { email } }); 
      if (exUser) { 
        const result = await bcrypt.compare(password, exUser.password); 
        if (result) { 
          return done(null, exUser); 
        } else {
          return done(null, false, { message: '비밀번호가 일치하지 않습니다.' }); 
        }
      } else {
        return done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));

};
