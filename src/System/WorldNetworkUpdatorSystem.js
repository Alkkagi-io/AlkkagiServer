import { System } from './index.js';
import { S2C_UpdateWorldPacket } from '../../AlkkagiShared/Packets/index.js';
import { DynamicAABBTree } from '../Utils/DynamicAABBTree/DynamicAABBTree.js';
import { Character } from '../Entity/index.js';

const WORLD_UPDATE_TICK = 10;

const VIEW_SIZE = {
    width: 20,
    height: 12
}

class WorldNetworkUpdatorSystem extends System {
    constructor(world, gameServer) {
        super(world);
        this.gameServer = gameServer;
        this.counter = 0;
        this.entityNetworkTree = new DynamicAABBTree({ fatMargin: 0 });

        this.world.on('addEntity', entity => this.onAddEntity(entity));
        this.world.on('removeEntity', entity => this.onRemoveEntity(entity));
    }

    getSystemID() {
        return "PlayerUpdatorSystem";
    }

    onPostUpdate(deltaTime) {
        // tree update는 tick 영향 안받고 실시간 업데이트 되도록
        for (const leaf of this.entityNetworkTree.nodes) {
            if (!leaf?.isLeaf || !leaf.data)
                continue;

            const entity = leaf.data;
            const aabb = this._getEntityViewAABB(entity);
            this.entityNetworkTree.update(leaf, aabb);
        }

        this.counter++;
        if(this.counter < WORLD_UPDATE_TICK)
            return;

        this.counter = 0;

        this.gameServer.connectedClients.forEach(client => {
            if (!client.playerHandle)
                return;

            // 주변 엔티티 가져오기
            const nearbyEntities = [];
            const AABB = this._getEntityViewAABB(client.playerHandle.playerEntity);
            this.entityNetworkTree.query(AABB, leaf => {
                const entity = leaf.data;
                nearbyEntities.push(entity);
            });

            const packet = new S2C_UpdateWorldPacket(nearbyEntities);
            const buffer = packet.serialize();
            client.send(buffer);
        });

        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `entity updated. entity count : ${entities.length}, client count : ${this.gameServer.connectedClients.size}`)
    }

    onAddEntity(entity) {
        if (!(entity instanceof Character))
            return;

        const AABB = this._getEntityViewAABB(entity);
        entity.refLeaf = this.entityNetworkTree.insert(entity, AABB);
    }

    onRemoveEntity(client) {
        if (!(entity instanceof Character))
            return;

        this.entityNetworkTree.remove(entity.refLeaf);
        entity.refLeaf = undefined;
    }

    _getEntityViewAABB(entity) {
        const pos = entity.position;
        const hw = VIEW_SIZE.width / 2;
        const hh = VIEW_SIZE.height / 2;

        return {
            minX: pos.x - hw,
            minY: pos.y - hh,
            maxX: pos.x + hw,
            maxY: pos.y + hh
        };
    }
}

export { WorldNetworkUpdatorSystem };