const express = require('express');
const { Feedback, User } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

/* Category CRUD API
 * - parameter category_id : 카테고리 번호
 * - parameter category_title : 카테고리 제목
 * - parameter category_color : 카테고리 색상
 */
// category insert
router.post('/insert', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const { category_title, category_color } = req.body;
        console.log('카테고리 저장 요청', category_title, category_color);
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({
            attributes: ['category'],
            where: { user_uid: user_uid }
        });

        const parseAllCategory = JSON.parse(user.category);
        // 카테고리 개수 검사(10개 제한, 0 ~ 9)
        if (parseAllCategory.length >= 10) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '카테고리 제한 개수를 초과하였습니다.';
            return res.status(403).json(result);
        }
        // 기본 카테고리 명 검사
        if (category_title == parseAllCategory[0].category_title) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '기본 카테고리 이름으로 생성할 수 없습니다.';
            return res.status(403).json(result);
        }
        // 반복문을 돌려 카테고리 명이 중복되는지 검사
        for (var i = 1; i < parseAllCategory.length; i++) {
            if (category_title == parseAllCategory[i].category_title) {
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '이미 생성된 카테고리입니다.';
                return res.status(403).json(result);
            }
        }
        // 카테고리 명이 중복되지 않는 경우 json object 생성 & array 추가
        const newCategory = new Object();
        newCategory.category_id = parseAllCategory[parseAllCategory.length - 1].category_id + 1;
        newCategory.category_title = category_title;
        newCategory.category_color = category_color;
        parseAllCategory.push(newCategory);
        const stringifyAllCategory = JSON.stringify(parseAllCategory);
        // 회원 정보 내부 카테고리 필드 업데이트
        const updateUser = await User.update({
            category: stringifyAllCategory,
        }, {
            where: { user_uid: user_uid },
        });
        // new category response
        const result = new Object();
        result.success = true;
        result.data = parseAllCategory;
        result.message = '새로운 카테고리를 생성했습니다.';
        console.log('Category Insert', JSON.stringify(result));
        return res.status(201).json(result);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// all category select
router.get('/selectall', async (req, res, next) => {
    try {
        // const user_uid = req.user.user_uid;
        console.log('모든 카테고리 데이터 요청')
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({
            attributes: ['category'],
            where: {
                email: 'test1@naver.com'
            }
        });
        const parseAllCategory = JSON.parse(user.category);
        // all category response
        const result = new Object();
        result.success = true;
        result.data = parseAllCategory;
        result.message = '사용자의 모든 카테고리 데이터를 가져왔습니다.';
        console.log('Category Select All', JSON.stringify(result));
        return res.status(200).json(result); //ReferenceError: stringifyResult is not defined
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// one category select
router.get('/selectone/:category_id', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const category_id = req.params.category_id;
        console.log('특정 카테고리 데이터 요청');
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        });
        const parseAllCategory = JSON.parse(user.category);
        // 반복문을 돌려 카테고리 id로 찾기
        for (var i = 0; i < parseAllCategory.length; i++) {
            if (category_id == parseAllCategory[i].category_id) {
                // one category response
                const result = new Object();
                result.success = true;
                result.data = parseAllCategory[i];
                result.message = '사용자가 선택한 카테고리의 데이터를 가져왔습니다.';
                console.log('Category Select One', JSON.stringify(result));
                return res.status(200).json(result);
            }
        }
        // error response
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = '카테고리의 ID가 잘못되었습니다.';
        console.log('Category Select All', JSON.stringify(result));
        return res.status(403).json(result);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// one category update
router.post('/update/:category_id', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const category_id = req.params.category_id;
        const { category_title, category_color } = req.body;
        console.log('선택한 카테고리 수정 요청');
        // 카테고리 번호 검사(기본값 수정 불가)
        if (category_id == 0) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '기본 카테고리는 수정할 수 없습니다.';
            return res.status(403).json(result);
        }
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        });
        const parseAllCategory = JSON.parse(user.category);
        // 반복문을 돌려 카테고리 id로 찾기
        for (var i = 1; i < parseAllCategory.length; i++) {
            if (category_id == parseAllCategory[i].category_id) {
                parseAllCategory[i].category_title = category_title;
                parseAllCategory[i].category_color = category_color;
                const stringifyAllCategory = JSON.stringify(parseAllCategory);
                // one category response
                // 회원 정보 내부 카테고리 필드 업데이트
                const updateUser = await User.update({
                    category: stringifyAllCategory,
                }, {
                    where: { user_uid: user_uid },
                });
                // update category response
                const result = new Object();
                result.success = true;
                result.data = parseAllCategory[i];
                result.message = '사용자가 선택한 카테고리의 정보를 수정했습니다.';
                console.log('Category Update One', JSON.stringify(result));
                return res.status(200).json(result);
            }
        }
        // error response
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = '카테고리의 ID가 잘못되었습니다.';
        console.log('Category Update Error', JSON.stringify(result));
        return res.status(403).json(result);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// one category delete
router.delete('/deleteone/:category_id', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const category_id = req.params.category_id;
        console.log('선택한 카테고리 삭제 요청');
        // 카테고리 번호 검사(기본값 삭제 불가)
        if (category_id == 0) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '기본 카테고리는 삭제할 수 없습니다.';
            return res.status(403).json(result);
        }
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        });
        const parseAllCategory = JSON.parse(user.category);
        // 반복문을 돌려 카테고리 id로 찾기
        for (var i = 1; i < parseAllCategory.length; i++) {
            if (category_id == parseAllCategory[i].category_id) {
                // 피드백 내부 카테고리 필드 기본값 업데이트
                const updateFeedback = await Feedback.update({
                    category: 0,
                }, {
                    where: {
                        user_uid: user_uid,
                        category: category_id
                    },
                });
                // 선택한 카테고리 삭제 후 json array 변경
                parseAllCategory.splice(i, 1);
                const stringifyAllCategory = JSON.stringify(parseAllCategory);
                // one category response
                // 회원 정보 내부 카테고리 필드 업데이트
                const updateUser = await User.update({
                    category: stringifyAllCategory,
                }, {
                    where: { user_uid: user_uid },
                });
                // delete category response
                const result = new Object();
                result.success = true;
                result.data = category_id;
                result.message = '사용자가 선택한 카테고리의 정보를 삭제했습니다.';
                console.log('Category Delete One', JSON.stringify(result));
                return res.status(200).json(result);
            }
        }
        // error response
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = '카테고리의 ID가 잘못되었습니다.';
        console.log('Category Delete Error', JSON.stringify(result));
        return res.status(403).json(result);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;