import { ServerPacketHandler } from './Base/ServerPacketHandler.js';

class C2S_StartAttackChargingPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        const attackComponent = playerHandle.playerEntity.attackComponent;
        attackComponent.startAttackCharging();


        playerHandle.playerEntity.healthComponent.damage(playerHandle.playerEntity, 10);
    }
}

export { C2S_StartAttackChargingPacketHandler };
