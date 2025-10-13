class CharacterLevel {
    constructor(character) {
        this.character = character;
        this.xpAmount = 0;
    }

    levelUpStat(type) {
        var success = this.character.statManager.levelUp(type);
        if (!success)
            return;

        // do somthing
    }
    
    gainXP(xpAmount) {
        this.xpAmount += xpAmount;
    }
}

export { CharacterLevel };