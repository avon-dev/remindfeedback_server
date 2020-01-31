const winston = require('../../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('../middlewares'); 

const express = require('express');
const { Board } = require('../../models');
const router = express.Router();

<<<<<<< HEAD

=======
//게시물 생성
>>>>>>> editcode_CHOI
router.post('/', clientIp, isLoggedIn, async (req, res, next) => {
    try{
        const user_email = req.user.email;
        const { feedback_id, board_title, board_content } = req.body;

        winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] 게시글(텍스트) 생성 Request`);
        winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, board_title : ${board_title},  board_content : ${board_content}`);

        const exBoard = await Board.create({
            board_title,
            board_content,
            board_category: 0,
            fk_feedbackId: feedback_id,
        });
        let result = {
            success: true,
            data: '',
            message: '게시글(글) 생성 완료',
        }
        if(exBoard) {
            result.data= exBoard;
            winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] ${result.message}`);
            res.status(201).json(result);
        }else {
            result.success = false;
            result.message = '게시글이 생성되지 않았습니다.';
            winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        }

    } catch(e){
        winston.log('error', `[BOARD|TEXT][${req.clientIp}|${req.user.email}] 게시글(텍스트) 생성 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[BOARD|TEXT][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

router.put('/:board_id', clientIp, isLoggedIn, async (req, res, next) => {
    try{
        const user_email = req.user.email;
        const board_id = req.params.board_id;
        const { board_title, board_content } = req.body; 

        winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] 게시글(텍스트) 수정 Request`);
        winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] board_id : ${board_id}, board_title : ${board_title},  board_content : ${board_content}`);

        const beforeBoard = await Board.findOne({
            where: {id:board_id},
        });
        let tempBoard = new Object();
        if(board_title || board_title !== beforeBoard.board_title){
            tempBoard.board_title = await board_title;
        }else{tempBoard.board_title = await beforeBoard.board_title;}

        if(board_content || board_content !== beforeBoard.board_content){
            tempBoard.board_content = await board_content;
        }else{tempBoard.board_content = await beforeBoard.board_content;}

        //업데이트
        const update = await Board.update({
            board_title:tempBoard.board_title, board_content:tempBoard.board_content
        }, {where: {id:board_id}})
        // console.log(update);
        //response
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: '게시글(글) 전체 수정 성공'
        }
        winston.log('info', `[BOARD|TEXT][${req.clientIp}|${user_email}] ${result.message}`);
        res.status(200).json(result);
    } catch(e){
        winston.log('error', `[BOARD|TEXT][${req.clientIp}|${req.user.email}] 게시글(텍스트) 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[BOARD|TEXT][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});



module.exports = router;
