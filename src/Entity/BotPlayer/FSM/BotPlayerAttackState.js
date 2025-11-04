import { EMoveState } from '../../../Component/index.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';
import { FSMState } from '../../../Component/FSM/index.js';
import { Random } from '../../../../AlkkagiShared/Modules/Random.js';

const CHARGING_TIME_MIN = 1.5;
const CHARGING_TIME_MAX = 2.75;

class BotPlayerAttackState extends FSMState {
    constructor() {
        super();
        this.timer = 0;
        this.targetChargingTime = 0;
        this.lastAttackDir = Vector.Zero();
    }

    onEnterState() {
        super.onEnterState();
        this.brain.aiData.owner.attackComponent.startAttackCharging();
        this.brain.aiData.owner.moveComponent.setLocomotionVelocity(Vector.Zero(), 0);
        this.timer = 0;
        this.targetChargingTime = Random.range(CHARGING_TIME_MIN, CHARGING_TIME_MAX);
    }

    onUpdateState(deltaTime) {
        super.onUpdateState(deltaTime);

        const currentTarget = this.brain.aiData.world.getEntity(this.brain.aiData.currentTargetEntityID);
        if(currentTarget == null) {
            this.brain.setAsDefaultState();
            return;
        }

        this.lastAttackDir = Vector.subtract(currentTarget.position, this.brain.aiData.owner.position);

        if(this.brain.aiData.owner.moveComponent.moveState != EMoveState.Hold) {
            this.brain.setAsDefaultState();
            return;
        }
        
        this.timer += deltaTime;
        if(this.timer >= this.targetChargingTime) {
            this.brain.setAsDefaultState();
            return;
        }
    }

    onExitState() {
        super.onExitState();
        if(this.lastAttackDir.x == 0 && this.lastAttackDir.y == 0)
            this.lastAttackDir = Vector.Up();

        this.brain.aiData.owner.attackComponent.finishAttackCharging(this.lastAttackDir);
    }
}

export { BotPlayerAttackState };