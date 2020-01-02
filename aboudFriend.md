## About Category
----
  <_친구(friend) 정보에 접근하는 방법 (친구 검색, 생성, 확인, 차단, 차단 해제)_>
* **전제**
  로그인 후 쿠키 정보를 이용한 인증 필요

* **API call:**
  http://localhost:8000/friend
  http://54.180.118.35/friend



**Search Friend**
----
  회원 한 명의 검색 데이터를 Json 형식으로 반환.

* **URL**
    `/search`

* **Method:**
    `GET`
  
* **URL Params**
    `NONE`

* **Data Params**
    `email=[string]` 검색할 사용자 이메일, NULL[X]

* **Success Response:**


  * **Code:** `200` <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test0@naver.com",
            "nickname": "test0",
            "portrait": "",
            "introduction": "",
            "type": 0
        },
        "message": "[SEARCH] 아직 친구 요청을 하지 않은 사용자입니다."
    }
    ```

  * **Code:** `200` <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test1@naver.com",
            "nickname": "test1",
            "portrait": "",
            "introduction": "",
            "type": 1
        },
        "message": "[SEARCH] 내가 친구 요청을 한(받은) 사용자입니다."
    }
    ```

  * **Code:** `200` <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 2
        },
        "message": "[SEARCH] 이미 친구로 등록된 사용자입니다."
    }
    ```

  * **Code:** `200` <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test3@naver.com",
            "nickname": "test3",
            "portrait": "",
            "introduction": "",
            "type": 3
        },
        "message": "[SEARCH] 내가(나를) 차단한 사용자입니다."
    }
    ```

  * **Code:** `200` <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test4@naver.com",
            "nickname": "test4",
            "portrait": "",
            "introduction": "",
            "type": 4
        },
        "message": "[SEARCH] 내가(나를) 차단한 사용자입니다."
    }
    ```

  * **Code:** `200` <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test4@naver.com",
            "nickname": "test4",
            "portrait": "",
            "introduction": "",
            "type": 5
        },
        "message": "[SEARCH] 서로 차단한 상태입니다."
    }
    ```

* **Error Response:**

  * **Code:** `403` FORBIDDEN : 로그인 한 이메일로 검색한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[SEARCH] 나 자신은 인생의 영원한 친구입니다."
    }
    ```

  * **Code:** `404` NOT FOUND : 사용자를 찾지 못한 경우 <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[SEARCH] 사용자를 찾을 수 없습니다."
    }
    ```



**Create Friend**
----
  친구 요청 및 수락.

* **URL**
    `/create`

* **Method:**
    `POST`
  
* **URL Params**
    `NONE`

* **Data Params**
    `email=[string]` 추가할 사용자 이메일, NULL[X]

* **Success Response:**

  * **Code:** `200` : 상대방이 나에게 친구 요청을 하지 않거나, 내가 상대방에게 친구 요청을 하지 않은 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 1,
        "message": "[CREATE] test1에게 친구 요청을 보냈습니다."
    }
    ```

  * **Code:** `200` : 상대방이 나에게 먼저 친구 요청을 하고, 내가 수락한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "email": "test1@naver.com",
            "nickname": "test1",
            "portrait": "",
            "introduction": "",
            "type": 2
        },
        "message": "[CREATE] test1의 친구 요청을 수락해서 친구가 되었습니다."
    }
    ```

* **Error Response:**

  * **Code:** `403` FORBIDDEN : 로그인 한 이메일로 친구를 추가한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 나 자신을 추가할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 서로 친구이거나 차단한 상태인 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 서로 친구이거나 차단한 사용자입니다."
    }
    ```

  * **Code:** `404` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 사용자를 찾을 수 없습니다."
    }
    ```
    
  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 친구 요청을 실패했습니다."
    }
    ```

 * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 친구 요청 수락을 실패했습니다."
    }
    ```



**Select Friend**
----
  친구 목록 불러오기.

* **URL**
    `/allfriend`

* **Method:**
    `GET`
  
* **URL Params**
    `NONE`

* **Data Params**
    `NONE`

* **Success Response:**

  * **Code:** `200` : 상대방이 나에게 친구 요청을 하지 않거나, 내가 상대방에게 친구 요청을 하지 않은 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": ""
            },
            {
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": ""
            },
            {
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": ""
            }
        ],
        "message": "[ALL FRIEND] 친구 목록을 성공적으로 가져왔습니다."
    }
    ```

* **Error Response:**

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[ALL FRIEND] 친구 목록을 가져오지 못했습니다."
    }
    ```



**Block Friend**
----
  친구 차단.

* **URL**
    `/block`

* **Method:**
    `PUT`
  
* **URL Params**
    `NONE`

* **Data Params**
    `email=[string]` 차단할 사용자 이메일, NULL[X]

* **Success Response:**

  * **Code:** `200` SUCCESS : 내가 상대방에게 친구 요청을 하고 친구가 되어 서로 차단하지 않은 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 3,
        "message": "[BLOCK] 성공적으로 test1를 차단하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 내가 상대방의 친구 요청을 수락하여 친구가 되어 서로 차단하지 않은 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 4,
        "message": "[BLOCK] 성공적으로 test1를 차단하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 상대방이 먼저 차단을 한 상태에서 내가 차단을 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 5,
        "message": "[BLOCK] 성공적으로 test1를 차단하였습니다."
    }
    ```

* **Error Response:**

  * **Code:** `403` FORBIDDEN : 로그인 한 이메일로 차단을 시도한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 스스로를 차단할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 친구 요청 상태인 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 친구가 아니므로 차단할 수 없습니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 이미 내가 상대방을 차단한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 이미 차단한 사용자입니다."
    }
    ```

   * **Code:** `404` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 사용자를 찾을 수 없습니다."
    }
    ```

  * **Code:** `404` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 친구를 찾을 수 없습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 친구 차단을 실패했습니다."
    }
    ```



**Unblock Friend**
----
  친구 차단 해제.

* **URL**
    `/unblock`

* **Method:**
    `PUT`
  
* **URL Params**
    `NONE`

* **Data Params**
    `email=[string]` 차단 해제할 사용자 이메일, NULL[X]

* **Success Response:**

  * **Code:** `200` SUCCESS : 내가 상대방에게 친구 요청을 하고 친구가 되어 서로 차단한 후 내가 차단 해제를 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 4,
        "message": "[UNBLOCK] 성공적으로 test1의 차단을 해제하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 내가 상대방의 친구 요청을 수락하여 친구가 되어 서로 차단한 후 내가 차단 해제를 한 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 3,
        "message": "[UNBLOCK] 성공적으로 test1를 차단하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 상대방이 먼저 차단을 한 상태에서 내가 차단 해제를 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 2,
        "message": "[UNBLOCK] 성공적으로 test1를 차단하였습니다."
    }
    ```

* **Error Response:**

  * **Code:** `403` FORBIDDEN : 로그인 한 이메일로 차단 해제를 시도한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[UNBLOCK] 스스로를 차단 해제할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 친구 요청 혹은 친구 상태이거나, 상대방이 나를 차단했어도 내가 상대방을 차단하지 않은 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[UNBLOCK] 아직 차단하지 않은 친구입니다."
    }
    ```

   * **Code:** `404` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[UNBLOCK] 사용자를 찾을 수 없습니다."
    }
    ```

  * **Code:** `404` NOT FOUND <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[UNBLOCK] 친구를 찾을 수 없습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[UNBLOCK] 친구 차단 해제를 실패했습니다."
    }
    ```
