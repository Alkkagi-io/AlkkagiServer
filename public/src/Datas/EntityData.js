import { getBytesHeaderSize } from '../Modules/BufferHandle.js';
import { SerializableData } from '../Modules/SerializableData.js';
import { Vector } from '../Modules/Vector.js';

class EntityData extends SerializableData {
    constructor(entityID, position) {
        super()

        this.entityID = entityID;
        this.position = position;
    }

    getFlexibleSize() {
        let size = 0;
        size += 2; // entityID uint16
        size += this.position.getFlexibleSize() + getBytesHeaderSize(); // position
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
}

export { EntityData };