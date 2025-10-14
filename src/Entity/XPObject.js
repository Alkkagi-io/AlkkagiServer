import { Character, Entity, Unit } from './index.js';

class XPObject extends Entity {
    constructor(world, xpAmount) {
        super(world);

        this.xpAmount = xpAmount; // non-serialzed property
    }

    onCollisionEnter(other) {
        super.onCollisionEnter(other);

        if(other instanceof Unit == false) {
            return;
        }

        if(other instanceof Character) {
            const levelComponent = other.levelComponent;
            levelComponent.gainXP(this.xpAmount);
        }

        this.world.removeEntity(this);
    }
}

export { XPObject };

