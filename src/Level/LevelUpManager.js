import { ResourceLevelUp, ELevelUpType } from "../../AlkkagiShared/Resource/ResourceLevelUp.js";

class LevelUpManager {
    constructor(character) {
        this.character = character; 
        this.levels = {};
        const resources = ResourceLevelUp.getAll();
        for (const res in resources) {
            this.levels[res.id] = 0;
        }
    }

    levelUp(levelUpType) {
        const res = ResourceLevelUp.get(levelUpType);
        if(res == null)
            return false;

        if (levels[levelUpType] >= res.maxLevel)
            return false;

        levels[levelUpType]++;
        return true;
    }

    getLevelValue(statType) {
        const res = ResourceLevelUp.getByStatType(statType);
        if(res == null)
            return null;

        return { value: res.getLevelValue(levels[res.id]), isPercentage: res.isPercentage() };
    }
}

export { LevelUpManager }