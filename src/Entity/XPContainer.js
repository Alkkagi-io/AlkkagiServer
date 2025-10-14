import { Entity, Character, XPObject } from './index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { HealthComponent } from '../Component/index.js';

const SPAWN_RADIUS = 10;

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
        const xpStep = 1;
        
        let leftXPAmount = xpAmount;
        while(leftXPAmount > 0) {
            const xp = Math.min(leftXPAmount, xpStep);
            const position = Vector.add(this.position, new Vector(Math.random() * SPAWN_RADIUS, Math.random() * SPAWN_RADIUS));

            const xpObject = new XPObject(this.world, xp);
            xpObject.position = position;
            
            this.world.addEntity(xpObject);
            leftXPAmount -= xp;
        }
    }
}

export { XPContainer };