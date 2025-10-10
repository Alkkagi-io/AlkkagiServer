import { registerCollisionRule } from "../Collision/CollisionRules.js";
import { DynamicAABBTree } from "../Utils/DynamicAABBTree/DynamicAABBTree.js";
import { System } from "./System.js";

class CollisionSystem extends System {
    constructor(world) {
        super(world);
        this.tree = null;
        this.prevCollisions = new Map();
        this.nextCollisions = new Map();

        world.on('addEntity', e => this.onAddEntity(e));
        world.on('removeEntity', e => this.onRemoveEntity(e));
    }

    getSystemID() {
        return 'CollisionSystem';
    }

    onAwake() {
        registerCollisionRule();
        this.tree = new DynamicAABBTree({ fatMargin: 2 });
    }

    onPreUpdate(deltaTime) {
        for (const leaf of this.tree.nodes) {
            if (!leaf?.isLeaf || !leaf.collider)
                continue;
            const aabb = leaf.collider.getAABB();
            this.tree.update(leaf, aabb);
        }

        this.tree.forEachOverlappingPairs?.((na, nb) => {
            const colA = na.collider;
            const colB = nb.collider;
            if (!colA || !colB)
                return;

            if (!colA.intersects(colB))
                return;

            const entityA = colA.owner;
            const entityB = colB.owner;

            if (!entityA || !entityB)
                return;

            // enter, stay 판정
            const prevA = this.prevCollisions.get(entityA);
            const alreadyCollision = !!prevA && prevA.has(entityB);

            if (alreadyCollision) {
                entityA.onCollisionStay(entityB);
                entityB.onCollisionStay(entityA);
            } else {
                entityA.onCollisionEnter(entityB);
                entityB.onCollisionEnter(entityA);
            }

            this._getSet(this.nextCollisions, entityA).add(entityB);
            this._getSet(this.nextCollisions, entityB).add(entityA);
        });

        // exit 판정
        for (const [entity, prevSet] of this.prevCollisions) {
            const nextSet = this.nextCollisions.get(entity) ?? new Set();
            for (const other of prevSet) {
                if (!nextSet.has(other)) {
                    entity.onCollisionExit(other);
                }
            }
        }

        this.prevCollisions = this.nextCollisions;
        this.nextCollisions = new Map();
    }

    onAddEntity(e) {
        if (!e.collider)
            return;

        const realAABB = e.collider.getAABB();
        e.collider.refLeaf = this.tree.insert(e.collider, realAabb);

        if (!this.prevCollisions.has(e))
            this.prevCollisions.set(e, new Set());
    }

    onRemoveEntity(e) {
        if (!e.collider)
            return;

        this.tree.remove(e.collider.refLeaf);
        e.collider.refLeaf = null;

        if (this.prevCollisions.has(e)) this.prevCollisions.delete(e);
        if (this.nextCollisions.has(e)) this.nextCollisions.delete(e);
        for (const set of this.prevCollisions.values()) set.delete(e);
        for (const set of this.nextCollisions.values()) set.delete(e);
    }

    _getSet(m, k) {
        let s = m.get(k);
        if (!s) {
            s = new Set();
            m.set(k, s);
        }
        return s;
    }
}

export { CollisionSystem };