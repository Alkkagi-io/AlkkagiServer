import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

const EMoveState = Object.freeze({
    Locomotion: 0,
    Hold: 1,
    Propelled: 2
});

const PROPEL_EPSILON = 0.01 * 0.01;
const PROPEL_LOCOMOTION_THRESHOLD = 0.05 * 0.05;

class MoveComponent {
    constructor(rigidbody) {
        this.rigidbody = rigidbody;
        this.moveDirection = Vector.Zero;
    }

    onUpdate(deltaTime) {
        switch(this.moveState) {
            case EMoveState.Locomotion:
                this.rigidbody.velocity = this.moveDirection;
                break;
            case EMoveState.Propelled:
                const sqrSpeed = this.rigidbody.velocity.getSqrMagnitude();
    
                const locomotionEnable = sqrSpeed < PROPEL_LOCOMOTION_THRESHOLD && this.moveDirection.x != 0 && this.moveDirection.y != 0;
                const propelReleaseEnable = sqrSpeed < PROPEL_EPSILON;
    
                if(locomotionEnable || propelReleaseEnable) {
                    this.moveState = EMoveState.Locomotion;
                }

                break;
        }
    }

    // set velocity for locomotion
    setMoveDirection(moveDirection) {
        this.moveDirection = Vector.normalize(moveDirection);
    }

    // set velocity for propelled => boom!
    propel(force) {
        this.moveState = EMoveState.Propelled;
        this.rigidbody.velocity = force;
    }

    // hold character
    hold() {
        this.moveState = EMoveState.Hold;
        this.rigidbody.velocity = Vector.Zero;
    }
}

export { MoveComponent, EMoveState };