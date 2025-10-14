import { StatManager } from '../../Stat/StatManager.js';
import { Unit } from '../index.js';
import { EStatType } from '../../../AlkkagiShared/Resource/ResourceStat.js';
import { CharacterAttack } from './CharacterAttack.js';
import { CharacterLevel } from './CharacterLevel.js';
import { HealthComponent, MoveComponent } from '../../Component/index.js';

class Character extends Unit {
    constructor(world) {
        super(world);

        // init variables
        this.statManager = new StatManager();
        this.autoHealTimer = 0;
        this.gold = 0;
    }

    onAwake() {
        super.onAwake();

        // init components
        this.healthComponent = new HealthComponent(() => this.statManager.getValue(EStatType.MAX_HP), this.onHPChanged);
        this.moveComponent = new MoveComponent(this.rigidbody);

        this.attackComponent = new CharacterAttack(this);
        this.levelComponent = new CharacterLevel(this, this.onLevelUp);
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        if (this.moveComponent) {
            this.moveComponent.onUpdate(deltaTime);
        }

        this.autoHealTimer += deltaTime;
        if(this.autoHealTimer >= 1)
        {
            this.autoHealTimer = this.autoHealTimer - 1;
            if (this.healthComponent) {
                this.healthComponent.heal(this.statManager.getValue(EStatType.AUTO_HEAL));
            }
        }
    }

    onCollide(other, contactPoint, normal, velocityReflected) {
        super.onCollide(other, contactPoint, normal, velocityReflected);
        this.moveComponent.propel(velocityReflected);
    }

    onHPChanged(prevHP, currentHP) {
        global.logger.Info('Character', `onHPChanged [prevHP: ${prevHP}, currentHP: ${currentHP}]`);

        if(currentHP <= 0) {
            this.world.removeEntity(this);
        }
    }

    onLevelUp(type) {
        const originMoveDirection = this.moveComponent.locomotionVelocity;
        const moveSpeed = this.statManager.getStatValue(EStatType.MOVE_SPEED);
        this.moveComponent.setLocomotionVelocity(originMoveDirection, moveSpeed);
    }

    getWeight() {
        return this.statManager.getValue(EStatType.WEIGHT);
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

export { Character };