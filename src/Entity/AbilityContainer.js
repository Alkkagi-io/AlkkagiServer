import { Entity } from './Entity.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';
import { ResourceAbilityInfo } from '../../AlkkagiShared/Resource/ResourceAbilityInfo.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';
import { AbilityFactory } from '../Ability/AbilityFactory.js';

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

    getRandomAbility(playerEntity) {
        const entryAbilityInfos = ResourceAbilityInfo.getEntryAbilityInfos();
        if(entryAbilityInfos == null || entryAbilityInfos.length == 0) {
            return null;
        }

        const randomIndex = Random.rangeInt(0, entryAbilityInfos.length);
        const randomAbilityInfo = entryAbilityInfos[randomIndex];
        if(randomAbilityInfo == null) {
            return null;
        }

        const ability = AbilityFactory.createAbility(randomAbilityInfo.abilityType);
        return ability;
    }
}

export { AbilityContainer };
