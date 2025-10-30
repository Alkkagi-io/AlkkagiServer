import { ServerPacketHandler } from './Base/ServerPacketHandler.js';

class VectorPacketHandler extends ServerPacketHandler {
    handle(packet) {
        globalThis.logger.info('VectorPacketHandler', `Received vector: ${packet.vector.x}, ${packet.vector.y}`);
    }
}

export { VectorPacketHandler };
