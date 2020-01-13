## About Auth
----
  <_회원가입 로그인 (유저 생성, 로그인, 확인)_>
<!-- * **API call:**
  localhost:3000/users

* **Sample JSON data:**
  ```json
  {
    "email":"homer@naver.com",
    "nickname":"호머 심슨",
    "password":"1234",
  }
  ```
  * `email=[string]` 회원 이메일. 로그인 할 때 사용됨, null[x]
  * `nickname=[string]` 회원이 직접 설정한 회원 이름, null[x]
  * `password=[string]` 회원 비밀번호, null[x] -->
  <!--회원정보 JSON 형태 + 변수 설명 -->



**SignUp**
----
  클라이언트로부터 JSON 형식의 유저 정보를 받아 새로운 유저 생성 후 생성된 유저의 정보를 JSON 형태로 반환.

* **URL**

  http://54.180.118.35/auth/signup

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    
    * `email=[string]` 회원 이메일. 로그인 할 때 사용됨, null[x]
    * `nickname=[string]` 회원이 직접 설정한 회원 이름, null[x]
    * `password=[string]` 암호화된 회원 비밀번호, null[x]


   
    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
        <!--회원정보 JSON 그대로 들어감-->
 
* **Sample javascript Call:**

  <!-- ```javascript
    axios
    .post(`http://54.180.118.35/auth/signup`, {
      headers: {
        'Content-Type': 'application/json',
      },
      email: "email@example.com",
      nickname: "지석",
      password : "1234",
    });
  ``` -->
* **Sample JSON data:**
  ```json
  {
      "headers": {
        "Content-Type": "application/json",
      },
      "email": "email@example.com",
      "nickname": "지석",
      "password" : "1234",
  }
  ```

**LogIn**
----
  
  회원가입 이후 로그인 (passport방식).
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  http://54.180.118.35/auth/login

* **Method:**

  `POST`
  

* **URL Params**
  
  None

*  **Data Params**

    **Required:**
    
    * `email=[string]` 회원 이메일. 로그인 할 때 사용됨, null[x]
    * `password=[string]` 회원 비밀번호, null[x]



* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 201 <br />
    **Response:**

    * `user=[object]` 유저 객체
      - `user_uid` 유저uid
      - `email` 이메일
      - `nickname` 닉네임
      - `tutorial` 튜토리얼 진행여부 (false일시 튜토리얼 진행)
    * `connect.sid=[cookie]` 
      - `value` connect.sid=value "쿠키"로 보내야 로그인 여부 확인가능 (토큰역할)


<!-- * **Sample Call:** -->

  <!-- ```javascript
    axios
    .post(`http://54.180.118.35/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      email: "email@example.com",
      password : "1234",
    });
  ``` -->
* **Sample request JSON data:**
  ```json
  {
      "headers": {
        "Content-Type": "application/json",
      },
      "email": "email@example.com",
      "password" : "1234",
  }
  ```

**GET User (Me)**
----
  로그인 후 본인 정보 get (passport방식).

* **URL**

  http://54.180.118.35/auth/me

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

    * `user=[object]` 로그인한 유저정보
      - `email` 이메일
      - `nickname` 닉네임
      - `portrait` 프로필사진명
      - `introduction` 상태메세지
      - `tutorial` 튜토리얼 진행여부 (false일시 튜토리얼 진행)

  * **Sample request JSON data:**
  ```json
  {
      "cookie": {
        "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
      }
  }
  ```




**LogOut**
----
  로그인 후 본인 정보 get (passport방식).

* **URL**

  http://54.180.118.35/auth/logout

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

    * `logout` logout Text 문자열

  * **Sample request JSON data:**
  ```json
  {
      "cookie": {
        "connect.sid": "s%3AfxZgKcirzD_d0zAHVTEnf9DQu9FVI2rO.Ijf7scJ%2Buj6YtprVUB6Vcuf1QVNXDIR64MP43366CaQ",
      }
  }
  ```



----
**Unregister**
----
  로그인 한 유저의 데이터 삭제, 연관 테이블 업데이트 후 회원 탈퇴

* **URL**

  `http://54.180.118.35/auth/unregister`

* **Method:**

  `DELETE`
  
*  **URL Params**

  `NONE`

* **Data Params**

  `NONE`
   
* **Success Response:**

  * **Code:** `200` SUCCESS : 피드백을 삭제한 경우 삭제한 피드백 아이디 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 1,
        "message": "[DELETE] 성공적으로 회원 탈퇴를 하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[DELETE] 사용자 조회 과정에서 에러가 발생하였습니다."
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
        "message": "[DELETE] 회원 탈퇴 실행 과정에서 에러가 발생하였습니다."
    }
    ```