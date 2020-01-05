## About Friend
----
  <_친구(friend) 정보에 접근하는 방법 (친구 검색, 생성, 확인, 차단, 차단 해제)_>
* **전제**
  로그인 후 쿠키 정보를 이용한 인증 필요

* **API call:**
  http://localhost:8000/friend
  http://54.180.118.35/friend



**Search Friend**
----
  친구 검색.

* **URL:**

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
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
            "portrait": "",
            "introduction": "",
            "type": -1
        },
        "message": "[SEARCH] 아직 친구 요청을 하지 않은 사용자입니다."
    }
    ```

  * **Code:** `200` 내가 친구요청을 하고 거절당하거나, 친구요청을 받고 거절한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
            "portrait": "",
            "introduction": "",
            "type": 0
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
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
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
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
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
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
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
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
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
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test@naver.com",
            "nickname": "test",
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

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[SEARCH] 사용자 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `404` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[SEARCH] 친구 조회 과정에서 에러가 발생하였습니다."
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

    `user_uid=[string]` 추가할 사용자 uid, NULL[X]
    `nickname=[string]` 추가할 사용자 닉네임, NULL[x]

* **Success Response:**

  * **Code:** `200` 1.내가 상대방에게 친구 요청을 했으나 거절 당하고 다시 친구 요청을 보낸 경우 <br>
              `201` 2.상대방이 나에게 친구 요청을 하지 않았고, 나도 상대방에게 친구 요청을 하지 않은 상태에서 친구 요청을 보낸 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 1,
        "message": "[CREATE] test1이 test2에게 친구 요청을 보냈습니다."
    }
    ```

  * **Code:** `200` : 상대방이 나에게 먼저 친구 요청을 하고, 내가 상대방에게 받은 친구 요청을 수락한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 2,
        "message": "[CREATE] test1이 test2의 친구 요청을 수락해서 친구가 되었습니다."
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
    
  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

 * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 친구 요청 과정에서 에러가 발생하였습니다."
    }
    ```

 * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[CREATE] 친구 요청 수락 과정에서 에러가 발생하였습니다."
    }
    ```



**Reject Friend**
----
  친구 거절.

* **URL**

    `/reject`

* **Method:**

    `PUT`
  
* **URL Params**

    `NONE`

* **Data Params**

    `user_uid=[string]` 거절할 사용자 uid, NULL[X]
    `nickname=[string]` 거절할 사용자 닉네임, NULL[x]

* **Success Response:**

  * **Code:** `200` 내가 상대방에게 받은 친구 요청을 거절한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 0,
        "message": "[REJECT] test1이 test2의 친구 요청을 거절했습니다."
    }
    ```

* **Error Response:**

  * **Code:** `403` FORBIDDEN : 로그인 한 이메일로 친구 요청을 거절한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[REJECT] 나 자신을 거절할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 내가 보낸 친구 요청을 내가 거절한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[REJECT] 내가 보낸 요청을 거절할 수 없습니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 이미 친구 이상의 관계인 친구 요청을 거절한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[REJECT] 친구 요청을 보낸 사용자가 아닙니다."
    }
    ```

  * **Code:** `404` NOT FOUND : 친구 요청을 보낸 적도, 받은 적도 없는 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[REJECT] 친구를 찾을 수 없습니다."
    }
    ```
    
  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[REJECT] 친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

 * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[REJECT] 친구 거절 과정에서 에러가 발생하였습니다."
    }
    ```



**Read All Friend Request(Send)**
----
  모든 보낸 친구 요청 목록 불러오기.

* **URL**

    `/allrequest/send`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Success Response:**

  * **Code:** `200` : 가져올 보낸 친구 요청 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "[ALL REQUEST|SEND] 가져올 보낸 친구 요청 목록이 없습니다."
    }
    ```

  * **Code:** `200` : 가져올 보낸 친구 요청 목록이 있는 경우 <br>
        첫째. 내가 상대방에게 친구 요청을 보내고 상대방이 거절하지 않은 경우(1) <br>
        둘째. 내가 상대방에게 친구 요청을 보내고 상대방이 거절한 경우(0) <br>
        친구 목록은 위 두 가지 경우를 전부 포함하여 반환합니다.<br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 0
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 0
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 1
            }
        ],
        "message": "[ALL REQUEST|SEND] 보낸 친구 요청 목록을 성공적으로 가져왔습니다."
    }
    ```

