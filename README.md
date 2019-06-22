<center>![상위 영웅](https://github.com/eunsukimme/Overfetch/blob/master/document/readme/overfetch_git_logo.png)</center>

# 오버페치(Overfetch): 오버워치 게임 데이터 시각화 프로젝트

한국장학재단이 주관하고 블리자드 엔터테인먼트(Blizzard Entertainment)가 지원하는 푸른등대 기부장학금 수혜 대학생이 만든 오버워치 게임 데이터 시각화 서비스 입니다.

## 발견한 문제점

오버워치 공식 홈페이지(https://playoverwatch.com/ko-kr/) 에서는 유저들의 게임 플레이 데이터를 볼 수 있는 서비스를 제공합니다. 해당 서비스에서 유저들은 여러 기준으로 모스트 챔피언을 확인할 수 있고, 각 영웅들의 플레이 도중 축적된 여러 게임 데이터들을 확인할 수 있습니다.

![상위 영웅](https://github.com/eunsukimme/Overfetch/blob/master/document/readme/playoverwatch_analysis2.PNG)

![통계](https://github.com/eunsukimme/Overfetch/blob/master/document/readme/playoverwatch_analysis.PNG)

하지만 이 기록들을 사용자들이 볼 때 그다지 유의미한 결과를 도출해 내지 못 합니다. 통계 화면에서 나타나는 데이터들은 양이 너무 많아 난잡한 느낌이 들고, 시각화가 되지 않은 로우 데이터 값들은 사용자가 보고 이해하는데 어려운 요인으로 작용합니다.

## 제시하는 해결 방법

우리팀은 이러한 문제를 해결하고 사용자가 자신의 게임 데이터로부터 유의미한 결과를 도출하여 더 나은 플레이 경험을 제공받을 수 있도록 하기 위해 다음과 같은 해결 방법을 제시하였습니다.

1. 사용자들의 게임 데이터들 중 유의미한 값들을 지닌 데이터를 선정하여 정리 & 분류합니다

2. 선별된 데이터를 사용자가 이해하기 쉬운 형태로 시각화 합니다

3. 사용자의 데이터를 바탕으로 더 나은 방향으로 플레이할 수 있도록 피드백을 제공합니다

## 기대 효과

그리하여 사용자들은 오버워치 통계를 보고 이해하며 분석하는데 걸리는 시간을 단축할 수 있으며, 자신의 게임 데이터를 한 눈에 쉽게 이해할 수 있을 것입니다. 또한 로우 데이터에서 미처 발견하지 못 했던 유의미한 결과들을 새롭게 도출할 수 있을 것입니다.

## 개발 스택

저희의 개발 스택은 다음과 같습니다.

| Component          | Technology                 |
| ------------------ | -------------------------- |
| Frontend           | React 16+                  |
| Backend            | NodeJS(Express 4)          |
| Database           | MongoDB                    |
| Data Visualization | D3                         |
| Client Build       | npm, yarn, webpack         |
| Library            | cheerio, concurrently, etc |
| DevOps             | MongoDB Atlas, Heroku      |

## 결과물

저희는 다음과 같이 오버워치 게임 데이터 시각화 웹 서비스 '오버페치(Overfetch)'를 제작하였습니다.

![알파(DEMO) 서비스 시연](https://github.com/eunsukimme/Overfetch/blob/master/document/readme/play.gif)

유투브 시연 영상

https://youtu.be/9-MuNmk0zeo

실제 사이트(현재 서버 운영 중단)

https://overfetch.herokuapp.com

## 후기

오버페치는 푸른등대 기부장학생들의 블리자드 역량강화 프로그램에서 최우수상을 수상하였습니다.

![수상 단체사진(좌측)](https://github.com/eunsukimme/Overfetch/blob/master/document/readme/first_prize.jpg)

관련 기사

http://news.zum.com/articles/52898873

좋은 분들과 너무나 소중한 추억을 만들 수 있도록 지원해주신 한국장학재단과 블리자드 엔터테인먼트에 다시 한 번 큰 감사를 드립니다.
