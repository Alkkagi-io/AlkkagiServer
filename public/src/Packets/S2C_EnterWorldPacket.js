import { getFlexiableUTF8Size } from '../Modules/BufferHandle.js';
import { Packet, EPacketID } from "./index.js";

class S2C_EnterWorldPacket extends Packet {
    constructor(entityID = 0) {
        super();
        
        this.entityID = entityID;
    }

    getPacketID() {
        return EPacketID.S2C_EnterWorld;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();

        size += 4 // entity ID (uint 32)

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeUint32(this.entityID);
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.entityID = readHandle.readUint32();
    }
}

export { S2C_EnterWorldPacket };