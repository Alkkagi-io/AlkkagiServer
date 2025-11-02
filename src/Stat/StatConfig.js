const Type = {
    WEIGHT: 0,
    MAX_HP: 1,
    ATK_COOLTIME: 2,
    POWER: 3,
    MOVE_SPEED: 4,
    AUTO_HEAL: 5,
};

const DefaultValue = {
    [Type.WEIGHT]: 100,
    [Type.MAX_HP]: 100,
    [Type.ATK_COOLTIME]: 1,
    [Type.POWER]: 50,
    [Type.MOVE_SPEED]: 2,
    [Type.AUTO_HEAL]: 0
};

export const StatConfig = { Type, DefaultValue };