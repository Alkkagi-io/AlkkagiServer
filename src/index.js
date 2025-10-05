// Libraries
import express from 'express';

// Modules
import { logger } from '../AlkkagiShared/modules/logger.js';
import { ResourceManager } from './Resource/ResourceManager.js'

// Projects
import { GameServer, createServerOptions } from './core/gameserver.js';
import { World, createWorldOptions } from './core/world.js';
import { buildPacketManager } from './core/packetmanager.js';
import { TestSystem } from './system/testsystem.js';

// global variables
globalThis.logger = logger;

const serverOptions = createServerOptions({
    port: 3000,
    maxConnections: 100,
});

const gameServer = new GameServer(serverOptions);
gameServer.start();
gameServer.expressApp.use(express.static('public'));

// load resources
const resourceManager = new ResourceManager();
await resourceManager.load(true);

// create world
const worldOptions = createWorldOptions({
    tickRate: 30,
});
const world = new World(worldOptions);
world.addSystem(new TestSystem(world));
world.addSystem(new TestSystem(world));
world.startLoop();

// build packet manager
buildPacketManager(gameServer, world);

// handle shutdown
process.on('SIGTERM', () => {
    gameServer.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    gameServer.close();
    process.exit(0);
});