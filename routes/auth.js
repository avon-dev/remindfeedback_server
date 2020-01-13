const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { deleteS3Obj, upload_s3 } = require('./S3');

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

let result = { // response form
    success: true,
    data: '',
    message: ""
}

let type = 'portrait';
let fileSize = 50 * 1024 * 1024;

/* Sign Up API
 * - parameter email
 * - parameter nickname
 * - parameter password
 */
router.post('/signup', async (req, res, next) => {
    try {
        const { email, password, nickname } = req.body;
        console.log('회원가입 요청', email, password, nickname);

        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.status(201).json({ msg: '이미 가입된 이메일 입니다.' });
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
        console.log('newUser', newUser.nickname);
        res.status(201).json(newUser);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.delete('/unregister', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[DELETE] 회원 탈퇴 요청');

        const user_uid = req.user.user_uid;
        // 기존 유저 정보 조회
        await User.findOne({
            attributes: ['portrait'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        }).then(user => { 
            // 사용자 테이블 조회를 성공한 경우
            console.log('[DELETE] 사용자 테이블 조회 성공');
            let deleteItems = []; // 삭제할 파일명 저장할 배열
            
            // 사진 경로 있으면 기존 파일 삭제
            if (user.portrait) { deleteItems.push({Key:user.portrait})}

            let query_select = 'SELECT * FROM boards WHERE fk_feedbackId=ANY(SELECT id FROM feedbacks WHERE user_uid=:user_uid)';

            
            // 게시글 테이블에서 board_id로 검색
            sequelize.query(query_select, {
                replacements: {
                    user_uid: user_uid
                },
                type: Sequelize.QueryTypes.SELECT,
                raw: true
            }).then((board) => {
                // 게시글 테이블 조회를 성공한 경우
                console.log('[DELETE] 게시글 테이블 조회 성공');

                if (board[0] != null) {
                    // 게시글 테이블에서 게시글 검색에 성공한 경우
                    console.log('[DELETE] 게시글 검색 성공');
                    board.forEach(element=>{
                        if(element.board_file1){
                            deleteItems.push({ Key: element.board_file1 })
                        }
                        if(element.board_file2){
                            deleteItems.push({ Key: element.board_file2 })
                        }
                        if(element.board_file3){
                            deleteItems.push({ Key: element.board_file3 })
                        }
                    })
                }
                // 삭제할 목록에 있는 파일들 전부 삭제
                deleteS3Obj(deleteItems);

                let query_update =
                    'UPDATE comments SET deletedAt=NOW() WHERE fk_user_uid=:user_uid; ' +
                    'UPDATE boards SET deletedAt=NOW() WHERE fk_feedbackId=ANY(SELECT id FROM feedbacks WHERE user_uid=:user_uid); ' +
                    'UPDATE feedbacks SET deletedAt=NOW() WHERE user_uid=:user_uid; ' +
                    'UPDATE friends SET deletedAt=NOW() WHERE user_uid=:user_uid OR friend_uid=:user_uid; ' +
                    'UPDATE users SET deletedAt=NOW() WHERE user_uid=:user_uid;';

                sequelize.query(query_update, {
                    replacements: {
                        user_uid: user_uid
                    },
                    raw: true
                }).then(() => {
                    // 정상적으로 회원 탈퇴 쿼리를 수행한 경우
                    console.log('[DELETE] 회원 탈퇴 성공');

                    // 친구 차단 목록을 그대로 리턴
                    const result = new Object();
                    result.success = true;
                    result.data = 'NONE';
                    result.message = '[DELETE] 성공적으로 회원 탈퇴를 하였습니다.';
                    console.log(result);
                    return res.status(200).send(result);
                }).catch(error => {
                    // 삭제 쿼리 실행을 실패한 경우
                    console.log('[DELETE] 회원 탈퇴 쿼리 실행 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[DELETE] 회원 탈퇴 실행 과정에서 에러가 발생하였습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });
            }).catch(error => {
                // 게시글 테이블 조회를 실패한 경우
                console.log('[DELETE] 게시글 테이블 조회 실패', error);

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[DELETE] 게시글 조회 과정에서 에러가 발생하였습니다.';
                console.log(result);
                return res.status(500).send(result);
            });
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[DELETE] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[DELETE] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

router.post('/login', async (req, res, next) => {
    try {
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
                if (user.tutorial === false) {
                    User.update({ tutorial: true }, { where: { user_uid: user.user_uid } });
                }
                console.log('로그인 요청시도')
                console.log('로그인??', req.isAuthenticated());
                let jsonuser = {
                    email: user.email,
                    nickname: user.nickname,
                    tutorial: user.tutorial,
                }
                return res.status(201).json(jsonuser);
            });
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.

    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.get('/me', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { user_uid: req.user.user_uid } });
        let sendUser = await {
            email: user.email,
            nickname: user.nickname,
            portrait: user.portrait,
            introduction: user.introduction,
            tutorial: user.tutorial,
        }
        res.status(201).json(sendUser);
    } catch (e) {
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
