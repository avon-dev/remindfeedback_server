const express = require('express');
const bcrypt = require('bcrypt');
const { User, Feedback, Board, Sequelize: { Op } } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
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


router.post('/create', isLoggedIn, async (req, res, next) => {
    try {
        const { adviser, category, title, write_date } = req.body;
        console.log('피드백 생성', adviser, category, title, write_date);

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
            res.status(201).json(result);
        } else {
            result.success = false;
            result.message = '피드백이 생성되지 않았습니다.';
            return res.status(201).json(result);
        }

    } catch (e) {
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

/* getfeedback API
 */
router.get('/all/:lastid', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        let lastid = parseInt(req.params.lastid);
        console.log('AllFeedback 요청', lastid);
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
        })
        //유저가 조언자인 피드백 목록
        feedbackList.yourFeedback = await Feedback.findAll({
            where: { adviser_uid: user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit: 10,
        })
        let result = {
            success: true,
            data: feedbackList,
            message: ""
        }
        res.status(200).json(result);
    } catch (e) {
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

router.get('/all/:lastid/:limit', isLoggedIn, async (req, res, next) => {
    try {
        const user_uid = req.user.user_uid;
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);
        console.log('AllFeedback 요청', lastid);
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
        })
        //유저가 조언자인 피드백 목록
        feedbackList.yourFeedback = await Feedback.findAll({
            where: { adviser_uid: user_uid, id: { [Op.lt]: lastid } },
            order: [['createdAt', 'DESC']],
            limit,
        })
        let result = {
            success: true,
            data: feedbackList,
            message: ""
        }
        res.status(200).json(result);
    } catch (e) {
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

router.get('/my/:lastid/:limit', isLoggedIn, async (req, res, next) => {
    try {
        let result = {
            success: true,
            data: '',
            message: "내가 만든 피드백 목록"
        }
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);
        console.log('myFeedback 요청', lastid);
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
        });
        await result.data.map((contact) => {
            findCategory(contact.category, category).then((data) => {
                // console.log(data, contact.category);
                contact.category = data
            });
        })
        res.status(200).json(result);
    } catch (e) {
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

router.get('/your/:lastid', isLoggedIn, async (req, res, next) => {
    try {
        let lastid = parseInt(req.params.lastid);
        console.log('yourFeedback 요청', lastid);
        const yourFeedback = await Feedback.findAll({
            where: { adviser_uid: req.user.user_uid, id: { [Op.lt]: lastid } },
            order: [['write_date', 'DESC']],
            limit: 10,
        });
        let result = {
            success: true,
            data: yourFeedback,
            message: "내가 조언자인 피드백 목록"
        }
        res.status(200).json(result);
    } catch (e) {
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

router.get('/your/:lastid/:limit', isLoggedIn, async (req, res, next) => {
    try {
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);
        console.log('yourFeedback 요청', lastid);
        const yourFeedback = await Feedback.findAll({
            where: { adviser_uid: req.user.user_uid, id: { [Op.lt]: lastid } },
            order: [['write_date', 'DESC']],
            limit,
        });
        let result = {
            success: true,
            data: yourFeedback,
            message: "내가 조언자인 피드백 목록"
        }
        res.status(200).json(result);
    } catch (e) {
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

router.put('/update/:feedback_id', isLoggedIn, async (req, res, next) => {
    try {
        const feedback_id = req.params.feedback_id;
        const { adviser, category, title, write_date } = req.body;
        console.log('feedback put 요청', adviser, category, title, write_date);
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
        let data = await Feedback.findOne({ where: { id: feedback_id } })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        res.status(200).json(result);
    } catch (e) {
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

router.patch('/adviser/:feedback_id', isLoggedIn, async (req, res, next) => {
    try {
        const feedback_id = req.params.feedback_id;
        const { adviser } = req.body;
        console.log('feedback adviser 수정', adviser);
        await Feedback.update({
            adviser_uid: adviser
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ where: { id: feedback_id } })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        res.status(200).json(result);
    } catch (e) {
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

router.patch('/category/:feedback_id', isLoggedIn, async (req, res, next) => {
    try {
        const feedback_id = req.params.feedback_id;
        const { category } = req.body;
        console.log('feedback category 수정', category);
        await Feedback.update({
            category: category
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ where: { id: feedback_id } })
        let result = {
            success: true,
            data: data,
            message: 'feedback update 성공'
        }
        res.status(200).json(result);
    } catch (e) {
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

router.patch('/title/:feedback_id', isLoggedIn, async (req, res, next) => {
    try {
        const feedback_id = req.params.feedback_id;
        const { title } = req.body;
        console.log('feedback title 수정', title);
        await Feedback.update({
            title
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ where: { id: feedback_id } })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        res.status(200).json(result);
    } catch (e) {
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

router.patch('/write_date/:feedback_id', isLoggedIn, async (req, res, next) => {
    try {
        const feedback_id = req.params.feedback_id;
        const { write_date } = req.body;
        console.log('feedback title 수정', write_date);
        await Feedback.update({
            write_date
        }, { where: { id: feedback_id } })
        const data = await Feedback.findOne({ where: { id: feedback_id } })
        let result = {
            success: true,
            data,
            message: 'feedback update 성공'
        }
        res.status(200).json(result);
    } catch (e) {
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

router.delete('/:feedback_id', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[DELETE] 피드백 삭제 요청');

        const user_uid = req.user.user_uid;
        const feedback_id = req.params.feedback_id;

        // 피드백 테이블에서 feedback_id로 uuid 검색
        // SELECT user_uid FROM feedbacks WHERE id=:feedback_id;
        await Feedback.findOne({
            attributes: ['user_uid', 'deletedAt'],
            where: {
                id: feedback_id
            }
        }).then(async(feedback) => {
            // 피드백 테이블 조회를 성공한 경우
            console.log('[DELETE] 피드백 테이블 조회 성공');
            console.log(feedback);

            if (feedback == null) {
                // 피드백 테이블에서 피드백 검색에 실패한 경우
                console.log('[DELETE] 피드백 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[DELETE] 피드백을 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 피드백 테이블에서 피드백 검색에 성공한 경우
                console.log('[DELETE] 피드백 검색 성공');

                if (user_uid != feedback.user_uid) {
                    // 본인이 작성한 피드백이 아닌 경우

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[DELETE] 내가 작성한 피드백이 아닙니다.';
                    console.log(result);
                    return res.status(200).send(result);
                } else {
                    // 본인이 작성한 피드백인 경우
                    // 이 피드백에 속한 게시물의 파일 검색
                    let deleteItems = [];
                    await Board.findAll({
                        attributes:['id','board_file1', 'board_file2', 'board_file3'],
                        where:{fk_feedbackId: feedback_id}
                    }).then(boards=>{
                        console.log("board ="+ boards);
                        // 삭제할 파일 목록 배열에 저장
                        boards.forEach(element=>{
                            if(element.board_file1){
                                deleteItems.push({ Key: element.board_file1 })
                            }
                            if(element.board_file2){
                                deleteItems.push({ Key: element.board_file2 })
                            }
                            if(element.board_file3){
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
                        console.log('[DELETE] 피드백 삭제 성공');
                        // 친구 차단 목록을 그대로 리턴
                        const result = new Object();
                        result.success = true;
                        result.data = feedback_id;
                        result.message = '[DELETE] 성공적으로 피드백을 삭제했습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 삭제 쿼리 실행을 실패한 경우
                        console.log('[DELETE] 피드백 삭제 쿼리 실행 실패', error);

                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[DELETE] 피드백 삭제 실행 과정에서 에러가 발생하였습니다.';
                        console.log(result);
                        return res.status(500).send(result);
                    });
                }
            }
        }).catch(error => {
            // 피드백 테이블 조회를 실패한 경우
            console.log('[DELETE] 피드백 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[DELETE] 피드백 조회 과정에서 에러가 발생하였습니다.';
            console.log(result);
            return res.status(500).send(result);
        });
    } catch (e) {
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
