import { BufferReadHandle, BufferWriteHandle } from "./bufferhandle.js";

class SerializableData {
    constructor() {
    }

    getFlexiableSize() {
        throw new Error("Abstract method 'getFlexiableSize' must be implemented");
    }

    serialize() {
        const buffer = new ArrayBuffer(this.getFlexiableSize());
        const writeHandle = new BufferWriteHandle(buffer);

        this.onSerialize(writeHandle);

        return writeHandle.build();
    }

    onSerialize(writeHandle) {
        throw new Error("Abstract method 'onSerialize' must be implemented");
    }

    deserialize(data) {
        const readHandle = new BufferReadHandle(data);

        this.onDeserialize(readHandle);

        return this;
    }

    onDeserialize(readHandle) {
        throw new Error("Abstract method 'onDeserialize' must be implemented");
    }
}

export { SerializableData };