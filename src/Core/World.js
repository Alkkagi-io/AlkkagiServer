import { EventEmitter } from "events";
import { DynamicAABBTree } from "../Utils/DynamicAABBTree/DynamicAABBTree.js";
import fs from 'fs';
import path from 'path';

const createWorldOptions = (configPath) => {
    const defaultConfig = {
        tickRate: 30,
    };

    try {
        const configFilePath = path.join(process.cwd(), configPath);
        if (fs.existsSync(configFilePath) == false) {
            globalThis.logger?.warn('World', 'Config file not found, using default values');
            return defaultConfig;
        }

        const configData = fs.readFileSync(configPath, 'utf8');
        const fileConfig = JSON.parse(configData);

        return {
            tickRate: fileConfig.tickRate || defaultConfig.tickRate,
        };
    } catch (error) {
        globalThis.logger?.error('World', `Error reading config file: ${error.message}`);
        return defaultConfig;
    }
};

class World extends EventEmitter {
    static entityCounter = 0;

    constructor(worldOptions) {
        super()

        this.worldOptions = worldOptions;

        this.tickRate = worldOptions.tickRate;
        this.tick = 1000 / this.tickRate;
        this.next = Date.now();
        
        this.entities = {}; // <entityID, entity>
        this.entityAddQueue = [];
        this.entityRemoveQueue = [];
        
        this.systems = {}; // <systemID, system>
        this.systemAddQueue = [];
        this.systemRemoveQueue = [];

        this.entityTree = new DynamicAABBTree({ fatMargin: 2 });

        this.isRunning = false;
    }

    addEntity(entity) {
        entity.entityID = World.entityCounter++;
        // if(this.entities[entity.entityID] !== undefined || this.entityAddQueue.some(e => e.entityID === entity.entityID)) {
        //     globalThis.logger.error('World', `Entity ${entity.constructor.name}(${entity.getID()}) already exists`);
        //     return;
        // }
        this.entityAddQueue.push(entity);
    }

    removeEntity(entity) {
        if(this.entities[entity.entityID] === undefined && !this.entityRemoveQueue.some(e => e.entityID === entity.entityID)) {
            globalThis.logger.error('World', `Entity ${entity.constructor.name}(${entity.getID()}) does not exist`);
            return;
        }
        
        this.entityRemoveQueue.push(entity);
    }

    getEntity(entityID) {
        return this.entities[entityID];
    }

    addSystem(system) {
        if(this.systems[system.getSystemID()] !== undefined || this.systemAddQueue.some(s => s.getSystemID() === system.getSystemID())) {
            globalThis.logger.error('World', `System ${system.constructor.name}(${system.getID()}) already exists`);
            return;
        }

        this.systemAddQueue.push(system);
    }

    removeSystem(system) {
        if(this.systems[system.getSystemID()] === undefined && !this.systemRemoveQueue.some(s => s.getSystemID() === system.getSystemID())) {
            globalThis.logger.error('World', `System ${system.constructor.name}(${system.getID()}) does not exist`);
            return;
        }

        this.systemRemoveQueue.push(system);
    }

    getSystem(systemID) {
        return this.systems[systemID];
    }

    startLoop() {
        if(this.isRunning) {
            globalThis.logger.error('World', 'World is already running');
            return;
        }

        this.isRunning = true;
        this.updateLoop();
    }

    updateLoop() {
        const now = Date.now();
        let drift = now - this.next;

        if(drift >= 0) {
            const steps = Math.floor(drift / this.tick) + 1;
            for(let i = 0; i < steps; i++)
                this.update(1 / this.tickRate);

            this.next += steps * this.tick;
        }

        const delay = Math.max(0, this.next - Date.now());
        setTimeout(this.updateLoop.bind(this), delay);
    }

    update(deltaTime) {
        this.onPreUpdate(deltaTime);
        this.onTreeUpdate(deltaTime);

        // system pre-update
        Object.values(this.systems).forEach(system => this.publishEvent(system, system.onPreUpdate, deltaTime));

        // entity update
        Object.values(this.entities).forEach(entity => this.publishEvent(entity, entity.onPreUpdate, deltaTime));
        Object.values(this.entities).forEach(entity => this.publishEvent(entity, entity.onUpdate, deltaTime));
        Object.values(this.entities).forEach(entity => this.publishEvent(entity, entity.onPostUpdate, deltaTime));
        
        // system post-update
        Object.values(this.systems).forEach(system => this.publishEvent(system, system.onPostUpdate, deltaTime));

        // entity late-update
        Object.values(this.entities).forEach(entity => this.publishEvent(entity, entity.onLateUpdate, deltaTime));

        // system late-update
        Object.values(this.systems).forEach(system => this.publishEvent(system, system.onLateUpdate, deltaTime));

        this.onPostUpdate(deltaTime);
    }

    onPreUpdate(deltaTime) 
    { 
        const entityAddQueue = this.entityAddQueue;
        const systemAddQueue = this.systemAddQueue;
        this.entityAddQueue = [];
        this.systemAddQueue = [];

        for(let i = 0; i < entityAddQueue.length; i++) {
            const entity = entityAddQueue[i];
            this.publishEvent(entity, entity.onAwake);
            this.entities[entity.entityID] = entity;
            entity.refLeaf = this.entityTree.insert(entity, entity.collider.getAABB());
            this.emit('addEntity', entity);
        }

        for(let i = 0; i < systemAddQueue.length; i++) {
            const system = systemAddQueue[i];
            this.publishEvent(system, system.onAwake);
            this.systems[system.getSystemID()] = system;
        }

        for(let i = 0; i < entityAddQueue.length; i++) {
            const entity = entityAddQueue[i];
            this.publishEvent(entity, entity.onStart);
        }

        for(let i = 0; i < systemAddQueue.length; i++) {
            const system = systemAddQueue[i];
            this.publishEvent(system, system.onStart);
        }
    }

    onTreeUpdate(deltaTime) {
        const nodes = [...this.entityTree.nodes];
        for (const leaf of nodes) {
            if (!leaf?.isLeaf || !leaf.data) 
                continue;

            const entity = leaf.data;
            const aabb = entity.collider.getAABB();
            entity.refLeaf = this.entityTree.update(leaf, aabb);
        }
    }

    onPostUpdate(deltaTime) 
    { 
        const entityRemoveQueue = this.entityRemoveQueue;
        const systemRemoveQueue = this.systemRemoveQueue;
        this.entityRemoveQueue = [];
        this.systemRemoveQueue = [];

        for(let i = 0; i < entityRemoveQueue.length; i++) {
            const entity = entityRemoveQueue[i];
            this.publishEvent(entity, entity.onDestroy);
            this.entityTree.remove(entity.refLeaf);
            this.emit('removeEntity', entity);
            delete this.entities[entity.entityID];
        }

        for(let i = 0; i < systemRemoveQueue.length; i++) {
            const system = systemRemoveQueue[i];
            this.publishEvent(system, system.onDestroy);
            delete this.systems[system.getSystemID()];
        }
    }

    publishEvent(object, event, ...args) {
        try {
            event.bind(object)(...args);
        } catch (error) {
            globalThis.logger.error('World', `Error occurred while publishing event. ${object.constructor.name}(${object.getID()})::${event.name}.\n${error.stack}`);
        }
    }
}

export { World, createWorldOptions };
