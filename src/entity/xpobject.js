import { Entity } from './entity.js';

class XPObject extends Entity {
    constructor() {
        super();
        this.xpAmount = 0; // non-serialzed property
    }

    onCollision(otherEntity) {
        super.onCollision(otherEntity);

        if(otherEntity instanceof Character) {
            otherEntity.gainXP(this.xpAmount);
            this.xpAmount = 0;
        }
    }
}

export { XPObject };

