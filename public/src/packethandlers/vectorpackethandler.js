import { ClientPacketHandler } from './index.js';

class VectorPacketHandler extends ClientPacketHandler {
    handle(packet) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message received`;
        messageDiv.textContent = `서버: vector: ${packet.vector.x}, ${packet.vector.y}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

export { VectorPacketHandler };