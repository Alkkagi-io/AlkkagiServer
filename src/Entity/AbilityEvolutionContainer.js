import { Entity } from './Entity.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';
import { ResourceAbilityInfo } from '../../AlkkagiShared/Resource/ResourceAbilityInfo.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';
import { AbilityFactory } from '../Ability/AbilityFactory.js';

class AbilityEvolutionContainer extends Entity {
    constructor(world) {
        super(world);
        this.collider = new SphereCollider(this);
    }

    getWeight() {
        return 10000;
    }

    getEntityType() {
        return EEntityType.AbilityEvolutionContainer;
    }

    getEvolvedAbility(playerEntity) {
        if(playerEntity == null) {
            return null;
        }

        const abilityComponent = playerEntity.abilityComponent;
        if(abilityComponent == null || abilityComponent.ability == null) {
            return null;
        }

        const trailingAbilityInfos = ResourceAbilityInfo.getTrailingAbilityInfos(abilityComponent.ability.abilityID);
        if(trailingAbilityInfos == null || trailingAbilityInfos.length == 0) {
            return null;
        }

        const randomIndex = Random.rangeInt(0, trailingAbilityInfos.length);
        const randomAbilityInfo = trailingAbilityInfos[randomIndex];
        if(randomAbilityInfo == null) {
            return null;
        }

        const ability = AbilityFactory.createAbility(randomAbilityInfo.abilityType);
        return ability;
    }
}

export { AbilityEvolutionContainer };
