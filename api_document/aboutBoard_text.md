## About Board Text

  <_게시물(글) 생성, 수정_>
  * **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/board/cards/text
    http://54.180.118.35/board/cards/text
    ```
  *주소 변경됨: `/board/text`->`/board/cards/text`*

----
**Create Board TEXT**
----
게시물(글) 생성

* **URL**

  /

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  * `feedback_id=[integer]` 피드백 ID
  * `board_title=[string]` 게시물(글) 제목,
  * `board_content=[string]` 게시물(글) 내용

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 201 
      **Content:** 사용자가 생성한 게시물<br/>

      * **Sample response JSON data:**
        ```json
        {
            "success": true,
            "data": {
                "confirm": false,
                "id": 17,
                "board_title": "ddd",
                "board_content": "ddddsfd",
                "board_category": 0,
                "fk_feedbackId": "1",
                "updatedAt": "2020-01-30T11:29:18.112Z",
                "createdAt": "2020-01-30T11:29:18.112Z"
            },
            "message": "게시글(글) 생성 완료"
        }
        ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 게시물 생성 오류 발생<br/>
        **Content:** 
        ```json
            {
                "success": false,
                "data": "",
                "message": "게시글이 생성되지 않았습니다."
            }
        ```
    </div>
    </details>


----
**Update Board(Text) All**
----
게시물(글) 모든 항목 수정

* **URL**

  /:board_id

* **Method:**

  `PUT` 
  (이전 항목들의 내용과 다른 항목 모두 변경, null은 기존값유지)
  
*  **URL Params**

  * `board_id` 게시물 ID

* **Data Params**

  * `board_title=[string]` 게시물(글) 제목,
  * `board_content=[string]` 게시물(글) 내용

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 200 
    **Content:** 사용자가 수정한 게시물 데이터<br/>

    * **Sample response JSON data:**
      ```json
      {
          "success": true,
          "data": {
              "id": 17,
              "board_category": 0,
              "board_title": "update 17",
              "board_content": "update 17",
              "board_file1": null,
              "board_file2": null,
              "board_file3": null,
              "confirm": false,
              "createdAt": "2020-01-30T11:29:18.000Z",
              "updatedAt": "2020-01-30T11:31:28.000Z",
              "deletedAt": null,
              "fk_feedbackId": 1
          },
          "message": "게시글(글) 전체 수정 성공"
      }
      ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 게시물 수정 오류 발생 (catch) <br/>
        **Content:** 
        ```json
            {
                "success": false,
                "data": "",
                "message": "INTERNAL SERVER ERROR"
            }
        ```
    </div>
    </details>