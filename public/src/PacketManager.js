import { PacketManager } from "./Packets/index.js";
import * as Packets from "./Packets/index.js";
import * as PacketHandlers from './PacketHandlers/index.js';

function buildPacketManager() {
    PacketManager.on(Packets.EPacketID.MESSAGE, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.VECTOR, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);
}

export { buildPacketManager };