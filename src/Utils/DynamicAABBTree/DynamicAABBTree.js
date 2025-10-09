class Node {
    constructor() {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.aabb = null;
        this.height = 0;
        this.collider = null;
    }

    get isLeaf() { return this.left === null; }
}

class DynamicAABBTree {
    constructor({ fatMargin = 2 } = {}) {
        this.root = null;
        this.fatMargin = fatMargin;
        this.nodes = new Set();
        this._pool = [];
    }

    _popNode() {
        return this._pool.pop() ?? new Node();
    }

    _pushNode(n) {
        n.parent = n.left = n.right = n.collider = null;
        n.aabb = null;
        n.height = 0;
        this._pool.push(n);
    }

    insert(collider, aabbReal) {
        const leaf = this._popNode();
        leaf.collider = collider;
        leaf.aabb = inflate(aabbReal, this.fatMargin);
        leaf.height = 0;
        this.nodes.add(leaf);

        if (!this.root) {
            this.root = leaf;
            return leaf;
        }

        let index = this.root;
        while (!index.isLeaf) {
            const left = index.left;
            const right = index.right;
            const area = perimeter(index.aabb);
            const combined = combine(index.aabb, leaf.aabb);
            const costParent = perimeter(combined);

            const costLeft = (left.isLeaf ? perimeter(combine(left.aabb, leaf.aabb))
                : (perimeter(combine(left.aabb, leaf.aabb)) - perimeter(left.aabb))) + 0;
            const costRight = (right.isLeaf ? perimeter(combine(right.aabb, leaf.aabb))
                : (perimeter(combine(right.aabb, leaf.aabb)) - perimeter(right.aabb))) + 0;

            if (costLeft < costRight)
                index = left; else index = right;
        }

        const oldParent = index.parent;
        const newParent = this._popNode();
        newParent.parent = oldParent;
        newParent.aabb = combine(leaf.aabb, index.aabb);
        newParent.height = index.height + 1;

        if (oldParent) {
            if (oldParent.left === index)
                oldParent.left = newParent;
            else
                oldParent.right = newParent;
        } else {
            this.root = newParent;
        }

        newParent.left = index;
        index.parent = newParent;
        newParent.right = leaf;
        leaf.parent = newParent;

        this._fixUpwards(newParent);
        return leaf;
    }

    remove(leaf) {
        if (!leaf || !this.nodes.has(leaf))
            return;

        this.nodes.delete(leaf);

        if (leaf === this.root) {
            this.root = null;
            this._pushNode(leaf);
            return;
        }

        const parent = leaf.parent;
        const grand = parent.parent;
        const sibling = (parent.left === leaf) ? parent.right : parent.left;

        if (grand) {
            if (grand.left === parent)
                grand.left = sibling;
            else
                grand.right = sibling;
            sibling.parent = grand;
            this._pushNode(parent);
            this._fixUpwards(grand);
        } else {
            this.root = sibling;
            sibling.parent = null;
            this._pushNode(parent);
        }

        this._pushNode(leaf);
    }

    update(leaf, aabbReal) {
        const fat = leaf.aabb;
        if (
            aabbReal.minX >= fat.minX && aabbReal.maxX <= fat.maxX &&
            aabbReal.minY >= fat.minY && aabbReal.maxY <= fat.maxY
        ) return;

        this.remove(leaf);
        const expanded = inflate(aabbReal, this.fatMargin);
        this.remove(leaf);
        leaf.collider = leaf.collider; // 유지
        leaf.aabb = expanded;
        leaf.height = 0;
        this.insert(leaf.collider, aabbReal);
    }

    query(aabb, callback) {
        if (!this.root)
            return;

        const stack = [this.root];
        while (stack.length) {
            const n = stack.pop();
            if (!n || !overlaps(n.aabb, aabb))
                continue;

            if (n.isLeaf) {
                if (callback(n) === false)
                    return;
            } else {
                stack.push(n.left, n.right);
            }
        }
    }

    forEachOverlappingPairs(callback) {
        const root = this.root;
        if (!root) return;

        const stack = [[root.left, root.right]];
        while (stack.length) {
            const [A, B] = stack.pop();
            if (!A || !B) 
                continue;
            if (!overlaps(A.aabb, B.aabb)) 
                continue;

            const ALeaf = A.isLeaf, BLeaf = B.isLeaf;
            if (ALeaf && BLeaf) {
                callback(A, B);
            } else if (ALeaf) {
                stack.push([A, B.left], [A, B.right]);
            } else if (BLeaf) {
                stack.push([A.left, B], [A.right, B]);
            } else {
                stack.push([A.left, B.left], [A.left, B.right], [A.right, B.left], [A.right, B.right]);
            }
        }
    }

    _fixUpwards(n) {
        while (n) {
            const l = n.left, r = n.right;
            n.height = 1 + Math.max(l ? l.height : 0, r ? r.height : 0);
            n.aabb = combine(l.aabb, r.aabb);
            n = n.parent;
        }
    }
}

function combine(A, B) {
    return {
        minX: Math.min(A.minX, B.minX),
        minY: Math.min(A.minY, B.minY),
        maxX: Math.max(A.maxX, B.maxX),
        maxY: Math.max(A.maxY, B.maxY),
    };
}

function perimeter(A) {
    return (A.maxX - A.minX) * 2 + (A.maxY - A.minY) * 2;
}

function overlaps(A, B, eps = 0) {
    return !(
        A.maxX < B.minX - eps ||
        A.minX > B.maxX + eps ||
        A.maxY < B.minY - eps ||
        A.minY > B.maxY + eps
    );
}

function inflate(A, margin) {
    return {
        minX: A.minX - margin, minY: A.minY - margin,
        maxX: A.maxX + margin, maxY: A.maxY + margin,
    };
}

export { DynamicAABBTree };