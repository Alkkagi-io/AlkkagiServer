import { ServerPacketHandler } from './index.js';
import { PlayerHandle } from '../Core/PlayerHandle.js'
import { Player } from '../Entity/index.js'
import { S2C_EnterWorldPacket } from '../../AlkkagiShared/Packets/index.js';

class C2S_EnterWorldPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerEntity = new Player(this.world, packet.nickname);
        this.world.addEntity(playerEntity);

        const playerHandle = new PlayerHandle(this.gameServer, this.world, this.clientHandle, playerEntity);
        this.clientHandle.playerHandle = playerHandle;

        const res = new S2C_EnterWorldPacket(playerEntity.entityID);
        this.clientHandle.send(res);
    }
}

export { C2S_EnterWorldPacketHandler };