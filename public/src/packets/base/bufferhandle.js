import { encodeUTF8, decodeUTF8, encodeUTF16LE, decodeUTF16LE } from '../../modules/encodingutility.js';

class BufferReadHandle {
    constructor(buffer) {
        this.buffer = buffer;
        this.view = new DataView(buffer);
        this.offset = 0;
    }

    readUint8() {
        if(this.offset + 1 > this.buffer.byteLength) {
            throw new Error('Error with readUint8: Out of bounds');
        }

        const value = this.view.getUint8(this.offset);
        this.offset += 1;

        return value;
    }
    
    readUint16() {
        if(this.offset + 2 > this.buffer.byteLength) {
            throw new Error('Error with readUint16: Out of bounds');
        }

        const value = this.view.getUint16(this.offset, true);
        this.offset += 2;

        return value;
    }
    
    readUint32() {
        if(this.offset + 4 > this.buffer.byteLength) {
            throw new Error('Error with readUint32: Out of bounds');
        }

        const value = this.view.getUint32(this.offset, true);
        this.offset += 4;

        return value;
    }

    readInt8() {
        if(this.offset + 1 > this.buffer.byteLength) {
            throw new Error('Error with readInt8: Out of bounds');
        }

        const value = this.view.getInt8(this.offset);
        this.offset += 1;

        return value;
    }
    
    readInt16() {
        if(this.offset + 2 > this.buffer.byteLength) {
            throw new Error('Error with readInt16: Out of bounds');
        }

        const value = this.view.getInt16(this.offset, true);
        this.offset += 2;

        return value;
    }
    
    readInt32() {
        if(this.offset + 4 > this.buffer.byteLength) {
            throw new Error('Error with readInt32: Out of bounds');
        }

        const value = this.view.getInt32(this.offset, true);
        this.offset += 4;

        return value;
    }

    readFloat32() {
        if(this.offset + 4 > this.buffer.byteLength) {
            throw new Error('Error with readFloat32: Out of bounds');
        }

        const value = this.view.getFloat32(this.offset, true);
        this.offset += 4;

        return value;
    }
    
    readFloat64() {
        if(this.offset + 8 > this.buffer.byteLength) {
            throw new Error('Error with readFloat64: Out of bounds');
        }

        const value = this.view.getFloat64(this.offset, true);
        this.offset += 8;

        return value;
    }

    readStringUTF8() {
        const length = this.readUint16();
        if(this.offset + length > this.buffer.byteLength) 
            throw new Error('Error with readStringUTF8: Out of bounds');
    
        const bytes = new Uint8Array(this.buffer, this.offset, length);
        const str = decodeUTF8(bytes);
        this.offset += length;
    
        return str;
    }
    
    readStringUTF16LE() {
        const length = this.readUint16();
        if(this.offset + length > this.buffer.byteLength) 
            throw new Error('Error with readStringUTF16LE: Out of bounds');
    
        const bytes = new Uint8Array(this.buffer, this.offset, length);
        const str = decodeUTF16LE(bytes);
        this.offset += length;
    
        return str;
    }

    readBytes() {
        const length = this.readUint16();
        if(this.offset + length > this.buffer.byteLength) 
            throw new Error('Error with readBytes: Out of bounds');

        const bytes = new Uint8Array(this.buffer.slice(this.offset, this.offset + length));
        this.offset += length;

        return bytes;
    }
}

class BufferWriteHandle {
    constructor(buffer) {
        this.buffer = buffer;
        this.view = new DataView(buffer);
        this.offset = 0;
    }
    
    writeUint8(value) {
        if(this.offset + 1 > this.buffer.byteLength) {
            throw new Error('Error with writeUint8: Out of bounds');
        }

        this.view.setUint8(this.offset, value);
        this.offset += 1;
    }
    
    writeUint16(value) {
        if(this.offset + 2 > this.buffer.byteLength) {
            throw new Error('Error with writeUint16: Out of bounds');
        }

        this.view.setUint16(this.offset, value, true);
        this.offset += 2;
    }
    
    writeUint32(value) {
        if(this.offset + 4 > this.buffer.byteLength) {
            throw new Error('Error with writeUint32: Out of bounds');
        }

        this.view.setUint32(this.offset, value, true);
        this.offset += 4;
    }

    writeInt8(value) {
        if(this.offset + 1 > this.buffer.byteLength) {
            throw new Error('Error with writeInt8: Out of bounds');
        }

        this.view.setInt8(this.offset, value);
        this.offset += 1;
    }
    
    writeInt16(value) {
        if(this.offset + 2 > this.buffer.byteLength) {
            throw new Error('Error with writeInt16: Out of bounds');
        }

        this.view.setInt16(this.offset, value, true);
        this.offset += 2;
    }
    
    writeInt32(value) {
        if(this.offset + 4 > this.buffer.byteLength) {
            throw new Error('Error with writeInt32: Out of bounds');
        }

        this.view.setInt32(this.offset, value, true);
        this.offset += 4;
    }
    
    writeFloat32(value) {
        if(this.offset + 4 > this.buffer.byteLength) {
            throw new Error('Error with writeFloat32: Out of bounds');
        }

        this.view.setFloat32(this.offset, value, true);
        this.offset += 4;
    }
    
    writeFloat64(value) {
        if(this.offset + 8 > this.buffer.byteLength) {
            throw new Error('Error with writeFloat64: Out of bounds');
        }

        this.view.setFloat64(this.offset, value, true);
        this.offset += 8;
    }

    writeStringUTF8(value) {
        const strBuffer = encodeUTF8(value);
        const length = strBuffer.length;
    
        if(length > 65535)
            throw new Error('Error with writeStringUTF8: Out of bounds');
            
        if(this.offset + 2 + length > this.buffer.byteLength) 
            throw new Error('Error with writeStringUTF8: Out of bounds');

        this.writeUint16(length);
        new Uint8Array(this.buffer, this.offset, length).set(strBuffer);

        this.offset += length;
    }
    
    writeStringUTF16LE(value) {
        const strBuffer = encodeUTF16LE(value, false);
        const length = strBuffer.length;
    
        if(length > 65535)
            throw new Error('Error with writeStringUTF16LE: Out of bounds');

        if(this.offset + 2 + length > this.buffer.byteLength) 
            throw new Error('Error with writeStringUTF16LE: Out of bounds');

        this.writeUint16(length);
        new Uint8Array(this.buffer, this.offset, length).set(strBuffer);

        this.offset += length;
    }

    writeBytes(bytes) {
        const length = bytes.length;
        if(this.offset + length > this.buffer.byteLength) 
            throw new Error('Error with writeBytes: Out of bounds');

        this.writeUint16(length);
        new Uint8Array(this.buffer, this.offset, length).set(bytes);

        this.offset += length;
    }

    build() {
        return this.buffer.slice(0, this.offset);
    }
}

function getFlexiableUTF8Size(value) {
    return 2 + value.length * 4;
}

function getFlexiableUTF16LESize(value) {
    return 2 + value.length * 4;
}

function getBytesHeaderSize() {
    return 2;
}

export { BufferReadHandle, BufferWriteHandle };
export { getFlexiableUTF8Size, getFlexiableUTF16LESize, getBytesHeaderSize };