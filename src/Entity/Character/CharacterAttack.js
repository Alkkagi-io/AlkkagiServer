import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';
import { EStatType } from '../../../AlkkagiShared/Resource/ResourceStat.js';
import { ECharacterState } from './ECharacterState.js';

class CharacterAttack {
    constructor(character) {
        this.character = character;
        this.moveComponent = character.moveComponent;
        this.chargingStartTime = Date.now();
    }

    startAttackCharging() {
        if(this.character.characterState != ECharacterState.Locomotion)
            return;

        this.chargingStartTime = Date.now();
        this.moveComponent.hold();
    }

    finishAttackCharging(direction) {
        if(this.character.characterState != ECharacterState.Hold)
            return;

        const chargingTime = (Date.now() - this.chargingStartTime) * 0.001;
        const chargingPower = Math.min(chargingTime, this.character.statManager.getStatValue(EStatType.MAX_CHARGE_LEN));

        let attackForce = Vector.normalize(direction);
        attackForce.multiply(chargingPower);

        this.moveComponent.propel(attackForce);
    }
}

export { CharacterAttack };