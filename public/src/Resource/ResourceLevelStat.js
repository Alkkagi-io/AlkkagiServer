import { parseToInteger, parseToFloat } from "./DataParseHelper.js";
import { ResourceBase } from "./ResourceBase.js";

const ELevelStatType = {
    ADD_WEIGHT_PER: 1,
    ADD_MAX_CHARGE_LEN_PER: 2,
    ADD_MAX_HP_PER: 3,
    ADD_MOVE_SPEED_PER: 4,
    ATK_COOLDOWN_PER: 5,
    AUTO_HEAL_PER_MIN: 6
};

class ResourceLevelStat extends ResourceBase {
    constructor() {
        super();
        this.icon = "";
        this.levelUpEffect = "";
        this.maxLevel = 0;
        this.levelValues = [];
    }

    init(id, dict) {
        super.init(id, dict);

        this.icon = this.getDictValue("Icon", "");
        this.levelUpEffect = this.getDictValue("LevelUpEffect", "");
        this.maxLevel = this.getDictValueInt("MaxLevel", 0);
        this.levelValues = this.getDictValue("LevelValues");
    }

    getLevelValue(level) {
        if (level > this.maxLevel)
            throw new Error('Invalid level exception');

        return this.levelValues[level];
    }
}

export { ResourceLevelStat, ELevelStatType };