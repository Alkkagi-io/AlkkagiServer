import { SerializableData } from './SerializableData.js';

class Vector extends SerializableData {
    static Zero = new Vector(0, 0);
    static One = new Vector(1, 1);
    static Up = new Vector(0, 1);
    static Down = new Vector(0, -1);
    static Left = new Vector(-1, 0);
    static Right = new Vector(1, 0);

    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    getFlexibleSize() {
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

    normalize() {
        const length = this.getMagnitude();
        if(length === 0) 
            return;

        this.x /= length;
        this.y /= length;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(value) {
        this.x *= value;
        this.y *= value;
    }

    divide(value) {
        this.x /= value;
        this.y /= value;
    }

    // -- static methods --
        
    static normalize(vector) {
        const length = vector.getMagnitude();
        if(length === 0) 
            return new Vector(0, 0);

        return new Vector(vector.x / length, vector.y / length);
    }

    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }

    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }

    static multiply(vector, value) {
        return new Vector(vector.x * value, vector.y * value);
    }

    static divide(vector, value) {
        return new Vector(vector.x / value, vector.y / value);
    }
}

export { Vector };