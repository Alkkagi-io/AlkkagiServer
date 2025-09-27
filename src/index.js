// Libraries
import express from 'express';

// Modules
import { logger } from '../AlkkagiShared/modules/logger.js';

// Projects
import { GameServer, createServerOptions } from './core/gameserver.js';
import { buildPacketManager } from './core/packetmanager.js';

// global variables
globalThis.logger = logger;

const serverOptions = createServerOptions({
    port: 3000,
    maxConnections: 100,
});

const gameServer = new GameServer(serverOptions);
gameServer.start();
gameServer.expressApp.use(express.static('public'));

// build packet manager
buildPacketManager(gameServer);

// handle shutdown
process.on('SIGTERM', () => {
    gameServer.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    gameServer.close();
    process.exit(0);
});