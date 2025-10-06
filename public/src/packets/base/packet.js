import { SerializableData } from "../../Modules/SerializableData.js";

class Packet extends SerializableData {
    constructor() {
        super();
    }

    getPacketID() {
        throw new Error("Abstract method 'getPacketID' must be implemented");
    }

    getFlexiableSize() {
        let size = 0;
        
        size += 1; // packetID

        return size;
    }

    onSerialize(writeHandle) {
        writeHandle.writeUint8(this.getPacketID()); // write packetID
    }

    onDeserialize(readHandle) {
        readHandle.readUint8(); // skip packetID
    }
}

export { Packet };