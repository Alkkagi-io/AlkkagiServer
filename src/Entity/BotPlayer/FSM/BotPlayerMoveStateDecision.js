import { FSMDecision } from '../../../Component/FSM/index.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';

class BotPlayerMoveStateDecision extends FSMDecision {
    constructor(moveState) {
        super();
        this.moveState = moveState;
    }

    onDecide() {
        const aiData = this.brain.aiData;
        const owner = aiData.owner;

        return owner.moveComponent.moveState == this.moveState;
    }
}

export { BotPlayerMoveStateDecision };