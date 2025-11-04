import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';
import { EEntityType } from '../../../../AlkkagiShared/Datas/index.js';

class BotPlayerAIData {
    constructor(owner, world, options) {
        this.owner = owner;
        this.world = world;
        this.options = options || { 
            sight: 30,
            characterDetectRadius: 17.5
        };
        this.currentTargetEntityID = -1;
    }
}

export { BotPlayerAIData };