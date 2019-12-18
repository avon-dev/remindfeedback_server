## About Board Text

  <_게시물(글) 생성, 수정_>

----

**Create Board TEXT**
----
게시물(글) 생성

* **URL**

  http://54.180.118.35/board/text/create

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    
    * `feedback_id=[integer]` 피드백 ID
    * `board_title=[string]` 게시물(글) 제목,
    * `board_content=[string]` 게시물(글) 내용

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 
    **Content:** 사용자가 생성한 게시물
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
      "feedback_id": 1,
      "board_title": "게시글 제목입니다",
      "board_content": "받은 피드백을 이렇게 개선했습니다 이하생략",
  }
  ```

----
**Update Board(Text) All**
----
게시물(글) 모든 항목 수정

* **URL**

  http://54.180.118.35/board/text/update/(board_id)

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경, null은 기존값유지)
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
    
    * `board_title=[string]` 게시물(글) 제목,
    * `board_content=[string]` 게시물(글) 내용

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
    "board_id": 1,
    "board_title": "게시글 제목수정 입니다",
    "board_content": "받은 피드백을 이렇게 개선했습니다 이하생략 수정",
  }
  ```
