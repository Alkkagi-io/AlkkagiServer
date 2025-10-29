import { System } from './System.js';
import { BotPlayer } from '../Entity/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

const SPAWN_DELAY_MIN = 500;
const SPAWN_DELAY_MAX = 3000;

class BotPlayerSpawnSystem extends System {
    constructor(world) {
        super(world);

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
            const botPlayer = new BotPlayer(this.world, 'AAA', this.spawnBotPlayer.bind(this));
            botPlayer.position = this.getRandomPosition();
            this.world.addEntity(botPlayer);
        }, delayMilliseconds);
    }

    getRandomPosition() {
        const halfWidth = this.gameConfig.worldWidth * 0.5;
        const halfHeight = this.gameConfig.worldHeight * 0.5;
        return new Vector(Random.range(-halfWidth, halfWidth), Random.range(-halfHeight, halfHeight));
    }
}

export { BotPlayerSpawnSystem };