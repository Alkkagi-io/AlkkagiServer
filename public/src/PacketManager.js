import { PacketManager } from "./Packets/index.js";
import * as Packets from "./Packets/index.js";
import * as PacketHandlers from './PacketHandlers/index.js';

function buildPacketManager() {
    PacketManager.on(Packets.EPacketID.Message, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.Vector, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);
    PacketManager.on(Packets.EPacketID.S2C_UpdateWorld, Packets.S2C_UpdateWorldPacket, PacketHandlers.S2C_UpdateWorldPacketHandler);
}

export { buildPacketManager };