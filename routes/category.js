const express = require('express');
const { Feedback, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

/* 
Category CRUD API
 */
// category create
router.post('/create', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[CREATE] 카테고리 생성 요청');

        const user_uid = req.user.user_uid;
        const { category_title, category_color } = req.body;

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: { user_uid: user_uid }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[CREATE] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[CREATE] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[CREATE] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[CREATE] 사용자 검색 성공');

                const parseAllCategory = JSON.parse(user.category);
                let i = 1;

                // 카테고리 개수 검사(10개 제한, 0 ~ 9)
                if (parseAllCategory.length >= 10) {
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[CREATE] 카테고리 제한 개수를 초과했습니다.';
                    console.log(result);
                    return res.status(200).json(result);
                }

                // 기본 카테고리 명 검사
                if (category_title == parseAllCategory[0].category_title) {
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[CREATE] 기본 카테고리 이름으로 생성할 수 없습니다.';
                    console.log(result);
                    return res.status(200).json(result);
                }

                // 반복문을 돌려 카테고리 명이 중복되는지 검사
                for (i = 1; i < parseAllCategory.length; i++) {
                    if (category_title == parseAllCategory[i].category_title) {
                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[CREATE] 이미 생성된 카테고리입니다.';
                        console.log(result);
                        return res.status(200).json(result);
                    }
                }

                // 카테고리 명이 중복되지 않는 경우
                if (i == parseAllCategory.length) {
                    // json object 생성 & array 추가
                    const newCategory = new Object();
                    newCategory.category_id = parseAllCategory[parseAllCategory.length - 1].category_id + 1;
                    newCategory.category_title = category_title;
                    newCategory.category_color = category_color;
                    parseAllCategory.push(newCategory);
                    const stringifyAllCategory = JSON.stringify(parseAllCategory);

                    // UPDATE users SET category=:category WHERE user_uid=:user_uid; 
                    User.update({
                        category: stringifyAllCategory,
                    }, {
                        where: { user_uid: user_uid },
                    }).then(() => {
                        // 카테고리 생성을 성공한 경우
                        console.log('[CREATE] 카테고리 생성 성공');

                        const result = new Object();
                        result.success = true;
                        result.data = parseAllCategory;
                        result.message = '[CREATE] 새로운 카테고리를 생성했습니다.';
                        console.log(result);
                        return res.status(200).json(result);
                    }).catch(error => {
                        // 사용자 테이블 조회를 실패한 경우
                        console.log('[CREATE] 카테고리 생성 실패', error);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[CREATE] 카테고리 생성 과정에서 에러가 발생하였습니다.';
                        console.log(result);
                        return res.status(500).send(result);
                    });
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[CREATE] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[CREATE] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// all category select
router.get('/selectall', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[SELECTALL] 모든 카테고리 요청');

        const user_uid = req.user.user_uid;

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[SELECTALL] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[SELECTALL] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[SELECTALL] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[SELECTALL] 사용자 검색 성공');

                const parseAllCategory = JSON.parse(user.category);
                // all category response
                const result = new Object();
                result.success = true;
                result.data = parseAllCategory;
                result.message = '[SELECTALL] 카테고리 목록을 성공적으로 가져왔습니다.';
                console.log(result);
                return res.status(200).json(result);
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[SELECTALL] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[SELECTALL] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// one category select
router.get('/selectone/:category_id', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[SELECTONE] 특정 카테고리 요청');

        const user_uid = req.user.user_uid;
        const category_id = req.params.category_id;

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[SELECTONE] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[SELECTONE] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[SELECTONE] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[SELECTONE] 사용자 검색 성공');

                const parseAllCategory = JSON.parse(user.category);
                let i = 0;
                // 반복문을 돌려 카테고리 id로 찾기
                for (i = 0; i < parseAllCategory.length; i++) {
                    if (category_id == parseAllCategory[i].category_id) {
                        // one category response
                        const result = new Object();
                        result.success = true;
                        result.data = parseAllCategory[i];
                        result.message = '[SELECTONE] 선택한 카테고리를 가져왔습니다.';
                        console.log(result);
                        return res.status(200).json(result);
                    }
                }
                if (i == parseAllCategory.length) {
                    // 반복문을 돌려 카테고리의 ID를 찾지 못한 경우 에러 출력
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[SELECTONE] 선택한 카테고리를 찾을 수 없습니다.';
                    console.log(result);
                    return res.status(200).json(result);
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[SELECTONE] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[SELECTONE] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// one category update
router.put('/update/:category_id', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[UPDATE] 특정 카테고리 수정 요청');

        const user_uid = req.user.user_uid;
        const category_id = req.params.category_id;
        const { category_title, category_color } = req.body;

        // 카테고리 번호 검사(기본값 수정 불가)
        if (category_id == 0) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[UPDATE] 기본 카테고리는 수정할 수 없습니다.';
            console.log(result);
            return res.status(200).send(result);
        }

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[UPDATE] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[UPDATE] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[UPDATE] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[UPDATE] 사용자 검색 성공');

                const parseAllCategory = JSON.parse(user.category);
                let i = 1;
                // 반복문을 돌려 카테고리 id로 찾기
                for (i = 1; i < parseAllCategory.length; i++) {
                    if (category_id == parseAllCategory[i].category_id) {
                        parseAllCategory[i].category_title = category_title;
                        parseAllCategory[i].category_color = category_color;
                        const stringifyAllCategory = JSON.stringify(parseAllCategory);

                        // UPDATE users SET category=:category WHERE user_uid=:user_uid; 
                        User.update({
                            category: stringifyAllCategory,
                        }, {
                            where: { user_uid: user_uid },
                        }).then(() => {
                            // 카테고리 수정에 성공한 경우
                            console.log('[UPDATE] 카테고리 수정 성공');
                            // update category response
                            const result = new Object();
                            result.success = true;
                            result.data = parseAllCategory[i];
                            result.message = '[UPDATE] 선택한 카테고리를 수정했습니다.';
                            console.log(result);
                            return res.status(200).json(result);
                        }).catch(error => {
                            // 카테고리 수정을 실패한 경우
                            console.log('[UPDATE] 카테고리 수정 실패', error);

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[UPDATE] 카테고리 수정 과정에서 에러가 발생하였습니다.';
                            console.log(result);
                            return res.status(500).send(result);
                        });

                        break;
                    }
                }
                if (i == parseAllCategory.length) {
                    // 반복문을 돌려 카테고리의 ID를 찾지 못한 경우 에러 출력
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[UPDATE] 선택한 카테고리를 찾을 수 없습니다.';
                    console.log(result);
                    return res.status(200).json(result);
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[UPDATE] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[UPDATE] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// one category delete
router.delete('/delete/:category_id', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[DELETE] 특정 카테고리 삭제 요청');

        const user_uid = req.user.user_uid;
        const category_id = req.params.category_id;

        // 카테고리 번호 검사(기본값 삭제 불가)
        if (category_id == 0) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[DELETE] 기본 카테고리는 삭제할 수 없습니다.';
            console.log(result);
            return res.status(200).send(result);
        }
        // SELECT category FROM User WHERE user_uid = 'user_uid';
        await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[DELETE] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[DELETE] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[DELETE] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[DELETE] 사용자 검색 성공');

                const parseAllCategory = JSON.parse(user.category);
                let i = 1;
                // 반복문을 돌려 카테고리 id로 찾기
                for (i = 1; i < parseAllCategory.length; i++) {
                    if (category_id == parseAllCategory[i].category_id) {
                        // 카테고리 id가 일치하는 경우
                        // UPDATE feedbacks SET category=0 WHERE user_uid=:user_uid AND category=:category_id; 
                        Feedback.update({
                            category: 0,
                        }, {
                            where: {
                                user_uid: user_uid,
                                category: category_id
                            },
                        }).then(() => {
                            // 피드백 테이블 수정을 성공한 경우
                            console.log('[DELETE] 피드백 테이블 수정 성공');

                            // 선택한 카테고리 삭제 후 json array 변경
                            parseAllCategory.splice(i, 1);
                            const stringifyAllCategory = JSON.stringify(parseAllCategory);

                            // UPDATE users SET category=:category WHERE user_uid=:user_uid;
                            User.update({
                                category: stringifyAllCategory,
                            }, {
                                where: {
                                    user_uid: user_uid
                                },
                            }).then(() => {
                                // 선택한 카테고리 삭제를 성공한 경우
                                console.log('[DELETE] 카테고리 삭제 수정 성공');

                                const result = new Object();
                                result.success = true;
                                result.data = category_id;
                                result.message = '[DELETE] 선택한 카테고리를 삭제했습니다.';
                                console.log(result);
                                return res.status(200).json(result);
                            }).catch(error => {
                                // 선택한 카테고리 삭제를 실패한 경우
                                console.log('[DELETE] 카테고리 삭제 실패', error);

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[DELETE] 카테고리 삭제 과정에서 에러가 발생하였습니다.';
                                console.log(result);
                                return res.status(500).send(result);
                            });
                        }).catch(error => {
                            // 피드백 테이블 수정을 실패한 경우
                            console.log('[DELETE] 피드백 테이블 수정 실패', error);

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[DELETE] 피드백 수정 과정에서 에러가 발생하였습니다.';
                            console.log(result);
                            return res.status(500).send(result);
                        });
                        break;
                    }
                }
                if (i == parseAllCategory.length) {
                    // 반복문을 돌려 카테고리의 ID를 찾지 못한 경우 에러 출력
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[DELETE] 선택한 카테고리를 찾을 수 없습니다.';
                    console.log(result);
                    return res.status(200).json(result);
                }
            }
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
        console.error(e);
        return next(e);
    }
});

module.exports = router;