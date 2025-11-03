import { FSMDecision } from '../../../Component/FSM/index.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';

class BotPlayerTargetConditionDecision extends FSMDecision {
    constructor(targetDistanceOptionProvider, targetKeepingDistanceProvider) {
        super();
        this.targetDistanceOptionProvider = targetDistanceOptionProvider;
        this.targetKeepingDistanceProvider = targetKeepingDistanceProvider;
    }

    onDecide() {
        const aiData = this.brain.aiData;
        const currentTargetEntity = aiData.world.getEntity(aiData.currentTargetEntityID);
        if(currentTargetEntity == null)
            return false;

        const sqrDistance = Vector.subtract(currentTargetEntity.position, aiData.owner.position).getSqrMagnitude();

        if(this.targetDistanceOptionProvider != null) {
            const targetDistanceOption = this.targetDistanceOptionProvider(currentTargetEntity);
            if(sqrDistance > targetDistanceOption * targetDistanceOption)
                return false;
        }

        if(this.targetKeepingDistanceProvider != null) {
            const targetKeepingDistance = this.targetKeepingDistanceProvider(currentTargetEntity);
            if(targetKeepingDistance > 0 && sqrDistance < targetKeepingDistance * targetKeepingDistance) {
                return false;
            }
        }

        return true;
    }
}

export { BotPlayerTargetConditionDecision };