const express = require('express');
const { Feedback, Board, Sequelize: { Op } } = require('../../models');
const { isLoggedIn } = require('../middlewares');
const router = express.Router();
const { deleteS3Obj, upload_s3_test } = require('../S3');

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

router.get('/selectone/:board_id', async (req, res, next) => {
    let board_id = parseInt(req.params.board_id);
    let result = {
        success: true,
        data: '',
        message: ""
    }
    try {
        const exBoard = await Board.findAll({
            where: { id: board_id },
            include: [{
                model: Feedback,
                attributes: ['user_uid', 'adviser_uid']
            }]
        }).then(board => {
            result.data = board;
            return res.status(200).json(result);
        })

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
})

/* getfeedback API
 */
router.get('/:feedbackid/:lastid', isLoggedIn, async (req, res, next) => {
    try {
        let feedbackid = parseInt(req.params.feedbackid);
        let lastid = parseInt(req.params.lastid);
        if (lastid === 0) {
            lastid = 9999;
        }
        console.log('AllBoard 요청', lastid);
        let boardList;

        boardList = await Board.findAll({
            where: { id: { [Op.lt]: lastid }, fk_feedbackId: feedbackid },
            order: [['id', 'DESC']],
            limit: 10,
        })

        let result = {
            success: true,
            data: boardList,
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

router.get('/:feedbackid/:lastid/:limit', isLoggedIn, async (req, res, next) => {
    try {
        let feedbackid = parseInt(req.params.feedbackid);
        let lastid = parseInt(req.params.lastid);
        let limit = parseInt(req.params.limit);
        if (lastid === 0) {
            lastid = 9999;
        }
        console.log('AllBoard 요청', lastid);
        let boardList;

        boardList = await Board.findAll({
            where: { id: { [Op.lt]: lastid }, fk_feedbackId: feedbackid },
            order: [['id', 'DESC']],
            limit,
        })

        let result = {
            success: true,
            data: boardList,
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

router.delete('/:board_id', isLoggedIn, async (req, res, next) => {
    try {
        console.log('[DELETE] 게시글 삭제 요청');

        const user_uid = req.user.user_uid;
        let board_id = parseInt(req.params.board_id);

        // 게시글 테이블에서 board_id로 검색
        await Board.findOne({
            where: {
                id: board_id
            },
            include: [{
                model:Feedback,
                attributes: ['user_uid']
            }]
        }).then((board) => {
            // 게시글 테이블 조회를 성공한 경우
            console.log('[DELETE] 게시글 테이블 조회 성공');

            if (board == null) {
                // 게시글 테이블에서 게시글 검색에 실패한 경우
                console.log('[DELETE] 게시글 검색 실패');

                const result = new Object();
                result.success = false;
                result.data = 'NONE';
                result.message = '[DELETE] 게시글을 찾을 수 없습니다.';
                console.log(result);
                return res.status(200).send(result);
            } else {
                // 게시글 테이블에서 게시글 검색에 성공한 경우
                console.log('[DELETE] 게시글 검색 성공');

                if (user_uid != board.feedback.user_uid) {
                    // 본인이 작성한 게시글이 아닌 경우

                    const result = new Object();
                    result.success = false;
                    result.data = 'NONE';
                    result.message = '[DELETE] 내가 작성한 게시글이 아닙니다.';
                    console.log(result);
                    return res.status(200).send(result);
                } else {
                    // 본인이 작성한 게시글인 경우
                    // 삭제할 파일 목록 배열에 저장
                    let deleteItems = [];

                    if (board.board_file1) {
                        deleteItems.push({ Key: board.board_file1 })
                    }
                    if (board.board_file2) {
                        deleteItems.push({ Key: board.board_file2 })
                    }
                    if (board.board_file3) {
                        deleteItems.push({ Key: board.board_file3 })
                    }
                    // 삭제 목록 배열 전달 -> S3에서 파일 삭제
                    deleteS3Obj(deleteItems);

                    let query_update =
                        'UPDATE comments SET deletedAt=NOW() WHERE fk_board_id=:board_id; ' +
                        'UPDATE boards SET deletedAt=NOW() WHERE board_id=:board_id';

                    // DB에서 게시글 삭제
                    sequelize.query(query_update, {
                        replacements: {
                            board_id: board_id
                        },
                        type: Sequelize.QueryTypes.update,
                        raw: true
                    }).then(() => {
                        // 정상적으로 게시글 삭제 쿼리를 수행한 경우
                        console.log('[DELETE] 게시글 삭제 성공');
            
                        // 친구 차단 목록을 그대로 리턴
                        const result = new Object();
                        result.success = true;
                        result.data = board_id;
                        result.message = '[DELETE] 성공적으로 게시글을 삭제했습니다.';
                        console.log(result);
                        return res.status(200).send(result);
                    }).catch(error => {
                        // 삭제 쿼리 실행을 실패한 경우
                        console.log('[DELETE] 게시글 삭제 쿼리 실행 실패', error);
            
                        const result = new Object();
                        result.success = false;
                        result.data = 'NONE';
                        result.message = '[DELETE] 게시글 삭제 실행 과정에서 에러가 발생하였습니다.';
                        console.log(result);
                        return res.status(500).send(result);
                    });
                }
            }
        }).catch(error => {
            // 게시글 테이블 조회를 실패한 경우
            console.log('[DELETE] 게시글 테이블 조회 실패', error);

            const result = new Object();
            result.success = false;
            result.data = 'NONE';
            result.message = '[DELETE] 게시글 조회 과정에서 에러가 발생하였습니다.';
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

router.patch('/board_title/:board_id', isLoggedIn, async (req, res, next) => {
    try {
        const board_id = req.params.board_id;
        const { board_title } = req.body;
        console.log('board board_title 수정', board_title);
        const update = await Board.update({
            board_title
        }, { where: { id: board_id } })
        const data = await Board.findOne({ where: { id: board_id } })
        let result = {
            success: true,
            data,
            message: 'board update 성공'
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

router.patch('/board_content/:board_id', isLoggedIn, async (req, res, next) => {
    try {
        const board_id = req.params.board_id;
        const { board_content } = req.body;
        console.log('board board_content 수정', board_content);
        const update = await Board.update({
            board_content
        }, { where: { id: board_id } })
        const data = await Board.findOne({ where: { id: board_id } })
        let result = {
            success: true,
            data,
            message: 'board update 성공'
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


module.exports = router;
