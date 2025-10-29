import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { EMoveState } from '../../Component/index.js';
import { StatConfig } from '../../Stat/StatConfig.js';
import { Character } from './Character.js';
import { EntityRule } from '../../Utils/Entity/EntityRule.js';

const ATTACK_CHARGE_THRESHOLD = 1;
const DAMAGE_FACTOR = 10;

class CharacterAttack {
    constructor(character) {
        this.owner = character;
        this.moveComponent = character.moveComponent;
        this.statManager = character.statManager;
        this.chargingStartTime = Date.now();
        this.lastAttackTime = 0;
    }

    onCollisionEnter(other) {        
        const velocity = this.owner.getVelocity();

        // if(other instanceof Character) {
        //     globalThis.logger.debug('CharacterAttack', `onCollisionEnter this: ${this.owner.nickname}, other: ${other.nickname}, directionSimilarity: ${Vector.dot(propelDirection, targetDirection)}`);
        // }

        if(EntityRule.isAttackMotion(velocity, this.owner.position, other.position) == false) {
            return;
        }

        const healthComponent = other.healthComponent;
        if(healthComponent) {
            const velocityMagnitude = velocity.getMagnitude();
            const weight = this.statManager.getValue(StatConfig.Type.WEIGHT);
            const damage = Math.floor(velocityMagnitude * weight * DAMAGE_FACTOR);
            healthComponent.damage(this.owner, damage);

            // 상대방이 이 공격을 맞고 죽었다면
            if (healthComponent.currentHP <= 0) {
                if (other instanceof Character) {
                    this.owner.score += 300;
                } else {
                    this.owner.score += 50;
                }
            }
        }
    }

    startAttackCharging() {
        if(this.moveComponent.moveState != EMoveState.Locomotion)
            return;

        const attackCooldown = (Date.now() - this.lastAttackTime) * 0.001; // tick to seconds
        if(attackCooldown < this.statManager.getValue(StatConfig.Type.ATK_COOLTIME))
            return;

        this.chargingStartTime = Date.now();
        this.moveComponent.hold();
    }

    finishAttackCharging(direction) {
        if(this.moveComponent.moveState != EMoveState.Hold)
            return;

        const chargingTime = (Date.now() - this.chargingStartTime) * 0.001 + 2; // tick to seconds
        if(chargingTime < ATTACK_CHARGE_THRESHOLD)
        {
            this.moveComponent.release();
            return;
        }

        const chargingPower = Math.min(chargingTime, this.statManager.getValue(StatConfig.Type.MAX_CHARGE_LEN));

        let attackForce = Vector.normalize(direction);
        attackForce.multiply(chargingPower * 10);

        this.lastAttackTime = Date.now();
        this.moveComponent.propel(attackForce);
    }
}

export { CharacterAttack };