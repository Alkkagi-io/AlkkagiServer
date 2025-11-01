import { Vector } from "../../../AlkkagiShared/Modules/Vector.js";
import { Collider } from "./Collider.js";

class SphereCollider extends Collider {
    constructor(owner) {
        super(owner);
        this.radius = 1;
    }

    getRadius() {
        return this.radius * this.entity.scale;
    }

    getAABB() {
        const pos = this.entity.position;
        const hSize = new Vector(this.getRadius(), this.getRadius());
        return {
            minX: pos.x - hSize.x,
            maxX: pos.x + hSize.x,
            minY: pos.y - hSize.y,
            maxY: pos.y + hSize.y
        };
    }

    getClosestPoint(p) {
        const center = this.entity.position;

        const dir = Vector.subtract(p, center);
        const dist = dir.getMagnitude();

        if (dist <= this.getRadius() || dist === 0) 
            return new Vector(p.x, p.y);

        const normalized = Vector.divide(dir, dist);
        return Vector.add(center, Vector.multiply(normalized, this.getRadius()));
    }
}

export { SphereCollider };