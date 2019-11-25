const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const util = require('../util');
const jwt = require('jsonwebtoken');

const router = express.Router();

/* Sign Up API
 * - parameter email
 * - parameter nickname
 * - parameter password
 */
router.post('/signup', async (req, res, next) => {
    try{
        const { email, password, nickname} = req.body;
        console.log('회원가입 요청', email, password, nickname);

        const exUser = await User.findOne({where: { email } });
        if(exUser) {
            return res.status(201).json( {msg:'이미 가입된 이메일 입니다.'});
        }
        const uid = await bcrypt.hash(email, 12);
        const pw = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            user_uid: uid,
            email,
            nickname,
            password: pw,
            portrait: '',
            introduction: ''
        })
    
        // let text = {password,pw}
        console.log('newUser',newUser.nickname);
        res.status(201).json({newUser});
    } catch(e){
        console.error(e);
        return next(e);
    }
});

router.post('/login', async (req, res, next) => {
    try{
        const { email, password } = req.body;

        let isValid = true;
        let validationError = {
            name:'ValidationError',
            errors:{}
        };
        if(!email){
            console.log('email 탐');
            isValid = false;
            validationError.errors.email = {"message":'email is required!'};
        }
        if(!password){
            console.log('password 탐');
            isValid = false;
            validationError.errors.password = {"message":'Password is required!'};
        }

        if(!isValid) return res.status(201).json(util.successFalse(validationError));
        else next();


    } catch(e){
        console.error(e);
        return next(e);
    }
}, async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const exUser = await User.findOne({where: { email:email } })
        console.log('exUser', exUser.nickname)
        const pass = await bcrypt.compare(password, exUser.password);
        if(exUser && pass){
            let payload = { 
                email : exUser.email
            };
            const secretOrPrivateKey = process.env.JWT_SECRET;
            let resToken = {
                accessToken:'',
                refreshToken:'',
            };
            let refreshOptions = {expiresIn: 60*60*24*14};
            let accessOptions = {expiresIn: 60*60};
            await jwt.sign(payload, secretOrPrivateKey, refreshOptions, (err, token) => {
                if(err) return res.json(util.successFalse(err));
                resToken.refreshToken = util.successTrue(token);
                console.log('refresh 생성')

                jwt.sign(payload, secretOrPrivateKey, accessOptions, (err, token) => {
                    if(err) return res.json(util.successFalse(err));
                    resToken.accessToken = util.successTrue(token);
                    res.header('x-access-token', token);
                    console.log('access 생성');
                    res.status(201).json(resToken);
                });
            });
            
        }else{
            return res.status(201).json(util.successFalse(null, '이메일과 비밀번호를 확인해주세요'))
        }
    } catch(e){
        console.error(e);
        return next(e);
    }
});

router.get('/me', util.isLoggedin, async (req,res,next) => {
    try{
        console.log('me탐', req.decoded.email)
        const user = await User.findOne({where: {email: req.decoded.email}})
        if (user) {
            res.json(util.successTrue(user)), console.log('me성공');
        } else{
            return res.status(200).json(util.successFalse(null, '유저정보가 없습니다')), console.error('me에러')
        }
    } catch(e){
        console.error(e);
        return next(e);
    }
    
  }
);

// refresh
router.get('/refresh', util.isLoggedin, async (req,res,next) => {
    try{
        console.log('refresh탐')
        const user = await User.findOne({where: {email: req.decoded.email}})
        if(user) {
            let payload = {
                email: user.email
            };
            const secretOrPrivateKey = process.env.JWT_SECRET;
            const options = {expiresIn: 60*60};
            jwt.sign(payload, secretOrPrivateKey, options,  (err, token) => {
                if(err) return res.json(util.successFalse(err));
                else res.json(util.successTrue(token));
            });
        }else{
            return res.status(200).json(util.successFalse(null,'유저정보가 없습니다'));
        }
    }catch(e){
        console.error(e);
        return next(e);
    }
    
  }
);

module.exports = router;
