import { Character } from './Character.js';
import { ECharacterState } from './Character.js';

class Player extends Character {
    constructor(world, nickname) {
        super(world);
    
        this.nickname = nickname;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        switch(this.characterState) {
            case ECharacterState.Locomotion:
                break;
            case ECharacterState.Hold:
                break;
            case ECharacterState.Propelled:
                break;
            case ECharacterState.Dead:
                break;
        }
    }
}

export { Player };

