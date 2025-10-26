import { Entity } from './index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { HealthComponent } from '../Component/index.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';

class GoldContainer extends Entity {
    constructor(world, goldAmount, hp, onDestroyCallback) {
        super(world);

        this.collider = new SphereCollider(this);

        this.goldAmount = goldAmount;
        this.onDestroyCallback = onDestroyCallback;

        this.healthComponent = new HealthComponent(() => hp, this.onHPChanged.bind(this));
    }

    getEntityType() {
        return EEntityType.GoldContainer;
    }

    onHPChanged(performer, prevHP, currentHP) {
        if(currentHP > 0) {
            return;
        }

        const walletComponent = performer.walletComponent;
        if(walletComponent != null) {
            walletComponent.gainGold(this.goldAmount);
        }

        this.onDestroyCallback?.();
        this.world.removeEntity(this);
    }
}

export { GoldContainer };