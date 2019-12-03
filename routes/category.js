const express = require('express');
const { User } = require('../models');
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
            return res.status(201).json({ msg: '카테고리 제한 개수를 초과하였습니다.' });
        }
        // 기본 카테고리 명 검사
        if (category_title == parseAllCategory[0].category_title) {
            return res.status(201).json({ msg: '기본 카테고리 이름으로 생성할 수 없습니다.' });
        }
        // 반복문을 돌려 카테고리 명이 중복되는지 검사
        for (var i = 1; i < parseAllCategory.length; i++) {
            if (category_title == parseAllCategory[i].category_title) {
                return res.status(201).json({ msg: '이미 생성된 카테고리입니다.' });
            }
        }
        // 카테고리 명이 중복되지 않는 경우 json object 생성 & array 추가
        const newCategory = new Object();
        newCategory.category_id = parseAllCategory[parseAllCategory.length-1].category_id+1;
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
        console.log('newCategory', updateUser.category);
        res.status(201).send(stringifyAllCategory);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// all category select
router.get('/selectall', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        console.log('모든 카테고리 데이터 요청')
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        const user = await User.findOne({ 
            attributes: ['category'], 
            where: { 
                user_uid: user_uid 
            } 
        });
        // all category response
        console.log('allCategory', user.category);
        res.status(201).json(user.category);
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
        for (var i = 1; i < parseAllCategory.length; i++) {
            if (category_id == parseAllCategory[i].category_id) {
                const stringifyOneCategory = JSON.stringify(parseAllCategory[i]);
                // one category response
                console.log('oneCategory', stringifyOneCategory);
                return res.status(201).send(stringifyOneCategory);
            }
        }
        return res.status(404).json({ msg: '카테고리 id가 잘못되었습니다.' });
        // const stringifyOneCategory = JSON.stringify(parseAllCategory[category_id]);
        // // one category response
        // console.log('oneCategory', stringifyOneCategory);
        // res.status(201).send(stringifyOneCategory);
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
            return res.status(201).json({ msg: '기본 카테고리는 수정할 수 없습니다.' });
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
                console.log('update category', stringifyAllCategory);
                return res.status(201).send(stringifyAllCategory);
            }
        }
        return res.status(404).json({ msg: '카테고리 id가 잘못되었습니다.' });
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
            return res.status(201).json({ msg: '기본 카테고리는 삭제할 수 없습니다.' });
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
                // update category response
                console.log('delete category', stringifyAllCategory);
                return res.status(201).send(stringifyAllCategory);
            }
        }
        return res.status(404).json({ msg: '카테고리 id가 잘못되었습니다.' });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

module.exports = router;