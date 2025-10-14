import { StatConfig } from "./StatConfig.js";

class StatManager {
    constructor(character) {
        this.character = character;
    }

    getValue(type) {
        let value = 0;

        const defaultValue = StatConfig.DefaultValue[type];
        if (defaultValue < 0)
            return 0;

        value = defaultValue;

        // 레벨업 수치 합산
        const levelValue = this.character.levelUpManager.getLevelValue(type);
        if (levelValue != null) {
            if (levelValue.isPercentage) {
                value += value * (levelValue.value / 100);
            } else {
                value += levelValue.value;
            }
        }

        // 버프 params 수치 합산
        const constantValueBuffs = this.character.buffManager.getBuffs(buff => { return buff.params[`AddStatValue${type}`] !== undefined });
        value += constantValueBuffs.reduce((sum, buff) => {
            const value = buff.params[`AddStatValue${type}`];
            return sum + (typeof value === 'number' ? value : 0);
        }, 0);

        const percentageValueBuffs = this.character.buffManager.getBuffs(buff => { return buff.params[`AddStatValue${type}Per`] !== undefined });
        value += value * (percentageValueBuffs.reduce((sum, buff) => {
            const value = buff.params[`AddStatValue${type}Per`];
            return sum + (typeof value === 'number' ? value : 0);
        }, 0) / 100);

        return value;
    }
}

export { StatManager }