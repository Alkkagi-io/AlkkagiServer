import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class PlayerHandle {
    constructor(gameServer, world, clientHandle) {
        this.gameServer = gameServer;
        this.world = world;
        this.clientHandle = clientHandle;
        this.playerEntity = null;
        this.lastPosition = new Vector();

        this.clientHandle.on('disconnect', this.handleClientDisconnect.bind(this));
    }

    getEntityPosition() {
        if(this.playerEntity == null)
            return this.lastPosition;

        return this.playerEntity.position;
    }

    handlePlayerEntityDestroyed() {
        if(this.playerEntity == null)
            return;

        this.lastPosition = this.playerEntity.position;
        this.playerEntity = null;
    }

    handleClientDisconnect() {
        if(this.playerEntity == null)
            return;

        globalThis.logger.info('PlayerHandle', `Player entity removed by client disconnect. EntityID: ${this.playerEntity.entityID}`);
        this.lastPosition = this.playerEntity.position;
        this.world.removeEntity(this.playerEntity);
        this.playerEntity = null;
    }
}

export { PlayerHandle };