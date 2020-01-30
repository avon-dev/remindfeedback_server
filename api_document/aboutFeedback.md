## About Feedback
----
  <_피드백 (피드백 가져오기 생성, 수정, 삭제)_>

* **전제**
  ```
  로그인 후 쿠키 정보를 이용한 인증 필요
  ```

* **API call:**
  ```
  http://localhost:8000/feedbacks
  http://54.180.118.35/feedbacks
  ```

---
**GET All Feedback**
----
  Returns json data about myfeedback and yourfeedback
  나의 피드백목록, 내가 조언자인 피드백 목록을 반환.

* **URL**

  /(lastid)
  /(lastid)/(limit)

* **Method:**

  `GET`
  
*  **URL Params**

    **lastid:**
    * `lastid` 몇번째 id 부터 데이터를 반환받을지에 대한 정보
    *  초기 값은 0으로 설정바람
    *  반환되는 배열의 마지막 feedback ID 값을 req 에 담기

    **limit:**
    * `limit` 몇개의 데이터를 반환받을지에 대한 정보

    **cookie:**
    * `connect.sid` 로그인 시 발급된 cookie 정보


* **Data Params**
  
  None

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />
    **Response:**

    * `user=[object]` 유저정보
    * `category=[array]` 유저의 전체 카테고리
    * `feedbackList=[object]` 전체피드백 리스트
      - `myFeedback=[array]` 사용자가 생성한 피드백
      - `yourFeedback=[array]` 사용자가 받은 피드백
      <br/>
      - `feedback list 각각의 객체정보`
      -- `id` 피드백 인덱스
      -- `user_uid` 피드백 생성 유저 uid
      -- `adviser` 조언자uid
      -- `category` 주제 ID
      -- `title` 피드백 제목
      -- `write_date` 피드백 받은 날짜
      -- `createdAt` 피드백 생성 날짜
      -- `updatedAt` 피드백 수정 날짜
      -- `deletedAt` 피드백 삭제 날짜
      -- `complete` 피드백 완료 여부(int)
      -- `adviser(owner)` 상대방 이메일, 닉네임, 사진정보 (객체)
      <br/>

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "myFeedback": [
            {
                "id": 12,
                "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
                "adviser_uid": "$2b$12$ZEyhKBzgaTjJr.2yCYJ5p.5I2gYSgH.3WiiO7nNzXCSauvm0MOQUS",
                "category": 0,
                "title": "테스트타이틀",
                "write_date": "2020-01-21T17:43:55.000Z",
                "complete": -1,
                "confirm": false,
                "createdAt": "2020-01-21T17:43:58.000Z",
                "updatedAt": "2020-01-21T17:44:01.000Z",
                "deletedAt": null,
                "adviser": {
                    "email": "avon.commu.gmail.com",
                    "nickname": "asdfff",
                    "portrait": "portrait-1576497442442.jpg"
                }
            }
        ],
        "yourFeedback": [
            {
                "id": 2,
                "user_uid": "$2b$12$ZEyhKBzgaTjJr.2yCYJ5p.5I2gYSgH.3WiiO7nNzXCSauvm0MOQUS",
                "adviser_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
                "category": 0,
                "title": "두번째",
                "write_date": "2019-12-05T00:00:00.000Z",
                "complete": 2,
                "confirm": false,
                "createdAt": "2019-12-06T12:49:09.000Z",
                "updatedAt": "2020-01-18T16:46:53.000Z",
                "deletedAt": null,
                "owner": {
                    "email": "avon.commu@gmail.com",
                    "nickname": "asdfff",
                    "portrait": "portrait-1576497442442.jpg"
                }
            }
        ],
        "user": {
            "email": "test@test.com",
            "nickname": "testnick",
            "portrait": "",
            "introduction": "",
            "tutorial": true,
            "category": "[{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"}]"
        },
        "category": [
            {
                "category_id": 0,
                "category_title": "Default",
                "category_color": "#000000"
            }
        ]
    },
    "message": ""
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>


----
**GET My Feedback**
----
  Returns json data about myfeedbacks.
  내가 작성한 피드백 목록 반환.

* **URL**

  /mine/(lastid)/(limit)

* **Method:**

  `GET`
  
