import { ServerPacketHandler } from './Base/ServerPacketHandler.js';
import { PlayerHandle } from '../Core/PlayerHandle.js'
import { Character, Player } from '../Entity/index.js'
import { S2C_AddPlayerPacket, S2C_EnterWorldResponsePacket } from '../../AlkkagiShared/Packets/index.js';

class C2S_EnterWorldRequestPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        const playerEntity = new Player(this.world, this.clientHandle, packet.nickname, playerHandle.handlePlayerEntityDestroyed.bind(playerHandle));
    
        this.world.addEntity(playerEntity);
        playerHandle.playerEntity = playerEntity;
        
        const addPlayerPacket = new S2C_AddPlayerPacket(playerEntity);
        for (const client of this.gameServer.connectedClients) {
            if (!client.playerHandle || client.playerHandle == playerHandle)
                continue;
            
            client.send(addPlayerPacket);
        }

        const worldPlayers = [];        
        for (const entity of Object.values(this.world.entities)) {
            if (!(entity instanceof Character))
                continue;
            
            worldPlayers.push(entity);
        }

        const res = new S2C_EnterWorldResponsePacket(playerEntity.entityID, worldPlayers);
        this.clientHandle.send(res);
    }
}

export { C2S_EnterWorldRequestPacketHandler };
