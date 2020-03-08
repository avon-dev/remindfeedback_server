const requestIp = require("request-ip")
const winston = require("../config/winston")

// inside middleware handler
exports.clientIp = (req, res, next) => {
  req.clientIp = requestIp.getClientIp(req)
  next()
}

exports.isLoggedIn = (req, res, next) => {
  // console.log('쿠키다쿠키',req.cookies)
  console.log("로그인 여부", req.isAuthenticated())
  if (req.isAuthenticated()) {
    winston.log("info", `[isLoggedIn][${req.clientIp}|${req.body.email}] 로그인 중`)
    next()
  } else {
    let result = {
      success: false,
      data: "",
      message: "로그인 요망"
    }
    winston.log("info", `[isLoggedIn][${req.clientIp}|${req.body.email}] ${result.message}`)
    res.status(200).send(result)
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  console.log("로그인 여부", req.isAuthenticated())
  if (!req.isAuthenticated()) {
    winston.log("info", `[isLoggedIn][${req.clientIp}|${req.body.email}] 로그아웃 상태`)
    next()
  } else {
    let result = {
      success: false,
      data: "",
      message: "로그아웃 요망"
    }
    winston.log("info", `[isNotLoggedIn][${req.clientIp}|${req.body.email}] ${result.message}`)
    res.status(200).send(result)
  }
}
