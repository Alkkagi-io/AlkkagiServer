import { Entity } from './Entity.js';
import { Unit } from './Unit.js';
import { Character } from './Character/Character.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';

const XP_OBJECT_SCALE = 0.3;

class XPObject extends Entity {
    constructor(world, xpAmount) {
        super(world);

        this.collider = new SphereCollider(this);
        this.scale = XP_OBJECT_SCALE;

        this.xpAmount = xpAmount; // non-serialzed property
    }

    getWeight() {
        return 0;
    }

    getEntityType() {
        return EEntityType.XPObject;
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
