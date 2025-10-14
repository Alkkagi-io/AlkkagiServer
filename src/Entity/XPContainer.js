import { Entity, Character, XPObject } from './index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { HealthComponent } from '../Component/index.js';

class XPContainer extends Entity {
    constructor(world, xpAmount, hp, onDestroyCallback) {
        super(world);

        this.xpAmount = xpAmount;
        this.onDestroyCallback = onDestroyCallback;

        this.healthComponent = new HealthComponent(() => hp, this.onHPChanged);
    }

    onHPChanged(prevHP, currentHP) {
        if(currentHP > 0) {
            return;
        }

        this.spawnXPObject(this.xpAmount);
        this.onDestroyCallback?.();
        this.world.removeEntity(this);
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