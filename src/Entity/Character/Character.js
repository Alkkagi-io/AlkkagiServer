import { StatManager } from '../../Stat/StatManager.js';
import { Unit } from '../index.js';
import { EStatType } from '../../../AlkkagiShared/Resource/ResourceStat.js';
import { ECharacterState } from './ECharacterState.js';
import { CharacterMove } from './CharacterMove.js';
import { CharacterAttack } from './CharacterAttack.js';
import { CharacterLevel } from './CharacterLevel.js';
import { HealthComponent } from '../../Component/index.js';

class Character extends Unit {
    constructor(world) {
        super(world);

        this.healthComponent = new HealthComponent(() => this.statManager.getValue(EStatType.MAX_HP), this.onHPChanged);

        this.moveComponent = new CharacterMove(this);
        this.attackComponent = new CharacterAttack(this);
        this.levelComponent = new CharacterLevel(this);

        this.characterState = ECharacterState.Locomotion;

        this.gold = 0;
        this.statManager = new StatManager();
    }

    getWeight() {
        return this.statManager.getValue(EStatType.WEIGHT);
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        this.moveComponent.onUpdate(deltaTime);
    }

    onCollide(other, contactPoint, normal, velocityReflected) {
        super.onCollide(other, contactPoint, normal, velocityReflected);
        this.moveComponent.propel(velocityReflected);
    }

    onHPChanged(prevHP, currentHP) {
        global.logger.Info('Character', `onHPChanged [prevHP: ${prevHP}, currentHP: ${currentHP}]`);
    }

    setCurrentState(state) {
        this.characterState = state;
    }

    gainGold(goldAmount) {
        this.gold += goldAmount;
    }

    useGold(goldAmount) {
        this.gold -= goldAmount;
        if (this.gold < 0)
            this.gold = 0;
    }
}

export { Character, ECharacterState };