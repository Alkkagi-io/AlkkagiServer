import { Vector } from "../../../AlkkagiShared/Modules/Vector.js";
import { Collider } from "./Collider.js";

class SphereCollider extends Collider {
    constructor(owner) {
        super(owner);
        this.radius = 0;
    }

    getAABB() {
        const pos = this.owner.position;
        const hSize = new Vector(this.radius, this.radius);
        return {
            minX: pos.x - hSize.x,
            maxX: pos.x + hSize.x,
            minY: pos.y - hSize.y,
            maxY: pos.y + hSize.y
        };
    }
}

export { SphereCollider };