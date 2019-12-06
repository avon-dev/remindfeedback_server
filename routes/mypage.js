const express = require('express');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const upload = require('./uploads');

let result = {
    success: true,
    data: '',
    message: ""
}

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

/* Update One User. */
router.post('/update', isLoggedIn, upload.single('portrait'), async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const { nickname , introduction } = req.body;
        const portrait = req.file;
        console.log('마이페이지 수정 요청');

        // 닉네임 검사 (필수값)
        if (!nickname) {
            result.success = false;
            result.data = 'NONE';
            result.message = '닉네임은 반드시 입력해야 합니다.';
            return res.status(403).json(result);
        }
        const updateUser = await User.update({
            nickname,
            portrait: portrait.filename,
            introduction,
        }, {
            where: { user_uid: user_uid },
        });

        result.data = await User.findOne({
            attributes: ['email','nickname','portrait','introduction'], // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                user_uid: user_uid
            }
        });
        result.message = "마이페이지 수정 성공";
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

module.exports = router;