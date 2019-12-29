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
        const Op = Sequelize.Op;
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

        // SELECT 'email', 'nickname', 'portrait', 'introduction'
        const exUser = await User.findOne({
            attributes: ['user_uid', 'email', 'nickname', 'portrait', 'introduction'],
            where: {
                email: email
            }
        });

        // 프론트에 돌려줄 검색 데이터 새로 생성
        const searchData = new Object();
        searchData.email = exUser.email;
        searchData.nickname = exUser.nickname;
        searchData.portrait = exUser.portrait;
        searchData.introduction = exUser.introduction;

        // 사용자 테이블에 친구 데이터가 있는 경우
        if (exUser) {
            console.log('친구 추가할 사용자 검색에 성공했습니다.');
            // 친구 테이블에 친구요청 데이터가 있는지 검색
            // SELECT type FROM friend WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
            const exFriend = await Friend.findOne({
                attributes: ['type'],
                where: {
                    user_uid: {
                        [Op.in]: [user_uid, exUser.user_uid]
                    },
                    friend_uid: {
                        [Op.in]: [user_uid, exUser.user_uid]
                    }
                }
            });

            // 친구 테이블에 친구 요청 데이터가 있는 경우
            if (exFriend) {
                // 타입에 따라 다른 리턴값 반환
                if (exFriend.type == 1) {
                    // 상대방이 이미 친구 요청을 한 경우
                    searchData.type = exFriend.type;

                    const result = new Object();
                    result.success = true;
                    result.data = searchData;
                    result.message = '친구 요청을 한 사용자입니다.';
                    console.log(result);
                    return res.status(200).send(result);
                } else if (exFriend.type == 2) {
                    // 이미 서로 친구인 친구를 요청하는 경우
                    searchData.type = exFriend.type;

                    const result = new Object();
                    result.success = true;
                    result.data = searchData;
                    result.message = '이미 친구로 등록된 사용자입니다.';
                    console.log(result);
                    return res.status(200).send(result);
                } else if (exFriend.type == 3) {
                    // 내가 차단한 친구인 경우
                    searchData.type = exFriend.type;

                    const result = new Object();
                    result.success = true;
                    result.data = searchData;
                    result.message = '내가 차단한 사용자입니다.';
                    console.log(result);
                    return res.status(200).send(result);
                } else if (exFriend.type == 4) {
                    // 친구가 나를 차단한 경우
                    searchData.type = exFriend.type;

                    const result = new Object();
                    result.success = true;
                    result.data = searchData;
                    result.message = '나를 차단한 사용자입니다.';
                    console.log(result);
                    return res.status(200).send(result);
                } else if (exFriend.type == 5) {
                    // 서로 차단한 경우
                    searchData.type = exFriend.type;

                    const result = new Object();
                    result.success = true;
                    result.data = searchData;
                    result.message = '서로 차단한 사용자입니다.';
                    console.log(result);
                    return res.status(200).send(result);
                }
            } else {
                // 없는 경우(새로 추가)
                searchData.type = 0;

                const result = new Object();
                result.success = true;
                result.data = searchData;
                result.message = '아직 친구 요청을 하지 않은 사용자입니다.';
                console.log(result);
                return res.status(200).send(result);
            }
        } else {
            // 없는 경우
            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자를 찾을 수 없습니다. 추가할 친구의 이메일을 다시 한 번 확인해주세요.';
            console.log(result);
            return res.status(403).send(result);
        }
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend create(친구 추가)
router.post('/create', isLoggedIn, async function (req, res, next) {
    try {
        const user_uid = req.user.user_uid;
        const email = req.body.email;
        const type = req.body.type; // 타입이 다르면 에러처리

        console.log('친구 추가 요청', req.body);

        // 친구 uuid 검색
        // SELECT uuid FROM user WHERE email='email';
        await User.findOne({
            attributes: ['uuid'],
            where: {
                email: email
            }
        }).then((friend) => {
            // 친구 UUID 검색에 성공한 경우 친구 추가
            console.log('친구 검색 성공함');

            // INSERT INTO friend VALUES('user_uid', 'friend_uid', type);
            const newFriend = await Friend.create({
                user_uid: user_uid,
                friend_uid: friend.dataValues,
                type: 1,
            }).then(() => {
                // 친구 추가를 성공한 경우
                console.log('친구 추가 성공함');

                const result = new Object();
                result.success = true;
                result.data = newFriend.type;
                result.message = '성공적으로 친구를 추가하였습니다.';
                console.log(result);
                return res.status(201).send(result);
            }).catch(error => {
                // 친구 추가를 실패한 경우
                console.log('친구 추가 실패함', error);

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '친구 추가를 실패했습니다. 다시 한 번 시도해주세요.';
                console.log(result);
                return res.status(500).send(result);
            });
        }).catch(error => {
            // 친구 UUID 검색에 실패한 경우
            console.log('친구 검색 실패함', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자를 찾을 수 없습니다. 추가할 친구의 이메일을 다시 한 번 확인해주세요.';
            console.log(result);
            return res.status(404).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend select all(모든 친구 목록)
router.get('/selectall', isLoggedIn, async function (req, res, next) {
    try {
        const Op = Sequelize.Op;

        const user_uid = req.user.user_uid;
        // let query = 'SELECT * FROM user WHERE user_uid=ANY(SELECT friend FROM friend WHERE user=:user_uid UNION SELECT user FROM friend WHERE friend=:user_uid)';

        // 모든 친구 검색
        // SELECT * FROM user WHERE user_uid=ANY(SELECT friend FROM friend WHERE user=:user_uid UNION SELECT user FROM friend WHERE friend=:user_uid);
        await User.findAll({
            include: [{
                model: friend
            }],
            where : {
                user_uid: {
                    [Op.any] : [Sequelize.literal('SELECT friend FROM friend WHERE user=:user_uid UNION SELECT user FROM friend WHERE friend=:user_uid')]
                },
                replacements: {
                    user_uid: user_uid
                }
            }
        }).then((friend_uid) => {
            console.log(friend_uid);
        }).catch(error => {
            console.log(error);
        });

    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend block(친구 차단)
router.post('/block', isLoggedIn, async function (req, res, next) {
    try {
        const Op = Sequelize.Op;
        const user_uid = req.user.user_uid;
        const email = req.body.email;

        console.log('[BLOCK] 친구 차단 요청', req.body);

        // 친구 uid 검색
        // SELECT uuid FROM user WHERE email='email';
        await User.findOne({
            attributes: ['uuid'],
            where: {
                email: email
            }
        }).then((friend_uid) => {
            console.log('[BLOCK] 친구 검색 성공');

            // 친구 UUID 검색에 성공한 경우 친구 테이블에서 값 찾아옴
            // SELECT type FROM friend WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
            await Friend.findOne({
                attributes: ['user_uid', 'friend_uid', 'type'],
                where: {
                    user_uid: {
                        [Op.in]: [user_uid, friend_uid.dataValues]
                    },
                    friend_uid: {
                        [Op.in]: [user_uid, friend_uid.dataValues]
                    }
                }
            }).then((friend) => {
                // 친구 테이블에서 type 찾아오는 걸 성공한 경우
                console.log('[BLOCK] 친구 관계 찾기 성공');

                // 친구 관계에 따라 수정 내용 변경
                if (friend[2].dataValues == 5) {
                    // 이미 서로 차단한 상태인 경우
                    console.log('[BLOCK] 이미 서로 차단한 상태');

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '이미 서로 차단한 상태입니다.';
                    console.log(result);
                    return res.status(404).send(result);
                } else {
                    /* 
                    1 -> LEFT 혹은 RIGHT가 친구 요청을 한 경우
                    2 -> LEFT와 RIGHT가 서로 친구인 경우
                    3 -> LEFT가 RIGHT를 차단한 경우
                    4 -> RIGHT가 LEFT를 차단한 경우
                    */
                    const updateInfo = new Object();
                    if (friend[0].dataValues == user_uuid) {
                        updateInfo.position = 'LEFT';
                    } else if (friend[1].dataValues == user_uuid) {
                        updateInfo.position = 'RIGHT';
                    }

                    if (friend[2].dataValues == 1 | friend[2].dataValues == 2) {
                        // 친구 요청 혹은 친구 상태인 경우
                        if (updateInfo.position == 'LEFT') {
                            updateInfo.type = 3;
                        } else {
                            updateInfo.type = 4;
                        }
                    } else if (friend[2].dataValues == 3) {
                        // LEFT가 RIGHT를 차단한 경우

                        if (updateInfo.position == 'LEFT') {
                            // 이미 차단한 상태이므로 에러 처리
                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '이미 차단한 사용자입니다.';
                            console.log(result);
                            return res.status(400).send(result);
                        } else {
                            updateInfo.type = 5;
                        }
                    } else if (friend[2].dataValues == 4) {
                        // RIGHT가 LEFT를 차단한 경우

                        if (updateInfo.position == 'LEFT') {
                            updateInfo.type = 5;
                        } else {
                            // 이미 차단한 상태이므로 에러 처리
                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '이미 차단한 사용자입니다.';
                            console.log(result);
                            return res.status(400).send(result);
                        }
                    }
                    // UPDATE FROM friend WHERE type=type;
                    await Friend.update({
                        user_uid: user_uid,
                        friend_uid: friend.dataValues,
                        type: updateInfo.type,
                    }).then((block) => {
                        // 친구 차단을 성공한 경우
                        console.log('[BLOCK] 친구 차단 성공');

                        const result = new Object();
                        result.success = true;
                        result.data = block.dataValues;
                        result.message = '성공적으로 친구를 차단하였습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 친구 차단을 실패한 경우
                        console.log('친구 차단 실패함', error);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '친구 차단을 실패했습니다. 다시 한 번 시도해주세요.';
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
                result.message = '친구 정보를 가져오는 걸 실패했습니다. 다시 한 번 시도해주세요.';
                console.log(result);
                return res.status(500).send(result);
            });
        }).catch(error => {
            // 친구 UUID 검색에 실패한 경우
            console.log('[BLOCK] 친구 검색 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자를 찾을 수 없습니다. 이메일을 다시 한 번 확인해주세요.';
            console.log(result);
            return res.status(404).send(result);
        });
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

// friend unblock(친구 차단 해제)
router.post('/unblock', isLoggedIn, async function (req, res, next) {
    try {
        const Op = Sequelize.OP;
        const user_uid = req.user.user_uid;
        const email = req.body.email;

        console.log('[UNBLOCK] 친구 차단 해제 요청', req.body);

        // 친구 uid 검색
        // SELECT uuid FROM user WHERE email='email';
        await friend_uid.findOne({
            attributes: ['uuid'],
            where: {
                email: email
            }
        }).then((friend_uid) => {
            console.log('[UNBLOCK] 친구 검색 성공');

            // 친구 UUID 검색에 성공한 경우 친구 테이블에서 값 찾아옴
            // SELECT type FROM friend WHERE user_uid IN(user_uid, friend_uid) AND friend_uid IN(user_uid, friend_uid);
            await Friend.findOne({
                attributes: ['user_uid', 'friend_uid', 'type'],
                where: {
                    user_uid: {
                        [Op.in]: [user_uid, friend_uid.dataValues]
                    },
                    friend_uid: {
                        [Op.in]: [user_uid, friend_uid.dataValues]
                    }
                }
            }).then((friend) => {
                // 친구 테이블에서 type 찾아오는 걸 성공한 경우
                console.log('[UNBLOCK] 친구 관계 찾기 성공');

                // 친구 관계에 따라 수정 내용 변경
                if (friend[2].dataValues == 1 | friend[2].dataValues == 2) {
                    // 아직 차단하지 않은 상태인 경우
                    console.log('[UNBLOCK] 아직 차단하지 않은 상태');

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '아직 차단하지 않은 친구입니다.';
                    console.log(result);
                    return res.status(404).send(result);
                } else {
                    /* 
                    3 -> LEFT가 RIGHT를 차단한 경우
                    4 -> RIGHT가 LEFT를 차단한 경우
                    5 -> LEFT와 RIGHT가 서로 차단한 경우
                    */
                    const updateInfo = new Object();
                    if (friend[0].dataValues == user_uuid) {
                        updateInfo.position = 'LEFT';
                    } else if (friend[1].dataValues == user_uuid) {
                        updateInfo.position = 'RIGHT';
                    }

                    if (friend[2].dataValues == 3) {
                        // LEFT가 RIGHT를 차단한 경우

                        if (updateInfo.position == 'LEFT') {
                            updateInfo.type = 2;
                        } else {
                            // 나는 차단한 적이 없으므로 차단 해제 에러 처리
                            console.log('[UNBLOCK] 아직 차단하지 않은 상태');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '아직 차단하지 않은 친구입니다.';
                            console.log(result);
                            return res.status(404).send(result);
                        }
                    } else if (friend[2].dataValues == 4) {
                        // RIGHT가 LEFT를 차단한 경우

                        if (updateInfo.position == 'LEFT') {
                            // 나는 차단한 적이 없으므로 차단 해제 에러 처리
                            console.log('[UNBLOCK] 아직 차단하지 않은 상태');

                            const result = new Object();
                            result.success = false;
                            result.data = 'NONE';
                            result.message = '아직 차단하지 않은 친구입니다.';
                            console.log(result);
                            return res.status(404).send(result);
                        } else {
                            updateInfo.type = 2;
                        }
                    } else if (friend[2].dataValues == 5) {
                        // LEFT와 RIGHT가 서로 차단한 경우

                        if (updateInfo.position == 'LEFT') {
                            // LEFT가 차단을 해제해도 RIGHT의 차단이 남아있음
                            updateInfo.type = 4;
                        } else {
                            // RIGHT가 차단을 해제해도 LEFT의 차단이 남아있음
                            updateInfo.type = 3;
                        }
                    }
                    // UPDATE FROM friend WHERE type=type;
                    await Friend.update({
                        user_uid: user_uid,
                        friend_uid: friend.dataValues,
                        type: updateInfo.type,
                    }).then((block) => {
                        // 친구 차단 해제를 성공한 경우
                        console.log('[UNBLOCK] 친구 차단 해제 성공');

                        const result = new Object();
                        result.success = true;
                        result.data = block.dataValues;
                        result.message = '성공적으로 친구 차단을 해제하였습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 친구 차단을 실패한 경우
                        console.log('친구 차단 실패함', error);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '친구 차단 해제를 실패했습니다. 다시 한 번 시도해주세요.';
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
                result.message = '친구 정보를 가져오는 걸 실패했습니다. 다시 한 번 시도해주세요.';
                console.log(result);
                return res.status(500).send(result);
            });
        }).catch(error => {
            // 친구 UUID 검색에 실패한 경우
            console.log('[UNBLOCK] 친구 검색 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '사용자를 찾을 수 없습니다. 이메일을 다시 한 번 확인해주세요.';
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
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
module.exports = router;