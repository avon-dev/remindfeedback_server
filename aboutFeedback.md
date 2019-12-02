## About Feedback
----
  <_피드백 생성 (피드백 가져오기 생성, 수정, 삭제)_>


**GET All Feedback**
----
  로그인 후 본인 정보 get (passport방식).

* **URL**

  http://54.180.118.35/feedback/all

* **Method:**

  `GET`
  
*  **URL Params**

    **cookie:**
    
    * `connect.sid` 로그인 시 발급된 cookie 정보

    

* **Data Params**
  
  None

* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 200 <br />
    **Response:**

    * `feedbackList=[object]` 전체피드백 리스트
      - `myFeedback=[array]` 사용자가 생성한 피드백
      - `yourFeedback=[array]` 사용자가 받은 피드백
      <br/>
      - `각 array 의 객체정보`
      -- `id` 피드백 인덱스
      -- `user_uid` 피드백 생성 유저 uid
      -- `adviser_uid` 조언자uid
      -- `category` 주제
      -- `title` 피드백 제목
      -- `write_date` 피드백 받은 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
      "cookie": {
        "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
      }
  }
  ```

----
**GET My Feedback**
----
* **URL**

  http://54.180.118.35/feedback/my

* **Method:**

  `GET`
  
*  **URL Params**

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
      "cookie": {
        "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
      }
  }
  ```


----
**GET Your Feedback**
----
* **URL**

  http://54.180.118.35/feedback/your

* **Method:**

  `GET`
  
*  **URL Params**

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
    * `category=[string]` 주제 id, (현재는 null보내기 바람 주제기능구현시 수정예정)
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
      "adviser_uid": "$2b$12$P6uA2DrSoWi4uK1Ik5rvu.jbykxXOi71JMTtHr8yKxvLCr03HiPfO",
      "category": 1,
      "title": "나의 첫번째 피드백",
      "write_date": "2019-12-25T18:25:43.000Z",
  }
  ```
