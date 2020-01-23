## About Category
----
  <_카테고리(Category) 정보에 접근하는 방법 (카테고리 생성, 확인, 수정, 삭제)_>

* **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/category
    http://54.180.118.35/category
    ```

**Create Category**
----
  카테고리 생성.

* **URL**

    `/create`

* **Method:**

    `POST`
  
* **URL Params**

    `NONE`

* **Data Params**

    `category_title=[string]` 추가할 카테고리 제목, NULL[X] <br>
    `category_color=[string]` 추가할 카테고리 색상, NULL[X]

* **Success Response:**

  * **Code:** 
    `200` : 카테고리 생성 성공 시 모든 카테고리 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "category_id": 0,
                "category_title": "Default",
                "category_color": "#000000"
            },
            {
                "category_id": 1,
                "category_title": "category1",
                "category_color": "#111111"
            },
            {
                "category_id": 2,
                "category_title": "category2",
                "category_color": "#222222"
            }
        ],
        "message": "새로운 카테고리를 생성했습니다."
    }
    ```

* **Error Response:**

  * **Code:** `200` FORBIDDEN : 카테고리 제한 개수를 초과한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "카테고리 제한 개수를 초과했습니다."
    }
    ```

  * **Code:** `200` FORBIDDEN : 기본 카테고리 이름으로 생성을 시도한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "기본 카테고리 이름으로 생성할 수 없습니다."
    }
    ```

  * **Code:** `200` FORBIDDEN : 카테고리 이름이 기존에 생성한 이름과 중복되는 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "이미 생성된 카테고리입니다."
    }
    ```

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "사용자를 찾을 수 없습니다."
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
        "message": "카테고리 생성 과정에서 에러가 발생하였습니다."
    }
    ```



**Read All Category**
----
  모든 카테고리 목록 불러오기.

* **URL**

    `/selectall`

* **Method:**

    `GET`
  
* **URL Params**

    `NONE`

* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 
    `200` : 카테고리 생성 성공 시 모든 카테고리 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "category_id": 0,
                "category_title": "Default",
                "category_color": "#000000"
            },
            {
                "category_id": 1,
                "category_title": "category1",
                "category_color": "#111111"
            },{
                "category_id": 2,
                "category_title": "category2",
                "category_color": "#222222"
            }
        ],
        "message": "카테고리 목록을 성공적으로 가져왔습니다."
    }
    ```

* **Error Response:**

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "사용자를 찾을 수 없습니다."
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



**Read One Category**
----
  선택한 카테고리 목록 불러오기.

* **URL**

  `/selectone/:category_id`

* **Method:**

  `GET`
  
* **URL Params**

  `category_id=` 선택할 카테고리 ID, NULL[X]

* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 
    `200` : 선택한 카테고리 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "category_id": 0,
            "category_title": "Default",
            "category_color": "#000000"
        },
        "message": "선택한 카테고리를 가져왔습니다."
    }
    ```

* **Error Response:**

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "사용자를 찾을 수 없습니다."
    }
    ```

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "선택한 카테고리를 찾을 수 없습니다."
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



**Update One Category**
----
  카테고리 수정.

* **URL**

  `/update/:category_id`

* **Method:**

  `PUT`
  
* **URL Params**

  `category_id=` 수정할 카테고리 ID, NULL[X]

* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 
    `200` : 수정한 카테고리 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "category_id": 1,
            "category_title": "category1",
            "category_color": "update_1"
        },
        "message": "선택한 카테고리를 수정했습니다."
    }
    ```

* **Error Response:**

 * **Code:** `200` FORBIDDEN : 기본 카테고리의 수정을 시도한 경우 <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "기본 카테고리는 수정할 수 없습니다."
    }
    ```

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "사용자를 찾을 수 없습니다."
    }
    ```

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "선택한 카테고리를 찾을 수 없습니다."
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
        "message": "카테고리 수정 과정에서 에러가 발생하였습니다."
    }
    ```



**Delete One Category**
----
  카테고리 삭제.

* **URL**

  `/delete/:category_id`

* **Method:**

  `DELETE`
  
* **URL Params**

  `category_id=` 삭제할 카테고리 ID, NULL[X]

* **Data Params**

  `NONE`

* **Success Response:**

  * **Code:** 
    `200` : 삭제한 카테고리의 id 반환 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "1",
        "message": "선택한 카테고리를 삭제했습니다."
    }
    ```

* **Error Response:**

 * **Code:** `200` FORBIDDEN : 기본 카테고리의 삭제를 시도한 경우 <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "기본 카테고리는 삭제할 수 없습니다."
    }
    ```

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "사용자를 찾을 수 없습니다."
    }
    ```

 * **Code:** `200` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "선택한 카테고리를 찾을 수 없습니다."
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
        "message": "피드백 수정 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "카테고리 삭제 과정에서 에러가 발생하였습니다."
    }
    ```