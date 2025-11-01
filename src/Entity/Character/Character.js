import { StatManager } from '../../Stat/StatManager.js';
import { Unit } from '../Unit.js';
import { CharacterAttack } from './CharacterAttack.js';
import { CharacterLevel } from './CharacterLevel.js';
import { HealthComponent, MoveComponent, EMoveState } from '../../Component/index.js';
import { StatConfig } from '../../Stat/StatConfig.js';
import { StatLevelUpManager } from '../../Level/StatLevelUpManager.js';
import { BuffManager } from '../../Buff/BuffManager.js';
import { EEntityType } from '../../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../../Collision/Collider/SphereCollider.js';
import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { XPObject } from '../XPObject.js';
import { CharacterWallet } from './CharacterWallet.js';
import { Random } from '../../../AlkkagiShared/Modules/Random.js';

const CHARACTER_XP_DROP_STEP = 10;
const CHARACTER_XP_DROP_RADIUS = 10;

const CHARACTER_DISSAPEAR_TIME = 1;

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
        this.isDead = false;
        this.dissapearTimer = 0;
    }

    getWeight() {
        return this.statManager.getValue(StatConfig.Type.WEIGHT);
    }

    onAwake() {
        super.onAwake();

        // init components
        this.walletComponent = new CharacterWallet(this);
        this.healthComponent = new HealthComponent(() => this.statManager.getValue(StatConfig.Type.MAX_HP), this.onHPChanged.bind(this));

        this.attackComponent = new CharacterAttack(this);
        this.levelComponent = new CharacterLevel(this, this.onGainXP.bind(this), this.onLevelUp.bind(this), this.onStatLevelUp.bind(this));
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        if (this.isDead) {
            this.dissapearTimer += deltaTime;
            if(this.dissapearTimer >= CHARACTER_DISSAPEAR_TIME) {
                this.world.removeEntity(this);
            }

            return;
        }

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

        if (this.isDead) {
            return;
        }

        this.moveComponent.propel(velocityReflected);
    }

    onCollisionEnter(other) {
        super.onCollisionEnter(other);

        if (this.isDead) {
            return;
        }

        if(this.moveStateBuffer == EMoveState.Propelled) {
            this.attackComponent.onCollisionEnter(other);
        }
    }

    onHPChanged(performer, prevHP, currentHP) {
        if (this.isDead) {
            return;
        }

        if(currentHP <= 0) {
            this.isDead = true;
            this.collider.enabled = false;

            // this.world.removeEntity(this);

            let xpCount = Math.floor(this.levelComponent.xpAmount / CHARACTER_XP_DROP_STEP);
            if(this.levelComponent.xpAmount % CHARACTER_XP_DROP_STEP >= CHARACTER_XP_DROP_STEP * 0.5) {
                xpCount++;
            }

            for(let i = 0; i < xpCount; i++) {
                const xpObject = new XPObject(this.world, CHARACTER_XP_DROP_STEP * (i + 1));
                const randomPosition = Random.insideUnitCircle().multiply(CHARACTER_XP_DROP_RADIUS);
                xpObject.position = Vector.add(this.position, randomPosition);
                
                this.world.addEntity(xpObject);
            }
        }
    }

    onGainXP(prevXP, currentXP) {
        const delta = currentXP - prevXP;
        this.score += delta;
    }

    onLevelUp(prevLevel, currentLevel, currentStatPoint) {
        globalThis.logger.debug('Character', `onLevelUp [prevLevel: ${prevLevel}, currentLevel: ${currentLevel}, currentStatPoint: ${currentStatPoint}]`);
    }

    onStatLevelUp(type) {
        const originMoveDirection = this.moveComponent.locomotionVelocity;
        const moveSpeed = this.statManager.getValue(StatConfig.Type.MOVE_SPEED);
        this.moveComponent.setLocomotionVelocity(originMoveDirection, moveSpeed);
    }
}

export { Character };
