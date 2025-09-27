import { EventEmitter } from 'events';
import { BufferReadHandle } from '../../AlkkagiShared/packets/index.js';
import { PacketManager } from '../../AlkkagiShared/packets/index.js';

class Client extends EventEmitter {
    constructor(socket) {
        super();
        this.socket = socket;

        this.socket.on('message', (message) => {
            // test
            if(message.length == 0)
                return;

            const buffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength);
            const readHandle = new BufferReadHandle(buffer);
            const packetID = readHandle.readUint8();

            globalThis.logger.info('GameServer', `Packet received. PacketID: ${packetID}`);
            // globalThis.logger.info('GameServer', `Buffer: ${JSON.stringify(message)}`);

            try {
                const packet = PacketManager.createPacket(packetID, buffer);
                const handler = PacketManager.createHandler(packetID, this);
                handler.handle(packet);
            } catch (error) {
                globalThis.logger.error('GameServer', `Error occurred while handling packet. PacketID: ${packetID}. Error: ${error}`);
            }
        });

        this.socket.on('close', () => {
            globalThis.logger.info('GameServer', 'Socket closed');
            this.disconnect();
        });

        this.socket.on('error', (error) => {
            globalThis.logger.error('GameServer', `Socket error: ${error}`);
            this.disconnect();
        });
    }

    send(packet) {
        const buffer = packet.serialize();
        this.socket.send(buffer, { binary: true });
    }

    disconnect() {
        this.socket.close();
        this.emit('disconnect');
    }
}

export default Client;