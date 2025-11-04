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

            // globalThis.logger.info('GameServer', `Buffer: ${JSON.stringify(message)}`);
            
            try {
                const packet = PacketManager.createPacket(packetID, buffer);
                const handler = PacketManager.createHandler(packetID, this);
                handler.handle(packet);
                globalThis.logger.info('GameServer', `Packet received. ClientID: ${this.clientID}, PacketType: ${packet.constructor.name}, Size: ${buffer.byteLength / 1024}KB`);
            } catch (error) {
                globalThis.logger.error('GameServer', `Error occurred while handling packet. ClientID: ${this.clientID}, PacketType: ${packet.constructor.name}.\n${error.stack}`);
            }
        });

        this.socket.on('close', () => {
            globalThis.logger.info('GameServer', `Socket closed. ClientID: ${this.clientID}`);
            this.disconnect();
        });

        this.socket.on('error', (error) => {
            globalThis.logger.error('GameServer', `Socket error. ClientID: ${this.clientID}, Error: ${error}`);
            this.disconnect();
        });
    }

    send(data, packetType = undefined) {
        let buffer = undefined;
        if (data instanceof Packet) {
            buffer = data.serialize();
            packetType = packetType ?? data.constructor.name;
        } else if (data instanceof ArrayBuffer) {
            buffer = data;
            packetType = packetType ?? 'unknown buffer';
        }
        
        if (buffer === undefined)
            throw new Error(`data is of invalid type. type : ${typeof (data)}`);
        
        this.socket.send(buffer, { binary: true });
        Diagnostics.recordNetworkSendTraffic(this, packetType, buffer.byteLength / 1024);
        // globalThis.logger.info('GameServer', `Packet sent. ClientID: ${this.clientID}, PacketType: ${packetType}, Size: ${buffer.byteLength / 1024}KB`);
    }

    disconnect() {
        this.socket.close();
        this.emit('disconnect');
    }
}

export default ClientHandle;