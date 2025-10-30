import { ClientPacketHandler } from './Base/ClientPacketHandler.js';

class S2C_EnterWorldPacketHandler extends ClientPacketHandler {
    handle(packet) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message received`;
        messageDiv.textContent = `서버: created entity id: ${packet.entityID}`;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

export { S2C_EnterWorldPacketHandler };
