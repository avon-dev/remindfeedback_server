## About Feedback
----
  <_피드백 생성 (피드백 가져오기 생성, 수정, 삭제)_>


**GET All Feedback**
----

* **URL**

  http://54.180.118.35/feedback/all/:start

* **Method:**

  `GET`
  
*  **URL Params**

    **start:**
    
    * `start` 몇번째 개수 부터 데이터를 반환받을지에 대한 정보 (10단위로 맞춰주세요 0, 10, 20..)

    **cookie:**
    
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 200 <br />
    **Response:**

    * `user=[object]` 유저정보
    * `category=[array]` 유저의 전체 카테고리
    * `feedbackList=[object]` 전체피드백 리스트
      - `myFeedback=[array]` 사용자가 생성한 피드백
      - `yourFeedback=[array]` 사용자가 받은 피드백
      <br/>
      - `각 array 의 객체정보`
      -- `id` 피드백 인덱스
      -- `user_uid` 피드백 생성 유저 uid
      -- `adviser` 조언자uid
      -- `category` 주제 ID
      -- `title` 피드백 제목
      -- `write_date` 피드백 받은 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
    "start": 0,
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    }
  }
  ```

----
**GET My Feedback**
----
* **URL**

  http://54.180.118.35/feedback/my/:start

* **Method:**

  `GET`
  
*  **URL Params**

    **start:**
    
    * `start` 몇번째 개수 부터 데이터를 반환받을지에 대한 정보 (10단위로 맞춰주세요 0, 10, 20..)

    **cookie:**
    
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 200 <br />
    **Response:**

    * `myFeedback=[array]` 사용자가 생성한 피드백
      - `id` 피드백 인덱스
      - `user_uid` 피드백 생성 유저 uid
      - `adviser_uid` 조언자 uid
      - `category` 주제
      - `title` 피드백 제목
      - `write_date` 피드백 받은 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
    "start": 0,
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    }
  }
  ```


----
**GET Your Feedback**
----
* **URL**

  http://54.180.118.35/feedback/your/:start

* **Method:**

  `GET`
  
*  **URL Params**

    **start:**
    
    * `start` 몇번째 개수 부터 데이터를 반환받을지에 대한 정보 (10단위로 맞춰주세요 0, 10, 20..)

    **cookie:**
    
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 200 <br />
    **Response:**

    * `yourFeedback=[array]` 사용자가 조언자인 피드백
      - `id` 피드백 인덱스
      - `user_uid` 피드백 생성 유저 uid
      - `adviser_uid` 조언자 uid
      - `category` 주제
      - `title` 피드백 제목
      - `write_date` 피드백 받은 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
    "start": 0,
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    }
  }
  ```


----
**Create Feedback**
----
피드백 생성

* **URL**

  http://54.180.118.35/feedback/create

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    
    * `adviser=[string]` 조언자 uid, (현재는 null보내기 바람 친구기능구현시 수정예정)
    * `category=[integer]` 주제 id,
    * `title=[string]` 피드백 제목, null[x]
    * `write_date=[date]` 피드백 받은 날짜, null[x]

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 
    **Content:** 사용자가 만든 피드백 데이터 전체
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
      "adviser": "$2b$12$P6uA2DrSoWi4uK1Ik5rvu.jbykxXOi71JMTtHr8yKxvLCr03HiPfO",
      "category": 1,
      "title": "나의 첫번째 피드백",
      "write_date": "2019-12-25T18:25:43.000Z",
  }
  ```

----
**Update Feedback All**
----
피드백 생성

* **URL**

  http://54.180.118.35/feedback/update/feedback_id

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경)
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `adviser=[string]` 조언자 uid, (현재는 null보내기 바람 친구기능구현시 수정예정)
    * `category=[string]` 주제 id, 
    * `title=[string]` 피드백 제목, null[x]
    * `write_date=[date]` 피드백 받은 날짜, null[x]

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 202 
    **Content:** 사용자가 만든 피드백 데이터 전체
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
      "adviser": "$2b$12$P6uA2DrSoWi4uK1Ik5rvu.jbykxXOi71JMTtHr8yKxvLCr03HiPfO",
      "category": 1,
      "title": "나의 첫번째 피드백",
      "write_date": "2019-12-25T18:25:43.000Z",
  }
  ```
----
**Update Feedback adviser**
----
피드백 조언자 수정

* **URL**

  http://54.180.118.35/feedback/adviser/feedback_id

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
 
    * `adviser=[string]` 조언자uid

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 203 
    **Content:** 사용자가 수정한 피드백 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "feedback_id" : 9,
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "adviser": "$2b$12$P6uA2DrSoWi4uK1Ik5rvu.jbykxXOi71JMTtHr8yKxvLCr03HiPfO",
  }
  ```




----
**Update Feedback category**
----
피드백 카테고리 수정

* **URL**

  http://54.180.118.35/feedback/category/feedback_id

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `category=[integer]` 주제 id, 

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 203 
    **Content:** 사용자가 수정한 피드백 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "feedback_id" : 9,
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "category": 1,
  }
  ```




----
**Update Feedback title**
----
피드백 제목 수정

* **URL**

  http://54.180.118.35/feedback/title/feedback_id

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `title=[string]` 피드백 제목

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 203 
    **Content:** 사용자가 수정한 피드백 데이터
 <br />

* **Sample request JSON data:**
  ```json
  {
    "feedback_id" : 9,
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
    "title": "나의 첫번째 피드백",
  }
  ```




----
**Delete Feedback**
----
피드백 생성

* **URL**

  http://54.180.118.35/feedback/feedback_id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    NONE

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 204 
    **Content:** 성공여부
 <br />

* **Sample request JSON data:**
  ```json
  {
    "feedback_id" : 9,
    "headers": {
      "Content-Type": "application/json",
    },
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    },
  }
  ```
