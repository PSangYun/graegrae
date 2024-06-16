# 그래그래
**GPT를 활용한 위인 AI 챗봇 서비스**

>*안중근, 방정환, 단군, 광개토대왕, 장영실, 정약용, 김구, 유관순, 세종대왕, 이순신*
<br/>

본 프로젝트는 인공지능을 활용해 역사적 인물들과 직접 대화할 수 있는 플랫폼의 제공을 목표로 한다.

<br/>

## 🛠실행
다음 내용을 순차적으로 수행한다.

<br/>

**Node.js 설치** <https://nodejs.org/>

**VS Code 설치** <https://code.visualstudio.com/>

**Python(3.4버전 이상) 설치** <https://www.python.org/downloads/>

<br/>

git clone 후 vscode에서 폴더 오픈

>Notion에서 다음 파일 다운로드
* **.env**
  
  Front 폴더에 삽입

  FrontApp 폴더에 삽입

* **serviceAccountKey.json**

  Back 폴더에 삽입

<br/>

vscode 터미널 2개 생성
> *터미널1*

1. 다음 명령어를 터미널1에 입력
```
    cd Back
   
    pip install openai
   
    pip install flask-cors
   
    pip install pytz

    pip install firebase-admin

    pip install python-dotenv
```
   
2. 실행

```
   python application.py
```

<br/>

> *터미널2*

 1. 다음 명령어를 터미널2에 입력

```
    cd Front
    
    npm install
    
    npm install @react-oauth/google @reduxjs/toolkit react-redux
    
    npm install firebase
    
    npm install react-spring-3d-carousel
    
    npm install @mui/material @emotion/react @emotion/styled
```
    
 2. 실행

```
    npm start
```

<br/>

***

다음은 앱 실행을 위한 추가적인 절차이다.

<br/>

*위의 단계들을 모두 무사히 마친 다음에 터미널 3개 생성 후 진행*

*전 단계에서 실행시켰던 것들 모두 종료 후 진행*

<br/>

> *터미널1*

```
  cd Back

  python application.py
```

<br/>

> *터미널2*
```
  cd FrontApp

  npm install

  npm start
```

<br/>

> *터미널3*

```
  cd greaApp

  npm install

  npx expo install react-native-webview

  npm install -g expo-cli

  npm start
```

  *컴퓨터와 휴대폰이 같은 네트워크여야 한다.*

  * 개인 휴대폰에 expo 설치
  * qr코드 찍어 expo를 통해 실행

<br/>

## 💻프로젝트 소개
* 메인 화면
   * 접속마다 다른 인물 생성
   * 인물 프로필 이동 가능
     
     ![main](https://github.com/PSangYun/graegrae/blob/main/main.png)

* 위인 프로필
  * 인물별 카드 뉴스
    
    ![card](https://github.com/PSangYun/graegrae/blob/main/card.png)
    ![news](https://github.com/PSangYun/graegrae/blob/main/news.png)

* 채팅
  * 위인 챗봇
    
    ![chat](https://github.com/PSangYun/graegrae/blob/main/chat.png)

<br/>

## ⚙개발환경
* Visual Studio Code
* React
* React Native
* Node.js
* 언어 : Javascript. Python
* 프레임워크 : Flask
* 데이터베이스 : Firebase

<br/>

## 👨‍💻사용 오픈소스
* 인물 프로필 Carousel
  
  <https://codesandbox.io/p/sandbox/1v96j74484?file=%2Fsrc%2Fexample.js%3A8%2C26&view=preview>

<br/>
  
* 오픈AI API 호출
  
  <https://github.com/minji337/jjinchin>

<br/><br/>

This project is licensed under the terms of the ~~~.
