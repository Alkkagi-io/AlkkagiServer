import { Character } from './index.js';

class Player extends Character {
    constructor(world, nickname) {
        super(world);
    
        this.nickname = nickname;
    }
}

export { Player };

