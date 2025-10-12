import { Vector } from "../../../AlkkagiShared/Modules/Vector.js";
import { Collider } from "./Collider.js";

class BoxCollider extends Collider {
    constructor(owner) {
        super(owner);
        this.size = new Vector();
    }
    
    getAABB() {
        const pos = this.owner.position;
        const hSize = Vector.divide(this.size, 2);
        return {
            minX: pos.x - hSize.x,
            maxX: pos.x + hSize.x,
            minY: pos.y - hSize.y,
            maxY: pos.y + hSize.y
        };
    }

    getClosestPoint(p) {
        const aabb = this.getAABB();
        return new Vector(
            Math.max(aabb.minX, Math.min(p.x, aabb.maxX)),
            Math.max(aabb.minY, Math.min(p.y, aabb.maxY)),
        );
    }
}

export { BoxCollider };