class PlayerHandle {
    constructor(gameServer, world, clientHandle, playerEntity) {
        this.gameServer = gameServer;
        this.world = world;
        this.clientHandle = clientHandle;
        this.playerEntity = playerEntity;

        this.clientHandle.on('disconnect', this.handleClientDisconnect.bind(this));
    }

    handleClientDisconnect() {
        globalThis.logger.info('GameServer', 'Player entity removed by client disconnect');
        this.world.removeEntity(this.playerEntity);
    }
}

export { PlayerHandle };