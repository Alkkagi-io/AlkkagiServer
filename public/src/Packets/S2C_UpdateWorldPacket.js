import { getBytesHeaderSize } from '../Modules/BufferHandle.js';
import { Packet, EPacketID } from "./index.js";
import { EntityData } from "../Datas/EntityData.js"

class S2C_UpdateWorldPacket extends Packet {
    constructor(entities = []) {
        super();

        this.entityDatas = [];
        entities.forEach(entity => {
            this.entityDatas.push(new EntityData(entity.entityID, entity.position));
        });
    }

    getPacketID() {
        return EPacketID.S2C_UpdateWorld;
    }

    getFlexibleSize() {
        let size = super.getFlexibleSize();

        size += 2; // entityDatas length (uint16)
        if(this.entityDatas.length > 0)
            size += (this.entityDatas[0].getFlexibleSize() + getBytesHeaderSize()) * this.entityDatas.length;

        return size;
    }

    onSerialize(writeHandle) {
        super.onSerialize(writeHandle);

        writeHandle.writeUint16(this.entityDatas.length);
        for(let i = 0; i < this.entityDatas.length; ++i)
            writeHandle.writeArrayBuffer(this.entityDatas[i].serialize());
    }

    onDeserialize(readHandle) {
        super.onDeserialize(readHandle);

        const entityDatasLength = readHandle.readUint16();
        for(let i = 0; i < entityDatasLength; ++i)
            this.entityDatas.push(new EntityData().deserialize(readHandle.readArrayBuffer()));
    }
}

export { S2C_UpdateWorldPacket };