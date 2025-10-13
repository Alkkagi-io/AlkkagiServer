import { ECharacterState } from './ECharacterState.js';
import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';

const PROPEL_EPSILON = 0.01 * 0.01;
const PROPEL_LOCOMOTION_THRESHOLD = 0.05 * 0.05;

class CharacterMove {
    constructor(character) {
        this.character = character;
        this.rigidbody = character.rigidbody;
    }

    onUpdate(deltaTime) {
        switch(this.character.characterState) {
            case ECharacterState.Locomotion:
                this.rigidbody.velocity = this.character.moveDirection;
                break;
            case ECharacterState.Propelled:
                const sqrSpeed = this.rigidbody.velocity.getSqrMagnitude();
    
                const locomotionEnable = sqrSpeed < PROPEL_LOCOMOTION_THRESHOLD && this.character.moveDirection.x != 0 && this.character.moveDirection.y != 0;
                const propelReleaseEnable = sqrSpeed < PROPEL_EPSILON;
    
                if(locomotionEnable || propelReleaseEnable) {
                    this.character.setCurrentState(ECharacterState.Locomotion);
                }

                break;
        }
    }

    // set velocity for locomotion
    setMoveDirection(moveDirection) {
        this.moveDirection = Vector.normalize(moveDirection);
    }

    // set velocity for propelled => boom!
    propel(force) {
        this.character.setCurrentState(ECharacterState.Propelled);
        this.rigidbody.velocity = force;
    }

    // hold character
    hold() {
        this.character.setCurrentState(ECharacterState.Hold);
        this.rigidbody.velocity = Vector.Zero;
    }
}

export { CharacterMove };