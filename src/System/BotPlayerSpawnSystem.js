import { System } from './System.js';
import { BotPlayer } from '../Entity/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';
import { S2C_AddPlayerPacket, S2C_RemovePlayerPacket } from '../../AlkkagiShared/Packets/index.js';

const SPAWN_DELAY_MIN = 500;
const SPAWN_DELAY_MAX = 3000;

class BotPlayerSpawnSystem extends System {
    constructor(world, gameServer) {
        super(world);

        this.gameServer = gameServer;
        this.gameConfig = globalThis.gameConfig;
    }

    getSystemID() {
        return 'BotPlayerSpawnSystem';
    }

    onStart() {
        super.onStart();

        for(let i = 0; i < this.gameConfig.botPlayerCount; i++) {
            this.spawnBotPlayer();
        }
    }

    spawnBotPlayer() {
        const delayMilliseconds = Random.range(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX);
        setTimeout(() => {
            const botPlayer = new BotPlayer(this.world, 'AAA', this.onBotPlayerDead.bind(this));
            botPlayer.position = this.getRandomPosition();
            this.world.addEntity(botPlayer);

            const addPlayerPacket = new S2C_AddPlayerPacket(botPlayer);
            for (const client of this.gameServer.connectedClients) {
                if (!client.playerHandle)
                    continue;
            
                client.send(addPlayerPacket);
            }
        }, delayMilliseconds);
    }

    onBotPlayerDead(entity) {
        const removePlayerPacket = new S2C_RemovePlayerPacket(entity.entityID);
        for (const client of this.gameServer.connectedClients) {
            if (!client.playerHandle)
                continue;
            
            client.send(removePlayerPacket);
        }
        this.spawnBotPlayer();
    }

    getRandomPosition() {
        const halfWidth = this.gameConfig.worldWidth * 0.5;
        const halfHeight = this.gameConfig.worldHeight * 0.5;
        return new Vector(Random.range(-halfWidth, halfWidth), Random.range(-halfHeight, halfHeight));
    }
}

export { BotPlayerSpawnSystem };