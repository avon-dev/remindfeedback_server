"use strict"

const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || "development"
const config = require(__dirname + "/../config/config.json")[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  console.log("1111111111111111111번을 탔구나")
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  console.log("2222222222222222222번을 탔구나")
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file))
    db[model.name] = model
  })

//TABLE 객체선언
db.User = require("./user")(sequelize, Sequelize)
db.Feedback = require("./feedback")(sequelize, Sequelize)
db.Board = require("./board")(sequelize, Sequelize)
db.Comment = require("./comment")(sequelize, Sequelize)
db.Friend = require("./friend")(sequelize, Sequelize)
db.Auth = require("./auth")(sequelize, Sequelize)

//TABLE 관계 맺기
db.Feedback.hasMany(db.Board, {
  foreignKey: "fk_feedbackId",
  sourceKey: "id",
  onDelete: "CASCADE"
})
db.Board.belongsTo(db.Feedback, {
  foreignKey: "fk_feedbackId",
  targetKey: "id",
  onDelete: "CASCADE"
})
db.User.hasMany(db.Comment, {
  foreignKey: "fk_user_uid",
  sourceKey: "user_uid",
  onDelete: "CASCADE"
})
db.Comment.belongsTo(db.User, {
  foreignKey: "fk_user_uid",
  sourceKey: "user_uid"
})
db.Board.hasMany(db.Comment, {
  foreignKey: "fk_board_id",
  sourceKey: "id",
  onDelete: "CASCADE"
})
db.Comment.belongsTo(db.Board, {
  foreignKey: "fk_board_id",
  sourceKey: "id"
})
db.User.hasMany(db.Friend, {
  foreignKey: "fk_friendId",
  targetKey: "id",
  onDelete: "CASCADE"
})

//feedback 호출시 조언자 및 작성자 정보 반환 위한 관계
db.Feedback.belongsTo(db.User, {
  foreignKey: "adviser_uid",
  sourceKey: "user_uid",
  as: "adviser",
  constraints: false
})
db.Feedback.belongsTo(db.User, {
  foreignKey: "user_uid",
  sourceKey: "user_uid",
  as: "owner",
  constraints: false
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
