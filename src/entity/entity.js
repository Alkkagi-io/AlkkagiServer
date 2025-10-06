import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class Entity {
    constructor(world) {
        super();

        this.world = world;

        this.entityID = 0;
        this.position = new Vector();
    }

    getID() {
        return this.entityID;
    }

    onAwake() { }                   // called when the entity is added to world
    onStart() { }                   // called after awake
    onDestroy() { }                 // called when the entity is removed from world

    onPreUpdate(deltaTime) { }        // called before update
    onUpdate(deltaTime) { }           // called every frame
    onPostUpdate(deltaTime) { }       // called after update
    onLateUpdate(deltaTime) { }       // called after system update

    onCollision(otherEntity) { }    // called when this entity collides with another entity
}

export { Entity };