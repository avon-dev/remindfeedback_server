//notice 테이블 정보 담기
module.exports = (sequelize, DataTypes) => (
    sequelize.define('notice', {
        sender_uid: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        type: {
            type: DataTypes.STRING, 
            allowNull: true,
        }, 
        data: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        receiver_uid: {
            type: DataTypes.STRING,
            allowNull: true
        },  
        read_date: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);