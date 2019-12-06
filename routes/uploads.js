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
        fileSize: 5*1024*1024
    },
  });
  
// single image upload multer 객체
const upload = multer({ storage: storage });
 
module.exports = upload;