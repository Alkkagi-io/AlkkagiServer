import { PacketHandler } from '../../packets/index.js';

// do nothing
class ClientPacketHandler extends PacketHandler {
    constructor() {
        super();
    }

    handle(packet) {
        super.handle(packet);
    }
}

export { ClientPacketHandler };