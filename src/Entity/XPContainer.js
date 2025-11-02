import { Entity } from './Entity.js';
import { Character } from './Character/Character.js';
import { XPObject } from './XPObject.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { HealthComponent } from '../Component/index.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

const SPAWN_RADIUS = 10;

class XPContainer extends Entity {
    constructor(world, xpAmount, hp, onDestroyCallback) {
        super(world);

        this.collider = new SphereCollider(this);

        this.xpAmount = xpAmount;
        this.onDestroyCallback = onDestroyCallback;

        this.healthComponent = new HealthComponent(() => hp, this.onHPChanged.bind(this));
    }

    getWeight() {
        return this.scale;
    }

    getEntityType() {
        return EEntityType.XPContainer;
    }

    onHPChanged(performer, prevHP, currentHP) {
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
            const randomPosition = Random.insideUnitCircle().multiply(SPAWN_RADIUS);
            const position = Vector.add(this.position, randomPosition);

            const xpObject = new XPObject(this.world, xp);
            xpObject.position = position;
            
            this.world.addEntity(xpObject);
            leftXPAmount -= xp;
        }
    }
}

export { XPContainer };
