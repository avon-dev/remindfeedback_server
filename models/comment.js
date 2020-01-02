//Coment 테이블 정보 담기
module.exports = (sequelize, DataTypes) => (
    sequelize.define('comment', {
        comment_content: { // 댓글 내용
            type: DataTypes.TEXT,
            allowNull: false, // 댓글은 내용 하나만 있으니 null 비허용
        },  
        confirm: { // 글 작성자가 확인했는지 여부(?)
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: true, //생성일, 수정일 기록
        paranoid: true, //삭제일기록(복구용)
    })
);
