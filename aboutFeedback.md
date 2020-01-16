## About Feedback
----
  <_피드백 생성 (피드백 가져오기 생성, 수정, 삭제)_>


**GET All Feedback**
----

* **URL**

  http://54.180.118.35/feedback/all/(lastid)

* **Method:**

  `GET`
  
*  **URL Params**

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
      -- `createdAt` 피드백 수정 날짜
      -- `deletedAt` 피드백 삭제 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
    "lastid": 0,
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    }
  }
  ```

----
**GET My Feedback**
----
* **URL**

  http://54.180.118.35/feedback/my/(lastid)

* **Method:**

  `GET`
  
*  **URL Params**

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

    * `myFeedback=[array]` 사용자가 생성한 피드백
      - `id` 피드백 인덱스
      - `user_uid` 피드백 생성 유저 uid
      - `adviser_uid` 조언자 uid
      - `category` 주제
      - `title` 피드백 제목
      - `write_date` 피드백 받은 날짜
      - `createdAt` 피드백 수정 날짜
      - `deletedAt` 피드백 삭제 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
    "lastid": 0,
    "cookie": {
      "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
    }
  }
  ```


----
**GET Your Feedback**
----
* **URL**

  http://54.180.118.35/feedback/your/(lastid)

* **Method:**

  `GET`
  
*  **URL Params**

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

    * `yourFeedback=[array]` 사용자가 조언자인 피드백
      - `id` 피드백 인덱스
      - `user_uid` 피드백 생성 유저 uid
      - `adviser_uid` 조언자 uid
      - `category` 주제 ID
      - `title` 피드백 제목
      - `write_date` 피드백 받은 날짜
      - `createdAt` 피드백 수정 날짜
      - `deletedAt` 피드백 삭제 날짜
      <br/>

  * **Sample request JSON data:**
  ```json
  {
    "lastid": 0,
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
    
    * `adviser=[string]` 조언자 uid, 
    * `category=[integer]` 주제 id,
    * `title=[string]` 피드백 제목, null[x]
    * `write_date=[date]` 피드백 받은 날짜, null[x]

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 
    **Content:** 사용자가 만든 피드백 데이터
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
피드백 수정

* **URL**

  http://54.180.118.35/feedback/update/(feedback_id)

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


* **Success Response:**

  * **Code:** 200 
    **Content:** 사용자가 수정한 피드백 데이터
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

  http://54.180.118.35/feedback/adviser/(feedback_id)

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

  * **Code:** 200
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

  http://54.180.118.35/feedback/category/(feedback_id)

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

  * **Code:** 200 
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

  http://54.180.118.35/feedback/title/(feedback_id)

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

  * **Code:** 200 
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
**Update Feedback write Date**
----
피드백 받은 날짜 수정

* **URL**

  http://54.180.118.35/feedback/write_date/(feedback_id)

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
    * `feedback_id` 피드백 ID

* **Data Params**

    **Required:**
    
    * `write_date=[date]` 피드백 받은 날짜

    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 200
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
    "write_date": "2019-12-25",
  }
  ```



----
**Delete Feedback**
----
피드백 삭제

* **URL**

  `http://54.180.118.35/feedback/(feedback_id)`

* **Method:**

  `DELETE`
  
*  **URL Params**

  `feedback_id` 피드백 ID

* **Data Params**

  `NONE`

* **Success Response:**

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
