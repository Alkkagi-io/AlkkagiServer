import { PacketFactory } from "./packets/index.js";
import * as Packets from "./packets/index.js";

function buildPacketFactory() {
    PacketFactory.on(Packets.EPacketID.MESSAGE, Packets.MessagePacket);
}

export { buildPacketFactory };