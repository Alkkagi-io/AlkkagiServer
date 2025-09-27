import { PacketFactory } from '../../AlkkagiShared/packets/index.js';
import * as Packets from '../../AlkkagiShared/packets/index.js';

function buildPacketFactory() {
    PacketFactory.on(Packets.EPacketID.MESSAGE, Packets.MessagePacket);
}

export { buildPacketFactory };