import { ServerPacketHandler } from './index.js';

class MessagePacketHandler extends ServerPacketHandler {
    handle(packet) {
        globalThis.logger.info('MessagePacketHandler', `Received message: ${packet.message}`);
    }
}

export { MessagePacketHandler };