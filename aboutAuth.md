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

  localhost:8000/auth/signup

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
    .post(`localhost:8000/auth/signup`, {
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
  
  회원가입 이후 로그인 (jwt방식).
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  localhost:8000/auth/login

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

    * `refreshToken=[object]` 만료기간 2주 토큰
      - `success` 로그인 성공여부
      - `message` 유저여부, 토큰만료 정보
      - `errors` 에러 내용
      - `data` refreshToken 으로 access 토큰 만료시 header 에 넣어야 하는 값

    * `accessToken=[object]` 만료기간 1시간 토큰
      - `success` 로그인 성공여부
      - `message` 유저여부, 토큰만료 정보
      - `errors` 에러 내용
      - `data` accessToken 으로 데이터 요청시 header 에 넣어야 하는 값 (쿠키등에 저장하여 보관)
 

<!-- * **Sample Call:** -->

  <!-- ```javascript
    axios
    .post(`localhost:8000/auth/login`, {
      headers: {
        'Content-Type': 'application/json',
      },
      email: "email@example.com",
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
      "password" : "1234",
  }
  ```

**GET User (Me)**
----
  로그인 후 본인 정보 get (jwt방식).
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  localhost:8000/auth/me

* **Method:**

  `GET`
  
*  **URL Params**

    **header:**
    
    * `x-access-token` 로그인 시 발급된 access토큰 정보기입

    

* **Data Params**
  
  None



* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 200 <br />
    **Response:**

    * `user=[object]` 로그인한 유저정보
 

<!-- * **Sample Call:**

  ```javascript
    axios
    .post(`localhost:8000/auth/me`, {
      headers: {
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGZAYXNkZi5jb20iLCJpYXQiOjE1NzQwNjIwMDMsImV4cCI6MTU3NDA2MjAwOX0.FhdS3dX1DiMtEeadvosyGvpYjjw50JrcWOht1-R3il0',
      }
    });
  ``` -->
  * **Sample JSON data:**
  ```json
  {
      "headers": {
        "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGZAYXNkZi5jb20iLCJpYXQiOjE1NzQwNjIwMDMsImV4cCI6MTU3NDA2MjAwOX0.FhdS3dX1DiMtEeadvosyGvpYjjw50JrcWOht1-R3il0",
      }
  }
  ```



**RefreshToken**
----
  access토큰 만료시 refresh토큰을 보내어 access토큰 재발급 (jwt방식).
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  localhost:8000/auth/refresh

* **Method:**

  `GET`
  
*  **URL Params**

    **header:**
    
    * `x-access-token` 로그인 시 발급된 refresh토큰 정보기입

    

* **Data Params**
  
  None



* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 200 <br />
    **Response:**

    * `accessToken=[object]` 만료기간 1시간 토큰
      - `success` 로그인 성공여부
      - `message` 유저여부, 토큰만료 정보
      - `errors` 에러 내용
      - `data` accessToken 으로 데이터 요청시 header 에 넣어야 하는 값 (쿠키등에 저장하여 보관)

<!-- * **Sample Call:**

  ```javascript
    axios
    .post(`localhost:8000/auth/me`, {
      headers: {
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGZAYXNkZi5jb20iLCJpYXQiOjE1NzQwNjIwMDMsImV4cCI6MTU3NDA2MjAwOX0.FhdS3dX1DiMtEeadvosyGvpYjjw50JrcWOht1-R3il0',
      }
    });
  ``` -->
  * **Sample JSON data:**
  ```json
  {
      "headers": {
        "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGZAYXNkZi5jb20iLCJpYXQiOjE1NzQwNTMwNDMsImV4cCI6MTU3NDEzOTQ0M30.BDYuub-TMKKQi0o546kf51OehKo7kPZpge68kDT9ZIQ",
      }
  }
  ```


**LogOut**
----
  로그인 시 발급된 모든 토큰을 삭제 시켜주면 됩니다.