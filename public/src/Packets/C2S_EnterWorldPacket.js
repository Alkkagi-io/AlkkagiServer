import { getFlexiableUTF8Size } from '../Modules/BufferHandle.js';
import { Packet, EPacketID } from "./index.js";

class C2S_EnterWorldPacket extends Packet {
    constructor(nickname) {
        super();

        this.nickname = nickname;
    }

    getPacketID() {
        return EPacketID.C2S_EnterWorld;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();

        size += getFlexiableUTF8Size(this.nickname); // utf8 str (max 4 bytes)

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeStringUTF8(this.nickname);
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.message = readHandle.readStringUTF8();
    }
}

export { C2S_EnterWorldPacket };