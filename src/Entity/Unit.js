import { Entity } from './Entity.js/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class Unit extends Entity {
    constructor(world) {
        super(world);

        this.speed = 0;
        this.moveDirection = new Vector();
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);

        const movement = this.moveDirection.getMultiplied(this.speed * deltaTime);
        this.position.add(movement);
    }
}

export { Unit };