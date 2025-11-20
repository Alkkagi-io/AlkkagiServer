import { Entity } from './Entity.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';
import { SphereCollider } from '../Collision/Collider/SphereCollider.js';

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
        // TODO: 어빌리티 진화 처리
        return null;
    }
}

export { AbilityEvolutionContainer };
