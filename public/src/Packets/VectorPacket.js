import { EPacketID, Packet } from "./index.js";
import { getBytesHeaderSize } from "../Modules/BufferHandle.js";
import { Vector } from "../Modules/Vector.js";

class VectorPacket extends Packet {
    constructor(vector = new Vector()) {
        super();
        this.vector = vector;
    }

    getPacketID() {
        return EPacketID.Vector;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();

        size += this.vector.getFlexibleSize() + getBytesHeaderSize(); // vector + header

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeArrayBuffer(this.vector.serialize());
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.vector = new Vector().deserialize(readHandle.readArrayBuffer());
    }
}

export { VectorPacket };