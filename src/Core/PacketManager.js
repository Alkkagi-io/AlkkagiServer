import { PacketManager } from '../../AlkkagiShared/Packets/index.js';
import * as Packets from '../../AlkkagiShared/Packets/index.js';
import * as PacketHandlers from '../PacketHandlers/index.js';

function buildPacketManager(gameServer, world) {
    PacketManager.on(Packets.EPacketID.Message, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.Vector, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);

    // inject game server
    PacketManager.injectHandlerArgs(gameServer, world);
}

export { buildPacketManager };