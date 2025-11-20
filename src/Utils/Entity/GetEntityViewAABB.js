function getEntityViewAABB(position, isAdmin) {
    let hw = globalThis.gameConfig.viewSize.width / 2 + globalThis.gameConfig.viewOffset.x;
    let hh = globalThis.gameConfig.viewSize.height / 2 + globalThis.gameConfig.viewOffset.y;

    if (isAdmin) {
        hw *= 3;
        hh *= 3;
    }

    return {
        minX: position.x - hw,
        minY: position.y - hh,
        maxX: position.x + hw,
        maxY: position.y + hh
    };
}

export { getEntityViewAABB };