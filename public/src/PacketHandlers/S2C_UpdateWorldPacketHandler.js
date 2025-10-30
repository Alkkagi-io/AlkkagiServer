import { ClientPacketHandler } from './Base/ClientPacketHandler.js';

class S2C_UpdateWorldPacketHandler extends ClientPacketHandler {
    handle(packet) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message received`;
        messageDiv.textContent = `서버: entity count: ${packet.entityDatas.length}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

export { S2C_UpdateWorldPacketHandler };
