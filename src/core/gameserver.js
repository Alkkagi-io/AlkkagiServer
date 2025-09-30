// Libraries
import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';

// Projects
import ClientHandle from './clienthandle.js';
import { MessagePacket } from '../../AlkkagiShared/packets/index.js';

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

        // regist socket server event
        this.socketServer.on('connection', (socket, req) => {
            globalThis.logger.info('GameServer', 'Socket connection established');
            this.handleServerConnection(socket, req);
        });

        this.socketServer.on('error', (error) => {
            globalThis.logger.error('GameServer', `Socket server error: ${error}`);
            this.handleServerError(error);

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
            client.disconnect();
        });
        this.connectedClients.clear();
        
        this.socketServer.close();
        this.server.close();

        globalThis.logger.info('GameServer', 'Game server closed successfully');
    }

    handleServerConnection(socket, request) {
        if(this.connectedClients.size >= this.serverOptions.maxConnections) {
            globalThis.logger.info('GameServer', 'Max connections reached. Connection rejected.');
            socket.close();
            return;
        }

        const clientHandle = new ClientHandle(socket);
        clientHandle.on('disconnect', () => {
            this.connectedClients.delete(clientHandle);
            globalThis.logger.info('GameServer', 'Client disconnected');
        });

        this.connectedClients.add(clientHandle);
        globalThis.logger.info('GameServer', 'Client connected');

        // return response about connected successfully
        clientHandle.send(new MessagePacket('Connected successfully'));
    }

    handleServerError(error) {
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
    }
}

export { GameServer };
export { createServerOptions };