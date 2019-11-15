## About Users
----
  <_유저 정보에 접근하는 방법 (유저 생성, 수정, 확인, 삭제)_>
* **API call:**
  localhost:3000/users

* **Sample JSON data:**
  ```json
  {
    "id":"1",
    "user_uid":"dkjfia2_djef_diaj_39w1",
    "email":"homer@naver.com",
    "nickname":"호머 심슨",
    "password":"jifoqewjiaosdpjf8ewjfaijdifepjfewjioafuq8f",
    "portrait":".uploads/portraits/384472034820357_qoejir2.jpg",
    "introduction":"오늘도 열심히 살자",
    "create_date":"2019-10-29T10:54:33.535+00:00",
    "update_date":"2019-11-06T10:25:02.210+00:00",
    "isDeleted": false
  }
  ```
  * `id=[number]` auto-increment, null[x]
  * `user_uid=[string]` 회원정보 기반으로 생성된 고유 식별자, null[x]
  * `email=[string]` 회원 이메일. 로그인 할 때 사용됨, null[x]
  * `nickname=[string]` 회원이 직접 설정한 회원 이름, null[x]
  * `password=[string]` 암호화된 회원 비밀번호, null[x]
  * `portrait=[string]` 회원이 직접 설정한 회원 프로필 사진 경로, null[o]
  * `introduction=[string]` 회원이 직접 설정한 상태메시지, null[o]
  * `create_date=[date]` 회원정보 생성 시 자동 저장된 날짜, null[x]
  * `update_date=[date]` 마지막으로 회원정보 수정된 날짜, null[o]
  * `isDeleted=[boolean]` 회원탈퇴 시 true, 기본값 false, null[x]
  <!--회원정보 JSON 형태 + 변수 설명 -->


**Show User**
----
  Returns json data about a single user.<br>
  회원 한 명에 대한 json 형식 데이터 반환.

* **URL**

  /:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
    * `id=[string]`

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
        <!--회원정보 JSON 그대로 들어감-->
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users/dafiofj2_id12_3jr8_djafaer3",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```


**Add User**
----
  Receive form data of a single user from client, create a user, and return json data of the created user.<br>
  클라이언트로부터 폼 데이터 형식의 유저 정보를 받아 새로운 유저 생성 후 생성된 유저의 정보를 json 형태로 반환.

* **URL**

  /

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


    **Optional**
    
    * `portrait=[string]` 회원이 직접 설정한 회원 프로필 사진 경로, null[o]
    * `introduction=[string]` 회원이 직접 설정한 상태메시지, null[o]
    <!--필요한 form field 명시 + 설명-->


* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
        <!--회원정보 JSON 그대로 들어감-->
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User wasn't created." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users",
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Modify User**
----
  Receive form data of a single user from client, modify a user, and return json data of the modified user.<br>
  클라이언트로부터 폼 데이터 형식의 유저 정보를 받아 기존 유저 정보 수정 후 수정된 유저의 정보를 json 형태로 반환.

* **URL**

  /:id

* **Method:**

  `PUT`
  <!--수정 시 PUT, PATCH 어떻게 할 건지-->
  
*  **URL Params**

   **Required:**
   `id=[string]`


* **Data Params**

  **Optional:** 

    * `nickname=[string]` 회원이 직접 설정한 회원 이름, null[x]    
    * `portrait=[string]` 회원이 직접 설정한 회원 프로필 사진 경로, null[o]
    * `introduction=[string]` 회원이 직접 설정한 상태메시지, null[o]
    <!--필요한 form field 명시 + 설명-->
    <!--`password=[string]` 암호화된 회원 비밀번호, null[x] 비밀번호 변경은 기능 따로 빼야 할 듯?-->

* **Success Response:**

  <!--수정 성공 시 http code 뭐할지?-->
  * **Code:** 201 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
        <!--회원정보 JSON 그대로 들어감-->
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User wasn't motified." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users/dafiofj2_id12_3jr8_djafaer3",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**DELETE User**
----
  Delete a user and return a success message.<br>
  유저를 삭제하고 삭제 성공 메시지를 리턴한다.
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  /:id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**

    * `id=[string]`

* **Data Params**
  
  None



* **Success Response:**
  <!--삭제 성공 시 http code 뭐할지?-->
  * **Code:** 201 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
        <!--회원정보 JSON 그대로 들어감-->
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User wasn't created." }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/users/dafiofj2_id12_3jr8_djafaer3",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```