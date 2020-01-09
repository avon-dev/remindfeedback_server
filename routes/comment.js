const express = require('express');
const { User, Feedback, Board, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

let result = { // response form
    success: true,
    data: '',
    message: ""
}

/* get all comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.get('/selectall/:board_id', async(req, res, next)=>{
    const board_id = parseInt(req.params.board_id);
    console.log(`해당 게시물의 전체 댓글 조회 요청 = ${board_id}`);
    result.data = '';
    try{
        const exBoard = await Board.findOne({where:{id: board_id}})
        if(!exBoard){
            result.success = false;
            result.message = "[404 NOT FOUND] 존재하지 않는 게시물의 댓글은 조회할 수 없습니다.";
            return res.status(404).json(result);
        }
        await Comment.findAll({
            where:{fk_board_id: board_id},
            include: [{ // 댓글 작성자의 nickname, portrait 정보 가져오기
                model: User,
                attributes: ['nickname', 'portrait'],
            }],
            paranoid: false // 삭제된 데이터도 반환
        }).then(comments=>{
            if(comments){
                if(comments[0]){
                    result.message = "[200 OK] 해당 게시물의 전체 댓글 조회 성공";
                    result.data = comments;
                }else{
                    result.message = "[200 OK] 해당 게시물에 댓글이 없습니다.";
                    result.data = '';
                }
                result.success = true;
                return res.status(200).json(result);
            }else{
                result.success = false;
                result.message = "[403 FORBIDDEN] 해당 게시물의 전체 댓글 조회 실패";
                return res.status(403).json(result);
            }
        });
    }catch(e){
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

/* get one comment
 * - parameter user_uid : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.get('/selectone/:comment_id', async(req, res, next)=>{
    const comment_id = parseInt(req.params.comment_id);
    console.log(`댓글 조회 요청 = ${comment_id}`);
    result.data = '';
    try{
        await Comment.findOne({
            where:{id: comment_id},
            include: [{
                model: User,
                attributes: ['nickname', 'portrait'],
            }]
        }).then(comment=>{
            if(comment){
                result.data = comment;
                result.success = true;
                result.message = "[200 OK] 댓글 조회 성공";
                return res.status(200).json(result);
            }else{
                result.success = false;
                result.message = "[404 NOT FOUND] 댓글 조회 실패: 존재하지 않는 댓글입니다.";
                return res.status(403).json(result);
            }
        });
    }catch(e){
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

/* update one comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.post('/create', isLoggedIn, async (req, res, next)=>{
    try{
        const user_uid = req.user.user_uid;
        const comment_content = req.body.comment_content;
        const board_id = parseInt(req.body.board_id);
        result.data = '';
        if(!comment_content) {
            result.success = false;
            result.message = "[403 FORBIDDEN] 댓글 생성 실패: 댓글 내용(comment_content)는 반드시 입력해야 합니다.";
            return res.status(403).json(result);
        }
        console.log(`새 댓글 생성 요청 들어옴 = ${board_id}, ${comment_content}`);
        // board_id값은 들어오는데 
        //{ Error: (conn=161, no: 1364, SQLState: HY000) Field 'board_id' doesn't have a default value 에러 발생

        const exBoard = await Board.findOne({
            where:{id: board_id},
            include: [{
                model: Feedback,
                attributes: ['user_uid','adviser_uid'],
            }]
        }).then(async board=>{
            console.log(`로그인 uid=${user_uid}, 주인 uid= ${board.feedback.adviser_uiduser_uid}, 조언자uid=${board.feedback.adviser_uid}`);
            if(board){
                if(user_uid!=board.feedback.user_uid && user_uid!=board.feedback.adviser_uid){
                    result.success = false;
                    result.message = "[401 UNAUTHORIZED] 댓글 작성 실패: 게시물 주인 및 조언자만 댓글을 작성할 수 있습니다.";
                    console.log(`댓글 작성 실패: 댓글 작성 권한 없음`, JSON.stringify(result));
                    return res.status(401).json(result);
                }
                const newComment = await Comment.create({
                    fk_board_id: board_id,
                    fk_user_uid: user_uid,
                    comment_content,
                });
                if(newComment){
                    result.data = newComment;
                    result.success = true;
                    result.message = '[201 CREATED] 댓글 생성 완료';
                    return res.status(201).json(result);
                }else{
                    result.success = false;
                    result.message = '[403 FORBIDDEN] 댓글 생성 실패';
                    return res.status(403).json(result);
                }
            }
            result.success = false;
            result.message = "[404 NOT FOUND] 댓글 작성 실패: 존재하지 않는 게시물입니다.";
            console.log(`댓글 생성 실패: 존재하지 않는 게시물`, JSON.stringify(result));
            return res.status(404).json(result);
        });
    }catch(e){
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});


/* update one comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.put('/update/:comment_id', isLoggedIn, async (req, res, next)=>{
    const user_uid = req.user.user_uid;
    const comment_id = parseInt(req.params.comment_id);
    const comment_content = req.body.comment_content;
    result.data = '';
    if(!comment_content) {
        result.success = false;
        result.message = "댓글 수정 실패: 댓글 내용(comment_content)는 반드시 입력해야 합니다.";
        return res.status(403).json(result);
    }
    console.log(`기존 댓글 수정 요청 들어옴 = ${comment_id} / ${comment_content}`);

    try{
        await Comment.findOne({
            where: {id: comment_id},
            include: [{
                model: User,
                attributes: ['nickname', 'portrait'],
            }]
        }).then(comment=>{
            if(comment){
                if(comment.fk_user_uid==user_uid){ // 댓글 주인만 수정 가능
                    comment.comment_content = comment_content;
                    comment.save();
    
                    result.data = comment; //삭제된 댓글 id 반환
                    result.success = true;
                    result.message = "[200 OK] 댓글 수정 성공";
                    console.log(`Update One User's comment`, JSON.stringify(result));
                    return res.status(200).json(result);
    
                }else{
                    result.success = false;
                    result.message = "[401 UNAUTHORIZED] 댓글 수정 실패: 본인의 댓글만 수정할 수 있습니다.";
                    console.log(`댓글 수정 실패: 댓글 주인 아님`, JSON.stringify(result));
                    return res.status(401).json(result);
                }
            }else{
                result.success = false;
                result.message = "[404 NOT FOUND] 댓글 수정 실패: 존재하지 않는 댓글입니다.";
                console.log(`댓글 수정 실패: 존재하지 않는 댓글`, JSON.stringify(result));
                return res.status(404).json(result);
            }
            
        });

    }catch(e){
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});


/* delete one comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.delete('/delete/:comment_id', isLoggedIn, async (req, res, next)=>{
    const user_uid = req.user.user_uid;
    const comment_id = parseInt(req.params.comment_id);
    result.data = '';

    console.log(`기존 댓글 삭제 요청 들어옴= ${comment_id}`);
    try{
        await Comment.findOne({
            where: {id: comment_id}
        }).then(comment =>{
            // 댓글 주인만 삭제 가능
            if(comment){
                if(comment.fk_user_uid==user_uid){
                    const deletedCom = new Object();
                    deletedCom.board_id = comment.fk_board_id;
                    deletedCom.comment_id = comment_id;

                    Comment.destroy({
                        where: {id: comment_id}
                    });

                    console.log(deletedCom);

                    result.data = deletedCom; //삭제된 댓글 id, 게시물 id 반환
                    result.success = true;
                    result.message = "[200 OK]댓글 삭제 성공";
                    console.log(`Delete One User's comment`, JSON.stringify(result));
                    return res.status(200).json(result);
                }else{
                    result.success = false;
                    result.message = "[401 UNAUTHORIZED] 댓글 삭제 실패: 본인의 댓글만 삭제할 수 있습니다.";
                    console.log(`댓글 삭제 실패: 댓글 주인 아님`, JSON.stringify(result));
                    return res.status(401).json(result);
                }
            }else{
                result.success = false;
                result.message = "[404 NOT FOUND] 댓글 삭제 실패: 존재하지 않는 댓글입니다.";
                console.log(`댓글 삭제 실패: 존재하지 않는 댓글`, JSON.stringify(result));
                return res.status(404).json(result);
            }
        });        
    }catch(e){
        result.success = false;
        result.message = e;
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});


module.exports = router;