* **Error Response:**

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[ALL REQUEST|SEND] 보낸 친구 요청 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```



**Read All Friend Request(Receive)**
----
  모든 받은 친구 요청 목록 불러오기.

* **URL**

    `/allrequest/receive`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Success Response:**

  * **Code:** `200` : 가져올 받은 친구 요청 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "[ALL REQUEST|RECEIVE] 가져올 보낸 친구 요청 목록이 없습니다."
    }
    ```

  * **Code:** `200` : 가져올 받은 친구 요청 목록이 있는 경우 <br>
        친구 목록은 내가 상대방에게 친구 요청을 받고 거절하지 않은 경우(1)만 반환합니다.<br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 1
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 1
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 1
            }
        ],
        "message": "[ALL REQUEST|RECEIVE] 받은 친구 요청 목록을 성공적으로 가져왔습니다."
    }
    ```

* **Error Response:**

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[ALL REQUEST|RECEIVE] 받은 친구 요청 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```




**Read All Friend**
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

  * **Code:** `200` : 가져올 친구 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "[ALL FRIEND] 가져올 친구 목록이 없습니다."
    }
    ```

  * **Code:** `200` : 가져올 친구 목록이 있는 경우 <br>
        첫째. 나와 상대방이 친구 관계인 경우(2) <br>
        둘째. 상대방은 나를 차단했지만 나는 상대방을 차단하지 않은 경우(3 혹은 4) <br>
        친구 목록은 위 두 가지 경우를 전부 포함하여 반환합니다.<br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 2
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 3
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 4
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
        "message": "[ALL FRIEND] 친구 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```



**Read All Friend Block**
----
  친구 차단 목록 불러오기.

* **URL**

    `/allblock`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Success Response:**

  * **Code:** `200` : 가져올 친구 차단 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "[ALL BLOCK] 가져올 친구 차단 목록이 없습니다."
    }
    ```

  * **Code:** `200` : 가져올 친구 목록이 있는 경우 <br>
        첫째. 내가 상대방을 차단한 경우(3 혹은 4) <br>
        둘째. 내가 상대방을 차단하고, 상대방도 나를 차단한 경우(5) <br>
        친구 목록은 위 두 가지 경우를 전부 포함하여 반환합니다.<br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 3
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 4
            },
            {
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 5
            }
        ],
        "message": "[ALL BLOCK] 친구 차단 목록을 성공적으로 가져왔습니다."
    }
    ```

* **Error Response:**

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[ALL BLOCK] 친구 차단 목록 조회 과정에서 에러가 발생하였습니다."
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
 
    `user_uid=[string]` 거절할 사용자 uid, NULL[X]
    `nickname=[string]` 거절할 사용자 닉네임, NULL[x]

* **Success Response:**

  * **Code:** `200` SUCCESS : 내가 상대방에게 친구 요청을 하고 친구가 되어 서로 차단하지 않은 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 3,
        "message": "[BLOCK] 성공적으로 test를 차단하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 내가 상대방의 친구 요청을 수락하여 친구가 되어 서로 차단하지 않은 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 4,
        "message": "[BLOCK] 성공적으로 test1이 test2를 차단하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 상대방이 먼저 차단을 한 상태에서 내가 차단을 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 5,
        "message": "[BLOCK] 성공적으로 test를 차단하였습니다."
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
        "message": "[BLOCK] 친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 친구 차단 과정에서 에러가 발생하였습니다."
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
 
    `user_uid=[string]` 거절할 사용자 uid, NULL[X]
    `nickname=[string]` 거절할 사용자 닉네임, NULL[x]

* **Success Response:**

  * **Code:** `200` SUCCESS : 내가 상대방에게 친구 요청을 하고 친구가 되어 서로 차단한 후 내가 차단 해제를 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 4,
        "message": "[UNBLOCK] 성공적으로 test1이 test2의 차단을 해제하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 내가 상대방의 친구 요청을 수락하여 친구가 되어 서로 차단한 후 내가 차단 해제를 한 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 3,
        "message": "[UNBLOCK] 성공적으로 test1이 test2의 차단을 해제하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 상대방이 먼저 차단을 한 상태에서 내가 차단 해제를 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": 2,
        "message": "[UNBLOCK] 성공적으로 test1이 test2의 차단을 해제하였습니다."
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

  * **Code:** `403` FORBIDDEN : 친구 요청 상태인 경우<br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[BLOCK] 친구가 아니므로 차단할 수 없습니다."
    }
    ```

  * **Code:** `403` FORBIDDEN : 친구 상태이거나, 상대방이 나를 차단했어도 내가 상대방을 차단하지 않은 경우 <br>
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
        "message": "[UNBLOCK] 친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

  * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "[UNBLOCK] 친구 차단 해제 과정에서 에러가 발생했습니다."
    }
    ```