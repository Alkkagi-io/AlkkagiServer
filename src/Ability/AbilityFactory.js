import { EAbilityType } from '../../AlkkagiShared/Datas/EAbilityType.js';

class AbilityFactory {
    static abilityFactories = { };

    constructor() {
        throw new Error('AbilityFactory is a static class and cannot be instantiated');
    }

    static on(abilityType, AbilityFactory) {
        if(abilityType == EAbilityType.None) {
            throw new Error('Ability type is not set');
        }

        if(AbilityFactory == null) {
            throw new Error('Ability class is not set');
        }

        this.abilityFactories[abilityType] = AbilityFactory;
    }

    static createAbility(abilityType) {
        if(abilityType == EAbilityType.None) {
            throw new Error('Ability type is not set');
        }

        const factory = AbilityFactory.abilityFactories[abilityType];
        if(factory == null) {
            throw new Error(`Ability factory for abilityType ${abilityType} not found`);
        }

        return new factory();
    }
}

// AbilityFactory.on(EAbilityType.Something, SomethingAbility);

export { AbilityFactory };