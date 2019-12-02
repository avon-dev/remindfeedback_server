//user 테이블 정보 담기
const defaultObject = new Object(); // 새로운 Object
const defaultArray = new Array(); // 새로운 Array
defaultObject.category_id = 0;
defaultObject.category_title = "Default";
defaultObject.category_color = "#000000";
defaultArray.push(defaultObject);
const stringifyCategory = JSON.stringify(defaultArray);

module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        }, 
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        }, 
        nickname: {
            type: DataTypes.STRING(20), 
            allowNull: true,
        }, 
        password: {
            type: DataTypes.STRING,
            allowNull: true, //카카오일시 필수가 아니어도되니 false
        }, 
        category: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: stringifyCategory,
        },
        portrait: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        introduction: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        tutorial: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);