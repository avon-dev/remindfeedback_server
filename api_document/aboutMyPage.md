## About MyPage
----
  <_MyPage 정보에 접근하는 방법 (마이페이지 조회, 수정)_>
* **전제**
  로그인 후 쿠키 정보를 이용한 인증 필요

* **API call:**
  http://localhost:8000/mypage<br>
  http://54.180.118.35/mypage

* **Sample JSON data:**
  ```json
    {
        "success": true,
        "data": {
            "email": "marge@naver.com",
            "nickname": "marge3333",
            "portrait": "portrait-1575634780042.png",
            "introduction": "I am marge333"
        },
        "message": "마이페이지 조회 성공"
    }
  ```
  * `success=[boolean]` 요청 성공 여부 null[x]
  * `data=[string]` 요청한 정보 null[o]
    - `email=[string]` 유저 이메일, 고유값, null[x]
    - `nickname=[string]` 유저 닉네임(이름), null[x]
    - `portrait=[string]` 프로필 사진 이름, null[o]
    - `introduction=[string]` 유저 소개글, null[o]
  * `message=[string]` 요청 성공 혹은 실패에 대한 세부 내용, null[x]
  <!--회원정보 JSON 형태 + 변수 설명 -->

  * **portrait 사진 url:**
  https://remindfeedback.s3.ap-northeast-2.amazonaws.com/파일명<br>


**Show MyPage**
----
  Returns json data about one user.<br>
  하나의 주제 데이터를 Json 형식으로 반환.

* **URL**

  /

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
    None

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "marge@naver.com",
            "nickname": "marge3333",
            "portrait": "portrait-1575634780042.png",
            "introduction": "I am marge333"
        },
        "message": "마이페이지 조회 성공"
    }
  ```
 
* **Error Response:**

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "INTERNAL SERVER ERROR"
    }
    ```



**Modify MyPage (All data)**
----
  Receive **multipart/form-data** of a single user from client, modify and return json data of the the user. <br>
  클라이언트로부터 **multipart/form-data** 형식의 유저 정보를 받아 수정 후 수정된 유저 객체를 json 형태로 반환.

* **URL**

  /
  >*주소 변경됨: `/mypage/update` -> `/mypage`*

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    * `nickname=[string]` 유저 닉네임, null[x]

    **Optional:**
    * `portrait=[string]` 프로필 사진 파일명, null[o]
    * `introduction=[string]` 유저 소개글, null[o]
    * `updatefile=[boolean]` 프로필 사진 파일 변경 및 삭제 여부, null[o]
    > updatefile 변수로 사진 업데이트 여부 판단 후 클라이언트가 보낸 새 파일 있으면 사진 수정, 없으면 사진 삭제로 간주함. updatefile변수가 false일 경우 기존 파일 그대로 사용

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 유저 정보 수정 후 업데이트 된 유저 정보 json으로 리턴
    ```json
    {
        "success": false,
        "data": {
            "email": "marge@naver.com",
            "nickname": "marge222",
            "portrait": "portrait-1575637987835.png",
            "introduction": "I am marge344"
        },
        "message": "마이페이지 수정 성공"
    }
    ```
 
* **Error Response:**

  * **Code:** 403 FORBIDDEN : nickname 변수에 값이 없을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "닉네임(nickname)은 반드시 입력해야 합니다."
    }
    ```

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "INTERNAL SERVER ERROR"
    }
    ```

  

  **Modify MyPage( nickname only)**
----
  Receive **x-www-form-urlencoded** of a single user's **nickname** from client, modify and return json data of the the user. <br>
  클라이언트로부터 **x-www-form-urlencoded** 형식의 유저 **닉네임** 정보를 받아 수정 후 수정된 유저 객체를 json 형태로 반환.

* **URL**

  /nickname
  >*주소 변경됨: `/mypage/update/nickname` -> `/mypage/nickname`*

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    * `nickname=[string]` 유저 닉네임, null[x]

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 유저 정보 수정 후 업데이트 된 유저 정보 json으로 리턴
    ```json
    {
        "success": false,
        "data": {
            "email": "marge@naver.com",
            "nickname": "marge_edit",
            "portrait": "portrait-1575637987835.png",
            "introduction": "I am marge344"
        },
        "message": "마이페이지 nickname 수정 성공"
    }
    ```
 
* **Error Response:**

  * **Code:**  nickname 변수에 값이 없을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "닉네임(nickname)은 반드시 입력해야 합니다."
    }
    ```

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "마이페이지 nickname 수정 실패"
    }
    ```



  **Modify MyPage( introduction only)**
----
  Receive **x-www-form-urlencoded** of a single user's **introduction** from client, modify and return json data of the the user. <br>
  클라이언트로부터 **x-www-form-urlencoded** 형식의 유저 **상태메시지** 정보를 받아 수정 후 수정된 유저 객체를 json 형태로 반환.

* **URL**

  /introduction
  >*주소 변경됨: `/mypage/update/introduction` -> `/mypage/introduction`*

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    None

    **Optional:**
    * `introduction=[string]` 유저 소개글, null[o]

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 유저 정보 수정 후 업데이트 된 유저 정보 json으로 리턴
    ```json
    {
        "success": false,
        "data": {
            "email": "marge@naver.com",
            "nickname": "marge222",
            "portrait": "portrait-1575637987835.png",
            "introduction": "introduction edited"
        },
        "message": "마이페이지 introduction 수정 성공"
    }
    ```
 
* **Error Response:**

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "마이페이지 introduction 수정 실패"
    }
    ```



  **Modify MyPage( portrait only)**
----
  Receive **multipart/form-data** of a single user's **portrait** from client, modify and return json data of the the user. <br>
  클라이언트로부터 **multipart/form-data** 형식의 유저 **프로필 사진** 정보를 받아 수정 후 수정된 유저 객체를 json 형태로 반환.

* **URL**

  /portrait
  >*주소 변경됨: `/mypage/update/portrait` -> `/mypage/portrait`*

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    None

    **Optional:**
    * `portrait=[string]` 프로필 사진 파일명, null[o]
    * `updatefile=[boolean]` 프로필 사진 파일 변경 및 삭제 여부, null[o]
    > updatefile 변수로 사진 업데이트 여부 판단 후 클라이언트가 보낸 새 파일 있으면 사진 수정, 없으면 사진 삭제로 간주함. updatefile변수가 false일 경우 기존 파일 그대로 사용

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 기존 사진 파일 삭제, 새로운 파일 업로드, 유저 정보 수정 후 업데이트 된 유저 정보 json으로 리턴
    ```json
    {
        "success": true,
        "data": {
            "email": "marge@naver.com",
            "nickname": "marge222",
            "portrait": "portrait-1575637987835.png",
            "introduction": "I am marge344"
        },
        "message": "마이페이지 portrait 수정 성공"
    }
    ```
 
* **Error Response:**

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "마이페이지 portrait 수정 실패"
    }
    ```
