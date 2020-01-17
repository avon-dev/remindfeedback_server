//feedback 테이블 정보 담기
/*complete
[-1] : 피드백 상태가 아무것도 아님
[0] : 피드백 완료 요청 거절 상태
[1] : 피드백 완료 요청 상태
[2] : 피드백 완료 수락 상태
*/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('feedback', {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        adviser_uid: {
            type: DataTypes.STRING,
            allowNull: true,
        }, 
        category: {
            type: DataTypes.INTEGER, 
            allowNull: true,
        }, 
        title: {
            type: DataTypes.STRING(100),
            allowNull: true,
        }, 
        write_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        complete: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1,
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