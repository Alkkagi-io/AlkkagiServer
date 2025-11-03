import { Entity } from './Entity.js';
import { Unit } from './Unit.js';
import { Character } from './Character/Character.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';

const XP_OBJECT_SCALE = 0.3;

class XPObject extends Entity {
    constructor(world, xpAmount, lifeTime) {
        super(world);

        this.collider = new SphereCollider(this);
        this.lifeTime = lifeTime;
        
        this.xpAmount = xpAmount; // non-serialzed property
        
        this.scale = XP_OBJECT_SCALE + 0.02 * xpAmount;
    }

    getWeight() {
        return 0;
    }

    getEntityType() {
        return EEntityType.XPObject;
    }

    onUpdate(deltaTime) {
        this.lifeTime -= deltaTime;
        if(this.lifeTime <= 0) {
            this.world.removeEntity(this);
        }
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
