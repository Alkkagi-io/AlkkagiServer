import { FSMTransition } from '../../../Component/FSM/index.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';

class BotPlayerTargetConditionTransition extends FSMTransition {
    constructor(targetState, targetDistanceOptionProvider) {
        super(targetState);
        this.targetDistanceOptionProvider = targetDistanceOptionProvider;
    }

    isTriggered() {
        const aiData = this.brain.aiData;
        const currentTargetEntity = aiData.world.getEntity(aiData.currentTargetEntityID);
        if(currentTargetEntity == null)
            return false;

        if(this.targetDistanceOptionProvider != null) {
            const sqrDistance = Vector.subtract(currentTargetEntity.position, aiData.owner.position).getSqrMagnitude();
            const targetDistanceOption = this.targetDistanceOptionProvider(currentTargetEntity);
            if(sqrDistance > targetDistanceOption * targetDistanceOption)
                return false;
        }

        return true;
    }
}

export { BotPlayerTargetConditionTransition };