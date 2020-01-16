
const { User, Feedback, Board } = require('../../models');

const {insert, read} = require('./firebase.js'); //insert(sender_uid, type, data, text, reseiver_uid)

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

        await insert(
            uid,
            [1, 1],
            [null, null, null],
            `${finduser(uid)} 님이 친구 요청했습니다`,
            id,
        )
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

        await insert(
            uid,
            [1, 2],
            [null, null, null],
            `${finduser(uid)} 님이 친구 수락했습니다`,
            id,
        )
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

        await insert(
            uid,
            [2, 1],
            [feedback.id, null, null],
            `${finduser(uid)} 님이 회원님을 조언자로 등록 했습니다`,
            feedback.adviser_uid,
        )
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

        await insert(
            uid,
            [2, 2],
            [feedback.id, null, null],
            `${finduser(uid)} 님이 조언자를 해제 했습니다`,
            feedback.adviser_uid,
        )
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

        await insert(
            uid,
            [3, 1],
            [board.fk_feedbackId, board.id, null],
            `${finduser(uid)} 님이 새로운 게시물을 등록 했습니다`,
            feedback.adviser_uid,
        )
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

        await insert(
            uid,
            [3, 2],
            [board.fk_feedbackId, board.id, comment.id],
            `${finduser(uid)} 님이 게시물에 댓글을 등록 했습니다`,
            receiver,
        )
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

        await insert(
            uid,
            [4, 1],
            [feedback.id, null, null],
            `${finduser(uid)} 님이 피드백 완료 요청 했습니다`,
            feedback.adviser_uid,
        )
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

        await insert(
            uid,
            [4, 2],
            [feedback.id, null, null],
            `${finduser(uid)} 님이 피드백 완료 요청을 수락했습니다.`,
            feedback.user_uid,
        )
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

        await insert(
            uid,
            [4, 3],
            [feedback.id, null, null],
            `${finduser(uid)} 님이 피드백 완료 요청을 거절했습니다.`,
            feedback.user_uid,
        )
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