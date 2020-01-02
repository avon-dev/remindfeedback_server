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
// Search Friend (친구 검색)
router.get('/search', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const email = req.body.email;

        // 본인 이메일 검색 시 에러 출력
        if (email == user_email) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '[SEARCH] 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(403).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT 'email', 'nickname', 'portrait', 'introduction'
        await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                email: email
            }
        }).then((user) => {
            // 사용자 테이블에서 사용자 검색을 성공한 경우
            console.log('[SEARCH] 사용자 검색 성공');

            // 프론트에 돌려줄 검색 데이터 객체 새로 생성
            const searchData = new Object();
            searchData.email = user.email;
            searchData.nickname = user.nickname;
            searchData.portrait = user.portrait;
            searchData.introduction = user.introduction;

            console.log('친구 추가할 사용자 검색에 성공했습니다.');
            console.log('나의 UUID : ' + user_uid);
            console.log('친구 UUID : ' + user.user_uid);

            // 친구 테이블에 친구요청 데이터가 있는지 검색
            // SELECT type FROM friend WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
            Friend.findOne({
                attributes: ['user_uid', 'friend_uid', 'type'],
                where: {
                    user_uid: {
                        [Op.in]: [user_uid, user.user_uid]
                    },
                    friend_uid: {
                        [Op.in]: [user_uid, user.user_uid]
                    }
                }
            }).then((friend) => {
                // 친구 테이블에 친구 요청 데이터가 있는 경우
                console.log('[SEARCH] 친구 데이터 검색 성공');

                // 타입에 따라 다른 리턴값 반환
                if (friend.type == 1) {
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
            }).catch(error => {
                // 친구 테이블에 친구 데이터가 없는 경우(새로 추가)
                console.log('[SEARCH] 친구 검색 실패', error);

                searchData.type = 0;

                const result = new Object();
                result.success = true;
                result.data = searchData;
                result.message = '[SEARCH] 아직 친구 요청을 하지 않은 사용자입니다.';
                console.log(result);
                return res.status(200).send(result);
            });
        }).catch(error => {
            // 사용자 테이블에서 친구 검색에 실패한 경우
            console.log('[SEARCH] 사용자 검색 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[SEARCH] 사용자를 찾을 수 없습니다.';
            console.log(result);
            return res.status(404).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// Create Friend(친구 추가)
router.post('/create', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const email = req.body.email;

        console.log('[CREATE] 친구 추가 요청', req.body);

        // 본인 이메일 검색 시 에러 출력
        if (email == user_email) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '[CREATE] 나 자신을 추가할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(403).send(result);
        }

        // 사용자 테이블에서 이메일로 사용자 검색
        // SELECT 'user_uid', 'nickname'
        await User.findOne({
            attributes: ['user_uid', 'nickname'],
            where: {
                email: email
            }
        }).then((user) => {
            // 친구 테이블에 친구요청 데이터가 있는지 검색
            // SELECT type FROM friend WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
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
                // 친구 테이블에 친구 요청 데이터가 있는 경우
                console.log('[CREATE] 친구 데이터 검색 성공');

                // LEFT가 RIGHT에게 친구 요청을 한 경우
                if (friend.user_uid == user_uid) {
                    // 내가 LEFT인 경우                    
                    console.log('[CREATE] 친구 추가 실패');

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[CREATE] 이미 친구 요청을 보낸 사용자입니다.';
                    console.log(result);
                    return res.status(403).send(result);
                } else {
                    // 내가 RIGHT인 경우
                    if (friend.type == 1) {
                        // 이미 LEFT가 RIGHT에게 친구 요청을 보낸 경우
                        // UPDATE friends SET type=2 WHERE user_uid IN(user_uid, friend_uid) and friend_uid IN(user_uid, friend_uid); 
                        Friend.update({
                            type: 2
                        }, {
                            where: {
                                [Op.or]: [{
                                    user_uid: user_uid,
                                    friend_uid: user.user_uid
                                }, {
                                    user_uid: user.user_uid,
                                    friend_uid: user_uid
                                }]
                            },
                            returning: true
                        }).then(() => {
                            // 친구 추가를 성공한 경우
                            console.log('[CREATE] 친구 추가 성공');

                            const result = new Object();
                            result.success = true;
                            result.data = 2;
                            result.message = '[CREATE] ' + user.nickname + '의 친구 요청을 수락해서 친구가 되었습니다.';
                            console.log(result);
                            return res.status(201).send(result);
                        }).catch(error => {
                            // 친구 추가를 실패한 경우
                            console.log('[CREATE] 친구 추가 실패', error);

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '[CREATE] 친구 요청 수락을 실패했습니다.';
                            console.log(result);
                            return res.status(500).send(result);
                        });
                    } else {
                        // 친구 관계가 아닌 경우
                        console.log('[CREATE] 친구 추가 실패');

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[CREATE] 서로 친구이거나 차단한 상태입니다.';
                        console.log(result);
                        return res.status(403).send(result);
                    }
                }
            }).catch(error => {
                // 친구 테이블에 친구 데이터가 없는 경우(새로 추가)
                console.log('[CREATE] 친구 검색 실패', error);

                // 친구 테이블에 친구 데이터 추가
                // INSERT INTO friend VALUES('user_uid', 'friend_uid', type);
                Friend.create({
                    user_uid: user_uid,
                    friend_uid: user.user_uid,
                    type: 1,
                }).then((create) => {
                    // 친구 추가를 성공한 경우
                    console.log('[CREATE] 친구 추가 성공');

                    const result = new Object();
                    result.success = true;
                    result.data = create.type;
                    result.message = '[CREATE] ' + user.nickname + '에게 친구 요청을 보냈습니다.';
                    console.log(result);
                    return res.status(201).send(result);
                }).catch(error => {
                    // 친구 추가를 실패한 경우
                    console.log('[CREATE] 친구 추가 실패', error);

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[CREATE] 친구 요청을 실패했습니다.';
                    console.log(result);
                    return res.status(500).send(result);
                });
            });
        }).catch(error => {
            // 사용자 테이블에서 친구 검색에 실패한 경우
            console.log('[CREATE] 사용자 검색 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[CREATE] 사용자를 찾을 수 없습니다.';
            console.log(result);
            return res.status(404).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// 친구 관계를 확인하고 요청한 친구인지, 차단한 친구인지 걸러낸 후 서로 친구인 관계만 리턴
// Read All Friend(모든 친구 목록)
router.get('/allfriend', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        let query =
            'SELECT email, nickname, portrait, introduction ' +
            'FROM users ' +
            'WHERE user_uid=ANY(' +
            'SELECT friend_uid ' +
            'FROM friends ' +
            'WHERE user_uid=:user_uid AND type=2 ' +
            'UNION ' +
            'SELECT user_uid ' +
            'FROM friends ' +
            'WHERE friend_uid=:user_uid AND type=2) ' +
            'ORDER BY nickname ASC';
        await sequelize.query(query, {
            replacements: {
                user_uid: user_uid
            },
            type: Sequelize.QueryTypes.SELECT,
            raw: true
        }).then((friendList) => {
            // 정상적으로 친구 목록을 불러온 경우
            console.log('[ALL FRIEND] 친구 목록 불러오기 성공');

            // 친구 목록을 그대로 리턴
            const result = new Object();
            result.success = true;
            result.data = friendList;
            result.message = '[ALL FRIEND] 친구 목록을 성공적으로 가져왔습니다.';
            console.log(result);
            return res.status(200).send(result);
        }).catch(error => {
            // 친구 목록을 불러오지 못한 경우 에러 처리
            console.log('[ALL FRIEND] 친구 목록 불러오기 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[ALL FRIEND] 친구 목록을 가져오지 못했습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend block(친구 차단)
router.put('/block', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const email = req.body.email;

        console.log('[BLOCK] 친구 차단 요청', req.body);

        // 본인 이메일 검색 시 에러 출력
        if (email == user_email) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '[BLOCK] 스스로를 차단할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(403).send(result);
        }

        // 친구 uid 검색
        // SELECT user_uid, nickname FROM user WHERE email='email';
        await User.findOne({
            attributes: ['user_uid', 'nickname'],
            where: {
                email: email
            }
        }).then((user) => {
            console.log('[BLOCK] 친구 검색 성공');

            // 친구 UID 검색에 성공한 경우 친구 테이블에서 값 찾아옴
            // SELECT * FROM friend WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
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
                // 친구 테이블에서 type 찾아오는 걸 성공한 경우
                console.log('[BLOCK] 친구 관계 찾기 성공');

                // 친구 관계에 따라 수정 내용 변경
                if (friend.type == 5) {
                    // 이미 서로 차단한 상태인 경우
                    console.log('[BLOCK] 이미 서로 차단한 상태');

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[BLOCK] 이미 차단한 사용자입니다.';
                    console.log(result);
                    return res.status(403).send(result);
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

                    if (friend.type == 1) {
                        // 한 쪽에서 친구 요청을 한 상태인 경우
                        console.log('[BLOCK] 친구 요청 상태');

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[BLOCK] 친구가 아니므로 차단할 수 없습니다.';
                        console.log(result);
                        return res.status(403).send(result);
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
                            return res.status(400).send(result);
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
                            return res.status(400).send(result);
                        }
                    }
                    // UPDATE type=type SET friends WHERE user_uid=user_uid;
                    Friend.update({
                        type: updateInfo.type
                    }, {
                        where: {
                            [Op.or]: [{
                                user_uid: user_uid,
                                friend_uid: user.user_uid
                            }, {
                                user_uid: user.user_uid,
                                friend_uid: user_uid
                            }]
                        }
                    }).then(() => {
                        // 친구 차단을 성공한 경우
                        console.log('[BLOCK] 친구 차단 성공');

                        const result = new Object();
                        result.success = true;
                        result.data = updateInfo.type;
                        result.message = '[BLOCK] 성공적으로 ' + user.nickname + '를 차단하였습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 친구 차단을 실패한 경우
                        console.log('[BLOCK] 친구 차단 실패', error);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[BLOCK] 친구 차단을 실패했습니다.';
                        console.log(result);
                        return res.status(500).send(result);
                    });
                }
            }).catch(error => {
                // 친구 테이블에서 type 찾아오는 걸 실패한 경우
                console.log('[BLOCK] 친구 관계 검색 실패', error);

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[BLOCK] 친구를 찾을 수 없습니다.';
                console.log(result);
                return res.status(404).send(result);
            });
        }).catch(error => {
            // 친구 UUID 검색에 실패한 경우
            console.log('[BLOCK] 친구 검색 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[BLOCK] 사용자를 찾을 수 없습니다.';
            console.log(result);
            return res.status(404).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend unblock(친구 차단 해제)
router.put('/unblock', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const email = req.body.email;

        console.log('[UNBLOCK] 친구 차단 해제 요청', req.body);

         // 본인 이메일 검색 시 에러 출력
         if (email == user_email) {
            const result = new Object();
            result.success = false;
            result.data = 'NONE'
            result.message = '[UNBLOCK] 스스로를 차단 해제할 수 없습니다. 나 자신은 인생의 영원한 친구입니다.';
            console.log(result);
            return res.status(403).send(result);
        }

        // 친구 uid 검색
        // SELECT user_uid, nickname FROM user WHERE email='email';
        await User.findOne({
            attributes: ['user_uid', 'nickname'],
            where: {
                email: email
            }
        }).then((user) => {
            console.log('[UNBLOCK] 친구 검색 성공');

            // 친구 UUID 검색에 성공한 경우 친구 테이블에서 값 찾아옴
            // SELECT * FROM friends WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
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
                // 친구 테이블에서 type 찾아오는 걸 성공한 경우
                console.log('[UNBLOCK] 친구 관계 찾기 성공');

                // 친구 관계에 따라 수정 내용 변경
                if (friend.type == 1 | friend.type == 2) {
                    // 아직 차단하지 않은 상태인 경우
                    console.log('[UNBLOCK] 아직 차단하지 않은 상태');

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[UNBLOCK] 아직 차단하지 않은 친구입니다.';
                    console.log(result);
                    return res.status(403).send(result);
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
                            return res.status(403).send(result);
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
                            return res.status(403).send(result);
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
                    // UPDATE type=type SET friends WHERE user_uid=user_uid;
                    Friend.update({
                        type: updateInfo.type
                    }, {
                        where: {
                            [Op.or]: [{
                                user_uid: user_uid,
                                friend_uid: user.user_uid
                            }, {
                                user_uid: user.user_uid,
                                friend_uid: user_uid
                            }]
                        }
                    }).then(() => {
                        // 친구 차단 해제를 성공한 경우
                        console.log('[UNBLOCK] 친구 차단 해제 성공');

                        const result = new Object();
                        result.success = true;
                        result.data = updateInfo.type;
                        result.message = '[UNBLOCK] 성공적으로 ' + user.nickname + '의 차단을 해제하였습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 친구 차단을 실패한 경우
                        console.log('친구 차단 실패함', error);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[UNBLOCK] 친구 차단 해제를 실패했습니다.';
                        console.log(result);
                        return res.status(500).send(result);
                    });
                }
            }).catch(error => {
                // 친구 테이블에서 type 찾아오는 걸 실패한 경우
                console.log('[UNBLOCK] 친구 관계 검색 실패', error);

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[UNBLOCK] 친구를 찾을 수 없습니다.';
                console.log(result);
                return res.status(404).send(result);
            });
        }).catch(error => {
            // 친구 UUID 검색에 실패한 경우
            console.log('[UNBLOCK] 친구 검색 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[UNBLOCK] 사용자를 찾을 수 없습니다.';
            console.log(result);
            return res.status(404).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// 탈퇴할 때 구현
// friend delete(친구 삭제)
router.delete('/delete', isLoggedIn, async function (req, res, next) {
    try {
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = '[DELETE] 아직 미구현 된 기능입니다.';
        console.log(result);
        return res.status(404).send(result);
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
module.exports = router;