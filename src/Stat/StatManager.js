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

    getStatValue(type) {
        const levelValue = this.getLevelValue(type);

        switch (type) {
            case EStatType.WEIGHT:
                return 기본_무게 + (기본_무게 * (levelValue / 100));
            case EStatType.MAX_HP:
                return 기본_최대_쳬력 + (기본_최대_쳬력 * (levelValue / 100));
            case EStatType.ATK_COOLTIME:
                return 기본_공격_쿨타임 - (기본_공격_쿨타임 * (levelValue / 100));
            case EStatType.MAX_CHARGE_LEN:
                return 기본_최대_차징_거리 + (기본_최대_차징_거리 * (levelValue / 100));
            case EStatType.MOVE_SPEED:
                return 기본_이동_속도 + (기본_이동_속도 * (levelValue / 100));
            case EStatType.AUTO_HEAL_PER_MIN:
                return levelValue / 100;
        }

        return 0;
    }

    getLevelValue(type) {
        const res = this._getStatResource(type);
        if(res == null)
            return 0;

        return res.getLevelValue(levels[type]);
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