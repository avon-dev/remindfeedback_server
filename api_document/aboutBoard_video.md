## About Board Video

  <_게시물(영상) 생성, 수정_>
  * **전제**
    ```
    로그인 후 쿠키 정보를 이용한 인증 필요
    ```

* **API call:**
    ```
    http://localhost:8000/board/cards/video
    http://54.180.118.35/board/cards/video
    ```
  *주소 변경됨: `/board/video`->`/board/cards/video`*

----

**Create Board VIDEO**
----
게시물(영상) 생성

* **URL**

  /

* **Method:**

  `POST`
  
*  **URL Params**
 
   None

* **Data Params**

    (form-data 형식)
    * `feedback_id=[integer]` 피드백 ID
    * `board_title=[string]` 게시물(영상) 제목,
    * `board_content=[string]` 게시물(영상) 내용
    * `videofile=[file]` 영상 (key 값은 videofile)

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
                "id": 22,
                "board_title": "제2",
                "board_content": "내2",
                "board_category": 2,
                "fk_feedbackId": "1",
                "board_file1": "video/1580387702596test_video.mp4",
                "updatedAt": "2020-01-30T12:35:03.010Z",
                "createdAt": "2020-01-30T12:35:03.010Z"
            },
            "message": "게시글(영상) 생성 완료"
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
                "message": "영상 게시글이 생성되지 않았습니다."
            }
        ```
    </div>
    </details>



----
**Update Board(Video) All**
----
게시물(영상) 모든 항목 수정

* **URL**

  /:board_id

* **Method:**

  `PUT` (이전 항목들의 내용과 다른 항목 모두 변경, null은 기존값유지)
  
  ```
  < 영상관련 설명 >

  하나의 게시물에 업로드 할 수 있는 영상은 총 1개 입니다.
  영상을 유지, 수정, 삭제 의 총 3가지 작업을 할 수 있습니다.

  * updatefile = 변경여부
  * videofile = 파일 데이터

  1. 기존 영상 유지
  updatefile1 = false,
  videofile = null
  
  2. 새로운 영상 수정
  updatefile1 = true,
  videofile = file

  3. 기존 영상 삭제
  updatefile1 = true,
  videofile = null
  ```  

*  **URL Params**
 
    * `board_id` 게시물 ID

* **Data Params**
    
    * `board_title=[string]` 게시물(영상) 제목,
    * `board_content=[string]` 게시물(영상) 내용
    <br/>
    * `updatefile1=[boolean]` 영상 변경 여부 (true 일시 기존데이터 삭제)
    * `videofile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
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
                "id": 21,
                "board_category": 2,
                "board_title": "update",
                "board_content": "update",
                "board_file1": "video/1580387737927test_video.mp4",
                "board_file2": null,
                "board_file3": null,
                "confirm": false,
                "createdAt": "2020-01-30T12:30:37.000Z",
                "updatedAt": "2020-01-30T12:35:38.000Z",
                "deletedAt": null,
                "fk_feedbackId": 1
            },
            "message": "게시글(영상) 전체 수정 성공"
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
**Update Board FILE**
----
게시물 영상 수정

* **URL**

  /file/:board_id

* **Method:**

  `PATCH`
  
*  **URL Params**
 
    * `board_id` 게시물 ID

* **Data Params**
 
    * `updatefile1=[boolean]` 영상 변경 여부 (true 일시 기존데이터 삭제)
    * `videofile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile1=[boolean]` 영상 변경 여부 (true 일시 기존데이터 삭제)
    * `videofile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
    <br/>
    * `updatefile1=[boolean]` 영상 변경 여부 (true 일시 기존데이터 삭제)
    * `videofile=[file]` 파일 존재시 파일명으로 DB update / 파일없으면 null  DB update
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
                "id": 21,
                "board_category": 2,
                "board_title": "update",
                "board_content": "update",
                "board_file1": "video/1580387579953test_video.mp4",
                "board_file2": null,
                "board_file3": null,
                "confirm": false,
                "createdAt": "2020-01-30T12:30:37.000Z",
                "updatedAt": "2020-01-30T12:33:00.000Z",
                "deletedAt": null,
                "fk_feedbackId": 1
            },
            "message": "게시글(영상) 일부 수정 성공"
        }
        ```
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    * **Code:** 500 게시물(음성) 수정 오류 발생<br/>
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
