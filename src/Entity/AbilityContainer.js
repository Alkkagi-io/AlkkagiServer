import { Entity } from './Entity.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';

class AbilityContainer extends Entity {
    constructor(world) {
        super(world);
        this.collider = new SphereCollider(this);
    }

    getWeight() {
        return 10000;
    }

    getEntityType() {
        return EEntityType.AbilityContainer;
    }
}

export { AbilityContainer };
