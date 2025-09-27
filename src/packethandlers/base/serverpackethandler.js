import { PacketHandler } from '../../../AlkkagiShared/packets/index.js';

class ServerPacketHandler extends PacketHandler {
    constructor(gameServer, client) {
        super();
        this.gameServer = gameServer;
        this.client = client;
    }

    handle(packet) {
        super.handle(packet);
    }
}

export { ServerPacketHandler };