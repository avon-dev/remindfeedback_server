const express = require('express');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const {upload, fileDelete} = require('./uploads');

let result = {
    success: true,
    data: '',
    message: ""
}

router.delete('/deleteFile', isLoggedIn, async (req, res, next)=>{
    try{
        const user_uid = req.user.user_uid;
        console.log('프로필사진 삭제');
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        fileDelete(user.portrait);
        return res.status(200).json("파일 삭제완료");
    }catch(e){
        res.status(500).json("파일 삭제실패");
        console.error(e);
        return next(e);
    }
});


/* Select One User. */
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        console.log('마이페이지 조회');
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.message="마이페이지 조회 성공"
        console.log('select one user.', JSON.stringify(result));
        return res.status(200).json(result);

    } catch (e) {
        result.success = false;
        result.message = "마이페이지 조회 실패"
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

/* Update One User's every data. */
router.put('/update', isLoggedIn, upload.single('portrait'), async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const nickname = req.body.nickname;
        let portrait = "";
        if(req.file) portrait = req.file.filename;
        let introduction = "";
        if(req.body.introduction) introduction = req.body.introduction;
        console.log('마이페이지 수정 요청');

        // 닉네임 검사 (필수값)
        if (!nickname) {
            result.success = false;
            result.data = 'NONE';
            result.message = '닉네임은 반드시 입력해야 합니다.';
            return res.status(403).json(result);
        }
        // 기존 유저 정보 조회
        const exUser = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        })
        .then(user =>{ // 기존 파일 삭제
            if(user.portrait){ fileDelete(user.portrait)}
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
        result.message = "마이페이지 수정 성공"
        console.log('Update One User', JSON.stringify(result));
        res.status(200).json(result);
    } catch (e) {
        result.success = false;
        result.message = "마이페이지 수정 실패"
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});


/* Update One User's nickname */
router.patch('/update/nickname', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const nickname = req.body.nickname;

        console.log(`마이페이지 nickname ${nickname} 수정 요청`);

        // 닉네임 검사 (필수값)
        if (!nickname) {
            result.success = false;
            result.data = 'NONE';
            result.message = '닉네임은 반드시 입력해야 합니다.';
            return res.status(403).json(result);
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
        result.message = "마이페이지 nickname 수정 성공";
        console.log(`Update One User's nickname`, JSON.stringify(result));
        res.status(200).json(result);
    } catch (e) {
        result.success = false;
        result.message = "마이페이지 nickname 수정 실패"
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

/* Update One User's introduction */
router.patch('/update/introduction', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        let introduction = "";
        if(req.body.introduction) introduction = req.body.introduction;
        
        console.log(`마이페이지 introduction ${introduction} 수정 요청`);
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
        result.message = "마이페이지 introduction 수정 성공";
        console.log(`Update One User's introduction`, JSON.stringify(result));
        res.status(200).json(result);
    } catch (e) {
        result.success = false;
        result.message = "마이페이지 introduction 수정 실패"
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

/* Update One User's portrait */
router.patch('/update/portrait', isLoggedIn,upload.single('portrait'), async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        let portrait = "";
        if(req.file) portrait = req.file.filename;
        
        console.log(`마이페이지 portrait ${portrait.filename} 수정 요청`);

        // 기존 유저 정보 조회
        const exUser = await User.findOne({
            attributes: ['portrait'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        })
        .then(user =>{ // 사진 경로 있으면 기존 파일 삭제
            if(user.portrait){ fileDelete(user.portrait)}
        });
        // 사진 파일명 업데이트
        const updateUser = await User.update({
            portrait
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
        result.message = "마이페이지 portrait 수정 성공";
        console.log(`Update One User's portrait`, JSON.stringify(result));
        res.status(200).json(result);
    } catch (e) {
        result.success = false;
        result.message = "마이페이지 portrait 실패"
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

module.exports = router;