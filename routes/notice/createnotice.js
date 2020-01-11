
const { Notice, User } = require('../../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

function finduser(uid) {
    return User.findOne({where: {user_uid:user.user_uid}})
    
}

exports.friendNotice = async(req, res, next, id) => {
    try{
        const exNotice = await Notice.create({
            sender_uid: req.user.user_uid,
            type: '1.1',
            data: '',
            receiver_uid: '',
            read_date: '',
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};


exports.friendNotice = async(req, res, next) => {
    try{
        let result = {
            success: true,
            data: '',
            message: ' 생성 완료',
        }
        const exNotice = await Notice.create({
            sender_uid: req.user.user_uid,
            
        })
    }catch(e){
        let result = {
            success: false,
            data: '',
            message: e
        }
        res.status(500).json(result);
        console.error(e);
        return next(e);
    }
};
