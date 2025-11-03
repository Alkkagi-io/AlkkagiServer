import { System } from './System.js';
import { XPContainer } from '../Entity/index.js';
import { ResourceXPSpawnSystemConfig } from '../Resource/ResourceXPSpawnSystemConfig.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

class XPSpawnSystem extends System {
    constructor(world) {
        super(world);

        this.config = ResourceXPSpawnSystemConfig.get(0);
        this.occupiedSlots = new Set();
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

        // 비어있는 슬롯 중에서 선택
        const slotIndex = this.getFreeRandomSlotIndex();
        if (slotIndex === -1) {
            // 모든 슬롯이 점유 중 -> 스폰 보류 (옵션: 타이머로 재시도)
            return;
        }

        const xpAmount = Random.rangeInt(tableRow.XPMin, tableRow.XPMax + 1);
        const hp = Random.rangeInt(tableRow.HPMin, tableRow.HPMax + 1);
        const scale = tableRow.Scale;
        const xpUnit = tableRow.XPUnit;

        this.occupiedSlots.add(slotIndex);

        // 죽을 때/사라질 때 호출될 release 콜백을 래핑해 슬롯을 해제
        const onContainerGone = () => {
            this.occupiedSlots.delete(slotIndex);
            // 기존 동작 유지: 죽을 때 다시 생성하고 싶다면 아래를 유지
            this.spawnXPContainer();
        };

        const xpContainer = new XPContainer(this.world, xpAmount, hp, xpUnit, onContainerGone.bind(this));
        xpContainer.scale = scale;
        xpContainer.position = this.getRandomPosition(slotIndex);
        this.world.addEntity(xpContainer);
    }

    getFreeRandomSlotIndex() {
        const list = this.config.positionList;
        if (!list || list.length === 0) return -1;

        // 비어있는 슬롯 수집
        const free = [];
        for (let i = 0; i < list.length; i++) {
            if (!this.occupiedSlots.has(i)) free.push(i);
        }
        if (free.length === 0) return -1;

        // 비어있는 슬롯 중 랜덤 선택
        const k = Random.rangeInt(0, free.length);
        return free[k];
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

    getRandomPosition(slotIndex) {
        const position = this.config.positionList[slotIndex];
        const jitter = Vector.multiply(Vector.One(), Random.range(-3, 3));

        return Vector.add(new Vector(position.x, position.y), jitter);
    }
}

export { XPSpawnSystem };