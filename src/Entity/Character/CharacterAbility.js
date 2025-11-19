class CharacterAbility {
    constructor() {
        this.ability = null;
    }

    setAbility(ability) {
        if(this.ability != null) {
            this.ability.onDeactive();
        }

        this.ability = ability;
        this.ability.onActive();
    }

    onUpdate(deltaTime) {
        if(this.ability == null) {
            return;
        }

        this.ability.onUpdate(deltaTime);
    }

    onLateUpdate(deltaTime) {
        if(this.ability == null) {
            return;
        }

        this.ability.onLateUpdate(deltaTime);
    }
}

export { CharacterAbility };