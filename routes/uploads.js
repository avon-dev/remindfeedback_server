const multer = require('multer');
const path = require('path');
const fs = require('fs');

let result = {
    success: true,
    data: 'NONE',
    message: ""
}

// multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
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
                console.log(filename);
                if(err) return console.log(err);
                console.log(`${filename} 파일 삭제 완료`);
            })
         }
        });
};