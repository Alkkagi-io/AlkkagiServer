import { EventEmitter } from 'events';
import { BufferReadHandle } from '../../AlkkagiShared/Modules/BufferHandle.js';
import { Packet, PacketManager } from '../../AlkkagiShared/Packets/index.js';
import { PlayerHandle } from './PlayerHandle.js';
import { Diagnostics } from '../Utils/ETC/Diagnostics.js';

class ClientHandle extends EventEmitter {
    constructor(gameServer, world, socket, clientID) {
        super();
        this.socket = socket;
        this.clientID = clientID;
        this.playerHandle = new PlayerHandle(gameServer, world, this);

        this.socket.on('message', (message) => {
            // test
            if (message.length == 0)
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

    send(data) {
        let buffer = undefined;
        if (data instanceof Packet) {
            buffer = data.serialize();
            Diagnostics.recordNetworkSendTraffic(this, data, buffer.byteLength / 1024);
        } else if (data instanceof ArrayBuffer) {
            buffer = data;
        }

        if (buffer === undefined)
            throw new Error(`data is of invalid type. type : ${typeof (data)}`);

        this.socket.send(buffer, { binary: true });
    }

    disconnect() {
        this.socket.close();
        this.emit('disconnect');
    }
}

export default ClientHandle;