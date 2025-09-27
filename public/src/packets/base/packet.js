import { BufferReadHandle, BufferWriteHandle } from "../index.js";

class Packet {
    constructor() {
    }

    getPacketID() {
        throw new Error("Abstract method 'getPacketID' must be implemented");
    }

    getFlexiablePacketSize() {
        let packetSize = 0;
        packetSize += 1; // packetID

        return packetSize;
    }

    serialize() {
        const buffer = new ArrayBuffer(this.getFlexiablePacketSize());
        const writeHandle = new BufferWriteHandle(buffer);

        writeHandle.writeUint8(this.getPacketID());

        this.onSerialize(writeHandle);

        return writeHandle.build();
    }

    onSerialize(writeHandle) {
        throw new Error("Abstract method 'onSerialize' must be implemented");
    }

    deserialize(data) {
        const readHandle = new BufferReadHandle(data);

        readHandle.readUint8(); // skip packetID

        this.onDeserialize(readHandle);

        return this;
    }

    onDeserialize(readHandle) {
        throw new Error("Abstract method 'onDeserialize' must be implemented");
    }
}

export { Packet };