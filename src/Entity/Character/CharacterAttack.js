import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { EMoveState } from '../../Component/index.js';
import { StatConfig } from '../../Stat/StatConfig.js';
import { Character } from './Character.js';

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
        if(this.moveComponent.moveState != EMoveState.Propelled) {
            return;
        }

        const healthComponent = other.healthComponent;
        if(healthComponent) {
            const velocity = this.moveComponent.rigidbody.velocity.getMagnitude();
            const weight = this.statManager.getValue(StatConfig.Type.WEIGHT);
            const damage = Math.floor(velocity * weight * DAMAGE_FACTOR);
            healthComponent.damage(other, damage);

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

        const chargingTime = (Date.now() - this.chargingStartTime) * 0.001; // tick to seconds
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