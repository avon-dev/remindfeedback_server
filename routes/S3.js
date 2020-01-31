const winston = require('../config/winston');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
    //서울리전
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

exports.upload_s3_test = (type, fileSize) => multer({ //멀터를 사용하면 upload 객체를 받을 수 있다.
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'remindfeedback',
        key(req, file, cb) {
            cb(null, `${type}/${+new Date()}${path.basename(file.originalname)}`); //picture 폴더의 시간+파일이름
        }
    }),
    limits: { fileSize: fileSize }, //파일 사이즈 (5mb)
});

exports.deleteS3Obj = (deleteItems) => {
    console.log(deleteItems);
    const s3 = new AWS.S3();
    deleteItems.forEach(element => { //삭제 리스트 받아서 하나씩 검사
        let params = {
            Bucket: "remindfeedback",
            Key: element.Key
        };
        let filename = element.Key; // 삭제할 파일 이름
        s3.headObject(params, (err, data) => {
            if (err) {
                return winston.log('error', `[S3] 파일 찾기 오류 \n ${err.stack}`);
            }
            winston.log('info', `[S3] 파일 있음: ${filename}`);
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    winston.log('error', `[S3] 파일 삭제 오류 \n ${err.stack}`);
                }
                winston.log('info', `[S3] 파일 삭제 완료: ${filename}`);
            });
        });
    });
};

// 로컬 디스크 관련
// multer 설정 (디스크)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.basename(file.originalname))
    },
    limits: { //크기 제한
        fileSize: 50 * 1024 * 1024 // 테스트를 위해 5mb로 상향 조정
    },
});

// single image upload multer 객체
exports.upload = multer({ storage: storage });

exports.fileDelete = (filename) => {
    fs.exists(`public/uploads/${filename}`, function (exists) { //파일 있는지 확인
        console.log(exists ? "파일 있음" : "파일 없음");
        if (exists) { // 파일 있으면 삭제
            fs.unlink(`public/uploads/${filename}`, (err) => {
                if (err) {
                    return winston.log('error', `[S3] 파일 삭제 오류 \n ${err.stack}`);
                }
                winston.log('info', `[S3] 파일 삭제 완료: ${filename}`);
            })
        }
    });
};