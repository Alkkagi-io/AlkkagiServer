import { getBytesHeaderSize } from "../Modules/BufferHandle.js";
import { Packet, EPacketID } from "./index.js";
import { Vector } from "../Modules/Vector.js";

class C2S_FinishAttackChargingPacket extends Packet {
    constructor(direction = Vector.Zero) {
        super();

        this.direction = direction;
    }

    getPacketID() {
        return EPacketID.C2S_FinishAttackCharging;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();

        size += this.direction.getFlexibleSize() + getBytesHeaderSize(); // vector + header
        
        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeArrayBuffer(this.direction.serialize());
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        this.direction = new Vector().deserialize(readHandle.readArrayBuffer());
    }
}

export { C2S_FinishAttackChargingPacket };