# 주제

날씨에 맞는 음식 추천 웹 어플리케이션

## 개요

momokji는 무엇을 먹을지 고민하는 분들을 위해 개발되었습니다.
날씨를 기반으로 한 사람들의 음식 선택 통계자료를 바탕으로 현재 날씨와 계절에 기반한 음식 메뉴를 추천하고, 그에 따른 내 주변의 음식점을 제시합니다.

## 프로젝트 목표

- 지인과 만났을 때 무엇을 먹을지 고민하는 시간 단축

  저희와 같이 음식 선택장애가 있는 분들께 현재 날씨, 계절에 따른 신뢰도 있는 메뉴를 추천합니다.

- 주변 음식점 추천

  메뉴 추천에 그치지 않고, 해당 메뉴들을 판매하는 음식점까지 알려주고, '나에게 카카오톡'으로 음식점 정보를 보낼 수 있어 편리합니다.
  
## 스크린샷
- 메인화면
<img width="441" alt="스크린샷 2021-06-22 오후 4 31 01" src="https://user-images.githubusercontent.com/29617557/122882861-9045e200-d377-11eb-8f88-7f562f117549.png">
- 지도
<img width="527" alt="스크린샷 2021-06-22 오후 4 31 44" src="https://user-images.githubusercontent.com/29617557/122882880-963bc300-d377-11eb-9ccb-ce1a6ec69c39.png">
- 마커 클릭 시
<img width="552" alt="스크린샷 2021-06-22 오후 4 32 19" src="https://user-images.githubusercontent.com/29617557/122882899-9b990d80-d377-11eb-97e4-09c8bc6c3d34.png">
- 카카오톡 전송 기능
<img width="306" alt="스크린샷 2021-06-22 오후 4 32 55" src="https://user-images.githubusercontent.com/29617557/122882940-a784cf80-d377-11eb-8436-52d838065a5a.png">
- 네이버 길찾기 링크 제공
<img width="507" alt="스크린샷 2021-06-22 오후 4 33 10" src="https://user-images.githubusercontent.com/29617557/122883245-f6326980-d377-11eb-8720-707571c3f7f8.png">

## 사용한 기술 또는 API

- React
- node.js (express)
- MySQL
- AWS EC2
- Kakao API [링크](https://developers.kakao.com/)
- OpenWeather [링크](https://openweathermap.org/)

## 구현 기능

- 사용자가 알아보고자 하는 음식점의 위치를 현재 사용자의 위치 또는 입력한 주소 중 선택할 수 있음
- 해당 지역의 날씨에 기반하여 음식 추천
- 추천 음식을 판매하는 음식점의 위치를 맵마커를 통해 제공
- 마커를 클릭하여 음식점에 관한 더 자세한 정보 제공
- 마커에서 '네이버 길찾기' 바로가기 링크 제공
- 마커에서 음식점 정보 및 위치를 '나에게 카카오톡'를 통해 전송 가능

## Installation

1. Clone the repo.

   ```bash
   git clone http://khuhub.khu.ac.kr/momokji/momokji
   ```
   

2. Install npm packages.

   ```bash
   npm install
   ```
   

3. Create new file named `.env` and enter API_keys as below.

- .env 파일 작성요령

  ```
  DB_PASS = {MySQL Password}

  REACT_APP_KAKAOMAP_API = {Kakao JavaScript API Key}
  REACT_APP_KAKAO_REST_API_KEY = {Kakao REST API Key}
  REACT_APP_KAKAO_INIT = {Kakao REST API Key}
  WEATHER_KEY = {openweathermap API key}
  ```
  

4. Create new tables using MySQL as below.

   sql 폴더의 rain.sql, seasons.sql 파일을 참조.

- DATABASE(MySQL) 설정 방법

  ```bash
  mysql -u root -p
  ```

  ```sql
  create database nodejs;
  use nodejs;
  source rain.sql;
  source seasons.sql;
  ```
  

5. Run the scripts.

   ```bash
   node server/server
   npm start
   ```
   
## Demo
https://2017104013.oss2021.tk:3000/ (유효기간 종료로 접속불가)

## Contact

- Kangho Noh

  [github](https://github.com/kangho-Noh)

- Yoonjong Lee

  [github](https://github.com/LEEYOONJONG)

## 참고한 자료
  논문 : [날씨 및 요일 특성이 음식점 메뉴 검색시스템 이용에 미치는 영향에 관한 실증 연구(조찬열, 정구임, 서양민, 최혜림)](https://www.koreascience.or.kr/article/JAKO201720636501085.pdf)
