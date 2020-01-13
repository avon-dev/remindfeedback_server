const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();
const {deleteS3Obj, upload_s3} = require('./S3');
let { result_ok, result_err } = require('./response');

// let result = { // response form
//     success: true,
//     data: '',
//     message: ""
// }

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
            return res.status(201).json(result_err('', 'ERR: [403 FORBIDDEN] 이미 가입된 이메일 입니다.'));
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
        result_ok.data = newUser;
        result_ok.message = '[201 CREATED] '+ newUser.nickname+ '님 회원가입 완료되었습니다.';
        res.status(201).json(result_ok);
    } catch(e){
        result_err.message = 'ERR: [500 SERVER] auth.js/signup/~catch';
        result_err.data = e;
        console.error(e);
        return next(result_err);
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

        const destroyedUser = await User.destroy({
            where: {user_uid: user_uid}
        });// 유저 삭제 내역 반환
        console.log(`Delete One User's all information.`);

        result_ok.data = destroyedUser;
        result_ok.message = '[200 OK] 회원 탈퇴 성공';
        return res.status(200).json(result_ok);
    }catch(e){
        result_err.message = 'ERR: [500 SERVER] auth.js/unregister/~catch';
        result_err.data = e;
        console.error(e);
        return next(result_err);
    }
});

router.post('/login', async (req, res, next) => {
    try{
        passport.authenticate('local', (authError, user, info) => { //done(에러, 성공, 실패)
            if (authError) {
              console.error(authError);
              result_err.message = 'ERR: [500 SERVER] auth.js/login/authError';
              result_err.data = authError;
              return next(result_err);
            }
            if (!user) {
                result_err.message = 'ERR: [404 NOT FOUND] 가입되지 않은 회원입니다.'
                return res.status(404).send(result_err);
            }
            return req.login(user, (loginError) => { // req.user 사용자 정보가 들어있다.
                if (loginError) {
                    result_err.message = 'ERR: [403 FORBIDDEN] 비밀번호가 일치하지 않습니다.'
                    result_err.data = loginError;
                    console.error(loginError);
                    return next(result_err);
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
                result_ok.data = jsonuser;
                result_ok.message = '[200 OK] 로그인 성공하였습니다.'
                return res.status(201).json(jsonuser);
            });
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.

    } catch(e){
        result_err.message = 'ERR: [500 SERVER] auth.js/login/~catch';
        result_err.data = e;
        console.error(e);
        return next(result_err);
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
        result_ok.data = sendUser;
        result_ok.message = '[200 OK] 내 정보 조회 성공'
        return res.status(200).json(result_ok);
    } catch(e){
        result_err.message = 'ERR: [500 SERVER] auth.js/me/~catch';
        result_err.data = e;
        console.error(e);
        return next(result_err);
    }
  }
);

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    result_ok.message = '[200 OK] 로그아웃 완료'
    res.status(200).json(result_ok);
})

module.exports = router;
