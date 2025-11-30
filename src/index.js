// Libraries
import express from 'express';
import fs from 'fs';
import path from 'path';

// Modules
import { logger } from '../AlkkagiShared/Modules/Logger.js';
import { ResourceManager } from './Resource/ResourceManager.js'

// Projects
import { GameServer, createServerOptions } from './Core/GameServer.js';
import { World, createWorldOptions } from './Core/World.js';
import { buildPacketManager } from './Core/PacketManager.js';
import { WorldNetworkUpdatorSystem, CollisionSystem, XPSpawnSystem, GoldSpawnSystem, BotPlayerSpawnSystem, RankingCalculateSystem, DiagnosticsSystem, AbilityContainerSpawnSystem, AbilityEvolutionContainerSpawnSystem } from './System/index.js';

// global variables
globalThis.logger = logger;
globalThis.gameConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config', 'game-config.json'), 'utf8'));

// load resources
const resourceManager = new ResourceManager();
await resourceManager.load(true);

// create world
const worldOptions = createWorldOptions(path.join(process.cwd(), 'config', 'world-config.json'));
const world = new World(worldOptions);

// create game server
const serverOptions = createServerOptions(path.join(process.cwd(), 'config', 'server-config.local.json'));
// const serverOptions = createServerOptions(path.join(process.cwd(), 'config', 'server-config.seh00n.json'));
// const serverOptions = createServerOptions(path.join(process.cwd(), 'config', 'server-config.live.json'));
const gameServer = new GameServer(serverOptions, world);

// setup systems
world.addSystem(new WorldNetworkUpdatorSystem(world, gameServer));
world.addSystem(new RankingCalculateSystem(world, gameServer));
world.addSystem(new CollisionSystem(world));
world.addSystem(new XPSpawnSystem(world));
// world.addSystem(new GoldSpawnSystem(world));
// world.addSystem(new AbilityContainerSpawnSystem(world));
// world.addSystem(new AbilityEvolutionContainerSpawnSystem(world));
world.addSystem(new BotPlayerSpawnSystem(world, gameServer));
world.addSystem(new DiagnosticsSystem(world, gameServer));

// start world loop
world.startLoop();

// build packet manager
buildPacketManager(gameServer, world);

// start game server
// 일단은 하나하나 넣자. RESTful 을 더 처리해야 할 상황이 생기면 그 땐 Controller를 만들어 라우트를 관리한다.
gameServer
    .build()
    .app(app => {
        app.use(express.static('public'));
    })
    .app(app => {
        app.get('/data/:filename', (req, res) => {
            globalThis.logger.info('GameServer', `GET /data/${req.params.filename}`);
            const { filename } = req.params;
        
            if (filename.includes('..')) {
                return res.status(400).send('invalid filename');
            }
        
            const filePath = path.join(process.cwd(), 'AlkkagiData', filename);
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(err.status || 404).send('file not found');
                }
            });
        });
    })
    .app(app => {
        app.get('/sharedbundle', (req, res) => {
            globalThis.logger.info('GameServer', `GET /sharedbundle`);

            const filePath = path.join(process.cwd(), 'AlkkagiShared', 'Output', 'SharedBundle.js');
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(err.status || 404).send('file not found');
                }
            });
        });
    })
    .start();

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

// const character = new Character(world, 'test_character');
// character.position.set(10, 10);
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

// import { BotPlayer } from './Entity/index.js';

// const botPlayer = new BotPlayer(world, 'BotPlayer');
// world.addEntity(botPlayer);
// botPlayer.position.set(0, 0);

// ----- debug -----

// import { AbilityContainer, AbilityEvolutionContainer } from './Entity/index.js';

// const abilityContainer = new AbilityContainer(world);
// world.addEntity(abilityContainer);
// abilityContainer.position.set(-5, 0);

// const abilityEvolutionContainer = new AbilityEvolutionContainer(world);
// world.addEntity(abilityEvolutionContainer);
// abilityEvolutionContainer.position.set(5, 0);