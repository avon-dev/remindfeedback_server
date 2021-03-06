## About Comment

  <_댓글 조회, 생성, 수정, 삭제_>
  * **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/comments
    http://54.180.118.35/comments
    ```
  *주소 변경됨: `/comment`->`/comments`*


----
**Create Comment**
----
게시물에 댓글 생성.
Create a comment to a single post.

* **URL**
  
  /
  >*주소 변경됨: `/comment/create` -> `/comments`*

* **Method:**

  `POST`
  
*  **URL Params**
    
    None

* **Data Params**
    * `board_id=[integer]` 게시물 번호(ID)
    * `comment_content=[string]` 댓글 내용

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    **Code:** 201 
    **Content:** 사용자 정보 및 사용자가 생성한 댓글 객체 반환<br/>

    * **Sample request JSON data:**
    ```json
    {
        "success": true,
        "data": {
            "user": {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test@naver.com",
                "nickname": "test",
                "portrait": "",
                "introduction": ""
            },
            "comment": {
                "confirm": false,
                "id": 40,
                "fk_board_id": 10,
                "fk_user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfdq",
                "comment_content": "content",
                "updatedAt": "2020-01-01T09:12:20.178Z",
                "createdAt": "2020-01-01T09:12:20.178Z"
            }
        },
        "message": "댓글 생성 완료"
    }
    ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 403 FORBIDDEN : 댓글 내용(comment_content)값이 비어있을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "댓글 생성 실패: 댓글 내용(comment_content)는 반드시 입력해야 합니다."
    }
    ```

  * **Code:** 401 UNAUTHORIZED : 게시물 작성자 혹은 조언자가 아닌 사람이 댓글 작성 시도할 때(권한 없음) <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "",
        "message": "댓글 작성 실패: 게시물 주인 및 조언자만 댓글을 작성할 수 있습니다."
    }
    ```

  * **Code:** 404 NOT FOUND : 존재하지 않는 게시물에 댓글 작성 시도할 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "",
        "message": "댓글 작성 실패: 존재하지 않는 게시물입니다."
    }
    ```
    </div>
    </details>  



---
**Show all comments of a single post with infinity scroll**
----
게시물 하나의 모든 댓글 보기(10개씩 가져옴). 댓글 객체 정보 + user의 nickname, portrait 정보 반환함. data 안 user 속성으로 접근할 수 있음.
Show all comments of a single post with infinity scroll. Return full data of the comments and user's email, nickname, portrait.

* **URL**

  /all/scroll/:board_id/:lastid/:sort
  > 변경됨: /comment/selectall/:board_id -> /comments/all/scroll/:board_id/:lastid/:sort
  

* **Method:**

  `GET`
  
*  **URL Params**

   * `board_id=[integer]` 게시물 번호(ID)
   * `lastid=[integer]` 마지막 (가장 아래의) 댓글 번호(ID)
        > 댓글은 최초 작성된 댓글이 가장 위에 오는 오름차순 정렬 -> lastid 보다 큰 것들을 불러옴
   * `sort=[integer]` 정렬방식. 0 = 오름차순(오래된 순), 1 = 내림차순(최신순)

* **Data Params**

    None

* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 200
        **Content:** 해당 게시물의 모든 댓글(10개씩) 불러오기<br/>

        * **Sample response JSON data:**

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
                        "email":"a",
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
                        "email":"a",
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
                        "email":"a",
                        "nickname": "marge_222",
                        "portrait": "1576479564662round_logo_512px_dark.png"
                    }
                }
            ],
            "message": "해당 게시물의 전체 댓글 조회 성공",
            "sort": "ASCENDING"
        }
        ```

      * **Code:** 200
        **Content:** 조회 요청했으나 댓글이 하나도 없을 때<br/>

        * **Sample request JSON data:**
        ```json
            {
                "success": true,
                "data": "",
                "message": "해당 게시물에 댓글이 없습니다."
            }
        ```

        **Content:** 조회 요청했으나 더 이상 불러올 댓글이 하나도 없을 때<br/>

        * **Sample request JSON data:**
        ```json
            {
                "success": true,
                "data": "",
                "message": "더 이상 불러올 댓글이 없습니다."
            }
        ```
    </div>
    </details>

    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 존재하지 않는 게시물의 댓글들을 조회하려고 할 때<br/>
        **Content:** 
        ```json
            {
                "success": false,
                "data": "",
                "message": "존재하지 않는 게시물의 댓글은 조회할 수 없습니다."
            }
        ```

    </div>
    </details>

