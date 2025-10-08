const { Collider } = require("./Collider");

class SphereCollider extends Collider {
    constructor(owner) {
        super(owner);
        this.radius = 0;
    }
}

export { SphereCollider }