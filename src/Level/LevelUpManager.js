import { ResourceLevelUp, ELevelUpType } from "../../AlkkagiShared/Resource/ResourceLevelUp.js";

class LevelUpManager {
    constructor() {
        this.levels = [];
        const resources = ResourceLevelUp.getAll();
        for (const res in resources) {
            this.levels.push(0);
        }
    }

    levelUp(type) {
        const res = this._getStatResource(type);
        if(res == null)
            return false;

        if (levels[type] >= res.maxLevel)
            return false;

        levels[type]++;
        return true;
    }

    getLevelValue(type) {
        const res = this._getStatResource(type);
        if(res == null)
            return null;

        return { value: res.getLevelValue(levels[type]), isPercentage: res.isPercentage() };
    }

    _getStatResource(type) {
        const res = ResourceLevelUp.getByStatType(type);
        if(res == null){
            logger.Error('StatManager', `resource is null [type: ${type}]`);
            return null;
        }

        return res;
    }
}

export { LevelUpManager }