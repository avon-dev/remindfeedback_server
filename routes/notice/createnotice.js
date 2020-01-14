
const { Notice, User } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

function finduser(uid) {
    const user = User.findOne({where: {user_uid: uid}});
    return user.nickname;
}

//상대방이 친구 요청함
exports.ReqFriendNotice = async(req, res, next, id) => {
    try{
        console('친구요청');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '1.1',
            data: `0.0.0`,
            text: `${finduser(uid)} 님이 친구 요청했습니다`,
            receiver_uid: id,
            read_date: null,
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};

//상대방이 친구 수락함
exports.AcptFriendNotice = async(req, res, next, id) => {
    try{
        console('친구수락');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '1.2',
            data: `0.0.0`,
            text: `${finduser(uid)} 님이 친구 수락했습니다`,
            receiver_uid: id,
            read_date: null,
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};

//상대방이 조언자를 등록함
exports.NewAdviserNotice = async(req, res, next, feedback) => {
    try{
        console('조언자등록');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '2.1',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 회원님을 조언자로 등록 했습니다`,
            receiver_uid: feedback.adviser_uid,
            read_date: null,
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};

//상대방이 조언자를 해제함
exports.ReleaseAdviserNotice = async(req, res, next, feedback) => {
    try{
        console('조언자해제');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '2.2',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 회원님을 조언자로 등록 했습니다`,
            receiver_uid: feedback.adviser_uid,
            read_date: null,
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};

//피드백에 새 게시물 생성
exports.NewBoardNotice = async(req, res, next, board) => {
    try{
        console('조언자추가');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '2.2',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 회원님을 조언자로 등록 했습니다`,
            receiver_uid: feedback.adviser_uid,
            read_date: null,
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};
