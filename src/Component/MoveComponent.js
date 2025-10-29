import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

const EMoveState = Object.freeze({
    Locomotion: 0,
    Hold: 1,
    Propelled: 2
});

const PROPEL_EPSILON = 0.01 * 0.01;

class MoveComponent {
    constructor(rigidbody) {
        this.rigidbody = rigidbody;
        this.moveState = EMoveState.Locomotion;
        this.locomotionVelocity = Vector.Zero();
    }

    onUpdate(deltaTime) {
        switch(this.moveState) {
            case EMoveState.Locomotion:
                this.rigidbody.velocity.set(this.locomotionVelocity.x, this.locomotionVelocity.y);
                break;
            case EMoveState.Propelled:
                const sqrSpeed = this.rigidbody.velocity.getSqrMagnitude();

                const isMoving = this.locomotionVelocity.x != 0 || this.locomotionVelocity.y != 0;
                const propelLocomotionThreshold = globalThis.gameConfig.propelLocomotionThreshold;
                const locomotionEnable = (sqrSpeed < propelLocomotionThreshold * propelLocomotionThreshold) && isMoving;
                const propelReleaseEnable = sqrSpeed < PROPEL_EPSILON;
    
                if(locomotionEnable || propelReleaseEnable) {
                    this.moveState = EMoveState.Locomotion;
                }

                break;
        }
    }

    // set velocity for locomotion
    setLocomotionVelocity(moveDirection, moveSpeed) {
        const velocity = Vector.multiply(Vector.normalize(moveDirection), moveSpeed);
        this.locomotionVelocity.set(velocity.x, velocity.y);
    }

    // set velocity for propelled => boom!
    propel(force) {
        this.moveState = EMoveState.Propelled;
        this.rigidbody.velocity.set(force.x, force.y);
    }

    // hold character
    hold() {
        this.moveState = EMoveState.Hold;
        this.rigidbody.velocity.set(0, 0);
    }

    release() {
        this.moveState = EMoveState.Locomotion;
    }
}

export { MoveComponent, EMoveState };