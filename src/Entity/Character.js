import { Unit } from './Unit.js';

class Character extends Unit {
    constructor(world) {
        super(world);

        this.xpAmount = 0; // non-serialzed property
        // stat data...
    }

    // character actions

    gainXP(xpAmount) {
        this.xpAmount += xpAmount;
    }
}

export { Character };