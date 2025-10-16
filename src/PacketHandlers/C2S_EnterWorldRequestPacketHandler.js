import { ServerPacketHandler } from './index.js';
import { PlayerHandle } from '../Core/PlayerHandle.js'
import { Player } from '../Entity/index.js'
import { S2C_EnterWorldResponsePacket } from '../../AlkkagiShared/Packets/index.js';

class C2S_EnterWorldRequestPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerEntity = new Player(this.world, this.clientHandle, packet.nickname);
        this.world.addEntity(playerEntity);

        const playerHandle = new PlayerHandle(this.gameServer, this.world, this.clientHandle, playerEntity);
        this.clientHandle.playerHandle = playerHandle;

        const res = new S2C_EnterWorldResponsePacket(playerEntity.entityID);
        this.clientHandle.send(res);
    }
}

export { C2S_EnterWorldRequestPacketHandler };