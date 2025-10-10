import { EStatType, StatManager } from '../Stat/StatManager.js';
import { Unit } from './Unit.js';

class Character extends Unit {
    constructor(world) {
        super(world);

        this.xpAmount = 0; // non-serialzed property
        this.statManager = new StatManager();
        
        // stat data...
        this.hp = this.statManager.getValue(EStatType.MAX_HP);
    }

    // character actions
    
    levelUpStat(type) {
        var success = this.statManager.levelUp(type);
        if (!success)
            return;

        // do somthing
    }

    gainXP(xpAmount) {
        this.xpAmount += xpAmount;
    }
}

export { Character };