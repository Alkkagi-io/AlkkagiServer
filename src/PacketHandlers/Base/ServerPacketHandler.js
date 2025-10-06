import { PacketHandler } from '../../../AlkkagiShared/Packets/index.js';

class ServerPacketHandler extends PacketHandler {
    constructor(gameServer, world, clientHandle) {
        super();
        this.gameServer = gameServer;
        this.world = world;
        this.clientHandle = clientHandle;
    }

    handle(packet) {
        super.handle(packet);
    }
}

export { ServerPacketHandler };