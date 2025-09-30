import { Vector } from '../../AlkkagiShared/modules/vector.js';
import { SerializableData } from '../../AlkkagiShared/modules/serializabledata.js';

class Entity extends SerializableData {
    constructor(world) {
        super();

        this.world = world;

        this.entityID = 0;              // serialized property
        this.position = new Vector();   // serialized property
    }

    getID() {
        return this.entityID;
    }

    getFlexiableSize() {
        let size = 0;
        size += 2; // entityID uint16
        size += this.position.getFlexiableSize(); // position
        return size;
    }

    onSerialize(writeHandle) {
        writeHandle.writeUint16(this.entityID);
        writeHandle.writeArrayBuffer(this.position.serialize());
    }

    onDeserialize(readHandle) {
        this.entityID = readHandle.readUint16();
        this.position = new Vector().deserialize(readHandle.readArrayBuffer());
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