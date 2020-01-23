## api 로그 작성법
----
  <_API 로그 작성법에 대한 안내_>

* **전제**
    ```
    로그를 작성하기 위해 추가적인 모듈 설치가 필요합니다.

    $ npm install winston
    $ npm install moment
    $ npm install moment-timezone
    $ npm install request-ip

    명령어 실행 후 package.json의 dependency 항목 확인이 필요합니다.
    ```

* **Logging Level의 심각도 기준**
    ```
     winston의 Logging Level은 RFC5424에서 지정한 syslog 심각도 기준과 유사합니다.

    [0] emerg(Emergency) : 시스템이 사용 불가능(system is unusable)
    [1] alert(Alert) : 즉시 조치를 취해야 함(action must be taken immediately)
    [2] crit(Critical) : 치명적인 조건(critical conditions)
    [3] error(Error) : 에러 조건(error conditions)
    [4] warning(Warning) : 경고 조건(warning conditions)
    [5] notice(Notice) : 정상이지만 중대한 조건(normal but significant condition)
    [6] info(Informational) : 정보 메세지(informational messages)
    [7] debug(Debug) : 디버그-레벨 메세지(debug-level messages)

    각 레벨에는 숫자로 된 우선 순위가 부여되며, 숫자가 낮을 수록 중요하게 취급됩니다.
    예를 들어, Error보다 Emergency의 숫자가 더 낮으며, 더 중요한 메세지를 담고 있습니다.
    ```

* **Logging Level**
    ```
    winston의 Logging Level은 따로 지정하지 않을 시 npm의 Logging Level을 따릅니다.

    [0] error : 오류를 일으키는 문제
    [1] warn : 오류는 아니지만 발생할 수 있는 문제
    [2] info : 일반적인 사용을 위해 예상할 수 있는 정보 메세지
    [3] verbose : info보다 폭넓은 의미에서의 메세지
    [4] debug : 개발 단계에서만 유용한 디버그 메세지
    [5] silly : 개발 단계에서 유용하진 않으나 확인을 위해 필요한 메세지

    +) 로그 파일을 생성할 때, Level을 설정할 수 있습니다. 일반적으로 선택한 Level의 상위 메세지는 전부 로그 파일에 출력됩니다. 예를 들어 debug 레벨을 선택한 경우, verbose부터 error 메세지까지 전부 출력됩니다.
    ```


* **실제 사용**
    ```
    1. logger를 사용할 js 파일 상단에 winston.js 파일의 경로를 추가합니다.
      const winston = require('./config/winston');

    2. 아래 예시 중 하나를 선택해서 로그를 출력합니다.
    2.1. Logging Level을 나타내는 문자열을 log() 메소드에 전달
      winston.log('error', 'Hello World!');
      winston.log('warn', 'Hello World!');
      winston.log('info', 'Hello World!');
      winston.log('verbose', 'Hello World!');
      winston.log('debug', 'Hello World!');
      winston.log('silly', 'Hello World!');

    2.2. winston Logger에 정의된 메소드 사용
      winston.error('Hello World!');
      winston.warn('Hello World!');
      winston.info('Hello World!');
      winston.verbose('Hello World!');
      winston.debug('Hello World!');
      winston.silly('Hello World!');
    ```