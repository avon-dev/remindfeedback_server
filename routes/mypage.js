const winston = require('../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const { User } = require('../models');
const router = express.Router();
const {deleteS3Obj, upload_s3_test} = require('./S3');

let result = {
    success: true,
    data: '',
    message: ""
}

let type = 'portrait';
let fileSize = 50 * 1024 * 1024;

/**
* Select One User.
* @returns {json} json data of response result.
*/
router.get('/', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;

        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] 마이페이지 조회 Request`);

        // SELECT category FROM User WHERE user_uid = 'user_uid';
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.success = true;
        result.message="마이페이지 조회 성공"
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        return res.status(200).json(result);

    } catch (e) {
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.user.email}] 마이페이지 조회 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

/**
* Update One User's every data.
* @param {String} nickname user nickname
* @param {String} introduction user introduction
* @param {file} portrait user profile picture
* @returns {json} json data of response result.
*/
router.put('/update', clientIp, isLoggedIn, upload_s3_test(type, fileSize).single('portrait'), async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const { nickname, introduction } = req.body;
        let portrait = "";

        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] 마이페이지 수정 Request`);
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] nickname : ${nickname}, introduction : ${introduction}`);

        // 닉네임 검사 (필수값)
        if (!nickname) {
            result.success = false;
            result.data = 'NONE';
            result.message = '닉네임은 반드시 입력해야 합니다.';
            winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }
        // 기존 유저 정보 조회
        const exUser = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        })
        .then(user =>{ 
            if(req.file){ // 클라이언트가 보낸 새 파일 있을 때
                let deleteItems = [];
                deleteItems.push({Key:user.portrait })
                deleteS3Obj(deleteItems) // 기존 파일 경로 삭제: fileDelete는 파일 찾아보고 있을 때만 삭제함
                portrait = req.file.key;
            }else{ // 클라이언트가 보낸 파일 없으면 기존 파일명 사용
                console.log(`보낸 파일 없음`);
                portrait = user.portrait;
            }
        });
        // 유저 정보 업데이트        
        const updateUser = await User.update({
            nickname,
            portrait,
            introduction,
        }, {
            where: { user_uid: user_uid },
        }); // update 후 returning 속성으로 변경값 받아오는 건 postgres에서만 된다고 함
        // mariadb에선 변경된 컬럼 개수만 나타남

        // 변경된 유저정보 보여주기 위해 조회
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.success = true;
        result.message = "마이페이지 수정 성공"
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        return res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.user.email}] 마이페이지 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});


/**
* Update One User's nickname.
* @param {String} nickname user nickname
* @returns {json} json data of response result.
*/
router.patch('/update/nickname', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const nickname = req.body.nickname;

        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] 마이페이지 별명 수정 Request`);
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] nickname : ${nickname}`);


        // 닉네임 검사 (필수값)
        if (!nickname) {
            result.success = false;
            result.data = 'NONE';
            result.message = '닉네임은 반드시 입력해야 합니다.';
            winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }
        // 닉네임 업데이트
        const updateUser = await User.update({
            nickname
        }, {
            where: { user_uid: user_uid },
        });
        // 업데이트 된 값 반환
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.success = true;
        result.message = "마이페이지 nickname 수정 성공";
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.user.email}] 마이페이지 별명 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});


/**
* Update One User's introduction.
* @param {String} introduction user introduction
* @returns {json} json data of response result.
*/
router.patch('/update/introduction', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const introduction = req.body.introduction;

        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] 마이페이지 소개 수정 Request`);
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] introduction : ${introduction}`);

        // 상태메시지 업데이트
        const updateUser = await User.update({
            introduction
        }, {
            where: { user_uid: user_uid },
        });
        // 업데이트 된 값 반환
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.success = true;
        result.message = "마이페이지 introduction 수정 성공";
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.user.email}] 마이페이지 소개 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});


/**
* Update One User's portrait. (AWS S3 upload)
* @param {String} nickname user nickname
* @param {String} introduction user introduction
* @param {file} portrait user profile picture
* @returns {json} json data of response result.
*/
router.patch('/update/portrait', clientIp, isLoggedIn, upload_s3_test(type, fileSize).single('portrait'), async (req, res, next) => {
    try {
        if(!req.file) console.log(`보낸 파일 없음`); 

        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        let portrait = "";

        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] 마이페이지 사진 수정 Request`);

        // 기존 유저 정보 조회
        const exUser = await User.findOne({
            attributes: ['portrait'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        })
        .then(user =>{ // 
            if(req.file){ // 클라이언트가 보낸 새 파일 있을 때
                let deleteItems = [];
                deleteItems.push({Key:user.portrait })
                deleteS3Obj(deleteItems) // 기존 파일 경로 삭제: fileDelete는 파일 찾아보고 있을 때만 삭제함
                portrait = req.file.key;
            }else{ // 클라이언트가 보낸 파일 없으면 기존 파일명 사용
                portrait = user.portrait;
            }
        });
        console.log(`마이페이지 portrait = ${portrait}`);
        // 사진 파일명 업데이트
        const updateUser = await User.update({
            portrait,
        }, {
            where: { user_uid: user_uid },
        });
        // 업데이트 된 값 반환
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.success = true;
        result.message = "마이페이지 portrait 수정 성공";
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.user.email}] 마이페이지 사진 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

/**
* Delete One User's portrait.
* @returns {json} json data of response result.
*/
router.delete('/delete/portrait', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] 마이페이지 사진 삭제 Request`);

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
        // 사진 파일명 업데이트
        const updateUser = await User.update({
            portrait:""
        }, {
            where: { user_uid: user_uid },
        });
        // 업데이트 된 값 반환
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.success = true;
        result.message = "마이페이지 portrait 삭제 성공";
        winston.log('info', `[MYPAGE][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.user.email}] 마이페이지 사진 삭제 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[MYPAGE][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;