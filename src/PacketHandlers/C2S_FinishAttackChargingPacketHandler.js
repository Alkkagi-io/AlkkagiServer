import { ServerPacketHandler } from './index.js';

class C2S_FinishAttackChargingPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        playerHandle.playerEntity.finishAttackCharging(packet.direction);
    }
}

export { C2S_FinishAttackChargingPacketHandler };