const express = require('express');
const bcrypt = require('bcrypt');
const { User, Feedback, Board, Sequelize: { Op } } = require('../../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares'); 
const router = express.Router();


/* getfeedback API
 */
router.get('/all/:lastid', isLoggedIn, async (req, res, next) => {
    try{
        let lastid = parseInt(req.params.lastid);
        if(lastid === 0){
            lastid = 9999;
        }
        console.log('AllBoard 요청', lastid);
        let boardList;
        
        boardList = await Board.findAll({
            where: {id: { [Op.lt]:lastid}},
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


module.exports = router;
