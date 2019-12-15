## About Board
----
  <_게시물 (가져오기, 삭제, 수정)_>


**GET All Board**
----

* **URL**

  http://54.180.118.35/board/feedbackid/lastid

* **Method:**

  `GET`
  
*  **URL Params**
    **feedbackid:**
    * `feedbackid` 피드백 아이디


    **lastid:**
    * `lastid` 몇번째 id 부터 데이터를 반환받을지에 대한 정보
    *  초기 값은 0
    *  반환되는 배열의 마지막 feedback ID 값을 req 에 담기

    **cookie:**
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
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

  * **Sample request JSON data:**
  ```json
  {
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "feedbackid": 13,
    "lastid": 0,
  }
  ```


----
**Delete Board**
----
게시물 삭제

* **URL**

  http://54.180.118.35/board/board_id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
    NONE

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200 
    **Content:** 성공여부 및 삭제된 피드백 id
 <br />

* **Sample request JSON data:**
  ```json
  {
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "board_id" : 9,
  }
  ```



----
**Update Board title**
----
게시물 제목 수정

* **URL**

  http://54.180.118.35/board/board_title/board_id

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
 
    * `board_title=[string]` 게시물 제목

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "board_id" : 9,
    "board_title":"게시물 제목 수정",
  }
  ```



----
**Update Board content**
----
게시물 내용 수정

* **URL**

  http://54.180.118.35/board/board_content/board_id

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
 
    * `board_content=[string]` 게시물 제목

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "board_id" : 9,
    "board_content":"게시물 제목 수정",
  }
  ```
