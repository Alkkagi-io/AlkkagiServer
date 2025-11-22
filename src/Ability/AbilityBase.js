class AbilityBase {
    constructor(owner, world, abilityID) {
        this.owner = owner;
        this.world = world;
        this.abilityID = abilityID;
    }
    
    getAbilityType() {
        throw new Error('AbilityBase is an abstract class');
    }

    onActive() {
        throw new Error('AbilityBase is an abstract class');
    }

    onDeactive() {
        throw new Error('AbilityBase is an abstract class');
    }

    onUpdate(deltaTime) {
        throw new Error('AbilityBase is an abstract class');
    }

    onLateUpdate(deltaTime) {
        throw new Error('AbilityBase is an abstract class');
    }
}