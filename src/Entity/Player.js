import { Character } from './Character/Character.js';
import { S2C_CharacterLevelUpPacket } from '../../AlkkagiShared/Packets/index.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';

class Player extends Character {
    constructor(world, clientHandle, nickname, onDestroyedCallback) {
        super(world, nickname);
        this.clientHandle = clientHandle;
        this.onDestroyedCallback = onDestroyedCallback;
    }

    getEntityType() {
        return EEntityType.Player;
    }

    onLevelUp(prevLevel, currentLevel, currentStatPoint) {
        super.onLevelUp(prevLevel, currentLevel, currentStatPoint);

        const levelUpPacket = new S2C_CharacterLevelUpPacket(currentLevel, currentStatPoint);
        this.clientHandle.send(levelUpPacket);
    }

    onDestroy() {
        super.onDestroy();
        this.onDestroyedCallback?.();
    }
}

export { Player };
