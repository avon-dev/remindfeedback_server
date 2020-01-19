## About Board Picture

  <_게시물(사진) 생성, 수정_>

----

**Create Board PICTURE**
----
게시물(사진) 생성

* **URL**

  http://54.180.118.35/board/picture/create

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    (form-data 형식)
    * `feedback_id=[integer]` 피드백 ID
    * `board_title=[string]` 게시물(사진) 제목,
    * `board_content=[string]` 게시물(사진) 내용
    * `file1=[file]` 사진1 (key 값은 file1)
    * `file2=[file]` 사진2 (key 값은 file2)
    * `file3=[file]` 사진3 (key 값은 file3)

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
      "board_title": "게시글 제목입니다",
      "board_content": "받은 피드백을 이렇게 개선했습니다 이하생략",
      "file1": file,
      "file2": file,
      "file3": file,
  }
  ```

----
**Update Board(Picture) All**
----
게시물(사진) 모든 항목 수정

* **URL**

  http://54.180.118.35/board/picture/update/(board_id)

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경, null은 기존값유지)
  
  *사진관련 설명
  ----
  하나의 게시물에 업로드 할 수 있는 사진은 총 3장입니다.
  각 사진을 유지, 수정, 삭제 의 총 3가지 작업을 할 수 있습니다.
  updatefile = 변경여부
  file = 파일 데이터
  <br>
  1. 기존 사진 유지
  updatefile1 = false,
  file1 = null
  
  2. 새로운 사진 수정
  updatefile1 = true,
  file1 = file

  3. 기존 사진 삭제
  updatefile1 = true,
  file1 = null
<br>
  

*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
    
    * `board_title=[string]` 게시물(사진) 제목,
    * `board_content=[string]` 게시물(사진) 내용
    <br/>
    * `updatefile1=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file1=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile2=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file2=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile3=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file3=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
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
    "board_title": "게시글 제목수정 입니다",
    "board_content": "받은 피드백을 이렇게 개선했습니다 이하생략 수정",
    //첫번째사진 유지
    "updatefile1": false,
    "file1": null,
    //두번째사진 변경
    "updatefile2": true,
    "file2": file,
    //세번째사진 삭제
    "updatefile3": true,
    "file3": null,
  }
  ```



----
**Update Board FILES**
----
게시물 사진 수정

* **URL**

  http://54.180.118.35/board/picture/files/(board_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `board_id` 게시물 ID

* **Data Params**

    **Required:**
 
    * `updatefile1=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file1=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile2=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file2=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile3=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file3=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
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
    //첫번째사진 유지
    "updatefile1": false,
    "file1": null,
    //두번째사진 변경
    "updatefile2": true,
    "file2": file,
    //세번째사진 삭제
    "updatefile3": true,
    "file3": null,
  }
  ```
