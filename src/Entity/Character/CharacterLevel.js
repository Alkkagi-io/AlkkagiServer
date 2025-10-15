import { ResourceCharacterLevel } from "../../../AlkkagiShared/Resource/ResourceCharacterLevel.js";

class CharacterLevel {
    constructor(character, onLevelUp, onStatLevelUp) {
        this.character = character;
        this.onLevelUp = onLevelUp;
        this.onStatLevelUp = onStatLevelUp;
        this.xpAmount = 0;
        this.level = 0;
    }

    levelUpStat(type) {
        var success = this.character.statLevelUpManager.levelUp(type);
        if (success == false)
            return;

        this.onStatLevelUp?.(type);
    }
    
    gainXP(xpAmount) {
        this.xpAmount += xpAmount;

        globalThis.logger.debug('CharacterLevel', `gainXP [gainedXP: ${xpAmount}, currentXPAmount: ${this.xpAmount}, currentLevel: ${this.level}]`);

        const prevLevel = this.level;
        let currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        while(currentLevelTableRow != null && this.xpAmount >= currentLevelTableRow.RequiredXP) {
            this.level++;
            globalThis.logger.debug('CharacterLevel', `levelUp [prevLevel: ${prevLevel}, currentLevel: ${this.level}]`);

            this.xpAmount -= currentLevelTableRow.RequiredXP;
            currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        }

        this.onLevelUp?.(prevLevel, this.level);
    }
}

export { CharacterLevel };