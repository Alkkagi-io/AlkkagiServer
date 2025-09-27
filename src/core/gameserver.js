// Libraries
import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';

// Projects
import Client from './client.js';
import { MessagePacket, EPacketID } from '../../AlkkagiShared/packets/index.js';
import { BufferReadHandle } from '../../AlkkagiShared/packets/index.js'; // test

const createServerOptions = (options = {}) => {
    return {
        port: options.port || 3000,
        maxConnections: options.maxConnections || 100,
    };
};

class GameServer {
    constructor(serverOptions) {
        this.serverOptions = serverOptions;
        this.connectedClients = new Set();
    }

    start() {
        // create server
        this.expressApp = express();
        this.server = http.createServer(this.expressApp);
        this.socketServer = new WebSocketServer({ server: this.server });

        // serve static files
        this.expressApp.use(express.static('public'));

        // regist socket server event
        this.socketServer.on('connection', (socket, req) => {
            globalThis.logger.info('GameServer', 'Client connected');

            const client = new Client(socket);
            this.connectedClients.add(client);

            client.on('message', (message) => {
                // test
                if(message.length == 0)
                    return;

                const buffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength);
                const readHandle = new BufferReadHandle(buffer);
                const packetID = readHandle.readUint8();

                globalThis.logger.info('GameServer', `Packet ID: ${packetID}`);
                if(packetID === EPacketID.MESSAGE) {
                    const messagePacket = new MessagePacket();
                    messagePacket.deserialize(buffer);
                    globalThis.logger.info('GameServer', `Received message: ${messagePacket.message}`);
                }
            });

            client.on('close', () => {
                globalThis.logger.info('GameServer', 'Client disconnected');
                this.connectedClients.delete(client);
            });

            client.on('error', (error) => {
                globalThis.logger.error('GameServer', `Client error: ${error}`);
            });

            // return response about connected successfully
            client.send(new MessagePacket('Connected successfully'));
        });

        this.socketServer.on('error', (error) => {
            globalThis.logger.error('GameServer', `Socket server error: ${error}`);

            switch (error.code) {
                case "EADDRINUSE":
                    globalThis.logger.error('GameServer', "Server could not bind to port!");
                    break;
                case "EACCES":
                    globalThis.logger.error('GameServer', "Please make sure you are running with root privileges.");
                    break;
                default:
                    globalThis.logger.error('GameServer', `Unhandled error code: ${error.code}`);
                    break;
            }

            // exits the program
            process.exit(1); 
        });

        // start server
        this.server.listen(this.serverOptions.port, () => {
            globalThis.logger.info('GameServer', `Game server started on port ${this.serverOptions.port}`);
        });
    }

    close() {
        this.connectedClients.forEach(client => {
            client.close();
        });
        this.connectedClients.clear();
        
        this.socketServer.close();
        this.server.close();

        globalThis.logger.info('GameServer', 'Game server closed successfully');
    }
}

export { GameServer };
export { createServerOptions };