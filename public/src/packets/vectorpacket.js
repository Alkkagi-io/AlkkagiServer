import { EPacketID, Packet, getBytesHeaderSize } from "./index.js";
import { Vector } from "../modules/vector.js";
import { VectorInt } from "../modules/vectorint.js";

class VectorPacket extends Packet {
    constructor(vector, vectorInt) {
        super();
        this.vector = vector;
        this.vectorInt = vectorInt;
    }

    getPacketID() {
        return EPacketID.VECTOR;
    }

    getFlexiableSize() {
        let size = super.getFlexiableSize();

        size += this.vector.getFlexiableSize() + getBytesHeaderSize(); // vector + header
        size += this.vectorInt.getFlexiableSize() + getBytesHeaderSize(); // vectorInt + header

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeBytes(new Uint8Array(this.vector.serialize()));
        writeHandle.writeBytes(new Uint8Array(this.vectorInt.serialize()));
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.vector = new Vector().deserialize(readHandle.readBytes().buffer);
        this.vectorInt = new VectorInt().deserialize(readHandle.readBytes().buffer);
    }
}

export { VectorPacket };