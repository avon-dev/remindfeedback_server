# remindFeedback_backend_test_api
## 설치 순서
### 1. git clone
    npm 설치를 우선 합니다
	해당 소스 코드를 받습니다.

###	2. npm i
	package.json 에 있는 패키지들을 설치합니다.
    명령어 npm i

###	3. mariaDB설치
https://mariadb.com/downloads/#mariadb_platform-mariadb_server
    에서 설치

### 4. 데이터베이스 config
    mariaDB를 설치하면 자동으로 HeidiSQL GUI 툴이 설치됩니다 HeidiSQL 을 실행하면 DB 포트를 설정합니다
    초기 설정으로 server-test/config/config.json 파일에 port 가 3307로 설정되어 있습니다 
    기존에 mysql 과 같은 DB를 사용하여 3306포트 번호를 사용하고 있기에 설정한 것이니 불필요하면
    변경하거나 삭제하면 됩니다.

### 5. 데이터베이스 생성
    데이터베이스를 직접 생성해주셔야 서버가 작동이 됩니다.
    자동 마이그레이션은 테이블만 가능합니다

    config 파일에 적혀있는 정보대로
    계정 : root
    비번 : avon
    DB명 : rf_db
    로 데이터베이스를 만들어 줍니다.

### 6. 서버 실행
    server-test/ 폴더에서
    npm start로 실행시킵니다. 
    서버 주소는 localhost:8000/ 으로 설정되었습니다.

### 7. Auth
    회원가입, 로그인, 내정보, 로그아웃 api는 aboutAuth.md 참고
    jwt 개념 참고 url : https://tansfil.tistory.com/59
https://tansfil.tistory.com/59