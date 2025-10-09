import { Vector } from "../../../AlkkagiShared/Modules/Vector.js";
import { Collider } from "./Collider.js";

class BoxCollider extends Collider {
    constructor(owner) {
        super(owner);
        this.size = new Vector();
    }
    
    getAABB() {
        const pos = this.owner.position;
        const hSize = this.size.getDivided(2);
        return {
            minX: pos.x - hSize.x,
            maxX: pos.x + hSize.x,
            minY: pos.y - hSize.y,
            maxY: pos.y + hSize.y
        };
    }
}

export { BoxCollider };