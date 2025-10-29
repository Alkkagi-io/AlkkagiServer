import { System } from './System.js';
import { XPContainer } from '../Entity/index.js';
import { ResourceXPSpawnSystemConfig } from '../Resource/ResourceXPSpawnSystemConfig.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

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

        const xpAmount = Random.rangeInt(tableRow.XPMin, tableRow.XPMax + 1);
        const hp = Random.rangeInt(tableRow.HPMin, tableRow.HPMax + 1);
        const xpContainer = new XPContainer(this.world, xpAmount, hp, this.spawnXPContainer.bind(this));
        xpContainer.position = this.getRandomPosition();
        this.world.addEntity(xpContainer);
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

export { XPSpawnSystem };