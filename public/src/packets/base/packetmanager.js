class PacketManager {
    static factories = { };
    static handlers = { };
    static packetArgs = [ ];
    static handlerArgs = [ ];

    constructor() {
        throw new Error("PacketManager is a static class and cannot be instantiated");
    }

    static on(packetID, PacketType, PacketHandlerType) {
        this.factories[packetID] = PacketType;
        this.handlers[packetID] = PacketHandlerType;
    }

    static createPacket(packetID, buffer, ...args) {
        const factory = this.factories[packetID];
        if(factory === undefined) {
            throw new Error(`Factory for packetID ${packetID} not found`);
        }

        const packet = new factory(...this.packetArgs, ...args);
        packet.deserialize(buffer);
        return packet;
    }

    static createHandler(packetID, ...args) {
        const handler = this.handlers[packetID];
        if(handler === undefined) {
            throw new Error(`Handler for packetID ${packetID} not found`);
        }

        return new handler(...this.handlerArgs, ...args);
    }

    static injectPacketArgs(...args) {
        this.packetArgs = args;
    }

    static injectHandlerArgs(...args) {
        this.handlerArgs = args;
    }
}

export { PacketManager };