import { ServerPacketHandler } from './Base/ServerPacketHandler.js';
import { PlayerHandle } from '../Core/PlayerHandle.js'
import { Character, Player } from '../Entity/index.js'
import { S2C_AddPlayerPacket, S2C_EnterWorldResponsePacket } from '../../AlkkagiShared/Packets/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';
import { Diagnostics } from '../Utils/ETC/Diagnostics.js';

class C2S_EnterWorldRequestPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        const playerEntity = new Player(this.world, this.clientHandle, packet.nickname, playerHandle.handlePlayerEntityDestroyed.bind(playerHandle));

        // playerEntity.position = new Vector(Math.random() * gameConfig.worldWith, Math.random() * gameConfig.worldHeight);
        playerEntity.position = new Vector(Random.range(-globalThis.gameConfig.worldWidth * 0.5, globalThis.gameConfig.worldWidth * 0.5), Random.range(-globalThis.gameConfig.worldHeight * 0.5, globalThis.gameConfig.worldHeight * 0.5));

        this.world.addEntity(playerEntity);
        playerHandle.playerEntity = playerEntity;

        const isAdmin = this._isAdmin(packet.nickname);
        if(isAdmin) {
            playerEntity.nickname = '알까기';
            playerHandle.isAdmin = true;
        }
        
        const addPlayerPacket = new S2C_AddPlayerPacket(playerEntity);
        const buffer = addPlayerPacket.serialize();
        for (const client of this.gameServer.connectedClients) {
            if (!client.playerHandle || client.playerHandle == playerHandle)
                continue;
            
            client.send(buffer);
            Diagnostics.recordNetworkSendTraffic(client, addPlayerPacket, buffer.byteLength / 1024);
        }

        const worldPlayers = [];        
        for (const entity of Object.values(this.world.entities)) {
            if (!(entity instanceof Character))
                continue;
            
            worldPlayers.push(entity);
        }

        const viewSize = new Vector(globalThis.gameConfig.viewSize.width, globalThis.gameConfig.viewSize.height);
        if(playerHandle.isAdmin) {
            viewSize.multiply(3);
        }

        const res = new S2C_EnterWorldResponsePacket(playerEntity.entityID, worldPlayers, viewSize);
        this.clientHandle.send(res);
    }

    _isAdmin(nickname) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        return nickname == `!@#${hh}${mm}`;
    }
}

export { C2S_EnterWorldRequestPacketHandler };
