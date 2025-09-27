import { ServerPacketHandler } from './index.js';

class VectorPacketHandler extends ServerPacketHandler {
    handle(packet) {
        globalThis.logger.info('VectorPacketHandler', `Received vector: ${packet.vector.x}, ${packet.vector.y}, vectorInt: ${packet.vectorInt.x}, ${packet.vectorInt.y}`);
    }
}

export { VectorPacketHandler };