import { ServerPacketHandler } from './Base/ServerPacketHandler.js';
import { S2C_CharacterStatLevelUpResponsePacket } from '../../AlkkagiShared/Packets/index.js';

class C2S_CharacterStatLevelUpRequestPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        const levelComponent = playerHandle.playerEntity.levelComponent;
        levelComponent.levelUpStat(packet.statLevelUpType);

        const statLevel = levelComponent.getStatLevel(packet.statLevelUpType);
        const statPoint = levelComponent.statPoint;

        const statLevelUpPacket = new S2C_CharacterStatLevelUpResponsePacket(packet.statLevelUpType, statLevel, statPoint);
        playerHandle.clientHandle.send(statLevelUpPacket);
    }
}

export { C2S_CharacterStatLevelUpRequestPacketHandler };
