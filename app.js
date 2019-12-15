var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

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
const mypageRouter = require('./routes/mypage');

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
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/feedback', feedbackRouter);
app.use('/category', categoryRouter);
app.use('/board', boardRouter);
app.use('/board/text', boardTextRouter);
app.use('/board/picture', boardPictureRouter);
app.use('/mypage', mypageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
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
