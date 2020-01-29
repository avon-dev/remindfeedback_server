**기본주석법**
----
  <_주석 달 때 '//'이 아닌 '/** ...*/'로 적을 것. 그래야 api 문서 변환툴 사용가능_>
  ```javascript
    /**
    * This function adds one to its input.
    * @param {number} input any number
    * @returns {number} that number, plus one.
    */
    function addOne(input) {
    return input + 1;
    }
```

* **Parameter**
  <_@param {number} input any number_>
    * @param: 이 함수의 인자를 가리키는 태그
    * {number}: 이 인자의 (자바스크립트) 데이터 타입 (number, string, Object 등등)
    * input: 이 인자의 이름 ([input=5]로 넣으면 input변수의 기본값이 5가 됨)
    * any number: 이 인자에 대한 설명

  <_@returns {number} that number, plus one._>
    * @returns : 이 함수의 리턴값임을 가리키는 태그

* **Tags**
  <_JSDoc 기준 tag_>
    * @param : 이 함수의 파라미터
    * @returns : 이 함수의 리턴값
    * @name : 이 함수, 클래스, 변수의 이름을 외부에서 지정할 때

* **Response:**
    <details>
    <summary>Success Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>
    <details>
    <summary>Error Response</summary>
    <div markdown="1">

    <!-- 위에 공백 1줄 두고 이 안에 기존 내용 붙이기 (Code ~ )-->
    </div>
    </details>

