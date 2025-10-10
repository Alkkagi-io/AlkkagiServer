import { Packet, EPacketID } from "./index.js";
import { EMoveInput } from "../Datas/index.js";

class C2S_MoveInputPacket extends Packet {
    constructor(moveInput = EMoveInput.None) {
        super();

        this.moveInput = moveInput;
    }

    getPacketID() {
        return EPacketID.C2S_MoveInput;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();

        size += 1; // moveInput (uint8)

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeUint8(this.moveInput);
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.moveInput = readHandle.readUint8();
    }
}

export { C2S_MoveInputPacket };