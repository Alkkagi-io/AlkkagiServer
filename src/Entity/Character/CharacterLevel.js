import { ResourceCharacterLevel } from "../../../AlkkagiShared/Resource/ResourceCharacterLevel.js";

class CharacterLevel {
    constructor(character, onGainXP, onLevelUp, onStatLevelUp) {
        this.statLevelUpManager = character.statLevelUpManager;
        this.onGainXP = onGainXP;
        this.onLevelUp = onLevelUp;
        this.onStatLevelUp = onStatLevelUp;
        this.xpAmount = 0;
        this.level = 1;
        this.statPoint = 0;
    }

    levelUpStat(type) {
        if (this.statPoint <= 0) {
            return;
        }

        var success = this.statLevelUpManager.levelUp(type);
        if (success == false) {
            return;
        }

        this.statPoint--;
        this.onStatLevelUp?.(type);
    }

    getStatLevelByStatType(type) {
        return this.statLevelUpManager.getStatLevelByStatType(type);
    }

    getStatLevelByStatLevelUpType(statLevelUpType) {
        return this.statLevelUpManager.getStatLevelByStatLevelUpType(statLevelUpType);
    }

    gainXP(xpAmount) {
        const prevXP = this.xpAmount;
        this.xpAmount += xpAmount;

        // handle uint16 overflow
        if(this.xpAmount > 65535) {
            this.xpAmount = 65535;
        }

        this.onGainXP?.(prevXP, this.xpAmount);

        const prevLevel = this.level;
        let currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        while(currentLevelTableRow != null && this.xpAmount >= currentLevelTableRow.requiredXP) {
            this.level++;
            this.statPoint++;

            currentLevelTableRow = ResourceCharacterLevel.get(this.level);
        }

        if (prevLevel < this.level)
            this.onLevelUp?.(prevLevel, this.level, this.statPoint);
    }
}

export { CharacterLevel };