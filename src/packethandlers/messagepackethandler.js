import { ServerPacketHandler } from './index.js';
import { MessagePacket } from '../../AlkkagiShared/packets/index.js';

class MessagePacketHandler extends ServerPacketHandler {
    handle(packet) {
        globalThis.logger.info('MessagePacketHandler', `Received message: ${packet.message}`);
        this.gameServer.connectedClients.forEach(client => {
            client.send(new MessagePacket(packet.message));
        });
    }
}

export { MessagePacketHandler };