import { ServerPacketHandler } from './Base/ServerPacketHandler.js';

class C2S_FinishAttackChargingPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        if(playerHandle.playerEntity == null) {
            return;
        }

        const attackComponent = playerHandle.playerEntity.attackComponent;
        if(attackComponent == null) {
            return;
        }

        attackComponent.finishAttackCharging(packet.direction);
    }
}

export { C2S_FinishAttackChargingPacketHandler };
