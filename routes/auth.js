const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();
const {deleteS3Obj, upload_s3} = require('./uploads');

let result = { // response form
    success: true,
    data: '',
    message: ""
}

/* Sign Up API
 * - parameter email
 * - parameter nickname
 * - parameter password
 */
router.post('/signup', async (req, res, next) => {
    try{
        const { email, password, nickname} = req.body;
        console.log('회원가입 요청', email, password, nickname);

        const exUser = await User.findOne({where: { email } });
        if(exUser) {
            return res.status(201).json( {msg:'이미 가입된 이메일 입니다.'});
        }
        const uid = await bcrypt.hash(email, 12);
        const pw = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            user_uid: uid,
            email,
            nickname,
            password: pw,
            portrait: '',
            introduction: '',
            tutorial: false,
        })
    
        // let text = {password,pw}
        console.log('newUser',newUser.nickname);
        res.status(201).json(newUser);
    } catch(e){
        console.error(e);
        return next(e);
    }
});

router.delete('/unregister',isLoggedIn, async (req, res, next)=>{
    try{
        const user_uid = req.user.user_uid;
        // 기존 유저 정보 조회
        const exUser = await User.findOne({
            attributes: ['portrait'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        })
        .then(user =>{ // 사진 경로 있으면 기존 파일 삭제
            //if(user.portrait){fileDelete(user.portrait)}
            if(user.portrait){deleteS3Obj(user.portrait)}
        });

        await User.destroy({
            where: {user_uid: user_uid}
        });
        result.data = await User.destroy({
            where: {user_uid: user_uid}
        }); // 유저 삭제 내역 반환
        result.success = true;
        result.message = "[200 OK] 회원 탈퇴 성공";
        console.log(`Delete One User's all information.`, JSON.stringify(result));
        return res.status(200).json(result);
    }catch(e){
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

router.post('/login', async (req, res, next) => {
    try{
        passport.authenticate('local', (authError, user, info) => { //done(에러, 성공, 실패)
            if (authError) {
              console.error(authError);
              return next(authError);
            }
            if (!user) {
                return res.status(201).send(info.message);
            }
            return req.login(user, (loginError) => { // req.user 사용자 정보가 들어있다.
                if (loginError) {
                    console.error(loginError);
                    return next(loginError);
                }
                if(user.tutorial === false){
                    User.update({tutorial:true},{where:{user_uid:user.user_uid}});
                }
                console.log('로그인 요청시도')
                console.log('로그인??',req.isAuthenticated());
                let jsonuser = {
                    email: user.email,
                    nickname: user.nickname,
                    tutorial: user.tutorial,
                }
                return res.status(201).json(jsonuser);
            });
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.

    } catch(e){
        console.error(e);
        return next(e);
    }
});

router.get('/me', isLoggedIn, async (req,res,next) => {
    try{
        const user = await User.findOne({where:{user_uid: req.user.user_uid}});
        let sendUser = await {
            email: user.email,
            nickname: user.nickname,
            portrait: user.portrait,
            introduction: user.introduction,
            tutorial: user.tutorial,
        }
        res.status(201).json(sendUser);
    } catch(e){
        console.error(e);
        return next(e);
    }
  }
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.status(200).json('logout');
})

module.exports = router;
