import { SerializableData } from './serializabledata.js';

class Vector extends SerializableData {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    getFlexiableSize() {
        let size = 0;

        size += 4; // x float32
        size += 4; // y float32

        return size;
    }

    onSerialize(writeHandle) {
        writeHandle.writeFloat32(this.x);
        writeHandle.writeFloat32(this.y);
    }

    onDeserialize(readHandle) {
        this.x = readHandle.readFloat32();
        this.y = readHandle.readFloat32();
    }
}

export { Vector };