import { ResourceStat, EStatType } from "../../AlkkagiShared/Resource/ResourceStat.js";

const 기본_무게 = 100;
const 기본_최대_쳬력 = 100;
const 기본_공격_쿨타임 = 1;
const 기본_최대_차징_거리 = 2;
const 기본_이동_속도 = 100;

class StatManager {
    constructor() {
        this.levels = [];
        const resources = ResourceStat.getAll();
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

    getValue(type) {
        const res = this._getStatResource(type);
        if(res == null)
            return;

        const levelUpValue = res.getLevelValue(levels[type]);

        switch (type) {
            case EStatType.ADD_WEIGHT_PER:
                return 기본_무게 + (기본_무게 * (levelUpValue / 100));
            case EStatType.ADD_MAX_HP_PER:
                return 기본_최대_쳬력 + (기본_최대_쳬력 * (levelUpValue / 100));
            case EStatType.AUTO_HEAL_PER_MIN:
                return levelUpValue;
            case EStatType.ATK_COOLDOWN_PER:
                return 기본_공격_쿨타임 + (기본_공격_쿨타임 * (levelUpValue / 100));
            case EStatType.ADD_MAX_CHARGE_LEN_PER:
                return 기본_최대_차징_거리 + (기본_최대_차징_거리 * (levelUpValue / 100));
            case EStatType.ADD_MOVE_SPEED_PER:
                return 기본_이동_속도 + (기본_이동_속도 * (levelUpValue / 100));
        }

        return 0;
    }

    _getStatResource(type) {
        const res = ResourceStat.get(type);
        if(res == null){
            logger.Error('StatManager', `resource is null [type: ${type}]`);
            return null;
        }

        return res;
    }
}

export { StatManager }