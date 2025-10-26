import { ServerPacketHandler } from './index.js';
import { PlayerHandle } from '../Core/PlayerHandle.js'
import { Player } from '../Entity/index.js'
import { S2C_EnterWorldResponsePacket } from '../../AlkkagiShared/Packets/index.js';

class C2S_EnterWorldRequestPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        const playerEntity = new Player(this.world, this.clientHandle, packet.nickname, playerHandle.handlePlayerEntityDestroyed.bind(playerHandle));
        
        this.world.addEntity(playerEntity);
        playerHandle.playerEntity = playerEntity;

        const res = new S2C_EnterWorldResponsePacket(playerEntity.entityID);
        this.clientHandle.send(res);
    }
}

export { C2S_EnterWorldRequestPacketHandler };