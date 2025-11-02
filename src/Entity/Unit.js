import { Entity } from './Entity.js';
import { Rigidbody } from '../Physics/Rigidbody.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { EMoveState } from '../Component/index.js';
import { MoveComponent } from '../Component/MoveComponent.js';

class Unit extends Entity {
    constructor(world) {
        super(world);
        this.rigidbody = new Rigidbody(this);
        this.velocityBuffer = new Vector();
        this.moveStateBuffer = EMoveState.Locomotion;
    }

    getVelocity() {
        return this.velocityBuffer;
    }
    
    onAwake() {
        super.onAwake();
        this.moveComponent = new MoveComponent(this.rigidbody);
    }

    onPreUpdate(deltaTime) {
        super.onPreUpdate(deltaTime);
        this.rigidbody.update(deltaTime);
    }

    onLateUpdate(deltaTime) {
        super.onLateUpdate(deltaTime);
        this.velocityBuffer.set(this.rigidbody.velocity.x, this.rigidbody.velocity.y);
        this.moveStateBuffer = this.moveComponent.moveState;
    }

    onCollisionEnter(other) {
        super.onCollisionEnter(other);

        if(other instanceof Entity == false) {
            return;
        }

        const weight = this.getWeight() * globalThis.gameConfig.weightMultiplier;
        const otherWeight = other.getWeight() * globalThis.gameConfig.weightMultiplier;

        if(weight == 0 || otherWeight == 0) {
            return;
        }

        // 보류
        // // 내가 공격한 경우가 아닐 때 (this.moveComponent.moveState != EMoveState.Propelled)
        // // 상대방이 날 공격한 건지 체크한다.
        // if(this.moveComponent.moveState != EMoveState.Propelled) {
        //     if(other instanceof Unit == false || other.moveComponent.moveState != EMoveState.Propelled) {
        //         return;
        //     }
        // }

        const velocity = this.getVelocity();
        const otherVelocity = other.getVelocity();

        const contactPoint = other.collider.getClosestPoint(this.position);
        const normal = Vector.normalize(Vector.subtract(other.position, contactPoint));
        const tangent = new Vector(-normal.y, normal.x);

        // Normal Direction Velocity
        const velocityNormal = Vector.dot(velocity, normal);
        const otherVelocityNormal = Vector.dot(otherVelocity, normal);

        // Tangent Direction Velocity
        const velocityTangent = Vector.dot(velocity, tangent);

        // Reflected Normal Direction Velocity
        const restitution = globalThis.gameConfig.collideRestitution;
        const velocityNormalReflected = ((weight - restitution * otherWeight) * velocityNormal + (1 + restitution) * otherWeight * otherVelocityNormal) / (weight + otherWeight);

        // Reflected Tangent Direction Velocity
        const velocityTangentReflected = velocityTangent;

        // Velocity Reflected
        const velocityReflected = Vector.add(Vector.multiply(normal, velocityNormalReflected), Vector.multiply(tangent, velocityTangentReflected)).multiply(globalThis.gameConfig.collideScaleMultiplier);

        this.onCollide(other, contactPoint, normal, velocityReflected);
    }

    // <entity, Vector, Vector, Vector>
    onCollide(other, contactPoint, normal, velocityReflected) { }
}

export { Unit };
