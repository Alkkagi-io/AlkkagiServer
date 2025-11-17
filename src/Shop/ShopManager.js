import { ResourceShopItem } from "../../AlkkagiShared/Resource/ResourceShopItem";
import { Buff } from "../Buff/Buff";
import { Character } from "../Entity/Character/Character"

function buyItem(entity, buyItemId) {
    if (!(entity instanceof Character))
        return;

    const res = ResourceShopItem.get(buyItemId);
    if (!res)
        return;

    if (!canBuy(entity, res))
        return;

    const walletComponent = entity.walletComponent;
    walletComponent.useGold(res.price);
    applyAbility(entity, res.ability);
}

function applyAbility(character, res) {
    const healValue = res.getAbilityValueInt('Heal');
    if (healValue > 0) {
        character.healthComponent.heal(character, healValue);
    }

    const buffData = res.getAbilityValue('Buff');
    if (!buffData) {
        const {
            Type = 0,
            Time = 0,
            IsPerminent = false,
            Value = 0
        } = buffData;

        character.buffManager.addBuff(new Buff(Type, Time, IsPerminent, Value));
    }
}

function canBuy(character, resBuyItem) {
    if (character.gold < resBuyItem.price)
        return false;

    return true;
}

export const ShopManager = { buyItem }