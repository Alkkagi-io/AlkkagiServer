import { System } from './System.js';
import { GoldContainer } from '../Entity/index.js';
import { ResourceGoldSpawnSystemConfig } from '../Resource/ResourceGoldSpawnSystemConfig.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

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

        const goldAmount = Random.rangeInt(tableRow.GoldMin, tableRow.GoldMax + 1);
        const hp = Random.rangeInt(tableRow.HPMin, tableRow.HPMax + 1);
        const goldContainer = new GoldContainer(this.world, goldAmount, hp, this.spawnGoldContainer.bind(this));
        goldContainer.position = this.getRandomPosition();
        this.world.addEntity(goldContainer);
    }

    getRandomTableRow() {
        if(this.config.spawnTable.length == 0) {
            return null;
        }

        const random = Random.range(0, this.config.totalRates);
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

        const position = this.config.positionList[Random.rangeInt(0, this.config.positionList.length)];
        return new Vector(position.x, position.y);
    }
}

export { GoldSpawnSystem };