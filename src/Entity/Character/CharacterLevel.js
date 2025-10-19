import { ResourceCharacterLevel } from "../../../AlkkagiShared/Resource/ResourceCharacterLevel.js";

class CharacterLevel {
    constructor(character, onLevelUp, onStatLevelUp) {
        this.statLevelUpManager = character.statLevelUpManager;
        this.onLevelUp = onLevelUp;
        this.onStatLevelUp = onStatLevelUp;
        this.xpAmount = 0;
        this.level = 0;
        this.statPoint = 0;
    }

    levelUpStat(type) {
        if (this.statPoint <= 0)
            return;

        var success = this.statLevelUpManager.levelUp(type);
        if (success == false)
            return;

        this.statPoint--;
        this.onStatLevelUp?.(type);
    }

    getStatLevel(type) {
        return this.statLevelUpManager.getStatLevel(type);
    }
    
    gainXP(xpAmount) {
        this.xpAmount += xpAmount;

        globalThis.logger.debug('CharacterLevel', `gainXP [gainedXP: ${xpAmount}, currentXPAmount: ${this.xpAmount}, currentLevel: ${this.level}, statPoint: ${this.statPoint}]`);

        const prevLevel = this.level;
        let currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        while(currentLevelTableRow != null && this.xpAmount >= currentLevelTableRow.RequiredXP) {
            this.level++;
            this.statPoint++;
            globalThis.logger.debug('CharacterLevel', `levelUp [prevLevel: ${prevLevel}, currentLevel: ${this.level}, statPoint: ${this.statPoint}]`);

            currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        }

        this.onLevelUp?.(prevLevel, this.level, this.statPoint);
    }
}

export { CharacterLevel };