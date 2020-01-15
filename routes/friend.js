const express = require('express');
const { User, Friend } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
// const sequelize = new Sequelize(config.url, config);

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

/* Friend CRUD API
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
// Search(친구 검색)
router.post ('/search', isLoggedIn, async function (req, res, next) {
    try {
        console.log('[SEARCH] 친구 검색 요청');

        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const email = req.body.email;

        // 본인 이메일 검색 시 에러 출력
        if (email == user_email) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[SEARCH] 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(200).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT user_uid, email, nickname, portrait, introduction FROM users WHERE email=:email;
        await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                email: email
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[SEARCH] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[SEARCH] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[SEARCH] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(404).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[SEARCH] 사용자 검색 성공');

                // 프론트에 돌려줄 검색 데이터 객체 새로 생성
                const searchData = new Object();
                searchData.user_uid = user.user_uid;
                searchData.email = user.email;
                searchData.nickname = user.nickname;
                searchData.portrait = user.portrait;
                searchData.introduction = user.introduction;

                // 친구 테이블에 친구 데이터가 있는지 검색
                // SELECT * FROM friends WHERE user_uid IN(:user_uid, :friend_uid) AND friend_uid IN(:user_uid, :friend_uid);
                Friend.findOne({
                    where: {
                        user_uid: {
                            [Op.in]: [user_uid, user.user_uid]
                        },
                        friend_uid: {
                            [Op.in]: [user_uid, user.user_uid]
                        }
                    }
                }).then((friend) => {
                    // 친구 테이블 조회를 성공한 경우
                    console.log('[SEARCH] 친구 테이블 조회 성공');

                    if (friend == null) {
                        // 검색 후 결과 값이 NULL인 경우(친구 테이블에 친구 데이터가 없는 경우) 
                        console.log('[SEARCH] 친구 검색 실패');

                        searchData.type = -1;

                        const result = new Object();
                        result.success = true;
                        result.data = searchData;
                        result.message = '[SEARCH] 아직 친구 요청을 하지 않은 사용자입니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    } else {
                        // 검색 후 결과 값이 NOT NULL인 경우(친구 테이블에 친구 데이터가 있는 경우)
                        console.log('[SEARCH] 친구 검색 성공');

                        // 타입에 따라 다른 리턴값 반환
                        if (friend.type == 0 | friend.type == 1) {
                            // 내가 친구 요청을 한 경우
                            searchData.type = friend.type;

                            const result = new Object();
                            result.success = true;
                            result.data = searchData;
                            if (friend.user_uid == user_uid) {
                                result.message = '[SEARCH] 내가 친구 요청을 한 사용자입니다.';
                            } else {
                                result.message = '[SEARCH] 내가 친구 요청을 받은 사용자입니다.';
                            }
                            console.log(result);
                            return res.status(200).send(result);
                        } else if (friend.type == 2) {
                            // 이미 서로 친구인 친구를 요청하는 경우
                            searchData.type = friend.type;

                            const result = new Object();
                            result.success = true;
                            result.data = searchData;
                            result.message = '[SEARCH] 이미 친구로 등록된 사용자입니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        } else if (friend.type == 3) {
                            // 내가 차단한 친구인 경우
                            // 내가 왼쪽인지 오른쪽인지 판단해서 값 리턴해야 함
                            searchData.type = friend.type;

                            const result = new Object();
                            result.success = true;
                            result.data = searchData;
                            if (friend.user_uid == user_uid) {
                                result.message = '[SEARCH] 내가 차단한 사용자입니다.';
                            } else {
                                result.message = '[SEARCH] 나를 차단한 사용자입니다.';
                            }
                            console.log(result);
                            return res.status(200).send(result);
                        } else if (friend.type == 4) {
                            // 친구가 나를 차단한 경우
                            searchData.type = friend.type;

                            const result = new Object();
                            result.success = true;
                            result.data = searchData;
                            if (friend.user_uid == user_uid) {
                                result.message = '[SEARCH] 나를 차단한 사용자입니다.';
                            } else {
                                result.message = '[SEARCH] 내가 차단한 사용자입니다.';
                            }
                            console.log(result);
                            return res.status(200).send(result);
                        } else if (friend.type == 5) {
                            // 서로 차단한 경우
                            searchData.type = friend.type;

                            const result = new Object();
                            result.success = true;
                            result.data = searchData;
                            result.message = '[SEARCH] 서로 차단한 상태입니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        }
                    }
                }).catch(error => {
                    // 친구 테이블 조회를 실패한 경우
                    console.log('[SEARCH] 친구 테이블 조회 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[SEARCH] 친구 조회 과정에서 에러가 발생하였습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[SEARCH] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[SEARCH] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Create(친구 추가)
router.post('/create', isLoggedIn, async function (req, res, next) {
    try {
        console.log('[CREATE] 친구 추가 요청');

        const user_uid = req.user.user_uid;
        const friend_uid = req.body.user_uid;
        const user_nickname = req.user.nickname;

        // 본인을 친구 추가 시 에러 출력
        if (friend_uid == user_uid) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[CREATE] 나 자신을 추가할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(200).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT user_uid, email, nickname, portrait, introduction FROM users WHERE user_uid=:user_uid;
        await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                user_uid: friend_uid
            }
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

                // 프론트에 돌려줄 검색 데이터 객체 새로 생성
                const searchData = new Object();
                searchData.user_uid = user.user_uid;
                searchData.email = user.email;
                searchData.nickname = user.nickname;
                searchData.portrait = user.portrait;
                searchData.introduction = user.introduction;

                // 친구 테이블에 친구 데이터가 있는지 검색
                // SELECT * FROM friends WHERE user_uid IN(:user_uid, :friend_uid) AND friend_uid IN(:user_uid, :friend_uid);
                Friend.findOne({
                    where: {
                        user_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        },
                        friend_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        }
                    }
                }).then((friend) => {
                    // 친구 테이블 조회를 성공한 경우
                    console.log('[CREATE] 친구 테이블 조회 성공');

                    if (friend == null) {
                        // 검색 후 결과 값이 NULL인 경우(친구 테이블에 친구 데이터가 없는 경우) 
                        console.log('[CREATE] 친구 검색 실패');

                        // 친구 테이블에 친구 데이터 추가
                        // INSERT INTO friends VALUES(:user_uid, :friend_uid, :type);
                        Friend.create({
                            user_uid: user_uid,
                            friend_uid: friend_uid,
                            type: 1,
                        }).then((create) => {
                            // 친구 추가를 성공한 경우
                            console.log('[CREATE] 친구 추가 성공');

                            searchData.type = 1;

                            const result = new Object();
                            result.success = true;
                            result.data = searchData;
                            result.message = '[CREATE] ' + user_nickname + '이 ' + searchData.nickname + '에게 친구 요청을 보냈습니다.';
                            console.log(result);
                            return res.status(201).send(result);
                        }).catch(error => {
                            // 친구 추가를 실패한 경우
                            console.log('[CREATE] 친구 추가 실패', error);

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[CREATE] 친구 요청 과정에서 에러가 발생하였습니다.';
                            console.log(result);
                            return res.status(500).send(result);
                        });

                    } else {
                        // 검색 후 결과 값이 NOT NULL인 경우(친구 테이블에 친구 데이터가 있는 경우)
                        console.log('[CREATE] 친구 검색 성공');

                        if (friend.type == 0) {
                            // 친구 요청을 보냈으나 거절당한 경우
                            // UPDATE friends SET type=:type WHERE (user_uid=:user_uid AND friend_uid=:friend_uid) OR (user_uid=:friend_uid AND friend_uid=:user_uid); 
                            Friend.update({
                                type: 1
                            }, {
                                where: {
                                    [Op.or]: [{
                                        user_uid: user_uid,
                                        friend_uid: friend_uid
                                    }, {
                                        user_uid: friend_uid,
                                        friend_uid: user_uid
                                    }]
                                }
                            }).then(() => {
                                // 친구 추가를 성공한 경우
                                console.log('[CREATE] 친구 추가 성공');

                                searchData.type = 1;

                                const result = new Object();
                                result.success = true;
                                result.data = searchData;
                                result.message = '[CREATE] ' + user_nickname + '이 ' + searchData.nickname + '에게 친구 요청을 보냈습니다.';
                                console.log(result);
                                return res.status(200).send(result);
                            }).catch(error => {
                                // 친구 추가를 실패한 경우
                                console.log('[CREATE] 친구 추가 실패', error);

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[CREATE] 친구 요청 과정에서 에러가 발생하였습니다.';
                                console.log(result);
                                return res.status(500).send(result);
                            });
                        }
                        else if (friend.type == 1) {
                            // 친구 요청을 보낸 경우
                            if (friend.user_uid == user_uid) {
                                // 내가 LEFT인 경우
                                console.log('[CREATE] 친구 추가 실패');

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[CREATE] 이미 친구 요청을 보낸 사용자입니다.';
                                console.log(result);
                                return res.status(200).send(result);
                            } else {
                                // 내가 RIGHT인 경우
                                // 이미 LEFT가 RIGHT에게 친구 요청을 보낸 경우 친구 정보 UPDATE
                                // UPDATE friends SET type=:type WHERE (user_uid=:user_uid AND friend_uid=:friend_uid) OR (user_uid=:friend_uid AND friend_uid=:user_uid); 
                                Friend.update({
                                    type: 2
                                }, {
                                    where: {
                                        [Op.or]: [{
                                            user_uid: user_uid,
                                            friend_uid: friend_uid
                                        }, {
                                            user_uid: friend_uid,
                                            friend_uid: user_uid
                                        }]
                                    }
                                }).then(() => {
                                    // 친구 추가를 성공한 경우
                                    console.log('[CREATE] 친구 추가 성공');

                                    searchData.type = 2;

                                    const result = new Object();
                                    result.success = true;
                                    result.data = searchData;
                                    result.message = '[CREATE] ' + user_nickname + '이 ' + searchData.nickname + '의 친구 요청을 수락해서 친구가 되었습니다.';
                                    console.log(result);
                                    return res.status(200).send(result);
                                }).catch(error => {
                                    // 친구 추가를 실패한 경우
                                    console.log('[CREATE] 친구 추가 실패', error);

                                    const result = new Object();
                                    result.success = false;
                                    result.data = 'NONE';
                                    result.message = '[CREATE] 친구 요청 수락 과정에서 에러가 발생하였습니다.';
                                    console.log(result);
                                    return res.status(500).send(result);
                                });
                            }
                        } else {
                            // 서로 친구 관계이거나 차단한 경우
                            console.log('[CREATE] 친구 추가 실패');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[CREATE] 서로 친구이거나 차단한 사용자입니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        }
                    }
                }).catch(error => {
                    // 친구 테이블 조회를 실패한 경우
                    console.log('[CREATE] 친구 테이블 조회 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[CREATE] 친구 조회 과정에서 에러가 발생하였습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });

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

// Reject(친구 거절)
router.put('/reject', isLoggedIn, async function (req, res, next) {
    try {
        console.log('[REJECT] 친구 거절 요청');

        const user_uid = req.user.user_uid;
        const friend_uid = req.body.user_uid;
        const user_nickname = req.user.nickname;

        // 본인을 친구 거절 시 에러 출력
        if (friend_uid == user_uid) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[REJECT] 나 자신을 거절할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(200).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT user_uid, email, nickname, portrait, introduction FROM users WHERE email=:email;
        await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                user_uid: friend_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[REJECT] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[REJECT] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[REJECT] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[REJECT] 사용자 검색 성공');

                // 프론트에 돌려줄 검색 데이터 객체 새로 생성
                const searchData = new Object();
                searchData.user_uid = user.user_uid;
                searchData.email = user.email;
                searchData.nickname = user.nickname;
                searchData.portrait = user.portrait;
                searchData.introduction = user.introduction;

                // 친구 테이블에 친구 데이터가 있는지 검색
                // SELECT * FROM friends WHERE user_uid IN(:user_uid, :friend_uid) AND friend_uid IN(:user_uid, :friend_uid);
                Friend.findOne({
                    where: {
                        user_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        },
                        friend_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        }
                    }
                }).then((friend) => {
                    // 친구 테이블 조회를 성공한 경우
                    console.log('[REJECT] 친구 테이블 조회 성공');

                    if (friend == null) {
                        // 검색 후 결과 값이 NULL인 경우(친구 테이블에 친구 데이터가 없는 경우) 
                        console.log('[REJECT] 친구 검색 실패');

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[REJECT] 친구를 찾을 수 없습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    } else {
                        // 검색 후 결과 값이 NOT NULL인 경우(친구 테이블에 친구 데이터가 있는 경우)
                        console.log('[REJECT] 친구 검색 성공');

                        if (friend.type == 1) {
                            // LEFT가 RIGHT에게 친구 요청을 보낸 경우
                            if (friend.user_uid == user_uid) {
                                // 내가 LEFT인 경우
                                //내가 보낸 요청을 거절할 수 없음
                                console.log('[REJECT] 친구 거절 실패');

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[REJECT] 내가 보낸 요청을 거절할 수 없습니다.';
                                console.log(result);
                                return res.status(200).send(result);
                            } else {
                                // 내가 RIGHT인 경우
                                // 상대방이 보낸 친구 요청을 거절
                                // UPDATE friends SET type=:type WHERE (user_uid=:user_uid AND friend_uid=:friend_uid) OR (user_uid=:friend_uid AND friend_uid=:user_uid); 
                                Friend.update({
                                    type: 0
                                }, {
                                    where: {
                                        [Op.or]: [{
                                            user_uid: user_uid,
                                            friend_uid: friend_uid
                                        }, {
                                            user_uid: friend_uid,
                                            friend_uid: user_uid
                                        }]
                                    }
                                }).then(() => {
                                    // 친구 거절을 성공한 경우
                                    console.log('[REJECT] 친구 거절 성공');

                                    searchData.type = 0;

                                    const result = new Object();
                                    result.success = true;
                                    result.data = searchData;
                                    result.message = '[REJECT] ' + user_nickname + '이 ' + searchData.nickname + '의 친구 요청을 거절했습니다.';
                                    console.log(result);
                                    return res.status(200).send(result);
                                }).catch(error => {
                                    // 친구 추가를 실패한 경우
                                    console.log('[REJECT] 친구 거절 실패', error);

                                    const result = new Object();
                                    result.success = false;
                                    result.data = 'NONE';
                                    result.message = '[REJECT] 친구 거절 과정에서 에러가 발생하였습니다.';
                                    console.log(result);
                                    return res.status(500).send(result);
                                });
                            }
                        } else {
                            // 친구 요청을 보낸 사용자가 아닌 경우
                            console.log('[REJECT] 친구 거절 실패');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[REJECT] 친구 요청을 보낸 사용자가 아닙니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        }
                    }
                }).catch(error => {
                    // 친구 테이블 조회를 실패한 경우
                    console.log('[REJECT] 친구 테이블 조회 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[REJECT] 친구 조회 과정에서 에러가 발생하였습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[REJECT] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[REJECT] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Read All Request Send(모든 보낸 친구 요청 목록)
router.get('/allrequest/send', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        let query =
            'SELECT u.user_uid, u.email, u.nickname, u.portrait, u.introduction, f.type ' +
            'FROM users AS u, (' +
            'SELECT friend_uid, type ' +
            'FROM friends ' +
            'WHERE user_uid=:user_uid AND (type=0 OR type=1) ' +
            ') AS f ' +
            'WHERE u.user_uid=f.friend_uid ' +
            'ORDER BY u.nickname ASC';
        await sequelize.query(query, {
            replacements: {
                user_uid: user_uid
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then((friendList) => {
            // 정상적으로 친구 요청 목록을 불러온 경우
            console.log('[ALL REQUEST|SEND] 친구 요청 목록 불러오기 성공');

            if (friendList[0] == null) {
                const result = new Object();
                result.success = true;
                result.data = '';
                result.message = '[ALL REQUEST|SEND] 가져올 보낸 친구 요청 목록이 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 친구 목록을 그대로 리턴
                const result = new Object();
                result.success = true;
                result.data = friendList;
                result.message = '[ALL REQUEST|SEND] 보낸 친구 요청 목록을 성공적으로 가져왔습니다.';
                console.log(result);
                return res.status(200).send(result);
            }
        }).catch(error => {
            // 친구 요청 목록 조회를 실패한 경우
            console.log('[ALL REQUEST|SEND] 보낸 친구 요청 목록 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[ALL REQUEST|SEND] 보낸 친구 요청 목록 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Read All Request Receive(모든 받은 친구 요청 목록)
router.get('/allrequest/receive', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        let query =
            'SELECT u.user_uid, u.email, u.nickname, u.portrait, u.introduction, f.type ' +
            'FROM users AS u, (' +
            'SELECT user_uid, type ' +
            'FROM friends ' +
            'WHERE friend_uid=:user_uid AND type=1' +
            ') AS f ' +
            'WHERE u.user_uid=f.user_uid ' +
            'ORDER BY u.nickname ASC';
        await sequelize.query(query, {
            replacements: {
                user_uid: user_uid
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then((friendList) => {
            // 정상적으로 친구 요청 목록을 불러온 경우
            console.log('[ALL REQUEST|RECEIVE] 친구 요청 목록 불러오기 성공');

            if (friendList[0] == null) {
                const result = new Object();
                result.success = true;
                result.data = '';
                result.message = '[ALL REQUEST|RECEIVE] 가져올 받은 친구 요청 목록이 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 친구 목록을 그대로 리턴
                const result = new Object();
                result.success = true;
                result.data = friendList;
                result.message = '[ALL REQUEST|RECEIVE] 받은 친구 요청 목록을 성공적으로 가져왔습니다.';
                console.log(result);
                return res.status(200).send(result);
            }
        }).catch(error => {
            // 친구 요청 목록 조회를 실패한 경우
            console.log('[ALL REQUEST|RECEIVE] 받은 친구 요청 목록 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[ALL REQUEST|RECEIVE] 받은 친구 요청 목록 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Read All Friend(모든 친구 목록)
router.get('/allfriend', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        let query =
            'SELECT u.user_uid, u.email, u.nickname, u.portrait, u.introduction, f.type ' +
            'FROM users AS u, ' +
            '(' +
            'SELECT friend_uid, type ' +
            'FROM friends ' +
            'WHERE user_uid=:user_uid AND (type=2 OR type=4) ' +
            'UNION ' +
            'SELECT user_uid, type ' +
            'FROM friends ' +
            'WHERE friend_uid=:user_uid AND (type=2 OR type=3)' +
            ') AS f ' +
            'WHERE u.user_uid=f.friend_uid ' +
            'ORDER BY u.nickname ASC';
        await sequelize.query(query, {
            replacements: {
                user_uid: user_uid
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then((friendList) => {
            // 정상적으로 친구 목록을 불러온 경우
            console.log('[ALL FRIEND] 친구 목록 불러오기 성공');

            if (friendList[0] == null) {
                const result = new Object();
                result.success = true;
                result.data = '';
                result.message = '[ALL FRIEND] 가져올 친구 목록이 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 친구 목록을 그대로 리턴
                const result = new Object();
                result.success = true;
                result.data = friendList;
                result.message = '[ALL FRIEND] 친구 목록을 성공적으로 가져왔습니다.';
                console.log(result);
                return res.status(200).send(result);
            }
        }).catch(error => {
            // 친구 목록 조회를 실패한 경우
            console.log('[ALL FRIEND] 친구 목록 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[ALL FRIEND] 친구 목록 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Read All Block(모든 친구 차단 목록)
router.get('/allblock', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        let query =
            'SELECT u.user_uid, u.email, u.nickname, u.portrait, u.introduction, f.type ' +
            'FROM users AS u, (' +
            'SELECT friend_uid, type ' +
            'FROM friends ' +
            'WHERE user_uid=:user_uid AND (type=3 OR type=5) ' +
            'UNION ' +
            'SELECT user_uid, type ' +
            'FROM friends ' +
            'WHERE friend_uid=:user_uid AND (type=4 OR type=5)' +
            ') AS f ' +
            'WHERE u.user_uid=f.friend_uid ' +
            'ORDER BY u.nickname ASC';
        await sequelize.query(query, {
            replacements: {
                user_uid: user_uid
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then((friendList) => {
            // 정상적으로 친구 차단 목록을 불러온 경우
            console.log('[ALL BLOCK] 친구 차단 목록 불러오기 성공');

            if (friendList[0] == null) {
                const result = new Object();
                result.success = true;
                result.data = '';
                result.message = '[ALL BLOCK] 가져올 친구 차단 목록이 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 친구 차단 목록을 그대로 리턴
                const result = new Object();
                result.success = true;
                result.data = friendList;
                result.message = '[ALL BLOCK] 친구 차단 목록을 성공적으로 가져왔습니다.';
                console.log(result);
                return res.status(200).send(result);
            }
        }).catch(error => {
            // 친구 차단 목록 조회를 실패한 경우
            console.log('[ALL BLOCK] 친구 목록 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[ALL BLOCK] 친구 차단 목록 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Block(친구 차단)
router.put('/block', isLoggedIn, async function (req, res, next) {
    try {
        console.log('[BLOCK] 친구 차단 요청');

        const user_uid = req.user.user_uid;
        const friend_uid = req.body.user_uid;
        const user_nickname = req.user.nickname;

        // 본인 이메일 차단 시 에러 출력
        if (user_uid == friend_uid) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[BLOCK] 스스로를 차단할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(200).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT user_uid, email, nickname, portrait, introduction FROM users WHERE email=:email;
        await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                user_uid: friend_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[BLOCK] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[BLOCK] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[BLOCK] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[BLOCK] 사용자 검색 성공');

                // 프론트에 돌려줄 검색 데이터 객체 새로 생성
                const searchData = new Object();
                searchData.user_uid = user.user_uid;
                searchData.email = user.email;
                searchData.nickname = user.nickname;
                searchData.portrait = user.portrait;
                searchData.introduction = user.introduction;

                // 친구 테이블에 친구 데이터가 있는지 검색
                // SELECT * FROM friends WHERE user_uid IN(:user_uid, :friend_uid) AND friend_uid IN(:user_uid, :friend_uid);
                Friend.findOne({
                    where: {
                        user_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        },
                        friend_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        }
                    }
                }).then((friend) => {
                    // 친구 테이블 조회를 성공한 경우
                    console.log('[BLOCK] 친구 테이블 조회 성공');

                    if (friend == null) {
                        // 검색 후 결과 값이 NULL인 경우(친구 테이블에 친구 데이터가 없는 경우) 
                        console.log('[BLOCK] 친구 검색 실패');

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[BLOCK] 친구를 찾을 수 없습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    } else {
                        // 검색 후 결과 값이 NOT NULL인 경우(친구 테이블에 친구 데이터가 있는 경우)
                        console.log('[BLOCK] 친구 검색 성공');

                        // 친구 관계에 따라 수정 내용 변경
                        if (friend.type == 5) {
                            // 이미 서로 차단한 상태인 경우
                            console.log('[BLOCK] 이미 서로 차단한 상태');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[BLOCK] 이미 차단한 사용자입니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        } else {
                            /* 
                            1 -> LEFT 혹은 RIGHT가 친구 요청을 한 경우
                            2 -> LEFT와 RIGHT가 서로 친구인 경우
                            3 -> LEFT가 RIGHT를 차단한 경우
                            4 -> RIGHT가 LEFT를 차단한 경우
                            */
                            const updateInfo = new Object();
                            if (friend.user_uid == user_uid) {
                                updateInfo.position = 'LEFT';
                            } else {
                                updateInfo.position = 'RIGHT';
                            }

                            if (friend.type == 0 | friend.type == 1) {
                                // 한 쪽에서 친구 요청을 한 상태인 경우
                                console.log('[BLOCK] 친구 요청 상태');

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[BLOCK] 친구가 아니므로 차단할 수 없습니다.';
                                console.log(result);
                                return res.status(200).send(result);
                            } else if (friend.type == 2) {
                                // 친구 상태인 경우
                                if (updateInfo.position == 'LEFT') {
                                    updateInfo.type = 3;
                                } else {
                                    updateInfo.type = 4;
                                }
                            } else if (friend.type == 3) {
                                // LEFT가 RIGHT를 차단한 경우

                                if (updateInfo.position == 'LEFT') {
                                    // 이미 차단한 상태이므로 에러 처리
                                    const result = new Object();
                                    result.success = false;
                                    result.data = 'NONE';
                                    result.message = '[BLOCK] 이미 차단한 사용자입니다.';
                                    console.log(result);
                                    return res.status(200).send(result);
                                } else {
                                    updateInfo.type = 5;
                                }
                            } else if (friend.type == 4) {
                                // RIGHT가 LEFT를 차단한 경우

                                if (updateInfo.position == 'LEFT') {
                                    updateInfo.type = 5;
                                } else {
                                    // 이미 차단한 상태이므로 에러 처리
                                    const result = new Object();
                                    result.success = false;
                                    result.data = 'NONE';
                                    result.message = '[BLOCK] 이미 차단한 사용자입니다.';
                                    console.log(result);
                                    return res.status(200).send(result);
                                }
                            }
                            // UPDATE friends SET type=:type WHERE (user_uid=:user_uid AND friend_uid=:friend_uid) OR (user_uid=:friend_uid AND friend_uid=:user_uid); 
                            Friend.update({
                                type: updateInfo.type
                            }, {
                                where: {
                                    [Op.or]: [{
                                        user_uid: user_uid,
                                        friend_uid: friend_uid
                                    }, {
                                        user_uid: friend_uid,
                                        friend_uid: user_uid
                                    }]
                                }
                            }).then(() => {
                                // 친구 차단을 성공한 경우
                                console.log('[BLOCK] 친구 차단 성공');

                                searchData.type = updateInfo.type;

                                const result = new Object();
                                result.success = true;
                                result.data = searchData;
                                result.message = '[BLOCK] 성공적으로 ' + user_nickname + '이 ' + searchData.nickname + '을 차단하였습니다.';
                                console.log(result);
                                return res.status(200).send(result);
                            }).catch(error => {
                                // 친구 차단을 실패한 경우
                                console.log('[BLOCK] 친구 차단 실패', error);

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[BLOCK] 친구 차단 과정에서 에러가 발생하였습니다.';
                                console.log(result);
                                return res.status(500).send(result);
                            });
                        }
                    }
                }).catch(error => {
                    // 친구 테이블 조회를 실패한 경우
                    console.log('[BLOCK] 친구 테이블 조회 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[BLOCK] 친구 조회 과정에서 에러가 발생하였습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[SEARCH] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[SEARCH] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Unblock(친구 차단 해제)
router.put('/unblock', isLoggedIn, async function (req, res, next) {
    try {
        console.log('[UNBLOCK] 친구 차단 해제 요청');

        const user_uid = req.user.user_uid;
        const friend_uid = req.body.user_uid;
        const user_nickname = req.user.nickname;

        // 본인 차단 해제 시 에러 출력
        if (user_uid == friend_uid) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[UNBLOCK] 스스로를 차단 해제할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(200).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT user_uid, email, nickname, portrait, introduction FROM users WHERE email=:email;
        await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                user_uid: friend_uid
            }
        }).then((user) => {
            // 사용자 테이블 조회를 성공한 경우
            console.log('[UNBLOCK] 사용자 테이블 조회 성공');

            if (user == null) {
                // 사용자 테이블에서 사용자 검색에 실패한 경우
                console.log('[UNBLOCK] 사용자 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[UNBLOCK] 사용자를 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 사용자 테이블에서 사용자 검색에 성공한 경우
                console.log('[UNBLOCK] 사용자 검색 성공');

                // 프론트에 돌려줄 검색 데이터 객체 새로 생성
                const searchData = new Object();
                searchData.user_uid = user.user_uid;
                searchData.email = user.email;
                searchData.nickname = user.nickname;
                searchData.portrait = user.portrait;
                searchData.introduction = user.introduction;

                // 친구 테이블에 친구 데이터가 있는지 검색
                // SELECT * FROM friends WHERE user_uid IN(:user_uid, :friend_uid) AND friend_uid IN(:user_uid, :friend_uid);
                Friend.findOne({
                    where: {
                        user_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        },
                        friend_uid: {
                            [Op.in]: [user_uid, friend_uid]
                        }
                    }
                }).then((friend) => {
                    // 친구 테이블 조회를 성공한 경우
                    console.log('[UNBLOCK] 친구 테이블 조회 성공');

                    if (friend == null) {
                        // 검색 후 결과 값이 NULL인 경우(친구 테이블에 친구 데이터가 없는 경우) 
                        console.log('[UNBLOCK] 친구 검색 실패');

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[UNBLOCK] 친구를 찾을 수 없습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    } else {
                        // 검색 후 결과 값이 NOT NULL인 경우(친구 테이블에 친구 데이터가 있는 경우)
                        console.log('[UNBLOCK] 친구 검색 성공');

                        // 친구 관계에 따라 수정 내용 변경
                        if (friend.type == 0 | friend.type == 1) {
                            // 친구 요청 상태인 경우
                            console.log('[UNBLOCK] 친구 요청 상태');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[UNBLOCK] 친구가 아니므로 차단 해제할 수 없습니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        } else if (friend.type == 2) {
                            // 친구 상태인 경우
                            console.log('[UNBLOCK] 친구 상태');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[UNBLOCK] 아직 차단하지 않은 친구입니다.';
                            console.log(result);
                            return res.status(200).send(result);
                        } else {
                            /* 
                            3 -> LEFT가 RIGHT를 차단한 경우
                            4 -> RIGHT가 LEFT를 차단한 경우
                            5 -> LEFT와 RIGHT가 서로 차단한 경우
                            */
                            const updateInfo = new Object();
                            if (friend.user_uid == user_uid) {
                                updateInfo.position = 'LEFT';
                            } else {
                                updateInfo.position = 'RIGHT';
                            }

                            if (friend.type == 3) {
                                // LEFT가 RIGHT를 차단한 경우
                                if (updateInfo.position == 'LEFT') {
                                    updateInfo.type = 2;
                                } else {
                                    // 나는 차단한 적이 없으므로 차단 해제 에러 처리
                                    console.log('[UNBLOCK] 아직 차단하지 않은 상태');

                                    const result = new Object();
                                    result.success = false;
                                    result.data = 'NONE';
                                    result.message = '[UNBLOCK] 아직 차단하지 않은 친구입니다.';
                                    console.log(result);
                                    return res.status(200).send(result);
                                }
                            } else if (friend.type == 4) {
                                // RIGHT가 LEFT를 차단한 경우
                                if (updateInfo.position == 'LEFT') {
                                    // 나는 차단한 적이 없으므로 차단 해제 에러 처리
                                    console.log('[UNBLOCK] 아직 차단하지 않은 상태');

                                    const result = new Object();
                                    result.success = false;
                                    result.data = 'NONE';
                                    result.message = '[UNBLOCK] 아직 차단하지 않은 친구입니다.';
                                    console.log(result);
                                    return res.status(200).send(result);
                                } else {
                                    updateInfo.type = 2;
                                }
                            } else if (friend.type == 5) {
                                // LEFT와 RIGHT가 서로 차단한 경우
                                if (updateInfo.position == 'LEFT') {
                                    // LEFT가 차단을 해제해도 RIGHT의 차단이 남아있음
                                    updateInfo.type = 4;
                                } else {
                                    // RIGHT가 차단을 해제해도 LEFT의 차단이 남아있음
                                    updateInfo.type = 3;
                                }
                            }
                            // UPDATE friends SET type=:type WHERE (user_uid=:user_uid AND friend_uid=:friend_uid) OR (user_uid=:friend_uid AND friend_uid=:user_uid); 
                            Friend.update({
                                type: updateInfo.type
                            }, {
                                where: {
                                    [Op.or]: [{
                                        user_uid: user_uid,
                                        friend_uid: friend_uid
                                    }, {
                                        user_uid: friend_uid,
                                        friend_uid: user_uid
                                    }]
                                }
                            }).then(() => {
                                // 친구 차단 해제를 성공한 경우
                                console.log('[UNBLOCK] 친구 차단 해제 성공');

                                searchData.type = updateInfo.type;

                                const result = new Object();
                                result.success = true;
                                result.data = searchData;
                                result.message = '[UNBLOCK] 성공적으로 ' + user_nickname + '이 ' + searchData.nickname + '의 차단을 해제하였습니다.';
                                console.log(result);
                                return res.status(200).send(result);
                            }).catch(error => {
                                // 친구 차단 해제를 실패한 경우
                                console.log('[UNBLOCK] 친구 차단 해제 실패', error);

                                const result = new Object();
                                result.success = false;
                                result.data = 'NONE';
                                result.message = '[UNBLOCK] 친구 차단 해제 과정에서 에러가 발생했습니다.';
                                console.log(result);
                                return res.status(500).send(result);
                            });
                        }
                    }
                }).catch(error => {
                    // 친구 테이블 조회를 실패한 경우
                    console.log('[UNBLOCK] 친구 테이블 조회 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[UNBLOCK] 친구 조회 과정에서 에러가 발생하였습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });
            }
        }).catch(error => {
            // 사용자 테이블 조회를 실패한 경우
            console.log('[UNBLOCK] 사용자 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[UNBLOCK] 사용자 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
module.exports = router;