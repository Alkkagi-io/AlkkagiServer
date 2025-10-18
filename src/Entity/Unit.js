import { Entity } from './index.js';
import { Rigidbody } from '../Physics/Rigidbody.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { EMoveState } from '../Component/index.js';

const RESTITUTION = 1; // collision coefficient

class Unit extends Entity {
    constructor(world) {
        super(world);
        this.rigidbody = new Rigidbody(this);
    }

    onPreUpdate(deltaTime) {
        super.onPreUpdate(deltaTime);
        this.rigidbody.update(deltaTime);
    }

    onCollisionEnter(other) {
        super.onCollisionEnter(other);

        if(other instanceof Unit == false || other.moveComponent.moveState != EMoveState.Propelled) {
            return;
        }

        const velocity = this.rigidbody.velocity;
        const otherVelocity = other.rigidbody ? other.rigidbody.velocity : Vector.Zero;

        const weight = this.getWeight();
        const otherWeight = other.getWeight();

        const contactPoint = other.collider.getClosestPoint(this.position);
        const normal = Vector.normalize(Vector.subtract(other.position, this.position));
        const tangent = new Vector(-normal.x, normal.y);

        // Normal Direction Velocity
        const velocityNormal = Vector.dot(velocity, normal);
        const otherVelocityNormal = Vector.dot(otherVelocity, normal);

        // Tangent Direction Velocity
        const velocityTangent = Vector.dot(velocity, tangent);

        // Reflected Normal Direction Velocity
        const velocityNormalReflected = ((weight - RESTITUTION * otherWeight) * velocityNormal + (1 + RESTITUTION) * otherWeight * otherVelocityNormal) / (weight + otherWeight);

        // Reflected Tangent Direction Velocity
        const velocityTangentReflected = velocityTangent;

        // Velocity Reflected
        const velocityReflected = Vector.add(Vector.multiply(normal, velocityNormalReflected), Vector.multiply(tangent, velocityTangentReflected));

        this.onCollide(other, contactPoint, normal, velocityReflected);
    }

    // <entity, Vector, Vector, Vector>
    onCollide(other, contactPoint, normal, velocityReflected) { }
}

export { Unit };