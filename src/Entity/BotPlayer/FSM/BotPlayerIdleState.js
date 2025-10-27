import { FSMState } from '../../../Component/FSM/index.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';

// patrolling
class BotPlayerIdleState extends FSMState {
    constructor() {
        super();
    }

    onUpdateState(deltaTime) {
        super.onUpdateState(deltaTime);
        const aiData = this.brain.aiData;
        const options = aiData.options;
        const world = aiData.world;

        if(aiData.currentTargetEntityID != -1) {
            const currentTargetEntity = world.getEntity(aiData.currentTargetEntityID);
            if(currentTargetEntity != null) {
                return;
            }
        }

        const AABB = {
            minX: aiData.owner.position.x - options.sight * 0.5,
            minY: aiData.owner.position.y - options.sight * 0.5,
            maxX: aiData.owner.position.x + options.sight * 0.5,
            maxY: aiData.owner.position.y + options.sight * 0.5
        };
        
        const targetEntities = [];
        world.entityTree.query(AABB, leafNode => {
            const entity = leafNode.data;
            if(entity == null)
                return;
            
            if(entity == aiData.owner)
                return;
            
            targetEntities.push(entity);
        });
        
        targetEntities.sort((a, b) => {
            const aSqrDistance = Vector.subtract(a.position, aiData.owner.position).getSqrMagnitude();
            const bSqrDistance = Vector.subtract(b.position, aiData.owner.position).getSqrMagnitude();
            return aSqrDistance - bSqrDistance;
        });
        
        if(targetEntities.length > 0) {
            aiData.currentTargetEntityID = targetEntities[0].getID();
        }
    }
}

export { BotPlayerIdleState };