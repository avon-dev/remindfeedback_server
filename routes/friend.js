const express = require('express');
const { User, Friend } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

/* Friend CRUD API
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
// friend search (친구 검색)
router.post('/search', isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const email = req.body.email;

        // 본인 이메일 검색 시 에러 출력
        if (email == user_email) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '사용자를 찾을 수 없습니다. 나 자신은 영원한 인생의 친구입니다.';
            console.log(result);
            return res.status(403).send(result);
        }


        console.log('친구 검색 요청', email);
        console.log(req.body);
        const exFriend = await User.findOne({
            attributes: ['email', 'nickname', 'portrait', 'introduction'],
            where: {
                email: email
            }
        });

        // 친구 검색에 성공한 경우
        if (exFriend) {
            const result = new Object();
            result.success = true;
            result.data = exFriend;
            result.message = '친구 검색에 성공했습니다.';
            console.log(result);
            return res.status(200).send(result);
        } else { // 실패한 경우
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '사용자를 찾을 수 없습니다. 이메일을 확인해주세요.';
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
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
module.exports = router;