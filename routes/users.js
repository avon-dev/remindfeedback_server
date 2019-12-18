const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

let result = {
  success: true,
  data: '',
  message: ""
}


/* GET users listing. */
router.get('/', isLoggedIn, async function(req, res, next) {
  try{
    const user_uid = req.user.user_uid;
    result.data =  await User.findOne({ // 이메일, 닉네임, 프로필사진 주소, 소개글
      where: {
          user_uid: user_uid
      }
    });
    result.message = "유저 정보 전부 불러오기 성공";
    console.log(result);
    return res.status(200).send(result);
  }catch(e){
    console.error(e);
    return next(e);
  }
});

module.exports = router;