*  **URL Params**

    **lastid:**
    * `lastid` 몇번째 id 부터 데이터를 반환받을지에 대한 정보
    *  초기 값은 0으로 설정바람
    *  반환되는 배열의 마지막 feedback ID 값을 req 에 담기
    
    **limit:**
    * `limit` 몇개의 데이터를 반환받을지에 대한 정보

    **cookie:**
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />
    **Response:**

    * `myFeedback=[array]` 사용자가 생성한 피드백
      - `id` 피드백 인덱스
      - `user_uid` 피드백 생성 유저 uid
      - `adviser_uid` 조언자 uid
      - `category` 주제
      - `title` 피드백 제목
      - `write_date` 피드백 받은 날짜
      - `complete` 피드백 완료 여부(int)
      - `confirm` 피드백 확인 여부
      - `createdAt` 피드백 생성 날짜
      - `updatedAt` 피드백 수정 날짜
      - `deletedAt` 피드백 삭제 날짜
      - `adviser` 조언자 닉네임과 사진정보 (객체)
      <br/>

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": [
        {
            "id": 12,
            "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
            "adviser_uid": "$2b$12$ZEyhKBzgaTjJr.2yCYJ5p.5I2gYSgH.3WiiO7nNzXCSauvm0MOQUS",
            "category": 0,
            "title": "테스트타이틀",
            "write_date": "2020-01-21T17:43:55.000Z",
            "complete": -1,
            "confirm": false,
            "createdAt": "2020-01-21T17:43:58.000Z",
            "updatedAt": "2020-01-21T17:44:01.000Z",
            "deletedAt": null,
            "adviser": {
                "email": "avon.commu@gmail.com",
                "nickname": "asdfff",
                "portrait": "portrait-1576497442442.jpg"
            }
        }
    ],
    "message": "내가 만든 피드백 목록"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>


----
**GET Your Feedback**
----
  Returns json data about yourfeedbacks.
  내가 조언자인 피드백 목록을 반환.

* **URL**

  /yours/(lastid)/(limit)

* **Method:**

  `GET`
  
*  **URL Params**

    **lastid:**
    * `lastid` 몇번째 id 부터 데이터를 반환받을지에 대한 정보
    *  초기 값은 0으로 설정바람
    *  반환되는 배열의 마지막 feedback ID 값을 req 에 담기

    **limit:**
    * `limit` 몇개의 데이터를 반환받을지에 대한 정보

    **cookie:**
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

    * `yourFeedback=[array]` 사용자가 조언자인 피드백
      - `id` 피드백 인덱스
      - `user_uid` 피드백 생성 유저 uid
      - `adviser_uid` 조언자 uid
      - `category` 주제 ID
      - `title` 피드백 제목
      - `write_date` 피드백 받은 날짜
      -- `createdAt` 피드백 생성 날짜
      -- `updatedAt` 피드백 수정 날짜
      -- `deletedAt` 피드백 삭제 날짜
      -- `complete` 피드백 완료 여부(int)
      -- `user` 조언자 닉네임과 사진정보 (객체)
      <br/>

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": [
        {
            "id": 4,
            "user_uid": "$2b$12$ZEyhKBzgaTjJr.2yCYJ5p.5I2gYSgH.3WiiO7nNzXCSauvm0MOQUS",
            "adviser_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
            "category": 0,
            "title": "네번째",
            "write_date": "2019-12-06T00:00:00.000Z",
            "complete": -1,
            "confirm": false,
            "createdAt": "2019-12-06T12:49:26.000Z",
            "updatedAt": "2019-12-06T12:49:26.000Z",
            "deletedAt": null,
            "owner": {
                "email": "avon.commu@gmail.com",
                "nickname": "asdfff",
                "portrait": "portrait-1576497442442.jpg"
            }
        }
    ],
    "message": "내가 만든 피드백 목록"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>


----
**Create Feedback**
----
Create a Feedback.
피드백 생성

