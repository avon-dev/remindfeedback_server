const winston = require('../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const { User, Feedback, Board, Comment, Sequelize: { Op } } = require('../models');
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
router.get('/all/scroll/:board_id/:lastid/:sort', clientIp, isLoggedIn, async(req, res, next)=>{
    const user_email = req.user.email;
    const board_id = parseInt(req.params.board_id);
    let lastid = parseInt(req.params.lastid);
    let sort = parseInt(req.params.sort);
    // sort = 0 (asc), =1 (desc)

    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] 게시물의 전체 댓글 목록 Request`);
    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] board_id : ${board_id}, lastid : ${lastid}, sort : ${sort}`);

    result.data = '';
    try{
        const exBoard = await Board.findOne({where:{id: board_id}})
        if(!exBoard){
            result.success = false;
            result.message = "존재하지 않는 게시물의 댓글은 조회할 수 없습니다.";
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        }
        let comments;
        if(sort===1){
            if(lastid===0) lastid = 9999;
            comments = await Comment.findAll({
                where: { id: { [Op.lt]: lastid } , fk_board_id: board_id},
                order: [['id', 'desc']], 
                limit: 10,
                include: [{ // 댓글 작성자의 nickname, portrait 정보 가져오기
                    model: User,
                    attributes: ['email', 'nickname', 'portrait'],
                }],
            })
            result.sort = 'DESCENDING'
        } else {
            comments = await Comment.findAll({
                where: { id: { [Op.gt]: lastid } , fk_board_id: board_id},
                order: [['id']], 
                limit: 10,
                include: [{ // 댓글 작성자의 nickname, portrait 정보 가져오기
                    model: User,
                    attributes: ['email', 'nickname', 'portrait'],
                }],
            })
            result.sort = 'ASCENDING'
        }
        if(comments){
            if(comments[0]){
                result.message = "해당 게시물의 전체 댓글 조회 성공";
                result.data = comments;
            }else{
                result.message = "더 이상 불러올 댓글이 없습니다."
                if(lastid===0){
                    result.message = "해당 게시물에 댓글이 없습니다.";
                }
                result.data = '';
            }
            result.success = true;
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] sort : ${result.sort}`);
            return res.status(200).json(result);
        }else{
            result.success = false;
            result.message = "해당 게시물의 전체 댓글 조회 실패";
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        }
    }catch(e){
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] 게시물의 전체 댓글 목록 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[COMMENT][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

/* get all comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.get('/all/page/:board_id/:page/:countPerPage/:sort', clientIp, isLoggedIn, async(req, res, next)=>{
    const user_email = req.user.email;
    const board_id = req.params.board_id;
    let page = parseInt(req.params.page)
    let countPerPage = 10;
    if(parseInt(req.params.countPerPage)!=0) countPerPage = parseInt(req.params.countPerPage)
    let sort = parseInt(req.params.sort)
    
    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] 게시물의 전체 댓글 목록 Request`);
    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] board_id : ${board_id}, page : ${page}, countPerPage : ${countPerPage}, sort : ${sort}`);

    result.data = '';
    let totalPage;
    try{
        const exBoard = await Board.findOne({where:{id: board_id}})
        if(!exBoard){
            result.success = false;
            result.message = "존재하지 않는 게시물의 댓글은 조회할 수 없습니다.";
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        }
        await Comment.count({
            where:{fk_board_id: board_id},
        }).then(count=>{
            if(count == 0){
                result.success = true;
                result.message = "해당 게시물에 댓글이 없습니다.";
                result.data = '';
                winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).json(result);
            }
            // 총 페이지 수 반환
            result.count = count;
            totalPage = Math.ceil(count/countPerPage);
        })
        // 페이지 0 이하면 1페이지로 간주
        
        if(page<1) page = 1;
        // 페이지 범위 초과 시 가장 마지막 페이지로 간주
        if(page>totalPage) page = totalPage;
        let startNum = countPerPage*(page-1);
        let comments;
        if(sort===1){
            comments = await Comment.findAll({
                where:{fk_board_id: board_id},
                include: [{ // 댓글 작성자의 nickname, portrait 정보 가져오기
                    model: User,
                    attributes: ['email', 'nickname', 'portrait'],
                }],
                offset: startNum,
                limit: countPerPage,
                order: [['createdAt', 'desc']]
            })
            result.sort = 'DESCENDING'  

        }else {
            comments = await Comment.findAll({
                where:{fk_board_id: board_id},
                include: [{ // 댓글 작성자의 nickname, portrait 정보 가져오기
                    model: User,
                    attributes: ['email', 'nickname', 'portrait'],
                }],
                offset: startNum,
                limit: countPerPage,
            })
            result.sort = 'ASCENDING'
        }
        if(comments){
            result.message = "해당 게시물의 전체 댓글 조회 성공";
            result.data = comments;
            result.success = true;
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] count : ${result.count}, sort : ${result.sort}`);
            return res.status(200).json(result);
        }else{
            result.success = false;
            result.message = "해당 게시물의 전체 댓글 조회 실패";
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        }
    }catch(e){
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] 게시물의 전체 댓글 목록 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[COMMENT][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

/* get one comment
 * - parameter user_uid : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.get('/:comment_id', clientIp, isLoggedIn, async(req, res, next)=>{
    const user_email = req.user.email;
    const comment_id = parseInt(req.params.comment_id);

    winston.log('info', `[COMMENT]][${req.clientIp}|${user_email}] 댓글 조회 Request`);
    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] comment_id : ${comment_id}`);

    result.data = '';
    try{
        await Comment.findOne({
            where:{id: comment_id},
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
            }]
        }).then(comment=>{
            if(comment){
                result.data = comment;
                result.success = true;
                result.message = "댓글 조회 성공";
                winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).json(result);
            }else{
                result.success = false;
                result.message = "댓글 조회 실패: 존재하지 않는 댓글입니다.";
                winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).json(result);
            }
        });
    }catch(e){
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] 댓글 조회 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[COMMENT][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

/* create one comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.post('/', clientIp, isLoggedIn, async (req, res, next)=>{
    try{
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const {board_id, comment_content } = req.body;
    
        winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] 댓글 생성 Request`);
        winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] comment_content : ${comment_content}, board_id : ${board_id}`);

        result.data = '';
        if(!comment_content) {
            result.success = false;
            result.message = "댓글 생성 실패: 댓글 내용(comment_content)는 반드시 입력해야 합니다.";
            return res.status(200).json(result);
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
            console.log(`로그인 uid=${user_uid}, 주인 uid= ${board.feedback.user_uid}, 조언자uid=${board.feedback.adviser_uid}`);
            if(board){
                if(user_uid!=board.feedback.user_uid && user_uid!=board.feedback.adviser_uid){
                    result.success = false;
                    result.message = "댓글 작성 실패: 게시물 주인 및 조언자만 댓글을 작성할 수 있습니다.";
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(401).json(result);
                }
                const comment = await Comment.create({
                    fk_board_id: board_id,
                    fk_user_uid: user_uid,
                    comment_content,
                });
                if(comment){
                    const user = new Object();
                    user.user_uid = user_uid;
                    user.email = req.user.email;
                    user.nickname = req.user.nickname;
                    user.portrait = req.user.portrait;
                    user.introduction = req.user.introduction;

                    const returnData = new Object();
                    returnData.user = user;
                    returnData.comment = comment;

                    result.data = returnData;
                    result.success = true;
                    result.message = '댓글 생성 완료';
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(201).json(result);
                }else{
                    result.success = false;
                    result.message = '댓글 생성 실패';
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }
            }
            result.success = false;
            result.message = "댓글 작성 실패: 존재하지 않는 게시물입니다.";
            winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        });
    }catch(e){
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] 댓글 생성 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

/* update one comment = 댓글 하나 수정
 */
router.put('/:comment_id', clientIp, isLoggedIn, async (req, res, next)=>{
    const user_uid = req.user.user_uid;
    const user_email = req.user.email;
    const comment_id = req.params.comment_id;
    const comment_content = req.body.comment_content;

    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] 댓글 수정 Request`);
    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] comment_id : ${comment_id}, comment_content : ${comment_content}`);

    result.data = '';
    if(!comment_content) {
        result.success = false;
        result.message = "댓글 수정 실패: 댓글 내용(comment_content)는 반드시 입력해야 합니다.";
        winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
        return res.status(200).json(result);
    }
    console.log(`기존 댓글 수정 요청 들어옴 = ${comment_id} / ${comment_content}`);

    try{
        await Comment.findOne({
            where: {id: comment_id},
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
            }]
        }).then(comment=>{
            if(comment){
                if(comment.fk_user_uid==user_uid){ // 댓글 주인만 수정 가능
                    comment.comment_content = comment_content;
                    comment.save();
    
                    result.data = comment; //삭제된 댓글 id 반환
                    result.success = true;
                    result.message = "댓글 수정 성공";
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
    
                }else{
                    result.success = false;
                    result.message = "댓글 수정 실패: 본인의 댓글만 수정할 수 있습니다.";
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }
            }else{
                result.success = false;
                result.message = "댓글 수정 실패: 존재하지 않는 댓글입니다.";
                winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).json(result);
            }
            
        });

    }catch(e){
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] 댓글 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[COMMENT][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});


/* delete one comment = 전체 댓글보기가 곧 해당 게시물 보기와 같음.
 * - parameter user_id : 로그인 한 회원 uuid
 * - parameter friend_id : 친구 추가할 회원 uuid
 */
router.delete('/:comment_id', clientIp, isLoggedIn, async (req, res, next)=>{
    const user_uid = req.user.user_uid;
    const user_email = req.user.email;
    const comment_id = parseInt(req.params.comment_id);

    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] 댓글 삭제 Request`);
    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] comment_id : ${comment_id}`);

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
                    result.message = "댓글 삭제 성공";
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }else{
                    result.success = false;
                    result.message = "댓글 삭제 실패: 본인의 댓글만 삭제할 수 있습니다.";
                    winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                    return res.status(200).json(result);
                }
            }else{
                result.success = false;
                result.message = "댓글 삭제 실패: 존재하지 않는 댓글입니다.";
                winston.log('info', `[COMMENT][${req.clientIp}|${user_email}] ${result.message}`);
                return res.status(200).json(result);
            }
        });        
    }catch(e){
        winston.log('error', `[COMMENT][${req.clientIp}|${req.user.email}] 댓글 삭제 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[COMMENT][${req.clientIp}|${req.body.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;