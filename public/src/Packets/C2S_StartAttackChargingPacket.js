import { Packet, EPacketID } from "./index.js";

class C2S_StartAttackChargingPacket extends Packet {
    constructor() {
        super();
    }

    getPacketID() {
        return EPacketID.C2S_StartAttackCharging;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();
        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);
    }
}

export { C2S_StartAttackChargingPacket };