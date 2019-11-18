//user 테이블 정보 담기
module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        user_uid: {
            type: DataTypes.STRING(255),
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
            type: DataTypes.STRING(255),
            allowNull: true, //카카오일시 필수가 아니어도되니 false
        }, 
        portrait: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        introduction: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);