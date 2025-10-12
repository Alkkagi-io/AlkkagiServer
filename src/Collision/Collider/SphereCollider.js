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

    getClosestPoint(p) {
        const center = this.owner.position;

        const dir = Vector.subtract(p, center);
        const dist = dir.magnitude();

        if (dist <= this.radius || dist === 0) 
            return new Vector(p.x, p.y);

        const normalized = Vector.divide(dir, dist);
        return Vector.add(center, Vector.multiply(normalized, this.radius));
    }
}

export { SphereCollider };