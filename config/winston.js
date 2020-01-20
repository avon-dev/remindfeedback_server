const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const fs = require('fs');

const env = process.env.NODE_ENV || "development";
const { combine, timestamp, label, printf } = format;

// Log 출력 포맷 지정
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logDir = 'log';
const DATE = moment().format("YYYY-MM-DD");

// log 폴더가 없으면 만듦
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const transport_file = new transports.File({
    name: 'info-file',
    filename: `${logDir}/${DATE}_server-test.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    colorize: false,
    level: env === "development" ? "debug" : "info",
    showLevel: true,
    json: false,
    timestamp: timestamp(),
    format: combine(
        label({ label: 'server-test' }),
        timestamp(),
        myFormat
    ),
    maxsize: 200000, // 단위는 바이트
    maxFiles: 100 // 자동으로 분리되어 생성되는 파일 개수
});

const transport_console = new (transports.Console)({
    name: 'debug-console',
    colorize: true,
    level: 'debug',
    showLevel: true,
    json: false,
    format: combine(
        label({ label: 'server-test' }),
        timestamp(),
        myFormat
    )
});

// Logger : 로그를 출력하는 객체
// transports : 여러 개의 설정 전보를 전달하는 속성
let logger = new createLogger({
    transports: [
        transport_file,
        transport_console
    ]
});

module.exports = logger;