import { System } from './System.js';
import { S2C_UpdateWorldPacket } from '../../AlkkagiShared/Packets/index.js';
import { Character } from '../Entity/index.js';
import { getEntityViewAABB } from '../Utils/Entity/GetEntityViewAABB.js';

// 5Hz
// const WORLD_UPDATE_TICK = 6;

// 10Hz
// const WORLD_UPDATE_TICK = 3;

// 30Hz
// const WORLD_UPDATE_TICK = 1;

class WorldNetworkUpdatorSystem extends System {
    constructor(world, gameServer) {
        super(world);
        this.gameServer = gameServer;
        this.counter = 0;
        this.lastUpdateTime = Date.now();
    }

    getSystemID() {
        return "PlayerUpdatorSystem";
    }

    onPostUpdate(deltaTime) {
        this.counter++;
        if(this.counter < globalThis.gameConfig.worldUpdateTick)
            return;

        this.counter = 0;

        const now = Date.now();
        const elapsedMS = now - this.lastUpdateTime;
        this.lastUpdateTime = now;

        this.gameServer.connectedClients.forEach(client => {
            if (!client.playerHandle)
                return;

            const AABB = getEntityViewAABB(client.playerHandle.getEntityPosition(), client.playerHandle.isAdmin);
            const { appearedEntities, nearbyEntities, disappearedEntities } = client.playerHandle.updateVisibleEntities(AABB);

            const packet = new S2C_UpdateWorldPacket(elapsedMS, client.playerHandle.playerEntity, appearedEntities, nearbyEntities, disappearedEntities);
            client.send(packet);
        });

        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `entity updated. entity count : ${entities.length}, client count : ${this.gameServer.connectedClients.size}`)
        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `elapsedMS: ${elapsedMS}`);
    }
}

export { WorldNetworkUpdatorSystem };
