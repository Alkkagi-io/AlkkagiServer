import { ClientPacketHandler } from './Base/ClientPacketHandler.js';

class MessagePacketHandler extends ClientPacketHandler {
    handle(packet) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message received`;
        messageDiv.textContent = `서버: ${packet.message}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

export { MessagePacketHandler };
