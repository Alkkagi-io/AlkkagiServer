import { ResourceStatLevelUp, EStatLevelUpType } from "../../AlkkagiShared/Resource/ResourceStatLevelUp.js";

class StatLevelUpManager {
    constructor(character) {
        this.character = character; 
        this.levels = {};
        const resources = ResourceStatLevelUp.getAll();
        for (const res of resources.values()) {
            this.levels[res.id] = 0;
        }
    }

    levelUp(levelUpType) {
        const res = ResourceStatLevelUp.get(levelUpType);
        if(res == null)
            return false;

        if (this.levels[levelUpType] >= res.maxLevel)
            return false;

        this.levels[levelUpType]++;
        return true;
    }

    getStatLevelByStatType(statType) {
        const res = ResourceStatLevelUp.getByStatType(statType);
        if(res == null)
            return 0;

        return this.levels[res.id];
    }

    getStatLevelByStatLevelUpType(statLevelUpType) {
        return this.levels[statLevelUpType];
    }

    getLevelValue(statType) {
        const res = ResourceStatLevelUp.getByStatType(statType);
        if(res == null)
            return null;

        const value = res.getLevelValue(this.levels[res.id]);
        if(value == null)
            return null;

        return { value: value, isPercentage: res.isPercentage() };
    }
}

export { StatLevelUpManager }