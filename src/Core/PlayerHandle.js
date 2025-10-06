class PlayerHandle {
    constructor(gameServer, world, clientHandle, playerEntity) {
        this.gameServer = gameServer;
        this.world = world;
        this.clientHandle = clientHandle;
        this.playerEntity = playerEntity;
    }
}

export { PlayerHandle };