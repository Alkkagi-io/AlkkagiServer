# AlkkagiServer
Alkkagi-io WebSocket Server

## 개요
이 프로젝트는 Alkkagi-io 게임을 위한 WebSocket 서버입니다. 실시간 통신을 통해 클라이언트 간의 메시지 교환과 게임 상태 동기화를 지원합니다.

## 기능
- ✅ WebSocket 연결 관리
- ✅ 실시간 메시지 브로드캐스트
- ✅ 채팅 시스템
- ✅ 연결 상태 모니터링
- ✅ Ping/Pong 연결 확인
- ✅ Graceful shutdown 지원

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

### 3. 테스트
서버가 실행되면 브라우저에서 `http://localhost:3000`에 접속하여 테스트 클라이언트를 사용할 수 있습니다.

## API 엔드포인트

### HTTP 엔드포인트
- `GET /` - 서버 상태 확인

### WebSocket 메시지 타입

#### 클라이언트 → 서버
```javascript
// Ping 메시지
{
  "type": "ping"
}

// 채팅 메시지
{
  "type": "chat",
  "sender": "사용자명",
  "message": "메시지 내용"
}

// 브로드캐스트 메시지
{
  "type": "broadcast",
  "message": "브로드캐스트할 메시지"
}
```

#### 서버 → 클라이언트
```javascript
// 연결 확인
{
  "type": "connection",
  "message": "서버에 성공적으로 연결되었습니다.",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Pong 응답
{
  "type": "pong",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 채팅 메시지
{
  "type": "chat",
  "message": "메시지 내용",
  "sender": "보낸이",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 브로드캐스트 메시지
{
  "type": "broadcast",
  "message": "브로드캐스트 메시지",
  "sender": "server",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 클라이언트 수 업데이트
{
  "type": "clientCount",
  "count": 5,
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// 오류 메시지
{
  "type": "error",
  "message": "오류 내용"
}
```

## 환경 변수
- `PORT`: 서버 포트 (기본값: 3000)

## 개발
- `npm run dev`: nodemon을 사용한 개발 모드
- `npm start`: 프로덕션 모드
- `npm test`: 테스트 실행 (현재 미구현)

## 라이선스
ISC
