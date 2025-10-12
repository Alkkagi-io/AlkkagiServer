import { EStatType, StatManager } from '../Stat/StatManager.js';
import { Unit } from './Unit.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

const ECharacterState = {
    Locomotion: 0,
    Hold: 1,
    Propelled: 2,
    Dead: 3
};

class Character extends Unit {
    constructor(world) {
        super(world);

        this.moveDirection = new Vector();
        this.characterState = ECharacterState.Locomotion;
        this.chargingStartTime = Date.now();

        this.xpAmount = 0;
        this.gold = 0;
        this.statManager = new StatManager();
        
        // stat data...
        this.hp = this.statManager.getValue(EStatType.MAX_HP);
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        switch(this.characterState) {
            case ECharacterState.Locomotion:
                this.rigidbody.velocity = this.moveDirection;
                break;
            case ECharacterState.Hold:
                break;
            case ECharacterState.Propelled:
                break;
            case ECharacterState.Dead:
                break;
        }
    }

    onCollide(other, contactPoint, normal, velocityReflected) {
        super.onCollide(other, contactPoint, normal, velocityReflected);
        this.propel(velocityReflected);
    }

    // -- apply input --

    startAttackCharging() {
        this.chargingStartTime = Date.now();
        this.hold();
    }

    finishAttackCharging(direction) {
        const chargingTime = (Date.now() - this.chargingStartTime) * 0.001;
        const chargingPower = Math.min(chargingTime, this.statManager.getStatValue(EStatType.MAX_CHARGE_LEN));

        let attackForce = Vector.normalize(direction);
        attackForce.multiply(chargingPower);

        this.propel(attackForce);
    }

    // -- control character --

    // set velocity for locomotion
    setMoveDirection(moveDirection) {
        this.moveDirection = Vector.normalize(moveDirection);
    }

    // set velocity for propelled => boom!
    propel(force) {
        this.characterState = ECharacterState.Propelled;
        this.rigidbody.velocity = force;
    }

    // hold character
    hold() {
        this.characterState = ECharacterState.Hold;
        this.rigidbody.velocity = Vector.Zero;
    }
    
    levelUpStat(type) {
        var success = this.statManager.levelUp(type);
        if (!success)
            return;

        // do somthing
    }

    heal(v) {
        this.hp += v;
        const maxHp = this.statManager.getValue(EStatType.MAX_HP);
        if (this.hp > maxHp)
            this.hp = maxHp
    }

    gainXP(xpAmount) {
        this.xpAmount += xpAmount;
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

export { Character, ECharacterState };