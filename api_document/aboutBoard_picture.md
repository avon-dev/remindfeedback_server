## About Board Picture

  <_게시물(사진) 생성, 수정_>
  * **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/board/cards/picture
    http://54.180.118.35/board/cards/picture
    ```
  *주소 변경됨: `/board/picture`->`/board/cards/picture`*

----

**Create Board PICTURE**
----
게시물(사진) 생성

* **URL**

  /

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  (form-data 형식)
  * `feedback_id=[integer]` 피드백 ID
  * `board_title=[string]` 게시물(사진) 제목,
  * `board_content=[string]` 게시물(사진) 내용
  * `file1=[file]` 사진1 (key 값은 file1)
  * `file2=[file]` 사진2 (key 값은 file2)
  * `file3=[file]` 사진3 (key 값은 file3)

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
                "id": 18,
                "board_title": "제2",
                "board_content": "내2",
                "board_category": 1,
                "fk_feedbackId": "1",
                "board_file1": "picture/1580384368786round_logo_512px_blue_gradation.png",
                "board_file2": "picture/1580384368787round_logo_512px_green_gradation.png",
                "board_file3": "picture/1580384368787round_logo_512px_purple_gradation.png",
                "updatedAt": "2020-01-30T11:39:29.063Z",
                "createdAt": "2020-01-30T11:39:29.063Z"
            },
            "message": "게시글(사진) 생성 완료"
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
                "message": "사진 게시글이 생성되지 않았습니다."
            }
        ```

    * **Code:** 500 서버 에러<br/>
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


----
**Update Board(Picture) All**
----
게시물(사진) 모든 항목 수정

* **URL**

  /:board_id

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경, null은 기존값유지)
  
  ```
  < 사진관련 설명 >

  하나의 게시물에 업로드 할 수 있는 사진은 총 3장입니다.
  각 사진을 유지, 수정, 삭제 의 총 3가지 작업을 할 수 있습니다.
  
  * updatefile = 변경여부
  * file = 파일 데이터

  1. 기존 사진 유지
  updatefile1 = false,
  file1 = null
  
  2. 새로운 사진 수정
  updatefile1 = true,
  file1 = file

  3. 기존 사진 삭제
  updatefile1 = true,
  file1 = null
  ```

*  **URL Params**
 
    * `board_id` 게시물 ID

* **Data Params**
    
    * `board_title=[string]` 게시물(사진) 제목,
    * `board_content=[string]` 게시물(사진) 내용
    <br/>
    * `updatefile1=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file1=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile2=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file2=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile3=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file3=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 200 
      **Content:** 사용자가 수정한 게시물<br/>

      * **Sample response JSON data:**
        ```json
        {
            "success": true,
            "data": {
                "id": 18,
                "board_category": 1,
                "board_title": "제2",
                "board_content": "내2",
                "board_file1": "picture/1580384698347round_logo_512px_green_gradation.png",
                "board_file2": "picture/1580384368787round_logo_512px_green_gradation.png",
                "board_file3": "picture/1580384368787round_logo_512px_purple_gradation.png",
                "confirm": false,
                "createdAt": "2020-01-30T11:39:29.000Z",
                "updatedAt": "2020-01-30T11:44:58.000Z",
                "deletedAt": null,
                "fk_feedbackId": 1
            },
            "message": "게시글(사진) 전체 수정 성공"
        }
        ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 500 게시물 수정 오류 발생<br/>
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


----
**Update Board FILES**
----
게시물 사진 수정

* **URL**

  /files/:board_id

* **Method:**

  `PATCH`
  
*  **URL Params**

    * `board_id` 게시물 ID

* **Data Params**

    * `updatefile1=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file1=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile2=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file2=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile3=[boolean]` 사진 변경 여부 (true 일시 기존데이터 삭제)
    * `file3=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    * **Code:** 200 
      **Content:** 사용자가 수정한 게시물<br/>

      * **Sample response JSON data:**
        ```json
        {
            "success": true,
            "data": {
                "id": 18,
                "board_category": 1,
                "board_title": "제2",
                "board_content": "내2",
                "board_file1": "picture/1580384852730round_logo_512px_green_gradation.png",
                "board_file2": "picture/1580384852731round_logo_512px_green_gradation.png",
                "board_file3": "picture/1580384368787round_logo_512px_purple_gradation.png",
                "confirm": false,
                "createdAt": "2020-01-30T11:39:29.000Z",
                "updatedAt": "2020-01-30T11:47:33.000Z",
                "deletedAt": null,
                "fk_feedbackId": 1
            },
            "message": "게시글(사진) 일부 수정 성공"
        }
        ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 500 게시물(사진) 수정 오류 발생<br/>
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
