const express = require('express');
const { isLoggedIn } = require('../middlewares'); 
const router = express.Router();

const {db, insert, read, update} = require('./firebase.js');


router.get('/:lastid/:limit', isLoggedIn, async (req, res, next) => {
    try{
        const result = await read(req.user.user_uid);
        console.log('아아아알림테스트임다', result)
        await res.status(200).json(result);   
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
        const { receiver_uid } = req.body;
        const result = await insert(useruid, [1, 1], [null, null, null], 'text', receiver_uid);
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

router.patch('/', isLoggedIn, async (req, res, next) => {
    try{
        const useruid = req.user.user_uid;
        const { docID } = req.body;
        const result = await update(useruid, docID);
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
        const uid = req.user.user_uid;
        let notice_id = req.params.notice_id;
        console.log('Notice 삭제 요청', notice_id);

        await db.collection(uid).doc(notice_id).delete();
        
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
