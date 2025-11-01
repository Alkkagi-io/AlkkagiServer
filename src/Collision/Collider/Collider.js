import { Vector } from "../../../AlkkagiShared/Modules/Vector.js";
import { Collision } from "../Collision.js";

class Collider {
    constructor(owner) {
        this.entity = owner;
    }

    intersect(other) {
        return Collision.intersect(this, other);
    }

    getAABB() {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
    }

    getClosestPoint(p) {
        return Vector();
    }
}

export { Collider };