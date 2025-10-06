import { System } from './index.js';
import { S2C_UpdateWorldPacket } from '../../AlkkagiShared/Packets/index.js';

const WORLD_UPDATE_TICK = 10;

class WorldNetworkUpdatorSystem extends System {
    constructor(world, gameServer) {
        super(world);
        this.gameServer = gameServer;
        this.counter = 0;
    }

    getSystemID() {
        return "PlayerUpdatorSystem";
    }

    onPostUpdate(deltaTime) {
        this.counter++;
        if(this.counter < WORLD_UPDATE_TICK)
            return;

        this.counter = 0;

        const entities = Object.values(this.world.entities);
        const packet = new S2C_UpdateWorldPacket(entities);
        const buffer = packet.serialize();

        this.gameServer.connectedClients.forEach(client => {
            client.send(buffer);
        });

        globalThis.logger.debug('WorldNetworkUpdatorSystem', `entity updated. entity count : ${entities.length}, client count : ${this.gameServer.connectedClients.size}`)
    }
}

export { WorldNetworkUpdatorSystem };