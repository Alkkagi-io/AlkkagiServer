import { PacketManager } from "./packets/index.js";
import * as Packets from "./packets/index.js";
import * as PacketHandlers from './packethandlers/index.js';

function buildPacketManager() {
    PacketManager.on(Packets.EPacketID.MESSAGE, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.VECTOR, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);
}

export { buildPacketManager };