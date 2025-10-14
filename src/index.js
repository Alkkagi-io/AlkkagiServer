// Libraries
import express from 'express';

// Modules
import { logger } from '../AlkkagiShared/Modules/Logger.js';
import { ResourceManager } from './Resource/ResourceManager.js'

// Projects
import { GameServer, createServerOptions } from './Core/GameServer.js';
import { World, createWorldOptions } from './Core/World.js';
import { buildPacketManager } from './Core/PacketManager.js';
import { WorldNetworkUpdatorSystem, CollisionSystem, XPSpawnSystem } from './System/index.js';

// global variables
globalThis.logger = logger;

const serverOptions = createServerOptions({
    port: 3000,
    maxConnections: 100,
});

// create game server
const gameServer = new GameServer(serverOptions);

// load resources
const resourceManager = new ResourceManager();
await resourceManager.load(true);

// create world
const worldOptions = createWorldOptions({
    tickRate: 30,
});
const world = new World(worldOptions);

// setup systems
world.addSystem(new WorldNetworkUpdatorSystem(world, gameServer));
world.addSystem(new CollisionSystem(world));
world.addSystem(new XPSpawnSystem(world));

// start world loop
world.startLoop();

// build packet manager
buildPacketManager(gameServer, world);

// start game server
gameServer.start();
gameServer.expressApp.use(express.static('public'));

// handle shutdown
process.on('SIGTERM', () => {
    gameServer.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    gameServer.close();
    process.exit(0);
});