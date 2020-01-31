## About Friend
----
  <_친구(friend) 정보에 접근하는 방법 (친구 검색, 생성, 확인, 차단, 차단 해제)_>

* **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/friends
    http://54.180.118.35/friends
    ```

* **반환되는 값 중 Type의 정의**
    ```
    [-1] : 서로 아무 사이도 아닌 경우
    [0] : A가 B에게 친구요청을 했으나 B가 거절한 경우
    [1] : A가 B에게 친구요청을 보낸 경우
    [2] : A와 B가 친구인 경우
    [3] : A가 B를 차단한 경우
    [4] : B가 A를 차단한 경우
    [5] : A와 B가 서로를 차단한 경우
    ```

* **상황 별 친구 관계 설명**
    <details>
    <summary>더보기</summary>
    <div markdown="1">

    ```
    [친구 요청]
    1. A가 B에게 친구 요청을 보낸 경우 : A가 B에게 친구 요청을 보냈으므로 상태가 [1]로 바뀝니다.
        1.1. B가 거절한 경우 : A의 친구 요청 목록에는 변화가 없으며, B가 거절했으므로 상태가 [0]으로 바뀝니다.
        1.2. B가 수락한 경우 : A의 친구 요청 목록에는 변화가 없으며, B가 수락했으므로 상태가 [2]으로 바뀝니다.
    
    +) 기타 예외상황인 경우 그에 맞는 응답을 반환합니다.
    +) 친구 요청을 보내고 상대방이 무응답인 경우, 상대방이 거절하기 전엔 재요청할 수 없습니다.

    [차단]
    1. A가 B를 차단한 경우 
        1.1. B가 A를 차단하지 않은 경우[2] : A의 차단 목록에 B가 추가되며, A가 B를 차단하므로 상태가 [3]으로 바뀝니다.
        1.2. B가 A를 차단한 경우[4] : A의 차단 목록에 B가 추가되며, 서로 차단했으므로 상태가 [5]로 바뀝니다.
    2. B가 A를 차단한 경우 
        2.1. A가 B를 차단하지 않은 경우[2] : A의 친구 목록에 B가 남아 있으며, B가 A를 차단하므로 상태가 [4]로 바뀝니다.
        2.2. A가 B를 차단한 경우[3] : A의 차단 목록에는 변화가 없으며, 서로 차단했으므로 상태가 [5]로 바뀝니다.

    [차단 해제]
    1. A가 B를 차단 해제한 경우
        1.1. B가 A를 차단하지 않은 경우[3] : A의 친구 목록에 B가 추가되며, A와 B는 다시 친구 관계가 되므로 상태가 [2]로 바뀝니다.
        1.2. B가 A를 차단한 경우[5] : A의 친구 목록에 B가 추가되지만, B의 차단은 유지되므로 상태가 [4]로 바뀝니다.
    2. B가 A를 차단 해제한 경우 
        2.1. A가 B를 차단하지 않은 경우[4] : A의 친구 목록은 변하지 않으며, A와 B는 다시 친구 관계가 되므로 상태가 [2]로 바뀝니다.
        2.2. A가 B를 차단한 경우[5] : A의 차단 목록에는 변화가 없으며, A의 차단은 유지되므로 상태가 [3]으로 바뀝니다.
    
    +) 기타 예외상황인 경우 그에 맞는 응답을 반환합니다.
    +) 친구 관계가 아닌 경우 차단/차단해제 할 수 없습니다.
    +) 서로 친구 관계가 되고 나면, 차단 및 차단 해제는 자유롭지만 친구 목록에서 친구를 삭제할 수 없습니다.
    ```
    
    </div>
    </details>

**Create Friend**
----
  친구 요청 및 수락.

* **URL**

    `/`

* **Method:**

    `POST`
  
* **URL Params**

    `NONE`

* **Data Params**

    `user_uid=[string]` 추가할 사용자 uid, NULL[X]

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 
    `200` 1.내가 상대방에게 친구 요청을 했으나 거절 당하고 다시 친구 요청을 보낸 경우 <br>
    `201` 2.상대방이 나에게 친구 요청을 하지 않았고, 나도 상대방에게 친구 요청을 하지 않은 상태에서 친구 요청을 보낸 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 1
        },        
        "message": "test1이 test2에게 친구 요청을 보냈습니다."
    }
    ```

    * **Code:** `200` : 상대방이 나에게 먼저 친구 요청을 하고, 내가 상대방에게 받은 친구 요청을 수락한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 2
        },
        "message": "test1이 test2의 친구 요청을 수락해서 친구가 되었습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `200` FORBIDDEN : 로그인 한 이메일로 친구를 추가한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "나 자신을 추가할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 서로 친구이거나 차단한 상태인 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "서로 친구이거나 차단한 사용자입니다."
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
        "message": "친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 요청 과정에서 에러가 발생하였습니다."
    }
    ```

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 요청 수락 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Search Friend**
----
  친구 검색.

* **URL:**

    `/search`

* **Method:**

    `POST`
  
* **URL Params**

    `NONE`

* **Data Params**

    `email=[string]` 검색할 사용자 이메일, NULL[X]

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

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
        "message": "아직 친구 요청을 하지 않은 사용자입니다."
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
        "message": "내가 친구 요청을 한(받은) 사용자입니다."
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
        "message": "내가 친구 요청을 한(받은) 사용자입니다."
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
        "message": "이미 친구로 등록된 사용자입니다."
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
        "message": "내가(나를) 차단한 사용자입니다."
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
        "message": "내가(나를) 차단한 사용자입니다."
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
        "message": "서로 차단한 상태입니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `200` FORBIDDEN : 로그인 한 이메일로 검색한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "나 자신은 인생의 영원한 친구입니다."
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
        "message": "친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Read All Friend**
----
  친구 목록 불러오기.

* **URL**

    `/`

* **Method:**
 
    `GET`
  
* **URL Params**

    `NONE`

* **Data Params**
 
    `NONE`

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` : 가져올 친구 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "가져올 친구 목록이 없습니다."
    }
    ```

    * **Code:** `200` : 가져올 친구 목록이 있는 경우 <br>
    ```
    첫째. 나와 상대방이 친구 관계인 경우(2)
    둘째. 상대방은 나를 차단했지만 나는 상대방을 차단하지 않은 경우(3 혹은 4)
    친구 목록은 위 두 가지 경우를 전부 포함하여 반환합니다.
    ```
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 2
            },
            {
                "id": 2,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 3
            },
            {
                "id": 3,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 4
            }
        ],
        "message": "친구 목록을 성공적으로 가져왔습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Read All Adviser**
----
  조언자 목록 불러오기.

* **URL**

    `/adviser`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` : 가져올 조언자 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "가져올 조언자 목록이 없습니다."
    }
    ```

    * **Code:** `200` : 가져올 조언자 목록이 있는 경우 <br>
    ```
    조언자 목록은 나와 상대방이 친구 관계인 경우(2)만 반환합니다.
    ```
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 2
            },
            {
                "id": 2,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 2
            }
        ],
        "message": "조언자 목록을 성공적으로 가져왔습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "조언자 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>


**Read All Friend Transmission**
----
  모든 보낸 친구 요청 목록 불러오기.

* **URL**

    `/transmission`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` : 가져올 보낸 친구 요청 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "가져올 보낸 친구 요청 목록이 없습니다."
    }
    ```

    * **Code:** `200` : 가져올 보낸 친구 요청 목록이 있는 경우 <br>
    ```
    첫째. 내가 상대방에게 친구 요청을 보내고 상대방이 거절하지 않은 경우(1)
    둘째. 내가 상대방에게 친구 요청을 보내고 상대방이 거절한 경우(0)
    친구 목록은 위 두 가지 경우를 전부 포함하여 반환합니다.
    ```
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 0
            },
            {
                "id": 2,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 0
            },
            {
                "id": 3,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 1
            }
        ],
        "message": "보낸 친구 요청 목록을 성공적으로 가져왔습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "보낸 친구 요청 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Read All Friend Reception**
----
  모든 받은 친구 요청 목록 불러오기.

* **URL**

    `/reception`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` : 가져올 받은 친구 요청 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "가져올 보낸 친구 요청 목록이 없습니다."
    }
    ```

    * **Code:** `200` : 가져올 받은 친구 요청 목록이 있는 경우 <br>
    ```
    모든 받은 친구 목록은 내가 상대방에게 친구 요청을 받고 거절하지 않은 경우(1)만 반환합니다.
    ```
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 1
            },
            {
                "id": 2,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 1
            },
            {
                "id": 3,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 1
            }
        ],
        "message": "받은 친구 요청 목록을 성공적으로 가져왔습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "받은 친구 요청 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Read All Friend Block**
----
  친구 차단 목록 불러오기.

* **URL**

    `/block`

* **Method:**
 
    `GET`
  
* **URL Params**

   `NONE`

* **Data Params**
 
    `NONE`

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` : 가져올 친구 차단 목록이 없는 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": "",
        "message": "가져올 친구 차단 목록이 없습니다."
    }
    ```

    * **Code:** `200` : 가져올 친구 목록이 있는 경우 <br>
    ```
    첫째. 내가 상대방을 차단한 경우(3 혹은 4)
    둘째. 내가 상대방을 차단하고, 상대방도 나를 차단한 경우(5)
    친구 목록은 위 두 가지 경우를 전부 포함하여 반환합니다.
    ```
    **Content:** 
    ```json
    {
        "success": true,
        "data": [
            {
                "id": 1,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test1@naver.com",
                "nickname": "test1",
                "portrait": "",
                "introduction": "",
                "type": 3
            },
            {
                "id": 2,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test2@naver.com",
                "nickname": "test2",
                "portrait": "",
                "introduction": "",
                "type": 4
            },
            {
                "id": 3,
                "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
                "email": "test3@naver.com",
                "nickname": "test3",
                "portrait": "",
                "introduction": "",
                "type": 5
            }
        ],
        "message": "친구 차단 목록을 성공적으로 가져왔습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 차단 목록 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Reject Friend**
----
  친구 거절.

* **URL**

    `/rejection/:friend_id`

* **Method:**

    `PATCH`
  
* **URL Params**

    `NONE`

* **Data Params**

    `user_uid=[string]` 거절할 사용자 uid, NULL[X] <br>
    `friend_id=[integer]` 거절할 친구 테이블 id, NULL[X]

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` 내가 상대방에게 받은 친구 요청을 거절한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 0
        },
        "message": "test1이 test2의 친구 요청을 거절했습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `200` FORBIDDEN : 로그인 한 이메일로 친구 요청을 거절한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "나 자신을 거절할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 내가 보낸 친구 요청을 내가 거절한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "내가 보낸 요청을 거절할 수 없습니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 이미 친구 이상의 관계인 친구 요청을 거절한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 요청을 보낸 사용자가 아닙니다."
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

    * **Code:** `200` NOT FOUND : 친구 요청을 보낸 적도, 받은 적도 없는 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구를 찾을 수 없습니다."
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
        "message": "친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 거절 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Block Friend**
----
  친구 차단.

* **URL**
 
    `/block/:friend_id`

* **Method:**
 
    `PATCH`
  
* **URL Params**
 
    `NONE`

* **Data Params**
 
    `user_uid=[string]` 차단할 사용자 uid, NULL[X] <br>
    `friend_id=[integer]` 거절할 친구 테이블 id, NULL[X]

 **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` SUCCESS : 내가 상대방에게 친구 요청을 하고 친구가 되어 서로 차단하지 않은 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 3
        },
        "message": "성공적으로 test1이 test2를 차단하였습니다."
    }
    ```

  * **Code:** `200` SUCCESS : 내가 상대방의 친구 요청을 수락하여 친구가 되어 서로 차단하지 않은 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 4
        },
        "message": "성공적으로 test1이 test2를 차단하였습니다."
    }
    ```

    * **Code:** `200` SUCCESS : 상대방이 먼저 차단을 한 상태에서 내가 차단을 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 5
        },
        "message": "성공적으로 성공적으로 test1이 test2를 차단하였습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `200` FORBIDDEN : 로그인 한 이메일로 차단을 시도한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "스스로를 차단할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 친구 요청 상태인 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구가 아니므로 차단할 수 없습니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 이미 내가 상대방을 차단한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "이미 차단한 사용자입니다."
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
        "message": "친구를 찾을 수 없습니다."
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
        "message": "친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 차단 과정에서 에러가 발생하였습니다."
    }
    ```

    </div>
    </details>



**Unblock Friend**
----
  친구 차단 해제.

* **URL**
 
    `/unblock/:friend_id`

* **Method:**
 
    `PATCH`
  
* **URL Params**
 
    `NONE`

* **Data Params**
 
    `user_uid=[string]` 차단 해제할 사용자 uid, NULL[X] <br>
    `friend_id=[integer]` 거절할 친구 테이블 id, NULL[X]

* **Response**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** `200` SUCCESS : 내가 상대방에게 친구 요청을 하고 친구가 되어 서로 차단한 후 내가 차단 해제를 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 4
        },
        "message": "성공적으로 test1이 test2의 차단을 해제하였습니다."
    }
    ```

    * **Code:** `200` SUCCESS : 내가 상대방의 친구 요청을 수락하여 친구가 되어 서로 차단한 후 내가 차단 해제를 한 경우  <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 3
        },
        "message": "성공적으로 test1이 test2의 차단을 해제하였습니다."
    }
    ```

    * **Code:** `200` SUCCESS : 상대방이 먼저 차단을 한 상태에서 내가 차단 해제를 한 경우 <br>
    **Content:** 
    ```json
    {
        "success": true,
        "data": {
            "user_uid": "sdfgh^&^$%@@#qrwgsh@%%uiukjhht%&iujhgfe%y&iuyhgfd",
            "email": "test2@naver.com",
            "nickname": "test2",
            "portrait": "",
            "introduction": "",
            "type": 2
        },
        "message": "성공적으로 test1이 test2의 차단을 해제하였습니다."
    }
    ```
    
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** `200` FORBIDDEN : 로그인 한 이메일로 차단 해제를 시도한 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "스스로를 차단 해제할 수 없습니다. 나 자신은 인생의 영원한 친구입니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 친구 요청 상태인 경우<br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구가 아니므로 차단 해제할 수 없습니다."
    }
    ```

    * **Code:** `200` FORBIDDEN : 친구 상태이거나, 상대방이 나를 차단했어도 내가 상대방을 차단하지 않은 경우 <br>
    **Content:**
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "아직 차단하지 않은 친구입니다."
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
        "message": "친구를 찾을 수 없습니다."
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
        "message": "친구 조회 과정에서 에러가 발생하였습니다."
    }
    ```

    * **Code:** `500` INTERNAL SERVER ERROR <br>
    **Content:** 
    ```json
    {
        "success": false,
        "data": "NONE",
        "message": "친구 차단 해제 과정에서 에러가 발생했습니다."
    }
    ```

    </div>
    </details>