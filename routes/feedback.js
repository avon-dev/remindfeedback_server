const winston = require('../config/winston');
const { clientIp, isLoggedIn, isNotLoggedIn } = require('./middlewares');

const express = require('express');
const { User, Feedback, Board, Sequelize: { Op } } = require('../models');
const router = express.Router();
const { deleteS3Obj, upload_s3_test } = require('./S3');

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(
        process.env[config.use_env_variable],
        config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config);
}

const findCategory = async (category_id, categoryList) => {
    // 반복문을 돌려 카테고리 id로 찾기
    return await categoryList.map((contact) => {
        if (category_id === contact.category_id) {
            return contact
        }
    })
}

//피드백 생성
router.post('/', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const { adviser, category, title, write_date } = req.body;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 생성 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] adviser : ${adviser}, category : ${category}, title : ${title}, write_date : ${write_date}`);

        const exFeedback = await Feedback.create({
            user_uid: req.user.user_uid,
            adviser_uid: adviser,
            category,
            title,
            write_date,
        });

        let result = {
            success: true,
            data: '',
            message: '피드백 생성 완료',
        }

        if (exFeedback) {
            result.data = exFeedback
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            res.status(201).json(result);
        } else {
            result.success = false;
            result.message = '피드백이 생성되지 않았습니다.';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 생성 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 완료 요청
router.patch('/request/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 완료 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}`);

        const beforeFeedback = await Feedback.findOne({ where: { id: feedback_id } });

        let result = {
            success: true,
            data: '',
            message: '피드백 완료 요청 성공',
        }

        if (!beforeFeedback) {
            result.success = false;
            result.message = '피드백이 존재하지 않습니다';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

        await Feedback.update({
            complete: 1
        }, { where: { id: feedback_id } });

        const exFeedback = await Feedback.findOne({ where: { id: feedback_id } });

        if (exFeedback) {
            result.data = exFeedback
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            res.status(200).json(result);
        } else {
            result.success = false;
            result.message = '존재하지 않는 피드백 입니다.';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 완료 요청 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 완료 거절
router.patch('/rejection/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 완료 거절 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}`);

        const beforeFeedback = await Feedback.findOne({ where: { id: feedback_id } });

        let result = {
            success: true,
            data: '',
            message: '피드백 완료 요청 거절',
        }

        if (!beforeFeedback) {
            result.success = false;
            result.message = '피드백이 존재하지 않습니다';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

        await Feedback.update({
            complete: 0
        }, { where: { id: feedback_id } });

        const exFeedback = await Feedback.findOne({ where: { id: feedback_id } });

        if (exFeedback) {
            result.data = exFeedback
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            res.status(200).json(result);
        } else {
            result.success = false;
            result.message = '존재하지 않는 피드백 입니다.';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 완료 거절 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 완료 수락
router.patch('/approval/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 완료 수락 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}`);

        const beforeFeedback = await Feedback.findOne({ where: { id: feedback_id } });

        let result = {
            success: true,
            data: '',
            message: '피드백 완료 요청 수락',
        }

        if (!beforeFeedback) {
            result.success = false;
            result.message = '피드백이 존재하지 않습니다';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

        await Feedback.update({
            complete: 2
        }, { where: { id: feedback_id } });

        const exFeedback = await Feedback.findOne({ where: { id: feedback_id } });

        if (exFeedback) {
            result.data = exFeedback;
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            res.status(200).json(result);
        } else {
            result.success = false;
            result.message = '존재하지 않는 피드백 입니다.';
            winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(200).json(result);
        }

    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 완료 수락 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 목록 가져오기(전체)
router.get('/:lastid', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        let lastid = parseInt(req.params.lastid);

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 피드백 목록 조회 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] lastid : ${lastid}`);


        if (lastid === 0) {
            lastid = 9999;
        }
        let feedbackList = {
            myFeedback: '',
            yourFeedback: '',
            user: '',
            category: '',
        }
        //유저정보 담아주기
        feedbackList.user = await User.findOne({
            attributes: ['email', 'nickname', 'portrait', 'introduction', 'tutorial', 'category'],
            where: { user_uid }
        })
        //유저의 카테고리 목록
        feedbackList.category = await JSON.parse(feedbackList.user.category);
        //유저가 만든 피드백 목록
        feedbackList.myFeedback = await Feedback.findAll({
            where: { user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
        })
        //유저가 조언자인 피드백 목록
        feedbackList.yourFeedback = await Feedback.findAll({
            where: { adviser_uid: user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'owner'
            }]
        })
        let result = {
            success: true,
            data: feedbackList,
            message: ""
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 목록 조회 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 목록 가져오기(전체)
router.get('/:lastid/:limit', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 목록(제한) 조회 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] lastid : ${lastid}, limit : ${limit}`);

        if (lastid === 0) {
            lastid = 9999;
        }
        let feedbackList = {
            myFeedback: '',
            yourFeedback: '',
            user: '',
            category: '',
        }
        //유저정보 담아주기
        feedbackList.user = await User.findOne({
            attributes: ['email', 'nickname', 'portrait', 'introduction', 'tutorial', 'category'],
            where: { user_uid }
        })
        //유저의 카테고리 목록
        feedbackList.category = await JSON.parse(feedbackList.user.category);
        //유저가 만든 피드백 목록
        feedbackList.myFeedback = await Feedback.findAll({
            where: { user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
        })
        //유저가 조언자인 피드백 목록
        feedbackList.yourFeedback = await Feedback.findAll({
            where: { adviser_uid: user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'owner'
            }]
        })
        let result = {
            success: true,
            data: feedbackList,
            message: ""
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 목록(제한) 조회 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 목록 가져오기(내피드백)
router.get('/mine/:lastid', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        let lastid = parseInt(req.params.lastid);

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 내가 만든 피드백 목록 조회 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] lastid : ${lastid}`);

        let result = {
            success: true,
            data: '',
            message: "내가 만든 피드백 목록"
        }

        if (lastid === 0) {
            lastid = 9999;
        }
        const user = await User.findOne({
            where: { user_uid: req.user.user_uid }
        })
        const category = JSON.parse(user.category)
        result.data = await Feedback.findAll({
            where: { user_uid: req.user.user_uid, id: { [Op.lt]: lastid } },
            order: [['write_date', 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
        });
        await result.data.map((contact) => {
            findCategory(contact.category, category).then((data) => {
                // console.log(data, contact.category);
                contact.category = data
            });
        })
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 내가 만든 피드백 목록 조회 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 목록 가져오기(내피드백)
router.get('/mine/:lastid/:limit', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 내가 만든 피드백 목록(제한) 조회 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] lastid : ${lastid}, limit : ${limit}`);

        let result = {
            success: true,
            data: '',
            message: "내가 만든 피드백 목록"
        }

        if (lastid === 0) {
            lastid = 9999;
        }
        const user = await User.findOne({
            where: { user_uid: req.user.user_uid }
        })
        const category = JSON.parse(user.category)
        result.data = await Feedback.findAll({
            where: { user_uid: req.user.user_uid, id: { [Op.lt]: lastid } },
            order: [['write_date', 'DESC']],
            limit,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
        });
        await result.data.map((contact) => {
            findCategory(contact.category, category).then((data) => {
                // console.log(data, contact.category);
                contact.category = data
            });
        });
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 내가 만든 피드백 목록(제한) 조회 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 목록 가져오기(내가 조언자)
router.get('/yoursa/:lastid', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        let lastid = parseInt(req.params.lastid);

        if (lastid === 0) {
            lastid = 9999;
        }

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 내가 조언자인 피드백 목록 조회 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] lastid : ${lastid}`);

        const yourFeedback = await Feedback.findAll({
            where: { adviser_uid: user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'owner'
            }]
        });
        let result = {
            success: true,
            data: yourFeedback,
            message: "내가 조언자인 피드백 목록"
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 내가 조언자인 피드백 목록 조회 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 목록 가져오기(내가 조언자)
router.get('/yours/:lastid/:limit', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);

        if (lastid === 0) {
            lastid = 9999;
        }

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 내가 조언자인 피드백 목록(제한) 조회 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] lastid : ${lastid}, limit : ${limit}`);

        const yourFeedback = await Feedback.findAll({
            where: { adviser_uid: user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit,
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'owner'
            }]
        });
        let result = {
            success: true,
            data: yourFeedback,
            message: "내가 조언자인 피드백 목록"
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 내가 조언자인 피드백 목록(제한) 조회  Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 수정 (전체)
router.put('/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;
        const { adviser, category, title, write_date } = req.body;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 생성 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, adviser : ${adviser}, category : ${category}, title : ${title}, write_date : ${write_date}`);

        const beforeFeedback = await Feedback.findOne({
            where: { id: feedback_id },
        });
        let tempFeedback = new Object();
        if (adviser || adviser !== beforeFeedback.adviser_uid) {
            tempFeedback.adviser_uid = await adviser;
        } else { tempFeedback.adviser_uid = await beforeFeedback.adviser_uid; }

        if (category || category !== beforeFeedback.category) {
            tempFeedback.category = await category;
        } else { tempFeedback.category = await beforeFeedback.category; }

        if (title || title !== beforeFeedback.title) {
            tempFeedback.title = await title;
        } else { tempFeedback.title = await beforeFeedback.title; }

        if (write_date || write_date !== beforeFeedback.write_date) {
            tempFeedback.write_date = await write_date;
        } else { tempFeedback.write_date = await beforeFeedback.write_date; }

        //업데이트
        const update = await Feedback.update({
            adviser_uid: tempFeedback.adviser_uid, category: tempFeedback.category, title: tempFeedback.title, write_date: tempFeedback.write_date
        }, { where: { id: feedback_id } })
        //response
        let data = await Feedback.findOne({ 
            where: { id: feedback_id },
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
         })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 수정 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

//피드백 수정 (조언자)
router.patch('/adviser/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;
        const adviser = req.body.adviser;

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 피드백 조언자 수정 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, adviser : ${adviser}`);

        await Feedback.update({
            adviser_uid: adviser
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ 
            where: { id: feedback_id },
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
        })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 조언자 수정 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

router.patch('/category/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;
        const category = req.body.category;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 카테고리 수정 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, category : ${category}`);

        await Feedback.update({
            category: category
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ 
            where: { id: feedback_id },
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
         })
        let result = {
            success: true,
            data: data,
            message: 'feedback update 성공'
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 카테고리 수정 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

router.patch('/title/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;
        const title = req.body.title;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 카테고리 수정 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, title : ${title}`);

        await Feedback.update({
            title
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ 
            where: { id: feedback_id },
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
         })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 제목 수정 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

router.patch('/dday/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;
        const write_date = req.body.write_date;

        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 날짜 수정 Request`);
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}, write_date : ${write_date}`);

        await Feedback.update({
            write_date
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ 
            where: { id: feedback_id },
            include: [{
                model: User,
                attributes: ['email', 'nickname', 'portrait'],
                as: 'adviser'
            }]
         })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
        res.status(200).json(result);
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 날짜 수정 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

router.delete('/:feedback_id', clientIp, isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        const user_email = req.user.email;
        const feedback_id = req.params.feedback_id;

        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] 피드백 삭제 Request`);
        winston.log('info', `[CATEGORY][${req.clientIp}|${user_email}] feedback_id : ${feedback_id}`);


        // 피드백 테이블에서 feedback_id로 uuid 검색
        // SELECT user_uid FROM feedbacks WHERE id=:feedback_id;
        await Feedback.findOne({
            attributes: ['user_uid', 'deletedAt'],
            where: {
                id: feedback_id
            }
        }).then(async (feedback) => {
            // 피드백 테이블 조회를 성공한 경우
            if (feedback == null) {
                // 피드백 테이블에서 피드백 검색에 실패한 경우
                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '피드백을 찾을 수 없습니다.';
                winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
                return res.status(200).send(result);
            } else {
                // 피드백 테이블에서 피드백 검색에 성공한 경우
                if (user_uid != feedback.user_uid) {
                    // 본인이 작성한 피드백이 아닌 경우
                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '내가 작성한 피드백이 아닙니다.';
                    winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
                    return res.status(200).send(result);
                } else {
                    // 본인이 작성한 피드백인 경우
                    // 이 피드백에 속한 게시물의 파일 검색
                    let deleteItems = [];
                    await Board.findAll({
                        attributes: ['id', 'board_file1', 'board_file2', 'board_file3'],
                        where: { fk_feedbackId: feedback_id }
                    }).then(boards => {
                        console.log("board =" + boards);
                        // 삭제할 파일 목록 배열에 저장
                        boards.forEach(element => {
                            if (element.board_file1) {
                                deleteItems.push({ Key: element.board_file1 })
                            }
                            if (element.board_file2) {
                                deleteItems.push({ Key: element.board_file2 })
                            }
                            if (element.board_file3) {
                                deleteItems.push({ Key: element.board_file3 })
                            }
                        })
                        console.log(`deletedItems = ${deleteItems}`);
                    })
                    // 삭제할 목록에 있는 파일들 전부 삭제
                    deleteS3Obj(deleteItems);


                    let query_update =
                        'UPDATE comments SET deletedAt=NOW() WHERE fk_board_id=ANY(SELECT id FROM boards WHERE fk_feedbackId=:feedback_id); ' +
                        'UPDATE boards SET deletedAt=NOW() WHERE fk_feedbackId=:feedback_id; ' +
                        'UPDATE feedbacks SET deletedAt=NOW() WHERE id=:feedback_id;';

                    sequelize.query(query_update, {
                        replacements: {
                            feedback_id: feedback_id
                        },
                        raw: true
                    }).then(() => {
                        // 삭제할 목록에 있는 파일들 전부 삭제
                        //deleteS3Obj(deleteItems);
                        // 정상적으로 피드백 삭제 쿼리를 수행한 경우
                        // 친구 차단 목록을 그대로 리턴
                        const result = new Object();
                        result.success = true;
                        result.data = feedback_id;
                        result.message = '성공적으로 피드백을 삭제했습니다.';
                        winston.log('info', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 삭제 쿼리 실행을 실패한 경우
                        winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 삭제 쿼리 실행 실패 \n ${error.stack}`);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '피드백 삭제 실행 과정에서 에러가 발생하였습니다.';
                        winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
                        return res.status(500).send(result);
                    });
                }
            }
        }).catch(error => {
            // 피드백 테이블 조회를 실패한 경우
            winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] 피드백 테이블 조회 실패 \n ${error.stack}`);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '피드백 조회 과정에서 에러가 발생하였습니다.';
            winston.log('error', `[FEEDBACK][${req.clientIp}|${user_email}] ${JSON.stringify(result)}`);
            return res.status(500).send(result);
        });
    } catch (e) {
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.user.email}] 피드백 삭제 Exception`);

        const result = new Object();
        result.success = false;
        result.data = 'NONE';
        result.message = 'INTERNAL SERVER ERROR';
        winston.log('error', `[FEEDBACK][${req.clientIp}|${req.body.email}] ${JSON.stringify(result)}`);
        res.status(500).send(result);
        return next(e);
    }
});

module.exports = router;
