import { System } from './index.js';
import { S2C_UpdateWorldPacket } from '../../AlkkagiShared/Packets/index.js';
import { DynamicAABBTree } from '../Utils/DynamicAABBTree/DynamicAABBTree.js';

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

        this.gameServer.on('connectlClient', client => this.onConnectClient(client));
        this.gameServer.on('disconnectClient', client => this.onDisConnectClient(client));
    }

    getSystemID() {
        return "PlayerUpdatorSystem";
    }

    onPostUpdate(deltaTime) {
        // tree update는 tick 영향 안받고 실시간 업데이트 되도록
        for (const leaf of this.entityNetworkTree.nodes) {
            if (!leaf?.isLeaf || !leaf.data)
                continue;
            const aabb = leaf.data.getAABB();
            this.entityNetworkTree.update(leaf, aabb);
        }

        this.counter++;
        if(this.counter < WORLD_UPDATE_TICK)
            return;

        this.counter = 0;

        this.gameServer.connectedClients.forEach(client => {
            if (!client.playerHandle)
                return;

            // 주변 클라이언트 엔티티 가져오기
            const nearbyClientEntities = [];
            const AABB = this._getClientEntityScreenAABB(client.playerHandle.playerEntity);
            this.entityNetworkTree.query(AABB, leaf => {
                const nearbyClient = leaf.data;
                nearbyClientEntities.push(nearbyClient.playerHandle.playerEntity);
            });

            const packet = new S2C_UpdateWorldPacket(nearbyClientEntities);
            const buffer = packet.serialize();
            client.send(buffer);
        });

        // globalThis.logger.debug('WorldNetworkUpdatorSystem', `entity updated. entity count : ${entities.length}, client count : ${this.gameServer.connectedClients.size}`)
    }

    onConnectClient(client) {
        if (!client.playerHandle)
            return;

        const AABB = _getClientEntityScreenAABB(client.playerHandle.playerEntity);
        client.refLeaf = this.entityNetworkTree.insert(client, AABB);
    }

    onDisConnectClient(client) {
        if (!client.playerHandle)
            return;

        this.entityNetworkTree.remove(client.refLeaf);
        client.refLeaf = undefined;
    }

    _getClientEntityScreenAABB(entity) {
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