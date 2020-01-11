//friend 테이블 정보 담기
/*
[0] : A가 B에게 친구요청을 했으나 B가 거절한 경우
[1] : A가 B에게 친구요청을 보낸 경우
[2] : A와 B가 친구인 경우
[3] : A가 B를 차단한 경우
[4] : B가 A를 차단한 경우
[5] : A와 B가 서로를 차단한 경우
*/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('friend', {
        user_uid: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        friend_uid: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        type: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);