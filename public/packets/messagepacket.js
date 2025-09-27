import { EPacketID, Packet, BufferReadHandle, BufferWriteHandle } from "./index.js";

class MessagePacket extends Packet {
    constructor(message) {
        super();
        this.message = message;
    }

    getPacketID() {
        return EPacketID.MESSAGE;
    }

    getPacketSize() {
        var packetSize = 0;
        packetSize += 1; // packetID
        packetSize += 2; // str length
        packetSize += this.message.length * 4; // utf8 str (max 4 bytes)

        return packetSize;
    }

    serialize() {
        const buffer = new ArrayBuffer(this.getPacketSize());
        const writeHandle = new BufferWriteHandle(buffer);

        writeHandle.writeUint8(this.getPacketID());
        writeHandle.writeStringUTF8(this.message);

        return writeHandle.build();
    }

    deserialize(data) {
        const readHandle = new BufferReadHandle(data);

        readHandle.readUint8(); // packetID
        this.message = readHandle.readStringUTF8();
        
        return this;
    }
}

export { MessagePacket };