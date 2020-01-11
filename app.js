var cluster = require('cluster');
var os = require('os');
var uuid = require('uuid');
// const port = 3000;
//키생성 - 서버 확인용
var instance_id = uuid.v4();

// 워커 생성

var cpuCount = os.cpus().length; //CPU 수
var workerCount = cpuCount / 2; //2개의 컨테이너에 돌릴 예정 CPU수 / 2

//마스터일 경우
if (cluster.isMaster) {
  console.log('서버 ID : ' + instance_id);
  console.log('서버 CPU 수 : ' + cpuCount);
  console.log('생성할 워커 수 : ' + workerCount);
  console.log(workerCount + '개의 워커가 생성됩니다\n');

  //워커 메시지 리스너
  var workerMsgListener = function (msg) {
    var worker_id = msg.worker_id;

    //마스터 아이디 요청
    if (msg.cmd === 'MASTER_ID') {
      cluster.workers[worker_id].send({ cmd: 'MASTER_ID', master_id: instance_id });
    }
  }

  //CPU 수 만큼 워커 생성
  for (var i = 0; i < workerCount; i++) {
    console.log("워커 생성 [" + (i + 1) + "/" + workerCount + "]");
    var worker = cluster.fork();

    //워커의 요청메시지 리스너
    worker.on('message', workerMsgListener);
  }

  //워커가 online상태가 되었을때
  cluster.on('online', function (worker) {
    console.log('워커 온라인 - 워커 ID : [' + worker.process.pid + ']');
  });

  //워커가 죽었을 경우 다시 살림
  cluster.on('exit', function (worker) {
    console.log('워커 사망 - 사망한 워커 ID : [' + worker.process.pid + ']');
    console.log('다른 워커를 생성합니다.');

    var worker = cluster.fork();
    //워커의 요청메시지 리스너
    worker.on('message', workerMsgListener);
  });

  //워커일 경우
} else if (cluster.isWorker) {
  var createError = require('http-errors');
  var express = require('express');
  var path = require('path');
  var cookieParser = require('cookie-parser');
  var morgan = require('morgan');

  // 마스터, 워커 ID 설정
  var worker_id = cluster.worker.id;
  var master_id;

   //마스터에게 master_id 요청
   process.send({worker_id: worker_id, cmd:'MASTER_ID'});
   process.on('message', function (msg){
       if (msg.cmd === 'MASTER_ID') {
           master_id = msg.master_id;
       }
   });

  const session = require('express-session');
  const flash = require('connect-flash');
  const passport = require('passport');
  const cors = require('cors');
  const hpp = require('hpp');
  const helmet = require('helmet');
  require('dotenv').config(); //.env 설정

  //router 객체 선언
  const authRouter = require('./routes/auth');
  const userRouter = require('./routes/users');
  const feedbackRouter = require('./routes/feedback');
  const categoryRouter = require('./routes/category');
  const boardRouter = require('./routes/board/all');
  const boardTextRouter = require('./routes/board/text');
  const boardPictureRouter = require('./routes/board/picture');
  const boardVideoRouter = require('./routes/board/video');
  const boardRecodeRouter = require('./routes/board/recode');
  const mypageRouter = require('./routes/mypage');
  const friendRouter = require('./routes/friend');
  const commentRouter = require('./routes/comment');

  const prod = process.env.NODE_ENV === 'production';

  const { sequelize } = require('./models');
  const passportConfig = require('./passport');
  const app = express();
  sequelize.sync();
  passportConfig(passport);

  app.set('port', process.env.PORT || 8000); //포트 설정

  if (prod) {
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({
      origin: true,
      credentials: true,
    }));
  } else {
    app.use(morgan('dev'));
    app.use(cors({
      origin: true,
      credentials: true,
    }));
  }

  app.use('/', express.static('public'));
  app.use('/mypage', express.static('public/uploads'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));
  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(flash()); //1회성 메세지
  app.use(passport.initialize()); //설정초기화 (미들웨어 연결)
  app.use(passport.session()); //로그인시 로컬로 로그인했을때 세션에 저장하는 역할
  app.get('/favicon.ico', (req, res) => {
    res.status(204);
  })
  app.get('/', (req, res) => { 
    res.send('remindfeedback 백엔드 정상 동작!');
  });
  
  // Worker 테스트 주소
  app.get('/worker', function (req, res) {
    res.send('안녕하세요 저는<br>['+master_id+']서버의<br>워커 ['+ cluster.worker.id+'] 입니다.');
  });
  app.get("/workerKiller", function (req, res) {
    cluster.worker.kill();
    res.send('워커킬러 호출됨');
  });
  
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/feedback', feedbackRouter);
  app.use('/category', categoryRouter);
  app.use('/board', boardRouter);
  app.use('/board/text', boardTextRouter);
  app.use('/board/picture', boardPictureRouter);
  app.use('/board/video', boardVideoRouter);
  app.use('/board/recode', boardRecodeRouter);
  app.use('/mypage', mypageRouter);
  app.use('/friend', friendRouter);
  app.use('/comment', commentRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  app.listen(prod ? app.get('port') : 8000, () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
  });

  module.exports = app;
}