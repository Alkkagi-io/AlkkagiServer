import { Character } from './index.js';
import { S2C_CharacterLevelUpPacket } from '../../AlkkagiShared/Packets/index.js';

class Player extends Character {
    constructor(world, clientHandle, nickname) {
        super(world);

        this.clientHandle = clientHandle;
        this.nickname = nickname;
    }

    onLevelUp(prevLevel, currentLevel, currentStatPoint) {
        super.onLevelUp(prevLevel, currentLevel, currentStatPoint);

        const levelUpPacket = new S2C_CharacterLevelUpPacket(currentLevel, currentStatPoint);
        this.clientHandle.send(levelUpPacket);
    }
}

export { Player };

