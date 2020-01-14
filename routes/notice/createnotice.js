
const { Notice, User, Feedback, Board } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

function finduser(uid) {
    const user = User.findOne({where: {user_uid: uid}});
    return user.nickname;
}
function findfeedback(id) {
    const feedback = Feedback.findOne({where: {id: id}});
    return feedback;
}
function findboard(id) {
    const board = Board.findOne({where: {id: id}});
    return board;
}

//상대방이 친구 요청함
exports.ReqFriendNotice = async(req, res, next, id) => {
    try{
        console.log('친구요청알림');
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
        console.log('친구수락알림');
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
        console.log('조언자등록알림');
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
        console.log('조언자해제알림');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '2.2',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 조언자를 해제 했습니다`,
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
        console.log('게시물추가알림');
        const uid = req.user.user_uid;

        const feedback = findfeedback(board.fk_feedbackId);

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '3.1',
            data: `${board.fk_feedbackId}.${board.id}.0`,
            text: `${finduser(uid)} 님이 새로운 게시물을 등록 했습니다`,
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

//피드백에 새 댓글 생성
exports.NewCommentNotice = async(req, res, next, comment) => {
    try{
        console.log('댓글추가알림');
        const uid = req.user.user_uid;
        const board = await findboard(comment.fk_board_id);
        const feedback = await findfeedback(board.fk_feedbackId);

        let receiver = await feedback.adviser_uid;
        if(uid === receiver) {receiver = feedback.user_uid};

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '3.2',
            data: `${board.fk_feedbackId}.${board.id}.${comment.id}`,
            text: `${finduser(uid)} 님이 게시물에 댓글을 등록 했습니다`,
            receiver_uid: receiver,
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

//피드백에 완료 요청
exports.ReqCompleteNotice = async(req, res, next, feedback) => {
    try{
        console.log('완료요청알림');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '4.1',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 피드백 완료 요청 했습니다`,
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

//완료 요청 수락
exports.OkCompleteNotice = async(req, res, next, feedback) => {
    try{
        console.log('피드백 완료 수락 알림');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '3.2',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 피드백 완료 요청을 수락했습니다.`,
            receiver_uid: feedback.user_uid,
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

//완료 요청 거절
exports.NoCompleteNotice = async(req, res, next, feedback) => {
    try{
        console.log('피드백 완료 수락 알림');
        const uid = req.user.user_uid;

        await Notice.create({
            sender_uid: req.user.user_uid,
            type: '3.3',
            data: `${feedback.id}.0.0`,
            text: `${finduser(uid)} 님이 피드백 완료 요청을 거절했습니다.`,
            receiver_uid: feedback.user_uid,
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