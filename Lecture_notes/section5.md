# Section5. Docker Compose
## Docker Compose란 무엇인가?
docker compose는 다중 컨테이너 도커 어플리케이션을 정의하고 실행하기 위한 도구이다.  
## 어플리케이션 소스 작성하기
- 레디스(Redis): 레디스는 REmote DIctionary Server의 약자이며 메모리 기반의 키-값 구조의 데이터 관리 시스템이다.  
또한 모든 데이터를 메모리에 저장하고 빠르게 조회할 수 있는 비관계형 데이터베이스(Nosql)이다.  
- 레디스를 쓰는 이유: 레디스는 데이터를 메모리에 저장을 하기 때문에 Mysql처럼 데이터베이스에 데이터를 저장하는 것과 비교했을 때 데이터를 훨씬 빠르게 불러오고 처리할 수 있다.  
레디스는 데이터를 메모리에 저장하기는 하지만 영속적으로도 보관이 가능하다 따라서 서버를 재부팅해도 데이터를 유지할 수 있다는 장점이 있다.  
- Node.js 환경에서 Redis 사용 방법  
(1) redis-server 작동  
(2) redis 모듈 다운로드  
(3) redis 모듈을 다운로드 받은 후에 레디스 클라이언트를 생성하기 위해서 redis에서 제공하는 createclient() 함수를 이용해서 레디스 클라이언트를 생성  
이때, redis-server가 작동하는 곳과 Node.js앱이 작동하는 곳이 다르다면 host와 port를 명시해줘야한다.  
## Docker Containers간 통신할 때 나타나는 에러
레디스 클라이언트가 작동하려면 레디스 서버가 먼저 켜져있어야 한다.  
따라서 먼저 레디스 서버를 위한 컨테이너를 실행하고 Node.js를 위한 컨테이너를 실행하는데, 이 때 오류가 발생한다.  
오류발생원인은 컨테이너 사이에 아무런 설정이 안되어 있어 접근이 불가능하기 때문이고,  
Docker compose가 멀티 컨테이너 상황에서 쉽게 네트워크를 연결시켜 줄 수 있다.  
## Docker Compose 파일 작성하기 
docker-compose.yml은 아래와 같이 작성되며 indenting이 매우 중요하다.  
```
version: "3"
services:
  redis-server:
    image: "redis"
  node-app:
    build: .
    ports:
     - "5000:8080"
```
yml은 무엇일까? YAML ain't markup language의 약자이며, 일반적으로 구성파일 및 데이터가 저장되거나 전송되는 응용프로그램에서 사용된다.  
원래는 XML이나 json 포맷으로 많이 쓰였지만, 조금 더 사람이 읽기 쉬운 포맷으로 나타낸게 yaml이다.  
## Docker Compose로 컨테이너 멈추기
$docker-compose build: 이미지를 빌드하기만 하며, 컨테이너를 시작하지는 않는다.  
$docker-compose up: 이미지가 존재하지 않을 경우에만 빌드하며, 컨테이너를 시작한다.  
$docker-compose up --build: 필요치 않을때도 강제로 이미지를 빌드하며, 컨테이너를 시작한다.  
$docker-compose up --no-build: 이미지 빌드 없이, 컨테이너를 시작한다. 이미지가 없을 시에는 실패한다.  