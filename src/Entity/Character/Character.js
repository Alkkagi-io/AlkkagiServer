import { StatManager } from '../../Stat/StatManager.js';
import { Unit } from '../Unit.js';
import { CharacterAttack } from './CharacterAttack.js';
import { CharacterLevel } from './CharacterLevel.js';
import { HealthComponent, MoveComponent, EMoveState } from '../../Component/index.js';
import { StatConfig } from '../../../AlkkagiShared/Configs/StatConfig.js';
import { StatLevelUpManager } from '../../Level/StatLevelUpManager.js';
import { BuffManager } from '../../Buff/BuffManager.js';
import { EEntityType } from '../../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../../Collision/Collider/SphereCollider.js';
import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { XPObject } from '../XPObject.js';
import { CharacterWallet } from './CharacterWallet.js';
import { Random } from '../../../AlkkagiShared/Modules/Random.js';

const CHARACTER_XP_DROP_STEP = 10;
const CHARACTER_XP_DROP_INNER_RADIUS = 10;
const CHARACTER_XP_DROP_OUTER_RADIUS = 30;

const CHARACTER_DISSAPEAR_TIME = 1;

const CHARACTER_DEFAULT_SCALE = 0.825;

const CHARACTER_AUTO_HEAL_INTERVAL = 0.1;

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

        this.scale = this._getScaleByWeight(this.statManager.getValue(StatConfig.Type.WEIGHT));
    }

    getWeight() {
        // return this.statManager.getValue(StatConfig.Type.WEIGHT);
        return this.scale;
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

        if (this.buffManager) {
            this.buffManager.update(deltaTime);
        }

        if (this.moveComponent) {
            this.moveComponent.onUpdate(deltaTime);
        }

        this.autoHealTimer += deltaTime;
        if(this.autoHealTimer >= CHARACTER_AUTO_HEAL_INTERVAL)
        {
            this.autoHealTimer = this.autoHealTimer - CHARACTER_AUTO_HEAL_INTERVAL;
            if (this.healthComponent) {
                this.healthComponent.heal(this, this.statManager.getValue(StatConfig.Type.AUTO_HEAL) * CHARACTER_AUTO_HEAL_INTERVAL);
            }
        }
    }

    onCollide(other, contactPoint, normal, velocityReflected) {
        super.onCollide(other, contactPoint, normal, velocityReflected);
        this.moveComponent.propel(velocityReflected);
    }

    onCollisionEnter(other) {
        super.onCollisionEnter(other);

        if(this.moveStateBuffer == EMoveState.Propelled) {
            this.attackComponent.onCollisionEnter(other);
        }
    }

    onHPChanged(performer, prevHP, currentHP) {
        if(currentHP <= 0) {
            this.enabled = false;
            setTimeout(() => this.world.removeEntity(this), CHARACTER_DISSAPEAR_TIME * 1000);

            const xpUnit = Math.floor(Math.pow(10, Math.floor(Math.log10(this.levelComponent.xpAmount))) / 3) + 1;
            let xpCount = Math.floor(this.levelComponent.xpAmount / xpUnit);
            if(this.levelComponent.xpAmount % xpUnit >= xpUnit * 0.5) {
                xpCount++;
            }

            for(let i = 0; i < xpCount; i++) {
                const xpObject = new XPObject(this.world, xpUnit, Random.range(globalThis.gameConfig.xpObjectLifeTimeMin, globalThis.gameConfig.xpObjectLifeTimeMax + 1));
                const randomPosition = Random.insideUnitCircle().multiply(Random.range(CHARACTER_XP_DROP_INNER_RADIUS, CHARACTER_XP_DROP_OUTER_RADIUS));
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
        // globalThis.logger.debug('Character', `onLevelUp [prevLevel: ${prevLevel}, currentLevel: ${currentLevel}, currentStatPoint: ${currentStatPoint}]`);
    }

    onStatLevelUp(type) {
        const originMoveDirection = this.moveComponent.locomotionVelocity;
        const moveSpeed = this.statManager.getValue(StatConfig.Type.MOVE_SPEED);
        this.moveComponent.setLocomotionVelocity(originMoveDirection, moveSpeed);

        // const weightLevel = this.statLevelUpManager.getStatLevelByStatType(StatConfig.Type.WEIGHT);
        // this.scale = 1 + (0.1 * weightLevel);
        const weight = this.statManager.getValue(StatConfig.Type.WEIGHT);
        this.scale = this._getScaleByWeight(weight);
    }

    _getScaleByWeight(weight) {
        return CHARACTER_DEFAULT_SCALE + (weight * 0.15);
    }
}

export { Character };
