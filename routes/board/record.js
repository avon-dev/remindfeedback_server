const winston = require('../../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('../middlewares'); 

const express = require('express');
const { Board } = require('../../models');
const {deleteS3Obj, upload_s3_test} = require('../S3');

const router = express.Router();

let type = 'record';
let fileSize = 5000 * 1024 * 1024;

//게시물 생성
router.post('/', clientIp, isLoggedIn, upload_s3_test(type, fileSize).single('recordfile'), async (req, res, next) => {
    try{
        const user_email = req.user.email;
        const { feedback_id, board_title, board_content } = req.body;

        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] 게시글(음성) 생성 Request`);
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, board_title : ${board_title},  board_content : ${board_content}`);

        let file;
        if(req.file) file = await req.file.key;

        const exBoard = await Board.create({
            board_title,
            board_content,
            board_category: 3,
            fk_feedbackId: feedback_id,
            board_file1: file,
        });
        let result = {
            success: true,
            data: '',
            message: '게시글(음성) 생성 완료',
        }
        if(exBoard) {
            result.data= exBoard;
            winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] ${result.message}`);
            res.status(201).json(result);
        }else {
            result.success = false;
            result.message = '음성 게시글이 생성되지 않았습니다.';
            winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] ${result.message}`);
            return res.status(200).json(result);
        }
    } catch(e){
        winston.log('error', `[BOARD|RECORD][${req.clientIp}|${req.user.email}] 게시글(음성) 생성 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[BOARD|RECORD][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

//게시물 수정 (전체)
router.put('/:board_id', clientIp, isLoggedIn, upload_s3_test(type, fileSize).single('recordfile'), async (req, res, next) => {
    try{
        const user_email = req.user.email;
        const board_id = req.params.board_id;
        const { board_title, board_content, updatefile1 } = req.body; 

        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] 게시글(음성) 전체 수정 Request`);
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] board_id : ${board_id}, board_title : ${board_title},  board_content : ${board_content}`);
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] updatefile1 : ${updatefile1}`);

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
        
        let deleteItems = [];
        tempBoard.board_file1 = await beforeBoard.board_file1;
        if(updatefile1){
            deleteItems.push({Key:beforeBoard.board_file1})
            if(req.file)tempBoard.board_file1 = await req.file.key
            else{tempBoard.board_file1 = null}
        }
        await deleteS3Obj(deleteItems);
        //업데이트
        await Board.update({
            board_title:tempBoard.board_title, board_content:tempBoard.board_content,
            board_file1: tempBoard.board_file1,
            board_file2: tempBoard.board_file2,
            board_file3: tempBoard.board_file3
        }, {where: {id:board_id}})
        //response
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: '게시글(음성) 전체 수정 성공'
        }
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] ${result.message}`);
        res.status(200).json(result);
    } catch(e){
        winston.log('error', `[BOARD|RECORD][${req.clientIp}|${req.user.email}] 게시글(음성) 전체 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[BOARD|RECORD][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

//게시물 수정 (음성파일)
router.patch('/file/:board_id', clientIp, isLoggedIn, upload_s3_test(type, fileSize).single('recordfile'), async (req, res, next) => {
    try{
        const user_email = req.user.email;
        const board_id = req.params.board_id;
        const updatefile1 = req.body.updatefile1; 

        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] 게시글(음성) 일부 수정 Request`);
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] board_id : ${board_id}`);
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] updatefile1 : ${updatefile1}`);

        const beforeBoard = await Board.findOne({
            where: {id:board_id},
        });
        let tempBoard = new Object();

        let deleteItems = [];
        tempBoard.board_file1 = await beforeBoard.board_file1;
        if(updatefile1){
            deleteItems.push({Key:beforeBoard.board_file1})
            if(req.file)tempBoard.board_file1 = await req.file.key
            else{tempBoard.board_file1 = null}
        }
        await deleteS3Obj(deleteItems);
        //업데이트
        await Board.update({
            board_file1: tempBoard.board_file1,
        }, {where: {id:board_id}})
        //response
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: '게시글(음성) 일부 수정 성공'
        }
        winston.log('info', `[BOARD|RECORD][${req.clientIp}|${user_email}] ${result.message}`);
        res.status(200).json(result);
    } catch(e){
        winston.log('error', `[BOARD|RECORD][${req.clientIp}|${req.user.email}] 게시글(음성) 일부 수정 Exception`);
        
        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[BOARD|RECORD][${req.clientIp}|${req.user.email}] ${result.message}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;
