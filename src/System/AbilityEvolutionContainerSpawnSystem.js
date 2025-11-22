import { System } from './System.js';
import { AbilityEvolutionContainer } from '../Entity/index.js';
import { ResourceAbilityEvolutionContainerSpawnSystemConfig } from '../Resource/ResourceAbilityEvolutionContainerSpawnSystemConfig.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

class AbilityEvolutionContainerSpawnSystem extends System {
    constructor(world) {
        super(world);

        this.config = ResourceAbilityEvolutionContainerSpawnSystemConfig.get(0);
        this.occupiedSlots = new Set();
    }

    getSystemID() {
        return 'AbilityEvolutionContainerSpawnSystem';
    }

    onStart() {
        super.onStart();

        for(let i = 0; i < this.config.spawnCount; i++) {
            this.spawnAbilityEvolutionContainer();
        }
    }

    spawnAbilityEvolutionContainer() {
        // 비어있는 슬롯 중에서 선택
        const slotIndex = this.getFreeRandomSlotIndex();
        if (slotIndex === -1) {
            // 모든 슬롯이 점유 중 -> 스폰 보류 (옵션: 타이머로 재시도)
            return;
        }

        this.occupiedSlots.add(slotIndex);

        // 죽을 때/사라질 때 호출될 release 콜백을 래핑해 슬롯을 해제
        const onContainerGone = () => {
            this.occupiedSlots.delete(slotIndex);
            // 기존 동작 유지: 죽을 때 다시 생성하고 싶다면 아래를 유지
            this.spawnAbilityEvolutionContainer();
        };

        const abilityEvolutionContainer = new AbilityEvolutionContainer(this.world, onContainerGone.bind(this));
        abilityEvolutionContainer.position = this.getRandomPosition(slotIndex);
        this.world.addEntity(abilityEvolutionContainer);
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

    getRandomPosition(slotIndex) {
        const position = this.config.positionList[slotIndex];
        const jitter = Vector.multiply(Vector.One(), Random.range(-1.5, 1.5));

        return Vector.add(new Vector(position.x, position.y), jitter);
    }
}

export { AbilityEvolutionContainerSpawnSystem };