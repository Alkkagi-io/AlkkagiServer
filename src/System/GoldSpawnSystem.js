import { System } from './System.js';
import { GoldContainer } from '../Entity/index.js';
import { ResourceGoldSpawnSystemConfig } from '../Resource/ResourceGoldSpawnSystemConfig.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class GoldSpawnSystem extends System {
    constructor(world) {
        super(world);

        this.config = ResourceGoldSpawnSystemConfig.get(0);
    }

    getSystemID() {
        return 'GoldSpawnSystem';
    }

    onStart() {
        super.onStart();

        for(let i = 0; i < this.config.spawnCount; i++) {
            this.spawnGoldContainer();
        }
    }

    spawnGoldContainer() {
        const tableRow = this.getRandomTableRow();
        if(tableRow == null) {
            return;
        }

        const goldAmount = Math.floor(Math.random() * (tableRow.GoldMax - tableRow.GoldMin + 1)) + tableRow.GoldMin;
        const hp = Math.floor(Math.random() * (tableRow.HPMax - tableRow.HPMin + 1)) + tableRow.HPMin;
        const goldContainer = new GoldContainer(this.world, goldAmount, hp, this.spawnGoldContainer.bind(this));
        goldContainer.position = this.getRandomPosition();
        this.world.addEntity(goldContainer);
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

        const position = this.config.positionList[Math.floor(Math.random() * this.config.positionList.length)];
        return new Vector(position.x, position.y);
    }
}

export { GoldSpawnSystem };