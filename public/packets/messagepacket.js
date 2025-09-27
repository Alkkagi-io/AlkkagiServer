import { EPacketID, Packet, getFlexiableUTF8Size } from "./index.js";

class MessagePacket extends Packet {
    constructor(message) {
        super();
        this.message = message;
    }

    getPacketID() {
        return EPacketID.MESSAGE;
    }

    getFlexiablePacketSize() {
        let packetSize = super.getFlexiablePacketSize();

        packetSize += getFlexiableUTF8Size(this.message); // utf8 str (max 4 bytes)

        return packetSize;
    }

    onSerialize(writeHandle) {
        writeHandle.writeStringUTF8(this.message);
    }

    onDeserialize(readHandle) {
        this.message = readHandle.readStringUTF8();
    }
}

export { MessagePacket };