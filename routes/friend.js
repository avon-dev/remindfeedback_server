const express = require('express');
const bcrypt = require('bcrypt');
const { User, Feedback, Sequelize: { Op } } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

/* Friend CRUD API
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
// friend search (친구 검색)
router.get('/search', isLoggedIn, async function (req, res, next) {
    try {
        const email = req.body.email;
        const friend = await User.findOne({
            attributes: ['user_uid'],
        }, { // 이메일, 닉네임, 프로필사진 주소, 소개글
            where: {
                email: email
            }
        });
        // DB에서 친구 데이터를 꺼내오는데 성공한 경우
        if (friend != null) {
            const result = new Object();
            result.success = true;
            result.data = friend
            result.message = '친구 검색을 성공했습니다.';
            console.log(result);
            return res.status(200).send(result);
        } else { // 실패한 경우
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '검색 결과를 찾을 수 없습니다. 이메일을 확인해주세요.';
            console.log(result);
            return res.status(403).send(result);
        }
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend create(친구 추가)
router.get('/create', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        const
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
module.exports = router;