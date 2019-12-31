const express = require('express');
const { User, Board, Comment } = require('../models');
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
router.get('/:board_id', async(req, res, next)=>{
    const user_uid = req.user.user_uid;
    const board_id = req.params.board_id;
    console.log(`해당 게시물의 전체 댓글 조회 요청 = ${board_id}`);
    try{
        await Comment.findAll({
            where:{fk_board_id: board_id},
            include: [{
                model: User,
                attributes: ['nickname', 'portrait'],
            }]
        }).then(comments=>{
            if(comments){
                result.data = comments;
                result.success = true;
                result.message = "해당 게시물의 전체 댓글 조회 성공";
                return res.status(200).json(result);
            }else{
                result.success = false;
                result.message = "해당 게시물의 전체 댓글 조회 실패";
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
        const {board_id, comment_content} = req.body;
    
        console.log(`새 댓글 생성 요청 들어옴 = ${board_id}, ${comment_content}`);
        // board_id값은 들어오는데 
        //{ Error: (conn=161, no: 1364, SQLState: HY000) Field 'board_id' doesn't have a default value 에러 발생

        const newComment = await Comment.create({
            fk_board_id: board_id,
            fk_user_uid: user_uid,
            comment_content,
        });
        if(newComment){
            result.data = newComment;
            result.success = true;
            result.message = '댓글 생성 완료';
            return res.status(201).json(result);
        }else{
            result.success = false;
            result.message = '댓글 생성 실패';
            return res.status(403).json(result);
        }

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
router.put('update/:comment_id', isLoggedIn, async (req, res, next)=>{
    const user_uid = req.user.user_uid;
    //const comment_id = req.params.comment_id;
    const {comment_id, comment_content} = req.body;

    console.log(`기존 댓글 수정 요청 들어옴 = ${comment_id} / ${comment_content}`);

    try{
        await Comment.findOne({
            where: {id: comment_id}
        }).then(comment=>{
            if(comment.fk_user_uid==user_uid){ // 댓글 주인만 수정 가능
                comment_content = comment_content;
                
                comment.save();

                result.data = comment; //삭제된 댓글 id 반환
                result.success = true;
                result.message = "댓글 수정 성공";
                console.log(`Update One User's comment`, JSON.stringify(result));
                return res.status(200).json(result);

            }else{
                result.success = false;
                result.message = "댓글 수정 실패: 본인의 댓글만 삭제할 수 있습니다.";
                console.log(`댓글 수정 실패: 댓글 주인 아님`, JSON.stringify(result));
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


/* delete one comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.delete('delete/:comment_id', isLoggedIn, async (req, res, next)=>{
    const user_uid = req.user.user_uid;
    //const comment_id = req.params.comment_id;
    const comment_id = req.body.comment_id;

    console.log(`기존 댓글 삭제 요청 들어옴= ${comment_id}`);
    try{
        await Comment.findOne({
            where: {id: comment_id}
        }).then(comment =>{
            // 댓글 주인만 삭제 가능
            if(comment.fk_user_uid==user_uid){
                Comment.destroy({
                    where: {id: comment_id}
                });
                result.data = comment_id; //삭제된 댓글 id 반환
                result.success = true;
                result.message = "댓글 삭제 성공";
                console.log(`Delete One User's comment`, JSON.stringify(result));
                return res.status(200).json(result);
            }else{
                result.success = false;
                result.message = "댓글 삭제 실패: 본인의 댓글만 삭제할 수 있습니다.";
                console.log(`댓글 삭제 실패: 댓글 주인 아님`, JSON.stringify(result));
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


module.exports = router;