var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
require('dotenv').config(); //.env 설정

//router 객체 선언
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');

const prod = process.env.NODE_ENV === 'production';

const { sequelize } = require('./models');
const app = express();
sequelize.sync();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8000); //포트 설정


// parse JSON and url-encoded query
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
  next();
});

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

app.get('/', (req, res) => {
  res.send('remindfeedback 백엔드 정상 동작!');
});
app.use('/auth', authRouter);
app.use('/users', userRouter);

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
