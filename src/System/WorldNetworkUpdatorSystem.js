import { System } from './index.js';
import { S2C_UpdateWorldPacket } from '../../AlkkagiShared/Packets/index.js';
import { Character } from '../Entity/index.js';

// 5Hz
// const WORLD_UPDATE_TICK = 6;

// 10Hz
// const WORLD_UPDATE_TICK = 3;

// 30Hz
const WORLD_UPDATE_TICK = 1;

const VIEW_SIZE = {
    width: 20,
    height: 12
}

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
        if(this.counter < WORLD_UPDATE_TICK)
            return;

        this.counter = 0;

        const now = Date.now();
        const elapsedMS = now - this.lastUpdateTime;
        this.lastUpdateTime = now;

        this.gameServer.connectedClients.forEach(client => {
            if (!client.playerHandle)
                return;

            // 주변 엔티티 가져오기
            const nearbyEntities = [];
            const AABB = this._getEntityViewAABB(client.playerHandle.getEntityPosition());
            this.world.entityTree.query(AABB, leaf => {
                const entity = leaf.data;
                nearbyEntities.push(entity);
            });

            const packet = new S2C_UpdateWorldPacket(elapsedMS, nearbyEntities, client.playerHandle.playerEntity);
            const buffer = packet.serialize();
            client.send(buffer);
        });

        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `entity updated. entity count : ${entities.length}, client count : ${this.gameServer.connectedClients.size}`)
        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `elapsedMS: ${elapsedMS}`);
    }

    _getEntityViewAABB(position) {
        const hw = VIEW_SIZE.width / 2;
        const hh = VIEW_SIZE.height / 2;

        return {
            minX: position.x - hw,
            minY: position.y - hh,
            maxX: position.x + hw,
            maxY: position.y + hh
        };
    }
}

export { WorldNetworkUpdatorSystem };