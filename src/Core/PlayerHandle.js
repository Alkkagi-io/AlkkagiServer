import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { S2C_RemovePlayerPacket } from '../../AlkkagiShared/Packets/S2C_RemovePlayerPacket.js';
import { Diagnostics } from '../Utils/ETC/Diagnostics.js';

class PlayerHandle {
    constructor(gameServer, world, clientHandle) {
        this.gameServer = gameServer;
        this.world = world;
        this.clientHandle = clientHandle;
        this.playerEntity = null;
        this.lastPosition = new Vector();

        this.nearbyEntities = new Set();

        this.clientHandle.on('disconnect', this.handleClientDisconnect.bind(this));
    }

    getEntityPosition() {
        if(this.playerEntity == null)
            return this.lastPosition;

        return this.playerEntity.position;
    }

    updateVisibleEntities(aabb) {
        const disappearedEntities = new Set(this.nearbyEntities);
        const appearedEntities = new Set();

        // 주변 엔티티 가져오기
        this.world.entityTree.query(aabb, leaf => {
            const entity = leaf.data;
    
            if(this.nearbyEntities.has(entity)) {
                disappearedEntities.delete(entity);
            } else {
                appearedEntities.add(entity);
                this.nearbyEntities.add(entity);
            }
        });

        disappearedEntities.forEach(entity => {
            this.nearbyEntities.delete(entity);
        });

        return  { 
            appearedEntities: appearedEntities, 
            nearbyEntities: this.nearbyEntities, 
            disappearedEntities: disappearedEntities
        };
    }

    handlePlayerEntityDestroyed() {
        if(this.playerEntity == null)
            return;
        this.broadcastRemovePlayerEntity();
        this.lastPosition = this.playerEntity.position;
        this.playerEntity = null;
    }

    handleClientDisconnect() {
        if(this.playerEntity == null)
            return;

        globalThis.logger.info('PlayerHandle', `Player entity removed by client disconnect. EntityID: ${this.playerEntity.entityID}`);
        this.lastPosition = this.playerEntity.position;
        this.broadcastRemovePlayerEntity();
        this.world.removeEntity(this.playerEntity);
        this.playerEntity = null;
    }

    broadcastRemovePlayerEntity() {
        const removePlayerPacket = new S2C_RemovePlayerPacket(this.playerEntity.entityID);
        const buffer = removePlayerPacket.serialize();

        for (const client of this.gameServer.connectedClients) {
            if (!client.PlayerHandle || client.PlayerHandle == this)
                continue;

            client.send(buffer, removePlayerPacket.constructor.name);
        }
    }
}

export { PlayerHandle };