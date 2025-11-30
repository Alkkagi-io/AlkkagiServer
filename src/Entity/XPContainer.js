import { Entity } from './Entity.js';
import { Character } from './Character/Character.js';
import { XPObject } from './XPObject.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { HealthComponent } from '../Component/index.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';

const SPAWN_RADIUS = 7;

class XPContainer extends Entity {
    constructor(world, xpAmount, hp, xpUnit, onDestroyCallback) {
        super(world);

        this.collider = new SphereCollider(this);

        this.xpAmount = xpAmount;
        this.xpUnit = xpUnit;
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
        if(this.enabled == false) {
            return;
        }

        if(currentHP > 0) {
            return;
        }

        this.spawnXPObject(this.xpAmount);
        this.destroy();
    }

    onDestroy() {
        super.onDestroy();
        this.onDestroyCallback?.();
    }

    spawnXPObject(xpAmount) {
        let leftXPAmount = xpAmount;
        while(leftXPAmount > 0) {
            const xp = Math.min(leftXPAmount, this.xpUnit);
            const randomPosition = Random.insideUnitCircle().multiply(SPAWN_RADIUS * this.scale);
            const position = Vector.add(this.position, randomPosition);

            const xpObject = new XPObject(this.world, xp, Random.range(globalThis.gameConfig.xpObjectLifeTimeMin, globalThis.gameConfig.xpObjectLifeTimeMax + 1));
            xpObject.position = position;
            
            this.world.addEntity(xpObject);
            leftXPAmount -= xp;
        }
    }
}

export { XPContainer };
