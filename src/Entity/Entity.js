import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { EEntityType } from '../../AlkkagiShared/Datas/index.js';

class Entity {
    constructor(world) {
        this.world = world;

        this.entityID = 0;
        this.scale = 1;
        this.position = new Vector();

        this.enabled = true;
    }

    getVelocity() {
        return Vector.Zero();
    }

    getEntityType() {
        return EEntityType.None;
    }

    getID() {
        return this.entityID;
    }

    getWeight() {
        return 1;
    }

    onAwake() { }                   // called when the entity is added to world
    onStart() { }                   // called after awake
    onDestroy() { }                 // called when the entity is removed from world

    onPreUpdate(deltaTime) { }        // called before update
    onUpdate(deltaTime) { }           // called every frame
    onPostUpdate(deltaTime) { }       // called after update
    onLateUpdate(deltaTime) { }       // called after system update

    onCollisionEnter(other) { }    // called once when collision with another entity begins
    onCollisionStay(other) { }      // called every frame while colliding with another entity
    onCollisionExit(other) { }      // called once when collision with another entity ends
}

export { Entity };