import { EPacketID, Packet, getFlexiableUTF8Size } from "./index.js";

class MessagePacket extends Packet {
    constructor(message) {
        super();
        this.message = message;
    }

    getPacketID() {
        return EPacketID.MESSAGE;
    }

    getFlexiableSize() {
        let size = super.getFlexiableSize();

        size += getFlexiableUTF8Size(this.message); // utf8 str (max 4 bytes)

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeStringUTF8(this.message);
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.message = readHandle.readStringUTF8();
    }
}

export { MessagePacket };