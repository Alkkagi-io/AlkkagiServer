import { PacketHandler } from '../../../AlkkagiShared/Packets/index.js';

class ServerPacketHandler extends PacketHandler {
    constructor(gameServer, world, client) {
        super();
        this.gameServer = gameServer;
        this.world = world;
        this.client = client;
    }

    handle(packet) {
        super.handle(packet);
    }
}

export { ServerPacketHandler };