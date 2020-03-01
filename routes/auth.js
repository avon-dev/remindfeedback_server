const winston = require('../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const bcrypt = require('bcrypt');
const { User, Auth, Sequelize: { Op } } = require('../models');
const passport = require('passport');
const router = express.Router();
const { deleteS3Obj, upload_s3 } = require('./S3');

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
require('dotenv').config(); //.env 설정
const config = require(__dirname + '/../config/config.json')[env];

const crypto = require('crypto');
const nodemailer = require('nodemailer');

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


//회원가입 전 이메일 중복확인 및 토큰 발행
router.post('/email', clientIp, async (req, res, next) => {
    try {
        const { email } = req.body;
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        winston.log('info', `[AUTH][${req.clientIp}|${email}] 회원가입전 메일확인 Request`);
        winston.log('info', `[AUTH][${req.clientIp}|${email}] email : ${email}`);

        const result = new Object();
        if (!emailRegexp.test(email)) {
            result.success = false;
            result.data = 'NONE';
            result.message = '이메일형식오류';
            return res.status(201).json(result)
        }

        //이메일 존재여부 파악
        const exuser = await User.findOne({
            where: { email: email }
        })
        if (exuser === null) {
            //존재시 토큰 생성 후
            const token = crypto.randomBytes(2).toString('hex'); // token 생성
            const data = { // 데이터 정리
                token,
                email: email,
                type: 1 // 비밀번호 관련 타입 1
            };
            Auth.create(data); // 데이터베이스 Auth 테이블에 데이터 입력

            //메일로 토큰 보내기
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.gmail_user,
                    pass: process.env.gmail_pass
                }
            });
            const emailOptions = { // 옵션값 설정
                from: 'test@gmail.com',
                to: email,
                subject: `[RemindFeedback] 회원가입을 위한 안내메일 입니다. `,
                html: '회원가입을 위해 토큰을 입력하여 주세요.'
                    + `<br>token 정보 : ${token}` + `<br>유효시간 10분`,
            };
            transporter.sendMail(emailOptions, res);

            // 전송 포트 종료
            transporter.close();
            
            // 토큰 생성 성공 메세지 리턴
            const result = new Object();
            result.success = true;
            result.data = 'NONE';
            result.message = `[AUTH][${req.clientIp}|${email}] 토큰 전송에 성공했습니다.`;
            return res.status(201).send(result);
        } else {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '존재하는 이메일 입니다.';
            console.log('info');
            return res.status(201).send(result);
        }

    } catch (e) {
        console.error(e);
        return next(e);
    }
})


// 회원가입
router.post('/register', clientIp, async (req, res, next) => {
    try {
        const { email, nickname, password, token } = req.body;

        winston.log('info', `[AUTH][${req.clientIp}|${email}] 회원가입 Request`);
        winston.log('info', `[AUTH][${req.clientIp}|${email}] email : ${email}, nickname : ${nickname}, password : ${password}, token : ${token}`);

        await Auth.findOne({
            where: {
                token,
                createdAt: {
                    [Op.gt]: new Date() - 600000
                },
                type: 1
            }
        }).then(async exauth => {
            let authemail = exauth.email;
            await console.log('authemail', authemail)

            await Auth.destroy({ where: { token: exauth.token } }).then().catch()

            //회원 등록
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '이미 가입한 이메일입니다.';
                winston.log('info', `[AUTH][${req.clientIp}|${email}] ${result.message}`);
                return res.status(200).send(result);
            }
            const uid = await bcrypt.hash(email, 12);
            const pw = await bcrypt.hash(password, 12);
            await User.create({
                user_uid: uid,
                email,
                nickname,
                password: pw,
                portrait: '',
                introduction: '',
                tutorial: false,
            });
            const returnData = new Object();
            returnData.user_uid = uid;
            returnData.email = email;
            returnData.nickname = nickname;
            returnData.tutorial = false;

            const result = new Object();
            result.success = true;
            result.data = returnData;
            result.message = '회원 가입에 성공했습니다.';
            winston.log('info', `[AUTH][${req.clientIp}|${email}] ${result.message}`);
            return res.status(201).send(result);

        }).catch(async e => {
            console.error(e);
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '유효한 토큰이 아닙니다.';
            console.log('info', `[AUTH] ${result.message}`);
            return res.status(200).send(result);
        })

    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] 회원가입 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] ${result.message}`);
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
                    'UPDATE users SET deletedAt=NOW() WHERE user_uid=:user_uid;' +
                    'UPDATE feedbacks SET updatedAt=NOW(), adviser_uid=null, complete=IF(complete=2, 2, -1) WHERE adviser_uid=:user_uid;';

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
                    winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).send(result);
                }).catch(error => {
                    // 삭제 쿼리 실행을 실패한 경우
                    winston.log('error', `[AUTH][${req.clientIp}|${user_email}] 회원 탈퇴 쿼리 실행 실패 \n ${error.stack}`);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '회원 탈퇴 실행 과정에서 에러가 발생하였습니다.';
                    winston.log('error', `[AUTH][${user_uid}] ${result.message}`);
                    return res.status(500).send(result);
                });
            }).catch(error => {
                // 게시글 테이블 조회를 실패한 경우
                winston.log('error', `[AUTH][${req.clientIp}|${user_email}] 게시글 테이블 조회 실패 \n ${error.stack}`);

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '게시글 조회 과정에서 에러가 발생하였습니다.';
                winston.log('error', `[AUTH][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(500).send(result);
            });
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            winston.log('error', `[AUTH][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[AUTH][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 회원 탈퇴 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] ${result.message}`);
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
                // 정상적으로 로그인에 성공한 경우
                winston.log('debug', `[AUTH][${req.clientIp}|${email}] 로그인 성공`);
                winston.log('debug', `[AUTH][${req.clientIp}|${email}] 로그인 인증 여부 : ${req.isAuthenticated()}`);

                let json_user = {
                    email: user.email,
                    nickname: user.nickname,
                    portrait: user.portrait,
                    introduction: user.introduction,
                    tutorial: user.tutorial,
                }

                // 로그인 한 사용자 데이터 리턴
                const result = new Object();
                result.success = true;
                result.data = json_user;
                result.message = '성공적으로 로그인했습니다.';
                winston.log('info', `[AUTH][${req.clientIp}|${email}] ${result.message}`);
                return res.status(200).send(result);
            });
        })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] 로그인 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.body.email}] ${result.message}`);
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
        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${result.message}`);
        return res.status(200).send(result);
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 내 정보 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

