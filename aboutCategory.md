## About Category
----
  <_주제(category) 정보에 접근하는 방법 (주제 생성, 수정, 확인, 삭제)_>
* **전제**
  로그인 후 쿠키 정보를 이용한 인증 필요

* **API call:**
  localhost:8000/category

* **Sample JSON data:**
  ```json
    {
        "success": true,
        "data": "[{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"},{\"category_id\":2,\"category_title\":\"edit2\",\"category_color\":\"dfdf\"}]",
        "message": "사용자의 모든 카테고리 데이터를 가져왔습니다."
    }
  ```
  * `success=[boolean]` 요청 성공 여부 null[x]
  * `data=[string]` 요청한 정보 null[o]
    - `category_id=[number]` 카테고리 id, 고유값, null[x]
    - `category_title=[string]` 카테고리 제목, null[x]
    - `category_color=[string]` 카테고리 색상값(헥사코드), null[x]
  * `message=[string]` 요청 성공 혹은 실패에 대한 세부 내용, null[x]
  <!--회원정보-주제 JSON 형태 + 변수 설명 -->



**Show All Category**
----
  Returns json data about all category of one user.<br>
  회원 한 명에 대한 모든 주제 데이터를 Json(array) 형식으로 반환.

* **URL**

  /selectall

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
        "data": "[{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"},{\"category_id\":2,\"category_title\":\"edit2\",\"category_color\":\"dfdf\"}]",
        "message": "사용자의 모든 카테고리 데이터를 가져왔습니다."
    }
  ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[404 NOT FOUND]"
    }
    ```
    

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[401 UNAUTHORIZED] You are unauthorized to make this request."
    }
    ```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/category/selectall",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```


**Show One Category**
----
  Returns json data about a single category of one user.<br>
  하나의 주제 데이터를 Json 형식으로 반환.

* **URL**

  /selectone/:category_id
  * **Sample URL:** category/selectone/0

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
    `category_id=[number]` 주제의 category_id 값

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
        "success": true,
        "data": "{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"}",
        "message": "사용자가 선택한 카테고리의 데이터를 가져왔습니다."
    }
  ```
 
* **Error Response:**

  * **Code:** 403 FORBIDDEN : 주제 목록에 없는 category_id를 호출했을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "카테고리의 ID가 잘못되었습니다."
    }
    ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[404 NOT FOUND]"
    }
    ```
    
  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[401 UNAUTHORIZED] You are unauthorized to make this request."
    }
    ```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/category/selectone/0",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```


**Add Category**
----
  Receive **x-www-form-urlencoded** data of a single category from client, create a category, and return json data of the all categories of the user. <br>
  클라이언트로부터 **x-www-form-urlencoded** 형식의 주제 정보를 받아 새로운 주제 생성 후 생성된 주제를 포함한 전체 주제 목록을 json 형태로 반환.

* **URL**

  /insert

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   None

* **Data Params**

    **Required:**
    
    * `category_title=[string]` 카테고리 제목, null[x]
    * `category_color=[string]` 색상 코드(ex. "#00000"), null[x]

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** 새로운 주제 추가 후 업데이트 된 전체 주제 목록 json으로 리턴
    ```json
    {
        "success": true,
        "data": "{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"}",
        "message": "새로운 카테고리를 생성했습니다."
    }
    ```
 
* **Error Response:**

  * **Code:** 403 FORBIDDEN : 카테고리 제한 개수 초과(10개 이상)<br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "카테고리 제한 개수를 초과하였습니다."
    }
    ```
    
  * **Code:** 403 FORBIDDEN : 기본 카테고리 이름("Default")으로 생성 <br />
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "기본 카테고리 이름으로 생성할 수 없습니다."
    }
    ```

  * **Code:** 403 FORBIDDEN : 카테고리 제목 중복됨 <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "이미 생성된 카테고리입니다."
    }
    ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[404 NOT FOUND]"
    }
    ```
    
  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[401 UNAUTHORIZED] You are unauthorized to make this request."
    }
    ```


* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/category/insert",
      dataType: "json",
      type : "POST",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Modify Category**
----
  Receive the 'category_id' of selected category and **x-www-form-urlencoded** data of the category data from client, modify the category, and return json data of the all categories of the user. <br>
  클라이언트로부터 특정 카테고리 id와 **x-www-form-urlencoded** 형식의 주제 정보를 받아 기존 주제 수정 후 수정된 주제를 포함한 전체 주제 목록을 json 형태로 반환.

* **URL**

  /update:category_id

* **Method:**

  `POST`
  <!--수정 시 PUT, PATCH 어떻게 할 건지-->
  
*  **URL Params**

   **Required:**
   `category_id=[number]`

* **Data Params**

  **Optional:** 
    * `category_title=[string]` 카테고리 제목, null[x]
    * `category_color=[string]` 색상 코드(ex. "#00000"), null[x]

* **Success Response:**

  <!--수정 성공 시 http code 뭐할지?-->
  * **Code:** 201 <br />
    **Content:** 회원 한 명에 대한 json데이터 전체
    ```json
    {
        "success": true,
        "data": "{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"}",
        "message": "사용자가 선택한 카테고리의 정보를 수정했습니다."
    }
    ```
 
* **Error Response:**

  * **Code:** 403 FORBIDDEN : 기본 카테고리를 수정하려고 할 때(category_id==0인 경우) <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "기본 카테고리는 수정할 수 없습니다."
    }
    ```

  * **Code:** 403 FORBIDDEN : 주제 목록에 없는 category_id를 호출했을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "카테고리의 ID가 잘못되었습니다."
    }
    ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[404 NOT FOUND]"
    }
    ```
    
  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[401 UNAUTHORIZED] You are unauthorized to make this request."
    }
    ```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/category/update/1",
      dataType: "json",
      type : "PUT",
      success : function(r) {
        console.log(r);
      }
    });
  ```

**DELETE User**
----
  Delete a category and return all categories of the user.<br>
  주제를 삭제하고 변경된 주제 목록을 json 형태로 리턴한다.
  <!--삭제 시 삭제된 객체를 리턴할 지 그냥 성공 메시지 리턴할지?-->

* **URL**

  /deleteone/:category_id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**

    * `category_id=[number]`

* **Data Params**
  
  None



* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 주제를 삭제하고 변경된 주제 목록을 json 형태로 리턴
    ```json
    {
        "success": true,
        "data": "{\"category_id\":0,\"category_title\":\"Default\",\"category_color\":\"#000000\"}",
        "message": "사용자가 선택한 카테고리의 정보를 삭제했습니다."
    }
    ```
 
* **Error Response:**

  * **Code:** 403 FORBIDDEN : 기본 카테고리를 수정하려고 할 때(category_id==0인 경우) <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "기본 카테고리는 삭제할 수 없습니다."
    }
    ```

  * **Code:** 403 FORBIDDEN : 주제 목록에 없는 category_id를 호출했을 때 <br />
    **Content:** 
     ```json
    {
        "success": false,
        "data": "NONE",
        "message": "카테고리의 ID가 잘못되었습니다."
    }
    ```

  * **Code:** 404 NOT FOUND <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[404 NOT FOUND]"
    }
    ```
    
  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "ERROR[401 UNAUTHORIZED] You are unauthorized to make this request."
    }
    ```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/category/deleteone/1",
      dataType: "json",
      type : "DELETE",
      success : function(r) {
        console.log(r);
      }
    });
  ```