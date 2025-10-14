import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { EMoveState } from '../../Component/index.js';
import { StatConfig } from '../../Stat/StatConfig.js';

const ATTACK_CHARGE_THRESHOLD = 1;

class CharacterAttack {
    constructor(character) {
        this.character = character;
        this.moveComponent = character.moveComponent;
        this.chargingStartTime = Date.now();
        this.lastAttackTime = 0;
    }

    startAttackCharging() {
        if(this.moveComponent.moveState != EMoveState.Locomotion)
            return;

        const attackCooldown = (Date.now() - this.lastAttackTime) * 0.001; // tick to seconds
        if(attackCooldown < this.character.statManager.getStatValue(StatConfig.Type.ATK_COOLTIME))
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

        const chargingPower = Math.min(chargingTime, this.character.statManager.getStatValue(EStatType.MAX_CHARGE_LEN));

        let attackForce = Vector.normalize(direction);
        attackForce.multiply(chargingPower);

        this.lastAttackTime = Date.now();
        this.moveComponent.propel(attackForce);
    }
}

export { CharacterAttack };