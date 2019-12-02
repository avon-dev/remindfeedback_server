const express = require('express');
const bcrypt = require('bcrypt');
const { User, Feedback } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();

/* Sign Up API
 * - parameter adviser_uid
 * - parameter category
 * - parameter title
 * - parameter write_date
 */
router.post('/create', isLoggedIn, async (req, res, next) => {
    try{
        const { adviser, category, title, write_date} = req.body;
        console.log('피드백 생성', adviser, category, title, write_date);
        let findCat;
        if(category){
            findCat= '';
        }else{
            //res.status(400).json( {msg: '주제를 설정해주세요'});
        }

        const exFeedback = await Feedback.create({
            user_uid: req.user.user_uid,
            adviser_uid: adviser,
            category: findCat,
            title,
            write_date,
        });
        if(exFeedback) {
            const myFeedback = await Feedback.findAll({
                where: {user_uid: req.user.user_uid},
                order: [['write_date', 'DESC']]
            })
            res.status(201).json(myFeedback);
        }else {
            return res.status(201).json( {msg:'피드백이 생성되지 않았습니다.'});
        }

    } catch(e){
        console.error(e);
        return next(e);
    }
});

/* getfeedback API
 */
router.get('/all', isLoggedIn, async (req, res, next) => {
    try{
        let feedbackList = {
            myFeedback: '',
            yourFeedback: '',
        }
        feedbackList.myFeedback = await Feedback.findAll({
            where: {user_uid: req.user.user_uid},
            order: [['write_date', 'DESC']]
        })
        feedbackList.yourFeedback = await Feedback.findAll({
            where: {adviser_uid: req.user.user_uid},
            order: [['write_date', 'DESC']]
        })
        res.status(201).json(feedbackList);
    } catch(e){
        console.error(e);
        return next(e);
    }
});

router.get('/my', isLoggedIn, async (req, res, next) => {
    try{
        const myFeedback = await Feedback.findAll({
            where: {user_uid: req.user.user_uid},
            order: [['write_date', 'DESC']]
        });
        res.status(201).json(myFeedback);
    } catch(e){
        console.error(e);
        return next(e);
    }
});

router.get('/your', isLoggedIn, async (req, res, next) => {
    try{
        const yourFeedback = await Feedback.findAll({
            where: {adviser_uid: req.user.user_uid},
            order: [['write_date', 'DESC']]
        });
        res.status(201).json(yourFeedback);
    } catch(e){
        console.error(e);
        return next(e);
    }
});


module.exports = router;