---
**Show all comments of a single post with pages**
----
페이지로 게시물 하나의 모든 댓글 보기. 총 댓글 객체 수(result.count) + 댓글 객체 정보(result.data) + user의 email, nickname, portrait 정보 반환함. data 안 user 속성으로 접근할 수 있음.
Show all comments of a single post with pages. Return the number of total pages, full data of the comments and user's email, nickname, portrait.

* **URL**

  /all/page/:board_id/:page/:countPerPage
  >*변경됨: `/comment/selectall/:board_id` -> `/comments/all/page/:board_id/:page/:countPerPage`*
  

* **Method:**

  `GET`
  
*  **URL Params**

   * `board_id=[integer]` 게시물 번호(ID)
   * `page=[integer]` 페이지 번호
        > 페이지 0 이하면 1페이지로 간주하고 페이지 범위 초과 시 가장 마지막 페이지로 간주함
   * `countPerPage=[integer]` 한 페이지 당 보여 줄 객체 수
   * `sort=[integer]` 정렬방식. 0 = 오름차순(오래된 순), 1 = 내림차순(최신순)

* **Data Params**

    None

* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 200
        **Content:** 해당 게시물의 모든 댓글 및 총 페이지 수(count) 불러오기<br/>

        * **Sample response JSON data:**

        ```json
        {
            "success": true,
            "data": [
                {
                    "id": 10,
                    "comment_content": "test_by2",
                    "confirm": false,
                    "createdAt": "2020-02-05T09:18:41.000Z",
                    "updatedAt": "2020-02-05T09:18:41.000Z",
                    "deletedAt": null,
                    "fk_user_uid": "$2b$12$IeUzBAMlvYWhLeKUM0LgLeyeCQa2c/1mbyCWiI89e8DHxwpaU78Qa",
                    "fk_board_id": 15,
                    "user": {
                        "email": "1",
                        "nickname": "aa",
                        "portrait": ""
                    }
                },
                {
                    "id": 11,
                    "comment_content": "test_by2",
                    "confirm": false,
                    "createdAt": "2020-02-05T09:18:42.000Z",
                    "updatedAt": "2020-02-05T09:18:42.000Z",
                    "deletedAt": null,
                    "fk_user_uid": "$2b$12$IeUzBAMlvYWhLeKUM0LgLeyeCQa2c/1mbyCWiI89e8DHxwpaU78Qa",
                    "fk_board_id": 15,
                    "user": {
                        "email": "1",
                        "nickname": "aa",
                        "portrait": ""
                    }
                }
            ],
            "message": "해당 게시물의 전체 댓글 조회 성공",
            "count": 5,
            "sort": "ASCENDING"
        }
        ```

      * **Code:** 200
        **Content:** 조회 요청했으나 댓글이 하나도 없을 때<br/>

        * **Sample request JSON data:**
        ```json
            {
                "success": true,
                "data": "",
                "message": "해당 게시물에 댓글이 없습니다."
            }
        ```
    </div>
    </details>

    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 존재하지 않는 게시물의 댓글들을 조회하려고 할 때<br/>
        **Content:** 
        ```json
            {
                "success": false,
                "data": "",
                "message": "존재하지 않는 게시물의 댓글은 조회할 수 없습니다."
            }
        ```

    </div>
    </details>

    

---
**Show one comment.**
----
조회 요청한 댓글 객체를 json 형태로 반환.
Return full data of a single comment and user(commenter)'s nickname, portrait.

* **URL**

  /:comment_id
    >*주소 변경됨: `/comment/selectone/:comment_id` -> `/comments/:comment_id`*

* **Method:**

  `GET`
  
*  **URL Params**

   * `comment_id=[integer]` 댓글 번호(ID)

* **Data Params**

    None

    <!--필요한 form field 명시 + 설명-->

* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    **Code:** 200
    **Content:** 조회 요청한 댓글 객체 반환<br/>
    **Sample request JSON data:**
    ```json
        {
            "success": true,
            "data": {
                "id": 5,
                "comment_content": "3333-333",
                "confirm": false,
                "createdAt": "2019-12-31T07:07:28.000Z",
                "updatedAt": "2019-12-31T07:07:28.000Z",
                "deletedAt": null,
                "fk_user_uid": "$2b$12$RCxSlT27FkieRFlulGF1uuE64BzKWVcF9r/SrssGRoD.wr8wjqrk6",
                "fk_board_id": 3,
                "user": {
                    "email":"a",
                    "nickname": "marge_222",
                    "portrait": "1576479564662round_logo_512px_dark.png"
                }
            },
            "message": "댓글 조회 성공"
        }
    ```

    </div>
    </details>

    <details>
    <summary>Error Response</summary>
    <div markdown="1">
      * **Code:** 존재하지 않는 댓글을 조회하려고 할 때<br/>
    **Content:** 
     ```json
    {
        "success": false,
        "data": "",
        "message": "댓글 조회 실패: 존재하지 않는 댓글입니다."
    }
    ```
    </div>
    </details>



---
**Modify one comment**
----
본인이 작성한 댓글 한 개의 내용 수정하여 수정된 댓글 객체 반환.
Update a single comment of the loggedin user and return the modified comment in json format.

* **URL**

  /:comment_id
  >*주소 변경됨: `/comment/update/:comment_id` -> `/comments/:comment_id`*

* **Method:**

  `PUT`
  
*  **URL Params**

   * `comment_id=[integer]` 댓글 번호(ID)
 
* **Data Params**
    
    * `comment_content=[String]` 댓글 내용


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 200
    **Content:** 수정된 댓글 객체 반환<br>
    * **Sample request JSON data:**
    ```json
        {
            "success": true,
            "data": {
                "id": 7,
                "comment_content": "edit_homer",
                "confirm": false,
                "createdAt": "2020-01-01T06:14:46.000Z",
                "updatedAt": "2020-01-01T06:16:34.262Z",
                "deletedAt": null,
                "fk_user_uid": "$2b$12$lUfAwWAZ73QNVqM7w3Iy.O//l3Mas0l7WEtsBJp3yuAqv2kitOeSS",
                "fk_board_id": 3
            },
            "message": "댓글 수정 성공"
        }
    ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 403 FORBIDDEN : 댓글 내용(comment_content)값이 비어있을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "댓글 수정 실패: 댓글 내용(comment_content)는 반드시 입력해야 합니다."
    }
    ```

  * **Code:** 401 UNAUTHORIZED : 본인의 댓글이 아닌 것을 수정하려고 할 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "댓글 수정 실패: 본인의 댓글만 수정할 수 있습니다."
    }
    ```

  * **Code:** 404 NOT FOUND : 존재하지 않는 댓글을 수정하려고 할 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "댓글 수정 실패: 존재하지 않는 댓글입니다."
    }
    ```
    </div>
    </details>



---
**Delete one comment.**
----
본인이 작성한 댓글 하나를 삭제하고 삭제된 댓글 번호 및 성공 메시지 반환.
Delete a single comment of the loggedin user and return the deleted comment_id and success message.

* **URL**

  /:comment_id
  >*주소 변경됨: `/comment/delete/:comment_id` -> `/comments/:comment_id`*

* **Method:**

  `DELETE`
  
*  **URL Params**

   * `comment_id=[integer]` 댓글 번호(ID)

* **Data Params**

    None

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    **Code:** 200
    **Content:** 삭제된 댓글 번호, 해당 댓글이 포함된 게시물 번호 및 성공 메시지 반환<br>
    * **Sample request JSON data:**
    ```json
        {
            "success": true,
            "data": {
                "board_id": 4,
                "comment_id": "5"
            },
            "message": "댓글 삭제 성공"
        }
    ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    **Code:** 401 UNAUTHORIZED : 본인의 댓글이 아닌 것을 삭제하려고 할 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "댓글 삭제 실패: 본인의 댓글만 삭제할 수 있습니다."
    }
    ```

    **Code:** 404 NOT FOUND : 존재하지 않는 댓글을 삭제하려고 할 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "댓글 삭제 실패: 존재하지 않는 댓글입니다."
    }
    ```
    </div>
    </details>

