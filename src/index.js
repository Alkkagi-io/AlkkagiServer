// Libraries
import express from 'express';

// Modules
import { logger } from '../AlkkagiShared/Modules/Logger.js';
import { ResourceManager } from './Resource/ResourceManager.js'

// Projects
import { GameServer, createServerOptions } from './Core/GameServer.js';
import { World, createWorldOptions } from './Core/World.js';
import { buildPacketManager } from './Core/PacketManager.js';
import { WorldNetworkUpdatorSystem } from './System/index.js';
import { Entity } from './Entity/Entity.js';

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
world.addSystem(new WorldNetworkUpdatorSystem(world, gameServer));

world.addEntity(new Entity(world));

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