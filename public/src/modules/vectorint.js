import { SerializableData } from './serializabledata.js';

class VectorInt extends SerializableData {
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

        size += 2; // x int16
        size += 2; // y int16
        
        return size;
    }

    onSerialize(writeHandle) {
        writeHandle.writeInt16(this.x);
        writeHandle.writeInt16(this.y);
    }

    onDeserialize(readHandle) {
        this.x = readHandle.readInt16();
        this.y = readHandle.readInt16();
    }
}

export { VectorInt };