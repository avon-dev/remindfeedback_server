const winston = require('../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const { Feedback, User } = require('../models');
const router = express.Router();


// Category CRUD API

// 카테고리 생성
router.post('/', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const { category_title, category_color } = req.body;

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 카테고리 생성 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] category_title : ${category_title}, category_color : ${category_color}`);

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: { user_uid: user_uid }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '사용자를 찾을 수 없습니다.';
                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                const parseAllCategory = JSON.parse(user.category);
                let i = 1;

                // 카테고리 개수 검사(10개 제한, 0 ~ 9)
                if (parseAllCategory.length >= 10) {
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '카테고리 제한 개수를 초과했습니다.';
                    winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }

                // 기본 카테고리 명 검사
                if (category_title == parseAllCategory[0].category_title) {
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '기본 카테고리 이름으로 생성할 수 없습니다.';
                    winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }

                // 반복문을 돌려 카테고리 명이 중복되는지 검사
                for (i = 1; i < parseAllCategory.length; i++) {
                    if (category_title == parseAllCategory[i].category_title) {
                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '이미 생성된 카테고리입니다.';
                        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
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
                        const result = new Object();
                        result.success = true;
                        result.data = parseAllCategory;
                        result.message = '새로운 카테고리를 생성했습니다.';
                        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                        return res.status(200).json(result);
                    }).catch(error => {
                        // 카테고리 생성을 실패한 경우
                        winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] 카테고리 생성 실패 \n ${error.stack}`);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '카테고리 생성 과정에서 에러가 발생하였습니다.';
                        winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                        return res.status(500).send(result);
                    });
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.user.email}] 카테고리 생성 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 모든 카테고리 읽기
router.get('/', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;

        winston.log('info', `[CATEGORY]][${req.clientIp}|${user_email}] 모든 카테고리 Request`);

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '사용자를 찾을 수 없습니다.';
                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                const parseAllCategory = JSON.parse(user.category);
                // all category response
                const result = new Object();
                result.success = true;
                result.data = parseAllCategory;
                result.message = '카테고리 목록을 성공적으로 가져왔습니다.';
                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).json(result);
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.user.email}] 모든 카테고리 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 특정 카테고리 읽기
router.get('/:category_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const category_id = req.params.category_id;

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 특정 카테고리 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] category_id : ${category_id}`);

        // 사용자 테이블에서 user_uid로 카테고리 검색
        // SELECT category FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['category'],
            where: {
                user_uid: user_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '사용자를 찾을 수 없습니다.';
                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                const parseAllCategory = JSON.parse(user.category);
                let i = 0;
                // 반복문을 돌려 카테고리 id로 찾기
                for (i = 0; i < parseAllCategory.length; i++) {
                    if (category_id == parseAllCategory[i].category_id) {
                        // one category response
                        const result = new Object();
                        result.success = true;
                        result.data = parseAllCategory[i];
                        result.message = '선택한 카테고리를 가져왔습니다.';
                        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                        return res.status(200).json(result);
                    }
                }
                if (i == parseAllCategory.length) {
                    // 반복문을 돌려 카테고리의 ID를 찾지 못한 경우 에러 출력
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '선택한 카테고리를 찾을 수 없습니다.';
                    winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.user.email}] 특정 카테고리 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 카테고리 수정
router.put('/:category_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const category_id = req.params.category_id;
        const { category_title, category_color } = req.body;

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] Update(카테고리 수정) Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] category_id : ${category_id}, category_title : ${category_title}, category_color : ${category_color}`);

        // 카테고리 번호 검사(기본값 수정 불가)
        if (category_id == 0) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '기본 카테고리는 수정할 수 없습니다.';
            winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
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
            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '사용자를 찾을 수 없습니다.';
                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
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
                            const result = new Object();
                            result.success = true;
                            result.data = parseAllCategory[i];
                            result.message = '선택한 카테고리를 수정했습니다.';
                            winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                            return res.status(200).json(result);
                        }).catch(error => {
                            // 카테고리 수정을 실패한 경우
                            console.log(`[CATEGORY][${req.clientIp}|${user_email}] 카테고리 수정 실패 \n ${error.stack}`);

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '카테고리 수정 과정에서 에러가 발생하였습니다.';
                            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
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
                    result.message = '선택한 카테고리를 찾을 수 없습니다.';
                    winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log(`[CATEGORY][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.user.email}] 카테고리 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

// 카테고리 삭제
router.delete('/:category_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const category_id = req.params.category_id;

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] Delete(카테고리 삭제) Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] category_id : ${category_id}`);

        // 카테고리 번호 검사(기본값 삭제 불가)
        if (category_id == 0) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '기본 카테고리는 삭제할 수 없습니다.';
            winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
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
            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '사용자를 찾을 수 없습니다.';
                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
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
                                const result = new Object();
                                result.success = true;
                                result.data = category_id;
                                result.message = '선택한 카테고리를 삭제했습니다.';
                                winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                                return res.status(200).json(result);
                            }).catch(error => {
                                // 선택한 카테고리 삭제를 실패한 경우
                                console.log(`[CATEGORY][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '카테고리 삭제 과정에서 에러가 발생하였습니다.';
                                winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                                return res.status(500).send(result);
                            });
                        }).catch(error => {
                            // 피드백 테이블 수정을 실패한 경우
                            console.log(`[CATEGORY][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '피드백 수정 과정에서 에러가 발생하였습니다.';
                            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
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
                    result.message = '선택한 카테고리를 찾을 수 없습니다.';
                    winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log(`[CATEGORY][${req.clientIp}|${user_email}] 사용자 테이블 조회 실패 \n ${error.stack}`);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[CATEGORY][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.user.email}] 카테고리 삭제 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[CATEGORY][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;