# Section4. 도커를 이용한 간단한 Node.js 어플 만들기
## Node.js 앱 만들기
Node.js 앱을 만들기 위해서는 package.json파일과 server.js파일을 만들어야 한다.  
- package.json: 프로젝트의 정보와 프로젝트에서 사용 중인 패키지의 의존성을 관리하는 곳  
- server.js: Node.js에서 진입점이 되는 파일  
package.json에서 express가 중요한데, express는 Node.js의 API를 단순화하고, 새로운 기능을 추가해서 Node.js를 쉽고 유용하게 사용할 수 있게 해준다.  
## Dockerfile 작성하기
Dockerfile을 작성할 때는 기본적으로 FROM, RUN, CMD 명령어를 사용한다.  
추가적으로 package.json과 server.js파일의 정보를 가져오기 위해서 COPY 명령어도 사용을 해야한다.  
```  
FROM node:10  
COPY package.json ./  
RUN npm install  
CMD ["node", "server.js"]  
```
npm은 Node.js로 만들어진 모듈을 웹에서 받아서 설치하고 관리해주는 프로그램이며,  
npm install은 package.json에 적혀있는 종속성들을 웹에서 자동으로 다운 받아서 설치해주는 명령어이다.  
## Package.json이 없다고 나오는 이유
npm install은 어플리케이션에 필요한 종속성을 다운받아 주는데, 다운 받을 때 먼저 package.json을 보고 그곳에 명시된 종속성들을 다운받아서 설치해준다. 하지만 package.json 및 다른 파일들이 컨테이너 안에 없기에 찾을 수 없다는 에러가 발생하는 것이다.  
따라서 Dockerfile을 다음과 같이 수정해야 한다.  
```
FROM node:10  
COPY ./ ./ 
RUN npm install  
CMD ["node", "server.js"]  
```
./ ./는 현재 디럭토리에 있는 모든 파일들을 의미한다.  
## 생성한 이미지로 어플리케이션 실행 시 접근이 안 되는 이유
docker로 build된 node.js를 웹에서 실행하기 위해서는 port mapping을 해줘야 한다.  
$docker run -p 5000:8080 이미지이름  
5000은 localhost의 포트번호이고 8080은 도커 컨테이너의 포트번호이다.  
## Working directory 명시해주기
build된 이미지를 보면 copy를 했던 package.json, server.js 등이 같이 포함되어 있다.  
만약 copy파일이 원래 이미지에 있던 파일과 이름이 같다면 그 파일을 엎어씌운다.  
그러면 문제가 생길 수 있으므로 working directory를 지정해 줘야 한다.  
```
FROM node:10  
WORKDIR /usr/src/app  
COPY ./ ./  
RUN npm install  
CMD ["node", "server.js"]  
```
working directory를 지정한 후에는 copy파일들이 /usr/src/app에 들어가게 된다.  
## 어플리케이션 소스 변경으로 다시 빌드하는 것에 대한 문제점
만약 dockerfile이 수정이 된다면 docker build, run을 다시 해줘야 한다.  
이는 매우 비효율적이므로 효율적으로 수정할 수 있는 방법들을 알아보자.  
## 어플리케이셔 소스 변경으로 재빌드시 효율적으로 하는 법
dockerfile을 수정 후 다시 build할 때 build하는 시간을 줄이기 위해서는 다음과 같이 하면 된다.  
```
FROM node:10  
WORKDIR /usr/src/app  
COPY package.json ./  
RUN npm install  
COPY ./ ./  
CMD ["node", "server.js"]  
```
npm install이 package.json에 적혀있는 종속성들을 웹에서 자동으로 다운 받아서 설치한 후 COPY ./ ./ 에서는 이전에 저장되어 있던 cache를 이용한다.  
따라서 다시 build 시 npm install은 영향을 받지 않으므로 속도가 줄어들게 된다.  
## Docker Volume에 대하여
docker volume은 소스코드가 변경되어도 다시 build할 필요 없이 바로 반영이 되게 해준다.  
volume은 copy와 차이점이 있는데, copy는 build시 로컬에서 도커 컨테이너로 파일들을 복사해서 넘겨주지만, volume은 도커 컨테이너가 로컬에 있는 파일들을 참조해서 반영을 한다.  
docker volume 명령어는 다음과 같으며 조금 복잡하다.  
$docker run -p 5000:8080 -v /usr/src/app/node_modules -v %cd%:/usr/src/app 이미지아이디