router.patch('/tutorial', clientIp, isLoggedIn, async (req, res, next) => {
    let result = {
        success: true,
        data: '',
        message: ""
    }
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] 튜토리얼 상태 true로 변경 Request`);

        if (req.user.tutorial === false) {
            User.update({ tutorial: true }, { where: { user_uid: user_uid } });
        }
        result.success = true;
        result.message = `튜토리얼 완료처리 성공`;
        winston.log('info', `[AUTH]][${req.clientIp}|${user_email}] ${result.message}`);
        return res.status(200).json(result);
    } catch (e) {
        result.success = false;
        result.message = `튜토리얼 완료처리 실패`;
        winston.log('error', `[AUTH]][${req.clientIp}|${user_email}] ${result.message}`);
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
        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${result.message}`);
        return res.status(200).send(result);
    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 로그아웃 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});


// 비밀번호 분실 신고
router.post('/password', clientIp, async (req, res, next) => {
    try {
        const user_email = req.body.email;

        winston.log('info', `[AUTH][${req.clientIp}|${user_email}] 비밀번호 초기화 요청`);

        const result = new Object();

        //이메일 존재여부 파악
        User.findOne({
            where: { email: user_email }
        }).then(async exuser => {

            const exauth = await Auth.findAll({
                where: {
                    email: user_email,
                    type: 2
                }
            })

            if (exauth.length > 4) {
                let lastauth = await exauth[exauth.length - 1]
                if (lastauth.createdAt > new Date() - 3600000) {//한시간 뒤 재발급 가능
                    console.log('lastauth', lastauth);
                    //1시간이 지나지 않아 토큰 발행 거부
                    result.success = false;
                    result.data = '';
                    result.message = '연속 토큰 발행 거부.';
                    return res.status(201).json(result);
                } else {
                    //제한시간이 지났으니 기존 토큰 모두 제거
                    await Auth.destroy({ where: { email: user_email } });
                }
            }

            //존재시 토큰 생성 후
            const token = crypto.randomBytes(2).toString('hex'); // token 생성
            const data = { // 데이터 정리
                token,
                email: exuser.email,
                type: 2 // 비밀번호 관련 타입 2
            };
            Auth.create(data); // 데이터베이스 Auth 테이블에 데이터 입력

            //메일로 토큰 보내기
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.gmail_user,
                    pass: process.env.gmail_pass
                }
            });
            const emailOptions = { // 옵션값 설정
                from: 'test@gmail.com',
                to: user_email,
                subject: `[RemindFeedback] 비밀번호 재설정을 위한 안내메일 입니다. `,
                html: '비밀번호 초기화를 위해 토큰을 입력하여 주세요.'
                    + `<br>token 정보 : ${token}` + `<br>유효시간 10분`,
            };
            transporter.sendMail(emailOptions, res); //전송

            // 토큰 생성 성공 메세지 리턴
            result.success = true;
            result.data = exuser;
            result.message = '토큰을 생성하여 이메일로 발신했습니다.';
            winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${result.message} ${token}`);
            return res.status(200).send(result);
        }).catch(error => {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '잘못된 이메일 입니다.';
            winston.log('info', `[AUTH][${req.clientIp}|${user_email}] ${result.message} ${error}`);
            return res.status(200).send(result);
        })

    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] 비밀번호 초기화 요청 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 비밀번호 초기화 요청
router.patch('/password', clientIp, async (req, res, next) => {
    try {
        const { token, password } = req.body;

        winston.log('info', `[AUTH][${req.clientIp}|${token}] 비밀번호 초기화 요청`);

        //이메일 존재여부 파악
        await Auth.findOne({
            where: {
                token,
                createdAt: {
                    [Op.gt]: new Date() - 600000
                },
            }
        }).then(async exauth => {
            let authemail = exauth.email;
            await console.log('여기다여기', authemail)
            const newpw = await bcrypt.hash(password, 12);
            const 유조 = await User.findOne({ where: { email: authemail } })
            console.log('유조', 유조.user_uid);
            await User.update({
                password: newpw
            }, { where: { user_uid: 유조.user_uid } }).then(
                await Auth.destroy({ where: { token: exauth.token } }).then().catch()
            ).catch(err => { console.error(err) });

            // 비밀번호 변경 성공 메세지 리턴
            const result = new Object();
            result.success = true;
            result.data = 'NONE';
            result.message = '비밀번호를 변경하였습니다 다시 로그인해주세요.';
            winston.log('info', `[AUTH][${req.clientIp}|] ${result.message}`);
            return await res.status(200).send(result);
        }).catch(async e => {
            console.error(e);
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '유효한 토큰이 아닙니다.';
            winston.log('info', `[AUTH][${req.clientIp}|] ${result.message}`);
            return res.status(200).send(result);
        })

    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}] 비밀번호 초기화 요청 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 이메일 확인
router.post('/checkemail', clientIp, async (req, res, next) => {
    try {
        const { email } = req.body;

        winston.log('info', `[AUTH][${req.clientIp}|${email}] 이메일 확인 요청`);

        //이메일 존재여부 파악
        await User.findOne({
            where: { email }
        }).then(async exuser => {
            const result = new Object();
            if (exuser !== null) {
                result.success = true;
                result.data = 'NONE';
                result.message = '존재하는 회원입니다.';
                winston.log('info', `[AUTH][${req.clientIp}|] ${result.message} | ${exuser}`);
                return await res.status(201).send(result);
            } else {
                result.success = false;
                result.data = 'NONE';
                result.message = '존재하지 않는 회원입니다.';
                winston.log('info', `[AUTH][${req.clientIp}|] ${result.message} | ${exuser}`);
                return await res.status(201).send(result);
            }
        }).catch(async e => {
            console.error(e);
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '잘못된 email 입니다.';
            winston.log('info', `[AUTH][${req.clientIp}|] ${result.message}`);
            return res.status(201).send(result);
        })

    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}] 이메일 확인 요청 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 비밀번호 확인
router.post('/checkpassword', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const { password } = req.body;
        const user_uid = req.user.user_uid;

        winston.log('info', `[AUTH][${req.clientIp}|${password}] 비밀번호 확인 요청`);

        //이메일 존재여부 파악
        await User.findOne({
            where: {
                user_uid: user_uid
            }
        }).then(async exuser => {
            const result = new Object();
            const samepw = await bcrypt.compare(password, exuser.password);
            if (samepw) {//비밀번호 일치
                result.success = true;
                result.data = 'NONE';
                result.message = '비밀번호가 일치합니다.';
                winston.log('info', `[AUTH][${req.clientIp}|] ${result.message}`);
                return await res.status(201).send(result);
            } else {//비밀번호 불일치
                result.success = false;
                result.data = 'NONE';
                result.message = '비밀번호가 일치하지 않습니다.';
                winston.log('info', `[AUTH][${req.clientIp}|] ${result.message}`);
                return await res.status(201).send(result);
            }
        }).catch(async e => {
            console.error(e);
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '유효한 비밀번호가 아닙니다. (string 값 보내주세요)';
            winston.log('info', `[AUTH][${req.clientIp}|] ${result.message}`);
            return res.status(500).send(result);
        })

    } catch (e) {
        winston.log('error', `[AUTH][${req.clientIp}] 비밀번호 확인 요청 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[AUTH][${req.clientIp}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;
