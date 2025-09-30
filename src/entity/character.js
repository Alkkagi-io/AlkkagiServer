import { Unit } from './unit.js';

class Character extends Unit {
    constructor() {
        super();

        this.xpAmount = 0; // non-serialzed property
        // stat data...
    }

    // character actions

    gainXP(xpAmount) {
        this.xpAmount += xpAmount;
    }
}

export { Character };