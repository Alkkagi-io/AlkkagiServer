import { Character } from './Character.js';

class Player extends Character {
    constructor(world, nickname) {
        super(world);
    
        this.nickname = nickname;
    }
}

export { Player };

