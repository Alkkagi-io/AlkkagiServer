import { ResourceShopItem } from "../../AlkkagiShared/Resource/ResourceShopItem";
import { Character } from "../Entity/Character/Character"

function buyItem(entity, buyItemId) {
    if (!(entity instanceof Character))
        return;

    const res = ResourceShopItem.get(buyItemId);
    if (!res)
        return;

    if (!canBuy(entity, res))
        return;

    entity.useGold(res.price);
    applyAbility(entity, res.ability);
}

function applyAbility(character, res) {
    const healValue = res.getAbilityValueInt('Heal');
    if (healValue > 0) {
        character.heal(healValue);
    }

    const buff = res.getAbilityValue('Buff');
    if (!buff) {

    }
}

function canBuy(character, resBuyItem) {
    if (character.gold < resBuyItem.price)
        return false;

    return true;
}

export const ShopManager = { buyItem }