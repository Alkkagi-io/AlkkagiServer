import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { EMoveState } from '../../Component/index.js';
import { StatConfig } from '../../Stat/StatConfig.js';

const ATTACK_CHARGE_THRESHOLD = 1;
const DAMAGE_FACTOR = 10;

class CharacterAttack {
    constructor(character) {
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
            healthComponent.damage(damage);
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
        attackForce.multiply(chargingPower);

        this.lastAttackTime = Date.now();
        this.moveComponent.propel(attackForce);
    }
}

export { CharacterAttack };