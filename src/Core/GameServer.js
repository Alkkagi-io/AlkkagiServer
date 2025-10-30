// Libraries
import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

// Projects
import ClientHandle from './ClientHandle.js';
import { MessagePacket } from '../../AlkkagiShared/Packets/index.js';

const createServerOptions = (configPath) => {
    // 기본 설정값
    const defaultConfig = {
        port: 3000,
        maxConnections: 100,
        certPath: null,
        keyPath: null,
    };

    try {
        const configFilePath = path.join(process.cwd(), configPath);
        if (fs.existsSync(configFilePath) == false) {
            globalThis.logger?.warn('GameServer', 'Config file not found, using default values');
            return defaultConfig;
        }

        const configData = fs.readFileSync(configPath, 'utf8');
        const fileConfig = JSON.parse(configData);

        return {
            port: fileConfig.port || defaultConfig.port,
            maxConnections: fileConfig.maxConnections || defaultConfig.maxConnections,
            certPath: fileConfig.certPath || defaultConfig.certPath,
            keyPath: fileConfig.keyPath || defaultConfig.keyPath,
        };
    } catch (error) {
        globalThis.logger?.error('GameServer', `Error reading config file: ${error.message}`);
        return defaultConfig;
    }
};

class GameServer {
    constructor(serverOptions, world) {
        this.serverOptions = serverOptions;
        this.connectedClients = new Set();
        this.world = world;
    }

    start() {
        this.clientCounter = 0;

        // create server
        this.expressApp = express();

        const key = this.serverOptions.keyPath ? fs.readFileSync(this.serverOptions.keyPath, 'utf8') : null;
        const cert = this.serverOptions.certPath ? fs.readFileSync(this.serverOptions.certPath, 'utf8') : null;

        if(key && cert) {
            this.server = https.createServer({ key: key, cert: cert }, this.expressApp);
        } else {
            this.server = http.createServer(this.expressApp);
        }

        this.socketServer = new WebSocketServer({ server: this.server, path: '/ws' });

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
            globalThis.logger.info('GameServer', `Game server started on port ${this.serverOptions.port} ${this.serverOptions.keyPath ? 'with SSL' : 'without SSL'}`);
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

        const clientHandle = new ClientHandle(this, this.world, socket, this.clientCounter);
        this.clientCounter++;

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