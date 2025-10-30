import { ServerPacketHandler } from './Base/ServerPacketHandler.js';

class C2S_FinishAttackChargingPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        const attackComponent = playerHandle.playerEntity.attackComponent;
        attackComponent.finishAttackCharging(packet.direction);
    }
}

export { C2S_FinishAttackChargingPacketHandler };
