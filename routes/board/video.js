const express = require('express');
const { Board } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares'); 
const {deleteS3Obj, upload_s3_test} = require('../S3');

const router = express.Router();

let type = 'video';
let fileSize = 500 * 1024 * 1024;

router.post('/create', isLoggedIn, upload_s3_test(type, fileSize).single('videofile'), async (req, res, next) => {
    try{
        const { feedback_id, board_title, board_content } = req.body;
        console.log(req.file)
        console.log('게시물 영상 생성', feedback_id, board_title, board_content);
        let file;
        if(req.file)file = await req.file.key;

        const exBoard = await Board.create({
            board_title,
            board_content,
            board_category: 2,
            fk_feedbackId: feedback_id,
            board_file1: file,
        });
        let result = {
            success: true,
            data: '',
            message: '게시글 생성 완료',
        }
        if(exBoard) {
            result.data= exBoard
            res.status(201).json(result);
        }else {
            result.success = false;
            result.message = '게시글이 생성되지 않았습니다.';
            return res.status(201).json(result);
        }
    } catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

router.put('/update/:board_id', isLoggedIn, upload_s3_test(type, fileSize).single('videofile'), async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { board_title, board_content, updatefile1 } = req.body; 
        console.log('board video put 요청', board_id, board_title, board_content, updatefile1);
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
            if(beforeBoard.board_file1)
            deleteItems.push({Key:beforeBoard.board_file1});
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
            message: 'board video update 성공'
        }
        res.status(200).json(result);
    } catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

router.patch('/file/:board_id', isLoggedIn, upload_s3_test(type, fileSize).single('videofile'), async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { updatefile1 } = req.body; 
        console.log('board video put 요청', board_id, updatefile1);
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
            message: 'board video update 성공'
        }
        res.status(200).json(result);
    } catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
});

module.exports = router;
