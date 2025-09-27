import { PacketManager } from '../../AlkkagiShared/packets/index.js';
import * as Packets from '../../AlkkagiShared/packets/index.js';
import * as PacketHandlers from '../packethandlers/index.js';

function buildPacketManager(gameServer) {
    PacketManager.on(Packets.EPacketID.MESSAGE, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.VECTOR, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);

    // inject game server
    PacketManager.injectHandlerArgs(gameServer);
}

export { buildPacketManager };