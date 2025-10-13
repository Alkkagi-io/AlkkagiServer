import { Entity, Unit, XPObject } from './index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class XPContainer extends Entity {
    constructor(world, xpAmount) {
        super(world);

        this.xpAmount = xpAmount;
        this.currentHP = 10;
    }

    onCollision(otherEntity) {
        super.onCollision(otherEntity);

        if(otherEntity instanceof Unit) {
            this.currentHP--;
            if(this.currentHP <= 0) {
                this.spawnXPObject(this.xpAmount);
                this.world.removeEntity(this);
            }
        }
    }

    spawnXPObject(xpAmount) {
        for(let i = 0; i < xpAmount; i++) {
            const xpObject = new XPObject(this.world, 1);
            xpObject.position = new Vector(this.position.x, this.position.y);
            this.world.addEntity(xpObject);
        }
    }
}

export { XPContainer };