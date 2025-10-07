const registry = new Map();

function getKey(a, b) {
    return `${a.constructor.name}|${b.constructor.name}`;
}

function register(a, b, fn) {
    registry.set(getKey(a, b), fn);
    if (a !== b)
        registry.set(getKey(b, a), (b, a) => fn(a, b));
}

function intersect(a, b) {
    const fn = registry.get(getKey(a, b));
    if (!fn) {
        logger.error('Collision', `Not exist rule for [${a.constructor.name}] : [${b.constructor.name}]`);
        return false;
    }

    return fn(a, b);
}

export const Collision = { register, intersect };