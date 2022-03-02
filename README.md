# 1. wetube-2021

![wetube](readme/momentom.jpg)



- # 사용기술

- - [x]  pug 사용
       
        - extends로 상속하여 코드 반복 방지
        - partials을 통해 코드 반복 방지
        - mixin을 사용하여 코드 반복 방지
  ---
- - [x]  MongoDB 및 Mongoose를 사용하여 서버연결

        - mongoDB를 mongoose를 통해 연결
        - Schema로 model을 인스턴스화 시켜 DB의 데이터를 구현
        - queries를 사용하여 CRUD방식 사용 
 
  ---
- - [x]  회원가입, 로그인,로그아웃,비밀번호 변경 구현

        - bcrypt를 사용하여 비밀번호 hashing
        - session을 사용하여, 로그인 구현 
        - fetch를 사용하여 github로 로그인 구현
        - session을 Destroy하여 로그아웃 구현
        - bcrypt compare함수를 이용해 비밀번호 체크후 변경 구현 
  ---
  
- - [x]  Middle Ware 사용 (전역변수, 파일 업로드) 

        - locals를 이용하여, 전역변수 설정 및 사용
        - protect,private middleware를 통해 사이트 보안 유지 
        - multer MiddleWare를 이용한 사진 및 비디오 업로드 
  ---


- - [x]   User,Video 를 서로 연결

        - ref, objectId를 통해 Video, User를 연결.
        - populate를 사용하여, pug에서 obj사용.
        - 
     
  ---

