// Libraries
import express from 'express';
import fs from 'fs';

// Modules
import { logger } from '../AlkkagiShared/Modules/Logger.js';
import { ResourceManager } from './Resource/ResourceManager.js'

// Projects
import { GameServer, createServerOptions } from './Core/GameServer.js';
import { World, createWorldOptions } from './Core/World.js';
import { buildPacketManager } from './Core/PacketManager.js';
import { WorldNetworkUpdatorSystem, CollisionSystem, XPSpawnSystem, GoldSpawnSystem, BotPlayerSpawnSystem } from './System/index.js';

// global variables
globalThis.logger = logger;
globalThis.gameConfig = JSON.parse(fs.readFileSync('./config/game-config.json', 'utf8'));

// load resources
const resourceManager = new ResourceManager();
await resourceManager.load(true);

// create world
const worldOptions = createWorldOptions('./config/world-config.json');
const world = new World(worldOptions);

// create game server
const serverOptions = createServerOptions('./config/server-config.local.json');
// const serverOptions = createServerOptions('./config/server-config.seh00n.json');
// const serverOptions = createServerOptions('./config/server-config.live.json');
const gameServer = new GameServer(serverOptions, world);

// setup systems
world.addSystem(new WorldNetworkUpdatorSystem(world, gameServer));
world.addSystem(new CollisionSystem(world));
world.addSystem(new XPSpawnSystem(world));
world.addSystem(new GoldSpawnSystem(world));
world.addSystem(new BotPlayerSpawnSystem(world));

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

// ----- debug -----

// import { Character, XPContainer, XPObject } from './Entity/index.js';
// import { S2C_UpdateWorldPacket } from '../AlkkagiShared/Packets/index.js';

// const character = new Character(world);
// world.addEntity(character);

// const xpObject = new XPObject(world, 100);
// world.addEntity(xpObject);
// xpObject.position.set(10, 10);

// const xpContainer = new XPContainer(world, 100, 100, () => {});
// world.addEntity(xpContainer);

// await new Promise(resolve => setTimeout(resolve, 1000));

// const serialized = new S2C_UpdateWorldPacket(Object.values(world.entities)).serialize();
// globalThis.logger.info('Serialized', JSON.stringify(serialized));
// const deserialized = new S2C_UpdateWorldPacket().deserialize(serialized);
// globalThis.logger.info('Deserialized', JSON.stringify(deserialized));

// ----- debug -----

import { BotPlayer } from './Entity/index.js';

const botPlayer = new BotPlayer(world, 'BotPlayer');
world.addEntity(botPlayer);
botPlayer.position.set(0, 0);