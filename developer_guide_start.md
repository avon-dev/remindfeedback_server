## Overview

**Root Endpoint**
----
  http://localhost:3000

**Client Errors**
----
  <_RemindFeedback에서 사용하는 client 에러 정리:_>

* **invalid한 JSON을 보낸 경우: `400 Bad Request` response.**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Problems parsing JSON" }`

* **body의 데이터타입이 JSON이 아닌 경우: `400 Bad Request` response.**
  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ error : "Body should be a JSON object." }`

* **invalid한 field를 보낸 경우(처리불가객체): `422 Unprocessable Entity` response.**
  * **Code:** 422 Unprocessable Entity <br />
    **Content:** `{ error : "Sending invalid fields." }`

* **접근 권한이 없는 경우: `401 Unauthorized` or `403 Forbidden` response.**
  * **Code:** 401 Unauthorized or 403 Forbidden <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **요청한 페이지가 없음: `404 Not Found` reponse.**
  * **Code:** 404 Not Found <br />
    **Content:** `{ error : "Page doesn't exist" }`


**Server Errors**
----
  <_RemindFeedback에서 사용하는 server 에러 정리:_>

* **서버 내부 오류: `500 Internal Server Error` response.**
  * **Code:** 500 Internal Server Error <br />
    **Content:** `{ error : "Problems in Server." }`

* **서비스 사용 불가: `503 Service Unavailable` response.**
  * **Code:** 503 Service Unavailable <br />
    **Content:** `{ error : "This service is not available now." }`



**HTTP redirects**
----
  <_RemindFeedback에서 사용하는 (request body를 사용하는)기본 client 에러 정리:_>

* **헤더 필드의 'location'에 지정된 주소로 영구 리다이렉팅**
  * **Code:** 301 Permanent redirection <br />

* **임시 리다이렉팅**
  * **Code:** 302 Temporary redirection <br />

**HTTP verbs (methods)**
----
  <_RemindFeedback에서 사용하는 HTTP methods 정리_>

* **HEAD**
  * **Description:** Can be issued against any resource to get just the HTTP header info. <br />

* **GET**
  * **Description:** 리소스 얻어야 하는 경우 <br />

* **POST**
  * **Description:** 새 리소스 생성하는 경우 <br />

* **PATCH**
  * **Description:** 일부 JSON 데이터를 이용해서 리소스 업데이트할 경우<br />

* **PUT**
  * **Description:** 리소스, 혹은 콜렉션을 교체(전면 수정)할 경우 <br />

* **DELETE**
  * **Description:** 리소스 삭제할 경우 <br />

**Pagination**
----
  <_아이템 여러 개를 반환하는 request에는 기본적으로 아이템 20개를 제공한다. 특정 페이지로 가고 싶을 때는 `?page` 파라미터로 접근할 수 있다. 또한 직접 `?per_page`파라미터를 사용해 페이지의 사이즈를 직접 조정할 수 있다._>

* **Example:**
  'http://localhost:3000/feedbacks/page=2&per_page=100' <br />




