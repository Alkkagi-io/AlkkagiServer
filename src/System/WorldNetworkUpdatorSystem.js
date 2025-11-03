import { System } from './System.js';
import { S2C_UpdateWorldPacket } from '../../AlkkagiShared/Packets/index.js';
import { Character } from '../Entity/index.js';

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

            const AABB = this._getEntityViewAABB(client.playerHandle.getEntityPosition(), client.playerHandle.isAdmin);
            const { appearedEntities, nearbyEntities, disappearedEntities } = client.playerHandle.updateVisibleEntities(AABB);

            const packet = new S2C_UpdateWorldPacket(elapsedMS, client.playerHandle.playerEntity, appearedEntities, nearbyEntities, disappearedEntities);
            client.send(packet);
        });

        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `entity updated. entity count : ${entities.length}, client count : ${this.gameServer.connectedClients.size}`)
        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `elapsedMS: ${elapsedMS}`);
    }

    _getEntityViewAABB(position, isAdmin) {
        let hw = globalThis.gameConfig.viewSize.width / 2 + globalThis.gameConfig.viewOffset.x;
        let hh = globalThis.gameConfig.viewSize.height / 2 + globalThis.gameConfig.viewOffset.y;

        if (isAdmin) {
            hw *= 3;
            hh *= 3;
        }

        return {
            minX: position.x - hw,
            minY: position.y - hh,
            maxX: position.x + hw,
            maxY: position.y + hh
        };
    }
}

export { WorldNetworkUpdatorSystem };
