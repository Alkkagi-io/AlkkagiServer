const registry = new Map();

function getKeyString(object) {
    return object instanceof Function ? object.name : object.constructor.name;
}

function getKey(a, b) {
    const aName = getKeyString(a);
    const bName = getKeyString(b);
    return `${aName}|${bName}`;
}

function register(a, b, fn) {
    registry.set(getKey(a, b), fn);
    globalThis.logger.debug('Collision', `Register rule for [${getKeyString(a)}] : [${getKeyString(b)}]`);
    if (a !== b)
        registry.set(getKey(b, a), (b, a) => fn(a, b));
}

function intersect(a, b) {
    const fn = registry.get(getKey(a, b));
    if (!fn) {
        globalThis.logger.error('Collision', `Not exist rule for [${getKeyString(a)}] : [${getKeyString(b)}]`);
        return false;
    }

    return fn(a, b);
}

export const Collision = { register, intersect };