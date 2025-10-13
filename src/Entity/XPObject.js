import { Character, Entity, Unit } from './index.js';

class XPObject extends Entity {
    constructor(world, xpAmount) {
        super(world);

        this.xpAmount = xpAmount; // non-serialzed property
    }

    onCollision(otherEntity) {
        super.onCollision(otherEntity);

        if(otherEntity instanceof Character) {
            otherEntity.gainXP(this.xpAmount);
        }

        if(otherEntity instanceof Unit) {
            this.world.removeEntity(this);
        }
    }
}

export { XPObject };

