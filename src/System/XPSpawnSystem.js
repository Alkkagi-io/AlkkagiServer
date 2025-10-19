import { System } from './System.js';
import { XPContainer } from '../Entity/index.js';
import { ResourceXPSpawnSystemConfig } from '../Resource/ResourceXPSpawnSystemConfig.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class XPSpawnSystem extends System {
    constructor(world) {
        super(world);

        this.config = ResourceXPSpawnSystemConfig.get(0);
    }

    getSystemID() {
        return 'XPSpawnSystem';
    }

    onStart() {
        super.onStart();

        for(let i = 0; i < this.config.spawnCount; i++) {
            this.spawnXPContainer();
        }
    }

    spawnXPContainer() {
        const tableRow = this.getRandomTableRow();
        if(tableRow == null) {
            return;
        }

        const xpAmount = Math.floor(Math.random() * (tableRow.XPMax - tableRow.XPMin + 1)) + tableRow.XPMin;
        const hp = Math.floor(Math.random() * (tableRow.HPMax - tableRow.HPMin + 1)) + tableRow.HPMin;
        const xpContainer = new XPContainer(this.world, xpAmount, hp, this.spawnXPContainer.bind(this));
        xpContainer.position = this.getRandomPosition();
        this.world.addEntity(xpContainer);

        globalThis.logger.debug('XPSpawnSystem', `Entity spawned [xpAmount: ${xpAmount}, hp: ${hp}, position: (${xpContainer.position.x}, ${xpContainer.position.y})]`);
    }

    getRandomTableRow() {
        if(this.config.spawnTable.length == 0) {
            return null;
        }

        const random = Math.random() * this.config.totalRates;
        let sum = 0;
        for(let i = 0; i < this.config.spawnTable.length; i++) {
            sum += this.config.spawnTable[i].Rate;
            if(random <= sum) {
                return this.config.spawnTable[i];
            }
        }

        return null;
    }

    getRandomPosition() {
        if(this.config.positionList.length == 0) {
            return Vector.Zero();
        }

        return this.config.positionList[Math.floor(Math.random() * this.config.positionList.length)];
    }
}

export { XPSpawnSystem };