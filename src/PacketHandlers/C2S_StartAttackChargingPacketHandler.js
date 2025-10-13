import { ServerPacketHandler } from './index.js';

class C2S_StartAttackChargingPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        const attackComponent = playerHandle.playerEntity.attackComponent;
        attackComponent.startAttackCharging();
    }
}

export { C2S_StartAttackChargingPacketHandler };