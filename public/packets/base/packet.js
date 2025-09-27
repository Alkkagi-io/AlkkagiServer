class Packet {
    constructor() {
    }

    getPacketID() {
        throw new Error("Abstract method 'getPacketID' must be implemented");
    }

    getPacketSize() {
        throw new Error("Abstract method 'getPacketSize' must be implemented");
    }

    serialize() {
        throw new Error("Abstract method 'serialize' must be implemented");
    }

    deserialize(data) {
        throw new Error("Abstract method 'deserialize' must be implemented");
    }
}

export { Packet };