import { Vector } from "../../AlkkagiShared/Modules/Vector.js";
import { BoxCollider } from "./Collider/BoxCollider.js";
import { SphereCollider } from "./Collider/SphereCollider.js";
import { Collision } from "./Collision.js";

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
        const apos = a.entity.position;
        const bpos = b.entity.position;
        const dir = Vector.subtract(apos, bpos);
        const r = a.radius + b.radius;
        return dir.x * dir.x + dir.y * dir.y  <= r * r;
    });
    
    // Sphere : Box
    Collision.register(SphereCollider, BoxCollider, (a, b) => {
        const apos = a.entity.position;
        const AABB = b.getAABB();
        const closestPoint = new Vector(
            Math.max(A.minX, Math.min(p.x, A.maxX)),
            Math.max(A.minY, Math.min(p.y, A.maxY))
        );
        const dir = Vector.subtract(apos, closestPoint);
        return dir.x * dir.x + dir.y * dir.y <= a.radius * a.radius;
    });
}

export { registerCollisionRule };