import { SerializableData } from './SerializableData.js';

class Vector extends SerializableData {
    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    getFlexiableSize() {
        let size = 0;

        size += 4; // x float32
        size += 4; // y float32

        return size;
    }

    onSerialize(writeHandle) {
        writeHandle.writeFloat32(this.x);
        writeHandle.writeFloat32(this.y);
    }

    onDeserialize(readHandle) {
        this.x = readHandle.readFloat32();
        this.y = readHandle.readFloat32();
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getSqrMagnitude() {
        return this.x * this.x + this.y * this.y;
    }

    getNormalized() {
        const length = this.getMagnitude();
        if(length === 0) 
            return new Vector(0, 0);

        return new Vector(this.x / length, this.y / length);
    }

    normalize() {
        const length = this.getMagnitude();
        if(length === 0) 
            return;

        this.x /= length;
        this.y /= length;
    }

    getAdded(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    getSubtracted(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    getMultiplied(value) {
        return new Vector(this.x * value, this.y * value);
    }

    multiply(value) {
        this.x *= value;
        this.y *= value;
    }

    getDivided(value) {
        return new Vector(this.x / value, this.y / value);
    }

    divide(value) {
        this.x /= value;
        this.y /= value;
    }
}

export { Vector };