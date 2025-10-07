import { Collision } from "../Collision";

class Collider {
    constructor(owner) {
        this.entity = owner;
    }

    intersect(other) {
        return Collision.intersect(this, other);
    }
}

export { Collider }