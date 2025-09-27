class Client {
    constructor(socket) {
        this.socket = socket;
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    send(packet) {
        const buffer = packet.serialize();
        this.socket.send(buffer, { binary: true });
    }

    close() {
        this.socket.close();
    }
}

export default Client;