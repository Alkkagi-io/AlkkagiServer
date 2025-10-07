const { Vector } = require("../../AlkkagiShared/Modules/Vector");
const { BoxCollider } = require("./Collider/BoxCollider");
const { SphereCollider } = require("./Collider/SphereCollider");
const { Collision } = require("./Collision");

function registerCollisionRule() {
    // Box : Box
    Collision.register(BoxCollider, BoxCollider, (a, b) => {
        const A = a.getAABB();
        const B = b.getAABB();
        return (
            A.maxX >= B.minX && A.minX <= B.maxX &&
            A.maxY >= B.minY && A.minY <= B.maxY
        );
    });
    
    // Sphere : Sphere
    Collision.register(SphereCollider, SphereCollider, (a, b) => {
        const apos = a.owner.position;
        const bpos = b.owner.position;
        const dir = apos.getSubtracted(bpos);
        const r = a.radius + b.radius;
        return dir.x * dir.x + dir.y * dir.y  <= r * r;
    });
    
    // Sphere : Box
    Collision.register(SphereCollider, BoxCollider, (a, b) => {
        const apos = a.owner.position;
        const AABB = b.getAABB();
        const closestPoint = new Vector(
            Math.max(A.minX, Math.min(p.x, A.maxX)),
            Math.max(A.minY, Math.min(p.y, A.maxY))
        );
        const dir = apos.getSubtracted(closestPoint);
        return dir.x * dir.x + dir.y * dir.y <= a.radius * a.radius;
    });
}

export { registerCollisionRule }