* **URL**

  /

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    * `adviser=[string]` 조언자 uid, 
    * `category=[integer]` 주제 id,
    * `title=[string]` 피드백 제목, null[x]
    * `write_date=[date]` 피드백 받은 날짜, null[x]

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    **Code:** 201 <br />

  * **Sample response JSON data:**
  ```json
  {
      "success": true,
      "data": {
          "complete": -1,
          "confirm": false,
          "id": 13,
          "user_uid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
          "adviser_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
          "category": 0,
          "title": "feedback title",
          "write_date": "2019-12-25T18:25:43.000Z",
          "createdAt": "2020-01-30T08:03:41.741Z",
          "updatedAt": "2020-01-30T08:03:41.741Z"
      },
      "message": "피드백 생성 완료"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>
  
----
**Complete Feedback**
----
Feedback completion request, feedback completion rejection, feedback completion acceptance 
피드백 완료 요청, 피드백 완료 거절, 피드백 완료 수락

* **URL**
  피드백 완료 요청
  /request/(feedback_id)
  피드백 완료 요청 거절
  /rejection/(feedback_id)
  피드백 완료 요청 수락
  /approval/(feedback_id)

* **Method:**

  `PATCH`
  
*  **complete 설명**
  feedback 의 complete 변수 설명
  -1 : 어떤 상태도 아님
  0 : 피드백 완료 거절 상태
  1 : 피드백 완료 요청 상태
  2 : 피드백 완료 수락 상태

* **URL Params**

    **Required:**
    
    * `feedback_id=[integer]` 피드백 id, 


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    **Code:** 201 
    **Content:** 사용자 정보 및 사용자가 생성한 댓글 객체 반환<br/>

  * **Sample response JSON data:**
  ```json
  {
      "success": true,
      "data": {
          "complete": 2,
          "confirm": false,
          "id": 13,
          "user_uid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
          "adviser_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
          "category": 0,
          "title": "feedback title",
          "write_date": "2019-12-25T18:25:43.000Z",
          "createdAt": "2020-01-30T08:03:41.741Z",
          "updatedAt": "2020-01-30T08:03:41.741Z"
      },
      "message": ""
  }
  ```
    </div>
    </details>

----
**Update Feedback All**
----
  Edit entire item of feedback
  피드백 수정

* **URL**

  /(feedback_id)

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경)
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `adviser=[string]` 조언자 uid, 
    * `category=[string]` 주제 id, 
    * `title=[string]` 피드백 제목, null[x]
    * `write_date=[date]` 피드백 받은 날짜, null[x]

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 13,
        "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
        "adviser_uid": "a",
        "category": 0,
        "title": "ggg",
        "write_date": "2019-12-25T18:25:43.000Z",
        "complete": -1,
        "confirm": false,
        "createdAt": "2020-01-30T08:03:41.000Z",
        "updatedAt": "2020-01-30T08:03:41.000Z",
        "deletedAt": null
    },
    "message": "feedback update 성공"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>


----
**Update Feedback adviser**
----
Edit feedback adviser
피드백 조언자 수정

* **URL**

  /adviser/(feedback_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
 
    * `adviser=[string]` 조언자uid

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 13,
        "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
        "adviser_uid": "a",
        "category": 0,
        "title": "ggg",
        "write_date": "2019-12-25T18:25:43.000Z",
        "complete": -1,
        "confirm": false,
        "createdAt": "2020-01-30T08:03:41.000Z",
        "updatedAt": "2020-01-30T08:03:41.000Z",
        "deletedAt": null
    },
    "message": "feedback update 성공"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>




----
**Update Feedback category**
----
Edit feedback category
피드백 카테고리 수정

* **URL**

  /category/(feedback_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `category=[integer]` 주제 id, 

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 13,
        "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
        "adviser_uid": "a",
        "category": 0,
        "title": "ggg",
        "write_date": "2019-12-25T18:25:43.000Z",
        "complete": -1,
        "confirm": false,
        "createdAt": "2020-01-30T08:03:41.000Z",
        "updatedAt": "2020-01-30T08:03:41.000Z",
        "deletedAt": null
    },
    "message": "feedback update 성공"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>



----
**Update Feedback title**
----
Edit feedback title
피드백 제목 수정

* **URL**

  /title/(feedback_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `title=[string]` 피드백 제목

    <!--필요한 form field 명시 + 설명-->

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 13,
        "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
        "adviser_uid": "a",
        "category": 0,
        "title": "ggg",
        "write_date": "2019-12-25T18:25:43.000Z",
        "complete": -1,
        "confirm": false,
        "createdAt": "2020-01-30T08:03:41.000Z",
        "updatedAt": "2020-01-30T08:03:41.000Z",
        "deletedAt": null
    },
    "message": "feedback update 성공"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>


----
**Update Feedback write Date**
----
Edit feedback write_date
피드백 받은 날짜 수정

* **URL**

  /write_date/(feedback_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `write_date=[date]` 피드백 받은 날짜

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

  * **Sample response JSON data:**
  ```json
  {
    "success": true,
    "data": {
        "id": 13,
        "user_uid": "$2b$12$nvoe5rDa/ocQ5oweF/Ydu.8n8eeO0DJoWVbdWOLqTUCSv1lHEYsKe",
        "adviser_uid": "a",
        "category": 0,
        "title": "ggg",
        "write_date": "2019-12-25T18:25:43.000Z",
        "complete": -1,
        "confirm": false,
        "createdAt": "2020-01-30T08:03:41.000Z",
        "updatedAt": "2020-01-30T08:03:41.000Z",
        "deletedAt": null
    },
    "message": "feedback update 성공"
  }
  ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>



----
**Delete Feedback**
----
피드백 삭제

* **URL**

  `/(feedback_id)`

* **Method:**

  `DELETE`
  
*  **URL Params**

  `feedback_id` 피드백 ID

* **Data Params**

  `NONE`

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  

  * **Code:** `200` SUCCESS : 피드백을 삭제한 경우 삭제한 피드백 아이디 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 1,
        "message": "[DELETE] 성공적으로 피드백을 삭제했습니다."
    }
    ```

  * **Code:** `200` FORBIDDEN : 본인이 작성한 피드백이 아닌 경우<br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 내가 작성한 피드백이 아닙니다."
    }
    ```

  * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 피드백을 찾을 수 없습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 피드백 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 피드백 삭제 실행 과정에서 에러가 발생하였습니다."
    }
    ```
    </div>
    </details>
