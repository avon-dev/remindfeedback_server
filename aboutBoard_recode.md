## About Board Recode

  <_게시물(음성) 생성, 수정_>

----

**Create Board RECODE**
----
게시물(음성) 생성

* **URL**

  http://54.180.118.35/board/recode/create

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    (form-data 형식)
    * `feedback_id=[integer]` 피드백 ID
    * `board_title=[string]` 게시물(음성) 제목,
    * `board_content=[string]` 게시물(음성) 내용
    * `recodefile=[file]` 음성 (key 값은 recodefile)

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 
    **Content:** 사용자가 생성한 게시물
 <br />

* **Sample request JSON data:**
  ```json
  {
      "headers": {
        "Content-Type": "multipart/form-data",
      },
      "cookie": {
        "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
      },
      "feedback_id": 1,
      "board_title": "게시물 제목입니다",
      "board_content": "받은 피드백을 이렇게 개선했습니다 이하생략",
      "recodefile": file,
  }
  ```

----
**Update Board(Recode) All**
----
게시물(음성) 모든 항목 수정

* **URL**

  http://54.180.118.35/board/recode/update/(board_id)

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경, null은 기존값유지)
  
  *음성관련 설명
  ----
  하나의 게시물에 업로드 할 수 있는 음성은 총 1개 입니다.
  음성을 유지, 수정, 삭제 의 총 3가지 작업을 할 수 있습니다.
  updatefile = 변경여부
  recodefile = 파일 데이터
  <br>
  1. 기존 음성 유지
  updatefile1 = false,
  recodefile = null
  
  2. 새로운 음성 수정
  updatefile1 = true,
  recodefile = file

  3. 기존 음성 삭제
  updatefile1 = true,
  recodefile = null
<br>
  

*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
    
    * `board_title=[string]` 게시물(음성) 제목,
    * `board_content=[string]` 게시물(음성) 내용
    <br/>
    * `updatefile1=[boolean]` 음성 변경 여부 (true 일시 기존데이터 삭제)
    * `recodefile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "headers": {
      "Content-Type": "multipart/form-data",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "board_id": 1,
    "board_title": "게시물 제목수정 입니다",
    "board_content": "받은 피드백을 이렇게 개선했습니다 이하생략 수정",
    //음성 유지
    "updatefile1": false,
    "recodefile": null,
    //음성 변경
    "updatefile1": true,
    "recodefile": file,
    //음성 삭제
    "updatefile1": true,
    "recodefile": null,
  }
  ```



----
**Update Board FILE**
----
게시물 음성 수정

* **URL**

  http://54.180.118.35/board/recode/file/(board_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
 
    * `updatefile1=[boolean]` 음성 변경 여부 (true 일시 기존데이터 삭제)
    * `recodefile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile1=[boolean]` 음성 변경 여부 (true 일시 기존데이터 삭제)
    * `recodefile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile1=[boolean]` 음성 변경 여부 (true 일시 기존데이터 삭제)
    * `recodefile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "headers": {
      "Content-Type": "multipart/form-data",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "board_id" : 9,
    //음성 유지
    "updatefile1": false,
    "recodefile": null,
    //음성 변경
    "updatefile1": true,
    "recodefile": file,
    //음성 삭제
    "updatefile1": true,
    "recodefile": null,
  }
  ```
