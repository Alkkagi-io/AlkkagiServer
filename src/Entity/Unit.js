import { Entity } from './Entity.js';
import { Rigidbody } from '../Physics/Rigidbody.js';

class Unit extends Entity {
    constructor(world) {
        super(world);
        this.rigidbody = new Rigidbody(this);
    }

    onPreUpdate(deltaTime) {
        super.onPreUpdate(deltaTime);
        this.rigidbody.update(deltaTime);
    }
}

export { Unit };