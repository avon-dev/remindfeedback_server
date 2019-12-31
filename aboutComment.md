## About Comment

  <_댓글 조회, 생성, 수정, 삭제_>
  * **전제**
  로그인 후 쿠키 정보를 이용한 인증 필요

* **API call:**
  http://localhost:8000/comment<br>
  http://54.180.118.35/comment

* **Sample JSON data:**
  ```json
  {
      "success": true,
      "data": [
          {
              "id": 3,
              "comment_content": "3333-111",
              "confirm": false,
              "createdAt": "2019-12-31T07:07:06.000Z",
              "updatedAt": "2019-12-31T07:07:06.000Z",
              "deletedAt": null,
              "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
              "fk_board_id": 3,
              "user": {
                  "nickname": "marge_222",
                  "portrait": "1576479564662round_logo_512px_dark.png"
              }
          },
          {
              "id": 4,
              "comment_content": "3333-222",
              "confirm": false,
              "createdAt": "2019-12-31T07:07:24.000Z",
              "updatedAt": "2019-12-31T07:07:24.000Z",
              "deletedAt": null,
              "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
              "fk_board_id": 3,
              "user": {
                  "nickname": "marge_222",
                  "portrait": "1576479564662round_logo_512px_dark.png"
              }
          }
      ],
      "message": "해당 게시물의 전체 댓글 조회 성공"
  }
  ```
  * `success=[boolean]` 요청 성공 여부 null[x]
  * `data=[string]` 요청한 정보 null[o]
    - `email=[string]` 유저 이메일, 고유값, null[x]
    - `nickname=[string]` 유저 닉네임(이름), null[x]
    - `portrait=[string]` 프로필 사진 이름, null[o]
    - `introduction=[string]` 유저 소개글, null[o]
  * `message=[string]` 요청 성공 혹은 실패에 대한 세부 내용, null[x]
  <!--회원정보 JSON 형태 + 변수 설명 -->


----

**Create Comment**
----
게시물에 댓글 생성.
Create a comment to a single post.

* **URL**

  http://54.180.118.35/comment/create

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    
    * `board_id=[integer]` 게시물 번호(ID)
    * `comment_content=[string]` 댓글 내용

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 
    **Content:** 사용자가 생성한 댓글 객체 반환
 <br />

* **Sample request JSON data:**
  ```json
  {
      "success": true,
      "data": {
          "confirm": false,
          "id": 6,
          "fk_board_id": "3",
          "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
          "comment_content": "3333-4444",
          "updatedAt": "2019-12-31T12:32:20.722Z",
          "createdAt": "2019-12-31T12:32:20.722Z"
      },
      "message": "댓글 생성 완료"
  }
  ```

---
**Show all comments of a single post**
----
게시물 하나의 모든 댓글 보기. 댓글 객체 정보 + user의 nickname, portrait 정보 반환함. data 안 user 속성으로 접근할 수 있음.
Show all comments of a single post. Return full data of the comments and user's nickname, portrait.

* **URL**

  http://54.180.118.35/comment/board_id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
   * `board_id=[integer]` 게시물 번호(ID)
 
   None

* **Data Params**

    **Required:**

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200
    **Content:** 해당 게시물의 모든 댓글 불러오기
 <br />

* **Sample request JSON data:**
  ```json
  {
      "success": true,
      "data": [
          {
              "id": 3,
              "comment_content": "3333-111",
              "confirm": false,
              "createdAt": "2019-12-31T07:07:06.000Z",
              "updatedAt": "2019-12-31T07:07:06.000Z",
              "deletedAt": null,
              "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
              "fk_board_id": 3,
              "user": {
                  "nickname": "marge_222",
                  "portrait": "1576479564662round_logo_512px_dark.png"
              }
          },
          {
              "id": 4,
              "comment_content": "3333-222",
              "confirm": false,
              "createdAt": "2019-12-31T07:07:24.000Z",
              "updatedAt": "2019-12-31T07:07:24.000Z",
              "deletedAt": null,
              "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
              "fk_board_id": 3,
              "user": {
                  "nickname": "marge_222",
                  "portrait": "1576479564662round_logo_512px_dark.png"
              }
          },
          {
              "id": 5,
              "comment_content": "3333-333",
              "confirm": false,
              "createdAt": "2019-12-31T07:07:28.000Z",
              "updatedAt": "2019-12-31T07:07:28.000Z",
              "deletedAt": null,
              "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
              "fk_board_id": 3,
              "user": {
                  "nickname": "marge_222",
                  "portrait": "1576479564662round_logo_512px_dark.png"
              }
          }
      ],
      "message": "해당 게시물의 전체 댓글 조회 성공"
  }
  ```