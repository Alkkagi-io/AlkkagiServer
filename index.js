const WebSocket = require('ws');
const express = require('express');
const http = require('http');

// Express 앱 생성
const app = express();
const server = http.createServer(app);

// 웹소켓 서버 생성
const wss = new WebSocket.Server({ server });

// 연결된 클라이언트들을 저장할 Set
const clients = new Set();

// 정적 파일 서빙 (필요시)
app.use(express.static('public'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Alkkagi WebSocket Server',
    status: 'running',
    connectedClients: clients.size
  });
});

// 웹소켓 연결 처리
wss.on('connection', (ws, req) => {
  console.log('새로운 클라이언트가 연결되었습니다.');
  
  // 클라이언트를 Set에 추가
  clients.add(ws);
  
  // 연결된 클라이언트 수를 모든 클라이언트에게 브로드캐스트
  broadcastClientCount();
  
  // 클라이언트로부터 메시지 수신
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('받은 메시지:', data);
      
      // 메시지 타입에 따른 처리
      handleMessage(ws, data);
    } catch (error) {
      console.error('메시지 파싱 오류:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: '잘못된 메시지 형식입니다.'
      }));
    }
  });
  
  // 클라이언트 연결 해제
  ws.on('close', () => {
    console.log('클라이언트 연결이 해제되었습니다.');
    clients.delete(ws);
    broadcastClientCount();
  });
  
  // 연결 오류 처리
  ws.on('error', (error) => {
    console.error('웹소켓 오류:', error);
    clients.delete(ws);
    broadcastClientCount();
  });
  
  // 연결 확인 메시지 전송
  ws.send(JSON.stringify({
    type: 'connection',
    message: '서버에 성공적으로 연결되었습니다.',
    timestamp: new Date().toISOString()
  }));
});

// 메시지 처리 함수
function handleMessage(ws, data) {
  switch (data.type) {
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date().toISOString()
      }));
      break;
      
    case 'broadcast':
      // 모든 클라이언트에게 메시지 브로드캐스트
      broadcastToAll({
        type: 'broadcast',
        message: data.message,
        sender: 'server',
        timestamp: new Date().toISOString()
      });
      break;
      
    case 'chat':
      // 채팅 메시지 처리
      broadcastToAll({
        type: 'chat',
        message: data.message,
        sender: data.sender || 'anonymous',
        timestamp: new Date().toISOString()
      });
      break;
      
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: '알 수 없는 메시지 타입입니다.'
      }));
  }
}

// 모든 클라이언트에게 메시지 브로드캐스트
function broadcastToAll(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// 연결된 클라이언트 수 브로드캐스트
function broadcastClientCount() {
  broadcastToAll({
    type: 'clientCount',
    count: clients.size,
    timestamp: new Date().toISOString()
  });
}

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Alkkagi WebSocket 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 WebSocket 엔드포인트: ws://localhost:${PORT}`);
  console.log(`🌐 HTTP 엔드포인트: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('서버 종료 중...');
  server.close(() => {
    console.log('서버가 정상적으로 종료되었습니다.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('서버 종료 중...');
  server.close(() => {
    console.log('서버가 정상적으로 종료되었습니다.');
    process.exit(0);
  });
});