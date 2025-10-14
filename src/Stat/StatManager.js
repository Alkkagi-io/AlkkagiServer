import { StatConfig } from "./StatConfig.js";

class StatManager {
    constructor(character) {
        this.character = character;
    }

    getValue(type) {
        let value = 0;

        const defaultValue = StatConfig.DefaultValue[type];
        if (defaultValue <= 0)
            return 0;

        value = defaultValue;

        const levelValue = this.character.levelUpManager.getLevelValue(type);
        if (levelValue != null) {
            if (levelValue.isPercentage) {
                value += value * (levelValue.value / 100);
            } else {
                value += levelValue.value;
            }
        }

        return value;
    }
}

export { StatManager }