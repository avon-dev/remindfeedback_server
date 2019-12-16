const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

let result = {
    success: true,
    data: 'NONE',
    message: ""
}

AWS.config.update({
    //서울리전
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

// multer_S3 설정 
exports.upload_s3 = multer({ //멀터를 사용하면 upload 객체를 받을 수 있다.
    storage: multerS3({ 
        s3: new AWS.S3(),
        bucket: 'remindfeedback',
        key(req, file, cb) {
            cb(null, `portrait/${+new Date()}${path.basename(file.originalname)}`); //picture 폴더의 시간+파일이름
        }
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, //파일 사이즈 (5mb)
});
// multer_S3 설정 

// multer 설정 (디스크)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.basename(file.originalname))
    },
    limits: { //크기 제한
        fileSize: 50*1024*1024 // 테스트를 위해 5mb로 상향 조정
    },
  });
  
// single image upload multer 객체
exports.upload = multer({ storage: storage });

exports.fileDelete = (filename)=>{
    fs.exists(`public/uploads/${filename}`, function (exists) { //파일 있는지 확인
         console.log(exists ? "파일 있음" : "파일 없음");
         if(exists){ // 파일 있으면 삭제
            fs.unlink(`public/uploads/${filename}`, (err)=>{
                if(err) return console.log(err);
                console.log(`${filename} 파일 삭제 완료`);
            })
         }
        });
};

exports.deleteS3Obj = (key)=>{
    const params = {
        Bucket: "remindfeedback",
        Key: key
    };
    const s3 = new AWS.S3();
    // try{
    //     await s3.headObject(params).promise()
    //     console.log("파일 있음")
    //     try{
    //         await s3.deleteObject(params).promise()
    //         console.log("파일 삭제 완료")
    //     }catch(e){
    //         console.log(`파일 삭제 오류: ${err}`)
    //     }
    // }catch(e){
    //     console.log(`파일 없음`)
    // }
    s3.headObject(params, (err, data)=>{
        if(err) { 
            console.log(`파일 찾기 오류: ${err}`);
            result.success = false;
            result.message = `파일 찾기 오류: ${err}`
            res.status(403).json(result);
        }
        console.log("파일 있음");
        s3.deleteObject(params, (err, data)=>{
            if(err) { 
                console.log(`파일 삭제 오류: ${err}`);
            }
            console.log("파일 삭제 완료")
        });
    });
};