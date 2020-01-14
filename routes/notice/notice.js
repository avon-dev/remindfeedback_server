const express = require('express');
const { Notice, Sequelize: { Op } } = require('../../models');
const { isLoggedIn } = require('../middlewares'); 
const router = express.Router();
const moment = require('moment');
moment.tz.setDefault("Asia/Seoul");

router.get('/:lastid/:limit', isLoggedIn, async (req, res, next) => {
    try{
        const useruid = req.user.user_uid;
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);
        if(lastid === 0){
            lastid = 9999;
        }
        console.log('AllNotice 요청', lastid);

        let noticeList = await Notice.findAll({
            where: {id: { [Op.lt]:lastid}, receiver_uid: useruid},
            order: [['id', 'DESC']],
            limit: limit,
        })
        
        let result = {
            success: true,
            data: noticeList,
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

router.post('/', isLoggedIn, async (req, res, next) => {
    try{
        const useruid = req.user.user_uid;
        const { notice_id } = req.body;
        console.log('알림 확인', notice_id);

        let noticeList = await Notice.update({
            read_date: moment().format('YYYY-MM-DD HH:mm:ss')
         },{ where: {id: { [Op.lt]:lastid}, receiver_uid: useruid},
        })
        
        let result = {
            success: true,
            data: noticeList,
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

router.delete('/:notice_id', isLoggedIn, async (req, res, next) => {
    try{
        let notice_id = parseInt(req.params.notice_id);
        console.log('Notice 삭제 요청', notice_id);

        await Notice.destroy({
            where: {id: notice_id},
        })
        
        let result = {
            success: true,
            data: notice_id,
            message: "알림이 삭제되었습니다"
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
