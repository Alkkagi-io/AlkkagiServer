import { StatConfig } from '../../../Stat/StatConfig.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';
import { FSMState } from '../../../Component/FSM/index.js';

class BotPlayerMoveState extends FSMState {
    constructor() {
        super();
    }

    onUpdateState(deltaTime) {
        super.onUpdateState(deltaTime);
        const aiData = this.brain.aiData;
        const owner = aiData.owner;
        const target = aiData.world.getEntity(aiData.currentTargetEntityID);
        if(target == null) {
            this.brain.setAsDefaultState();
            return;
        }

        const direction = Vector.subtract(target.position, owner.position);
        owner.moveComponent.setLocomotionVelocity(direction, owner.statManager.getValue(StatConfig.Type.MOVE_SPEED) * 5);
    }
}

export { BotPlayerMoveState };