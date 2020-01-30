## About Board
  <_게시물 (가져오기, 삭제, 수정)_>

* **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/board/cards
    http://54.180.118.35/board/cards
    ```



----
**GET All Board**
----
Return posts of feedback.
특정 피드백의 게시물 반환.

* **URL**

  /(feedbackid)/(lastid)
  /(feedbackid)/(lastid)/(limit)

* **Method:**

  `GET`
  
*  **URL Params**
    **feedbackid:**
    * `feedbackid=[integer]` 피드백 아이디


    **lastid:**
    * `lastid` 몇번째 id 부터 데이터를 반환받을지에 대한 정보
    *  초기 값은 0으로 설정바람
    *  반환되는 배열의 마지막 feedback ID 값을 req 에 담기

    **limit:**
    * `limit` 몇개의 데이터를 반환받을지에 대한 정보


* **Data Params**
  
  None

* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

  * **Code:** 200 <br />
    **Response:**
    * `id=[integer]` board의 아이디
    * `board_category=[integer]` 0(글), 1(사진), 2(영상), 3(녹음)
    * `board_title=[string]` 게시물 제목
    * `board_content=[string]` 게시물 내용
    * `board_file1=[string]` 1번째 사진파일, 영상, 녹음파일
    * `board_file2=[string]` (사진게시물) 2번째 사진파일
    * `board_file3=[string]` (사진게시물) 3번째 사진파일
    * `confirm=[boolean]` 게시물 확인 여부
    * `createdAt=[date]` 게시물 생성일
    * `updatedAt=[date]` 게시물 수정일
    * `deletedAt=[date]` 게시물 삭제일
    * `fk_feedbackId=[date]` (foreign key) 소속 피드백 아이디
      <br/>

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": [
        {
            "id": 26,
            "board_category": 1,
            "board_title": "asdf",
            "board_content": "asdfff",
            "board_file1": "picture/1579508387097̔X3.jpg",
            "board_file2": null,
            "board_file3": null,
            "confirm": false,
            "createdAt": "2020-01-20T07:15:29.000Z",
            "updatedAt": "2020-01-20T08:19:47.000Z",
            "deletedAt": null,
            "fk_feedbackId": 2
        },
        {
            "id": 22,
            "board_category": 1,
            "board_title": "title",
            "board_content": "content",
            "board_file1": "picture/15795083870.jpg",
            "board_file2": null,
            "board_file3": null,
            "confirm": false,
            "createdAt": "2020-01-15T07:15:29.000Z",
            "updatedAt": "2020-01-15T08:19:47.000Z",
            "deletedAt": null,
            "fk_feedbackId": 2
        }
    ],
    "message": ""
  }
  ```
    </div>
    </details>




----
**GET One Board**
----
Return post.
특정 게시물 정보.

* **URL**

  /(board_id)

* **Method:**

  `GET`
  
*  **URL Params**
    **board_id:**
    * `board_id=[integer]` 게시물 아이디


* **Data Params**
  
  None

* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

  * **Code:** 200 <br />
    **Response:**
    * `id=[integer]` board의 아이디
    * `board_category=[integer]` 0(글), 1(사진), 2(영상), 3(녹음)
    * `board_title=[string]` 게시물 제목
    * `board_content=[string]` 게시물 내용
    * `board_file1=[string]` 1번째 사진파일, 영상, 녹음파일
    * `board_file2=[string]` (사진게시물) 2번째 사진파일
    * `board_file3=[string]` (사진게시물) 3번째 사진파일
    * `confirm=[boolean]` 게시물 확인 여부
    * `createdAt=[date]` 게시물 생성일
    * `updatedAt=[date]` 게시물 수정일
    * `deletedAt=[date]` 게시물 삭제일
    * `fk_feedback=[object]` 작성자, 조언자 정보 반환
      <br/>

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": [
        {
            "id": 26,
            "board_category": 1,
            "board_title": "asdf",
            "board_content": "asdfff",
            "board_file1": "picture/1579508387097̔X3.jpg",
            "board_file2": null,
            "board_file3": null,
            "confirm": false,
            "createdAt": "2020-01-20T07:15:29.000Z",
            "updatedAt": "2020-01-20T08:19:47.000Z",
            "deletedAt": null,
            "fk_feedbackId": 2,
            "feedback": {
                "user_uid": "$2b$12$ZEyhKBzgaTjJr.2yCYJ5p.5I2gYSgH.3WiiO7nNzXCSauvm0MOQUS",
                "adviser_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe"
            }
        }
    ],
    "message": ""
  }
  ```
    </div>
    </details>



**Delete Board**
----
게시글 삭제

* **URL**

  `/(board_id)`

* **Method:**

  `DELETE`
  
*  **URL Params**

  `board_id` 게시글 ID, NULL[X]

* **Data Params**

  `NONE`

* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

  * **Code:** `200` SUCCESS : 게시글을 삭제한 경우 삭제한 게시글 아이디 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 1,
        "message": "[DELETE] 성공적으로 게시글을 삭제했습니다."
    }
    ```

  * **Code:** `200` FORBIDDEN : 본인이 작성한 게시글이 아닌 경우<br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 내가 작성한 게시글이 아닙니다."
    }
    ```

  * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 게시글을 찾을 수 없습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 게시글 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 게시글 삭제 실행 과정에서 에러가 발생하였습니다."
    }
    ```
    </div>
    </details>


----
**Update Board title**
----
게시물 제목 수정

* **URL**

  /board_title/(board_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
 
    * `board_title=[string]` 게시물 제목

    <!--필요한 form field 명시 + 설명-->


* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

  * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터
  <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 26,
        "board_category": 1,
        "board_title": "수정",
        "board_content": "asdfff",
        "board_file1": "picture/1579508387097̔X3.jpg",
        "board_file2": null,
        "board_file3": null,
        "confirm": false,
        "createdAt": "2020-01-20T07:15:29.000Z",
        "updatedAt": "2020-01-30T11:23:57.000Z",
        "deletedAt": null,
        "fk_feedbackId": 2
    },
    "message": "board update 성공"
  }
  ```

    </div>
    </details>



----
**Update Board content**
----
게시물 내용 수정

* **URL**

  /board_content/(board_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
 
    * `board_content=[string]` 게시물 제목

    <!--필요한 form field 명시 + 설명-->


* **Response:**

    <details>
    <summary>Success Response</summary>
    <div markdown="1">

  * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터
  <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 26,
        "board_category": 1,
        "board_title": "asdf",
        "board_content": "수정",
        "board_file1": "picture/1579508387097̔X3.jpg",
        "board_file2": null,
        "board_file3": null,
        "confirm": false,
        "createdAt": "2020-01-20T07:15:29.000Z",
        "updatedAt": "2020-01-30T11:23:57.000Z",
        "deletedAt": null,
        "fk_feedbackId": 2
    },
    "message": "board update 성공"
  }
  ```

    </div>
    </details>

