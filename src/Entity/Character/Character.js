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
import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { XPObject } from '../XPObject.js';
import { CharacterWallet } from './CharacterWallet.js';

const CHARACTER_XP_DROP_STEP = 10;
const CHARACTER_XP_DROP_RADIUS = 10;

class Character extends Unit {
    constructor(world, nickname) {
        super(world);

        // init variables
        this.score = 0;
        this.nickname = nickname;
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
        this.walletComponent = new CharacterWallet(this);
        this.healthComponent = new HealthComponent(() => this.statManager.getValue(StatConfig.Type.MAX_HP), this.onHPChanged);
        this.moveComponent = new MoveComponent(this.rigidbody);

        this.attackComponent = new CharacterAttack(this);
        this.levelComponent = new CharacterLevel(this, this.onGainXP, this.onLevelUp, this.onStatLevelUp);
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
                this.healthComponent.heal(this, this.statManager.getValue(StatConfig.Type.AUTO_HEAL));
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

    onHPChanged(performer, prevHP, currentHP) {
        if(currentHP <= 0) {
            this.world.removeEntity(this);

            let xpCount = Math.floor(this.levelComponent.xpAmount / CHARACTER_XP_DROP_STEP);
            if(this.levelComponent.xpAmount % CHARACTER_XP_DROP_STEP >= CHARACTER_XP_DROP_STEP * 0.5) {
                xpCount++;
            }

            for(let i = 0; i < xpCount; i++) {
                const xpObject = new XPObject(this.world, CHARACTER_XP_DROP_STEP * (i + 1));
                xpObject.position = Vector.add(this.position, new Vector(Math.random() * CHARACTER_XP_DROP_RADIUS, Math.random() * CHARACTER_XP_DROP_RADIUS));
                
                this.world.addEntity(xpObject);
            }
        }
    }

    onGainXP(prevXP, currentXP) {
        const delta = currentXP - prevXP;
        score += delta;
    }

    onLevelUp(prevLevel, currentLevel, currentStatPoint) {
        globalThis.logger.debug('Character', `onLevelUp [prevLevel: ${prevLevel}, currentLevel: ${currentLevel}, currentStatPoint: ${currentStatPoint}]`);
    }

    onStatLevelUp(type) {
        const originMoveDirection = this.moveComponent.locomotionVelocity;
        const moveSpeed = this.statManager.getValue(StatConfig.Type.MOVE_SPEED);
        this.moveComponent.setLocomotionVelocity(originMoveDirection, moveSpeed);
    }

    getWeight() {
        return this.statManager.getValue(StatConfig.Type.WEIGHT);
    }
}

export { Character };