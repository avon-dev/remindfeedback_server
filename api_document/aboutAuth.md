## About Auth
----
  <_회원 인증 관련: 메일중복검사 및 토큰발행, 회원 가입, 회원 탈퇴, 로그인, 로그아웃, 유저 정보 확인, 메일확인, 비밀번호변경_>
* **API call:**
  localhost:8000/auth


---
**Send token by email**
----
  이메일 중복검사 및 토큰발행.

* **URL**

  /email

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    
    * `email=[string]` 회원 이메일. 토큰 전송용 메일, null[x]


* **Success Response:**

  * **Code:** 201
    **Content:** 토큰 데이터
        <!--회원정보 JSON 그대로 들어감-->

* **Sample JSON data:**
  ```json
  {
      "email": "example@test.com"
  }
  ```


---
**SignUp**
----
  클라이언트로부터 JSON 형식의 유저 정보를 받아 새로운 유저 생성 후 생성된 유저의 정보를 JSON 형태로 반환.

* **URL**

  /register

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
    * `token=[string]` 메일로 전달받은 토큰 정보, null[x]


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
        <!--회원정보 JSON 그대로 들어감-->

* **Sample JSON data:**
  ```json
  {
      "success": true,
      "data": {
          "user_uid": "$2b$12$vAPL5iEkkpAheaAd2ssbXeEofDvGvgrbIHKr8qQ8YKcE7okyTBDlm",
          "email": "d",
          "nickname": "d",
          "tutorial": false,
          "token": "ab12"
      },
      "message": "회원 가입에 성공했습니다."
  }
  ```

---
**LogIn**
----
  
  회원가입 이후 로그인 (passport방식).
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  /login

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


* **Sample request JSON data:**
  ```json
  {
      "success": true,
      "data": {
          "email": "1",
          "nickname": "aa",
          "tutorial": true
      },
      "message": "성공적으로 로그인했습니다."
  }
  ```

---
**GET User (Me)**
----
  로그인 후 본인 정보 get (passport방식).

* **URL**

  /me

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
      "success": true,
      "data": {
          "email": "1",
          "nickname": "aa",
          "portrait": "",
          "introduction": "aa",
          "tutorial": true
      },
      "message": "로그인 한 사용자의 데이터를 불러왔습니다."
  }
  ```




---
**LogOut**
----
  로그인 후 본인 정보 get (passport방식).

* **URL**

  /logout

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
      "success": true,
      "data": "NONE",
      "message": "로그아웃을 완료했습니다."
  }
  ```



----
**Unregister**
----
  로그인 한 유저의 데이터 삭제, 연관 테이블 업데이트 후 회원 탈퇴

* **URL**

  /unregister

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
        "message": "성공적으로 회원 탈퇴를 하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "사용자 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "게시글 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "회원 탈퇴 실행 과정에서 에러가 발생하였습니다."
    }
    ```


----
**Request find password**
----
Send to token with email
요청시 이메일로 토큰 보내기

* **URL**

  /password

* **Method:**

  `POST`
  
*  **URL Params**

   NONE

* **Data Params**

    **Required:**
 
    * `email=[string]` 토큰을 보낼 이메일 주소

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

    이메일로 토큰 보냄

    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>



----
**Changing password**
----
Changing your password

* **URL**

  /password

* **Method:**

  `PATCH`
  
*  **URL Params**

   NONE

* **Data Params**

    **Required:**
 
    * `token=[string]` 이메일로 받은 토큰정보
    * `password=[string]` 새로운 비밀번호

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 200 <br />

    성공(실패) 메세지

    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>



----
**Checking email**
----
Checking your email

* **URL**

  /checkemail

* **Method:**

  `POST`
  
*  **URL Params**

   NONE

* **Data Params**

    **Required:**
 
    * `email=[string]` 이메일


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 201 <br />

    * **Code:** `201` SUCCESS : 이메일 존재 여부 메세지 반환
    **Content:** 
    ```json
    {
        "success": true,
        "data": "NONE",
        "message": "존재하는 회원입니다."
    }
    ```
    * **Code:** `201` SUCCESS : 이메일 부재 메세지 반환
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "존재하지 않는 회원입니다."
    }
    ```

    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "INTERNAL SERVER ERROR"
    }
    ```
    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>




----
**Checking password**
----
Checking your password

* **URL**

  /checkpassword

* **Method:**

  `POST`
  
*  **URL Params**

   NONE

* **Data Params**

    **Required:**
 
    * `password=[string]` 비밀번호

    <!--필요한 form field 명시 + 설명-->


* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">
  
  * **Code:** 201 <br />

    * **Code:** `201` SUCCESS : 비밀번호 일치 메세지 반환
    **Content:** 
    ```json
    {
        "success": true,
        "data": "NONE",
        "message": "비밀번호가 일치합니다."
    }
    ```
    * **Code:** `201` SUCCESS : 비밀번호 불일치 메세지 반환
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "비밀번호가 일치하지 않습니다."
    }
    ```

    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "유효한 비밀번호가 아닙니다. (string 값 보내주세요)"
    }
    ```
    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>
