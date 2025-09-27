class PacketFactory {
    static factories = { };

    constructor() {
        throw new Error("PacketFactory is a static class and cannot be instantiated");
    }

    static on(packetID, PacketType) {
        this.factories[packetID] = PacketType;
    }

    static create(packetID, buffer, ...args) {
        const factory = this.factories[packetID];
        if(factory === undefined) {
            throw new Error(`Factory for packetID ${packetID} not found`);
        }

        const packet = new factory(...args);
        packet.deserialize(buffer);
        return packet;
    }
}

export { PacketFactory };