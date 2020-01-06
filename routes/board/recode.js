const express = require('express');
const { Board } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares'); 
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');

const router = express.Router();

AWS.config.update({
    //서울리전
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

const S3 = new AWS.S3();

const upload = multer({ //멀터를 사용하면 upload 객체를 받을 수 있다.
    storage: multerS3({ 
        s3: new AWS.S3(),
        bucket: 'remindfeedback',
        key(req, file, cb) {
            cb(null, `recode/${+new Date()}${path.basename(file.originalname)}`); //recode 폴더의 시간+파일이름
        }
    }),
    limits: { fileSize: 500 * 1024 * 1024 }, //파일 사이즈 (50mb)
});

const filedelete = (deleteItems) => {
    console.log(deleteItems);
    let params = {
        Bucket: 'remindfeedback',
        Delete: {
            Objects: deleteItems,
        }
    };
    S3.deleteObjects(params, function(err, data) {
        if (err) console.log(err)
        else console.log("Successfully deleted remindfeedback");
    })
}

router.post('/create', isLoggedIn, upload.single('recodefile'), async (req, res, next) => {
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

router.put('/update/:board_id', isLoggedIn, upload.single('recodefile'), async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { board_title, board_content, updatefile1 } = req.body; 
        console.log('board recode put 요청', board_id, board_title, board_content, updatefile1);
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
        await filedelete(deleteItems);
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
            message: 'board recode update 성공'
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

router.patch('/file/:board_id', isLoggedIn, upload.single('recodefile'), async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { updatefile1 } = req.body; 
        console.log('board recode put 요청', board_id, updatefile1);
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
        await filedelete(deleteItems);
        //업데이트
        await Board.update({
            board_file1: tempBoard.board_file1,
        }, {where: {id:board_id}})
        //response
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: 'board recode update 성공'
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
