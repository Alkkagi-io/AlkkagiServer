import { PacketManager } from '../../AlkkagiShared/Packets/index.js';
import * as Packets from '../../AlkkagiShared/Packets/index.js';
import * as PacketHandlers from '../PacketHandlers/index.js';

function buildPacketManager(gameServer, world) {
    PacketManager.on(Packets.EPacketID.Message, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.Vector, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);
    PacketManager.on(Packets.EPacketID.C2S_EnterWorld, Packets.C2S_EnterWorldPacket, PacketHandlers.C2S_EnterWorldPacketHandler);

    // inject game server
    PacketManager.injectHandlerArgs(gameServer, world);
}

export { buildPacketManager };