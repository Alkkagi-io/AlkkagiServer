import { System } from './System.js';
import { BotPlayer } from '../Entity/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

const SPAWN_DELAY_MIN = 1000;
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
        const delayMilliseconds = Math.random() * (SPAWN_DELAY_MAX - SPAWN_DELAY_MIN) + SPAWN_DELAY_MIN;
        setTimeout(() => {
            const botPlayer = new BotPlayer(this.world, 'AAA', this.spawnBotPlayer.bind(this));
            botPlayer.position = this.getRandomPosition();
            this.world.addEntity(botPlayer);
        }, delayMilliseconds);
    }

    getRandomPosition() {
        return new Vector((Math.random() - 0.5) * this.gameConfig.worldWidth, (Math.random() - 0.5) * this.gameConfig.worldHeight);
    }
}

export { BotPlayerSpawnSystem };