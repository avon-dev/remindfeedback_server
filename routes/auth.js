const winston = require('../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const passport = require('passport');
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

let type = 'portrait';
let fileSize = 50 * 1024 * 1024;

// Auth CRUD API

// 회원가입
router.post('/signup', clientIp, async (req, res, next) => {
    try {
        const { email, nickname, password } = req.body;

        winston.log('info', `[AUTH][${req.clientIp}|${email}] 회원가입 Request`);
        winston.log('info', `[AUTH][${req.clientIp}|${email}] email : ${email}, nickname : ${nickname}, password : ${password}`);

        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '이미 가입한 이메일입니다.';
            winston.log('info', `[AUTH][${req.clientIp}|${email}] ${JSON.stringify(result)}`);
            return res.status(200).send(result);
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
        });
        const result = new Object();
        result.success = true;
        result.data = newUser;
        result.message = '회원 가입에 성공했습니다.';
        winston.log('info', `[AUTH][${req.clientIp}|${email}] ${JSON.stringify(result)}`);
        return res.status(201).send(result);
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] 회원가입 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 회원 탈퇴
router.delete('/unregister', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;

        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] 회원 탈퇴 Request`);

        // 기존 유저 정보 조회
        await User.findOne({
            attributes: ['portrait'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        }).then(user => {
            // 사용자 테이블 조회를 성공한 경우
            let deleteItems = []; // 삭제할 파일명 저장할 배열

            // 사진 경로 있으면 기존 파일 삭제
            if (user.portrait) { deleteItems.push({ Key: user.portrait }) }

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
                if (board[0] != null) {
                    // 게시글 테이블에서 게시글 검색에 성공한 경우
                    board.forEach(element => {
                        if (element.board_file1) {
                            deleteItems.push({ Key: element.board_file1 })
                        }
                        if (element.board_file2) {
                            deleteItems.push({ Key: element.board_file2 })
                        }
                        if (element.board_file3) {
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
                    // 친구 차단 목록을 그대로 리턴
                    const result = new Object();
                    result.success = true;
                    result.data = 'NONE';
                    result.message = '성공적으로 회원 탈퇴를 하였습니다.';
                    winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
                    return res.status(200).send(result);
                }).catch(error => {
                    // 삭제 쿼리 실행을 실패한 경우
                    winston.log('error', `[AUTH][${req.clientIp}|${user_email}] 회원 탈퇴 쿼리 실행 실패 \n ${error.stack}`);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '회원 탈퇴 실행 과정에서 에러가 발생하였습니다.';
                    winston.log('error', `[AUTH][${user_uid}] ${JSON.stringify(result)}`);
                    return res.status(500).send(result);
                });
            }).catch(error => {
                // 게시글 테이블 조회를 실패한 경우
                winston.log('error', `[AUTH][${req.clientIp}|${user_email}] 게시글 테이블 조회 실패 \n ${error.stack}`);

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '게시글 조회 과정에서 에러가 발생하였습니다.';
                winston.log('error', `[AUTH][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
                return res.status(500).send(result);
            });
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            winston.log('error', `[AUTH][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[AUTH][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 회원 탈퇴 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 로그인
router.post('/login', clientIp, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        winston.log('info', `[AUTH][${req.clientIp}|${email}] 로그인 Request`);
        winston.log('info', `[AUTH][${req.clientIp}|${email}] email : ${email}, password : ${password}`);

        passport.authenticate('local', (authError, user, info) => { //done(에러, 성공, 실패)
            if (authError) {
                winston.log('error', `[AUTH][${req.clientIp}|${email}] ${authError}`);
                return next(authError);
            }
            if (!user) {
                winston.log('info', `[AUTH][${req.clientIp}|${email}] ${info.message}`);
                return res.status(200).send(info.message);
            }
            return req.login(user, (loginError) => { // req.user 사용자 정보가 들어있다.
                if (loginError) {
                    winston.log('error', `[AUTH][${req.clientIp}|${email}] ${loginError}`);
                    return next(loginError);
                }
                if (user.tutorial === false) {
                    User.update({ tutorial: true }, { where: { user_uid: user.user_uid } });
                }
                // 정상적으로 로그인에 성공한 경우
                winston.log('debug', `[AUTH][${req.clientIp}|${email}] 로그인 성공`);
                winston.log('debug', `[AUTH][${req.clientIp}|${email}] 로그인 인증 여부 : ${req.isAuthenticated()}`);

                let json_user = {
                    email: user.email,
                    nickname: user.nickname,
                    tutorial: user.tutorial,
                }

                // 로그인 한 사용자 데이터 리턴
                const result = new Object();
                result.success = true;
                result.data = json_user;
                result.message = '성공적으로 로그인했습니다.';
                winston.log('info', `[AUTH][${req.clientIp}|${email}] ${JSON.stringify(result)}`);
                return res.status(200).send(result);
            });
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] 로그인 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 내 정보
router.get('/me', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;

        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] 내 정보 Request`);

        let json_user = {
            email: req.user.email,
            nickname: req.user.nickname,
            portrait: req.user.portrait,
            introduction: req.user.introduction,
            tutorial: req.user.tutorial
        }

        // 로그인 성공 메세지 리턴
        const result = new Object();
        result.success = true;
        result.data = json_user;
        result.message = '로그인 한 사용자의 데이터를 불러왔습니다.';
        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        return res.status(200).send(result);
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 내 정보 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 로그아웃
router.get('/logout', clientIp, isLoggedIn, (req, res) => {
    try {
        const user_email = req.user.email;

        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] 로그아웃 Request`);

        // 로그아웃
        req.logout();

        // 로그아웃 성공 메세지 리턴
        const result = new Object();
        result.success = true;
        result.data = 'NONE';
        result.message = '로그아웃을 완료했습니다.';
        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        return res.status(200).send(result);
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 로그아웃 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;
