class PacketHandler {
    constructor() {
    }

    handle(packet) {
        throw new Error("Abstract method 'handle' must be implemented");
    }
}

export { PacketHandler };