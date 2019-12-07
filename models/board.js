//board 테이블 정보 담기
module.exports = (sequelize, DataTypes) => (
    sequelize.define('board', {
        board_category: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }, 
        board_title: {
            type: DataTypes.STRING(100), 
            allowNull: true,
        }, 
        board_content: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        board_file: {
            type: DataTypes.STRING,
            allowNull: true
        },      
        confirm: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);