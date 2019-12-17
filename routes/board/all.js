const express = require('express');
const { Board, Sequelize: { Op } } = require('../../models');
const { isLoggedIn } = require('../middlewares'); 
const AWS = require('aws-sdk');
const router = express.Router();

AWS.config.update({
    //서울리전
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

const S3 = new AWS.S3();


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

/* getfeedback API
 */
router.get('/:feedbackid/:lastid', isLoggedIn, async (req, res, next) => {
    try{
        let feedbackid = parseInt(req.params.feedbackid);
        let lastid = parseInt(req.params.lastid);
        if(lastid === 0){
            lastid = 9999;
        }
        console.log('AllBoard 요청', lastid);
        let boardList;
        
        boardList = await Board.findAll({
            where: {id: { [Op.lt]:lastid}, fk_feedbackId: feedbackid},
            order: [['id', 'DESC']],
            limit: 10,
        })
        
        let result = {
            success: true,
            data: boardList,
            message: ""
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


router.delete('/:board_id', isLoggedIn, async (req, res, next) => {
    try{
        let board_id = parseInt(req.params.board_id);
        console.log('Board 삭제 요청', board_id);

        const beforeBoard = await Board.findOne({
            where: {id:board_id},
        });

        let deleteItems = [];

        if(beforeBoard.board_file1){
            await deleteItems.push({Key:beforeBoard.board_file1})
        }
        if(beforeBoard.board_file2){
            await deleteItems.push({Key:beforeBoard.board_file2})
        }
        if(beforeBoard.board_file3){
            await deleteItems.push({Key:beforeBoard.board_file3})
        }
        await filedelete(deleteItems);
        
        await Board.destroy({
            where: {id: board_id},
        })
        
        let result = {
            success: true,
            data: board_id,
            message: "삭제되었습니다"
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

router.patch('/board_title/:board_id', isLoggedIn, async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { board_title } = req.body; 
        console.log('board board_title 수정', board_title);
        const update = await Board.update({
            board_title
        }, {where: {id:board_id}})
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: 'board update 성공'
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

router.patch('/board_content/:board_id', isLoggedIn, async (req, res, next) => {
    try{
        const board_id = req.params.board_id;
        const { board_content } = req.body; 
        console.log('board board_content 수정', board_content);
        const update = await Board.update({
            board_content
        }, {where: {id:board_id}})
        const data = await Board.findOne({where:{id:board_id}})
        let result = {
            success: true,
            data,
            message: 'board update 성공'
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
