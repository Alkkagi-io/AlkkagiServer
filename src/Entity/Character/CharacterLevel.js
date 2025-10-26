import { ResourceCharacterLevel } from "../../../AlkkagiShared/Resource/ResourceCharacterLevel.js";

class CharacterLevel {
    constructor(character, onGainXP, onLevelUp, onStatLevelUp) {
        this.statLevelUpManager = character.statLevelUpManager;
        this.onGainXP = onGainXP;
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
        const prevXP = this.xpAmount;
        this.xpAmount += xpAmount;
        this.onGainXP?.(prevXP, this.xpAmount);

        const prevLevel = this.level;
        let currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        while(currentLevelTableRow != null && this.xpAmount >= currentLevelTableRow.RequiredXP) {
            this.level++;
            this.statPoint++;

            currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        }

        this.onLevelUp?.(prevLevel, this.level, this.statPoint);
    }
}

export { CharacterLevel };