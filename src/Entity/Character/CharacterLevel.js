class CharacterLevel {
    constructor(character, onLevelUp) {
        this.character = character;
        this.onLevelUp = onLevelUp;
        this.xpAmount = 0;
    }

    levelUpStat(type) {
        var success = this.character.statManager.levelUp(type);
        if (success == false)
            return;

        this.onLevelUp(type);
    }
    
    gainXP(xpAmount) {
        this.xpAmount += xpAmount;
    }
}

export { CharacterLevel };