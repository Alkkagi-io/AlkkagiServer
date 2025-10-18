import { StatManager } from '../../Stat/StatManager.js';
import { Unit } from '../index.js';
import { CharacterAttack } from './CharacterAttack.js';
import { CharacterLevel } from './CharacterLevel.js';
import { HealthComponent, MoveComponent } from '../../Component/index.js';
import { StatConfig } from '../../Stat/StatConfig.js';
import { StatLevelUpManager } from '../../Level/StatLevelUpManager.js';
import { BuffManager } from '../../Buff/BuffManager.js';
import { EEntityType } from '../../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../../Collision/Collider/SphereCollider.js';

class Character extends Unit {
    constructor(world) {
        super(world);

        // init variables
        this.collider = new SphereCollider(this);
        this.statManager = new StatManager(this);
        this.statLevelUpManager = new StatLevelUpManager(this);
        this.buffManager = new BuffManager(this);
        this.autoHealTimer = 0;
        this.gold = 0;
    }

    getEntityType() {
        return EEntityType.Character;
    }

    onAwake() {
        super.onAwake();

        // init components
        this.healthComponent = new HealthComponent(() => this.statManager.getValue(StatConfig.Type.MAX_HP), this.onHPChanged);
        this.moveComponent = new MoveComponent(this.rigidbody);

        this.attackComponent = new CharacterAttack(this);
        this.levelComponent = new CharacterLevel(this, this.onLevelUp, this.onStatLevelUp);
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        if (this.buffManager) {
            this.buffManager.update(deltaTime);
        }

        if (this.moveComponent) {
            this.moveComponent.onUpdate(deltaTime);
        }

        this.autoHealTimer += deltaTime;
        if(this.autoHealTimer >= 1)
        {
            this.autoHealTimer = this.autoHealTimer - 1;
            if (this.healthComponent) {
                this.healthComponent.heal(this.statManager.getValue(StatConfig.Type.AUTO_HEAL));
            }
        }
    }

    onCollide(other, contactPoint, normal, velocityReflected) {
        super.onCollide(other, contactPoint, normal, velocityReflected);
        this.moveComponent.propel(velocityReflected);
    }

    onCollisionEnter(other) {
        super.onCollisionEnter(other);
        this.attackComponent.onCollisionEnter(other);
    }

    onHPChanged(prevHP, currentHP) {
        global.logger.debug('Character', `onHPChanged [prevHP: ${prevHP}, currentHP: ${currentHP}]`);

        if(currentHP <= 0) {
            this.world.removeEntity(this);
        }
    }

    onLevelUp(prevLevel, currentLevel, currentStatPoint) {
        global.logger.debug('Character', `onLevelUp [prevLevel: ${prevLevel}, currentLevel: ${currentLevel}, currentStatPoint: ${currentStatPoint}]`);
    }

    onStatLevelUp(type) {
        const originMoveDirection = this.moveComponent.locomotionVelocity;
        const moveSpeed = this.statManager.getValue(StatConfig.Type.MOVE_SPEED);
        this.moveComponent.setLocomotionVelocity(originMoveDirection, moveSpeed);
    }

    getWeight() {
        return this.statManager.getValue(StatConfig.Type.WEIGHT);
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