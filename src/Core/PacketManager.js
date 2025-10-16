import { PacketManager } from '../../AlkkagiShared/Packets/index.js';
import * as Packets from '../../AlkkagiShared/Packets/index.js';
import * as PacketHandlers from '../PacketHandlers/index.js';

function buildPacketManager(gameServer, world) {
    PacketManager.on(Packets.EPacketID.Message, Packets.MessagePacket, PacketHandlers.MessagePacketHandler);
    PacketManager.on(Packets.EPacketID.Vector, Packets.VectorPacket, PacketHandlers.VectorPacketHandler);
    PacketManager.on(Packets.EPacketID.C2S_EnterWorld, Packets.C2S_EnterWorldPacket, PacketHandlers.C2S_EnterWorldPacketHandler);
    PacketManager.on(Packets.EPacketID.C2S_MoveInput, Packets.C2S_MoveInputPacket, PacketHandlers.C2S_MoveInputPacketHandler);
    PacketManager.on(Packets.EPacketID.C2S_StartAttackCharging, Packets.C2S_StartAttackChargingPacket, PacketHandlers.C2S_StartAttackChargingPacketHandler);
    PacketManager.on(Packets.EPacketID.C2S_FinishAttackCharging, Packets.C2S_FinishAttackChargingPacket, PacketHandlers.C2S_FinishAttackChargingPacketHandler);
    PacketManager.on(Packets.EPacketID.C2S_CharacterStatLevelUpRequest, Packets.C2S_CharacterStatLevelUpRequestPacket, PacketHandlers.C2S_CharacterStatLevelUpRequestPacketHandler);

    // inject game server
    PacketManager.injectHandlerArgs(gameServer, world);
}

export { buildPacketManager };