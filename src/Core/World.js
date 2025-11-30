import { EventEmitter } from "events";
import { DynamicAABBTree } from "../Utils/DynamicAABBTree/DynamicAABBTree.js";
import fs from 'fs';
import path from 'path';

const createWorldOptions = (configPath) => {
    const defaultConfig = {
        tickRate: 30,
    };

    try {
        if (fs.existsSync(configPath) == false) {
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
    constructor(worldOptions) {
        super()

        this.worldOptions = worldOptions;

        this.entityCounter = 0;
        this.time = 0;
        this.tickRate = worldOptions.tickRate;
        this.tick = 1000 / this.tickRate;
        this.next = Date.now();
        
        this.entities = {}; // <entityID, entity>
        this.entityAddQueue = new Set();
        this.entityRemoveQueue = new Set();
        
        this.systems = {}; // <systemID, system>
        this.systemAddQueue = new Set();
        this.systemRemoveQueue = new Set();

        this.entityTree = new DynamicAABBTree({ fatMargin: 2 });

        this.isRunning = false;
    }

    addEntity(entity) {
        entity.entityID = this.entityCounter++;
        if(this.entities[entity.entityID] != null) {
            globalThis.logger.error('World', `Entity ${entity.constructor.name}(${entity.getID()}) already exists`);
            return;
        }

        if(this.entityAddQueue.has(entity)) {
            globalThis.logger.error('World', `Entity ${entity.constructor.name}(${entity.getID()}) is already in add queue`);
            return;
        }

        this.entityAddQueue.add(entity);
    }

    removeEntity(entity) {
        if(this.entities[entity.entityID] == null) {
            globalThis.logger.error('World', `Entity ${entity.constructor.name}(${entity.getID()}) does not exist`);
            return;
        }

        if(this.entityRemoveQueue.has(entity)) {
            globalThis.logger.error('World', `Entity ${entity.constructor.name}(${entity.getID()}) is already in remove queue`);
            return;
        }

        this.entityRemoveQueue.add(entity);
    }

    getEntity(entityID) {
        return this.entities[entityID];
    }

    addSystem(system) {
        if(this.systems[system.getSystemID()] != null) {
            globalThis.logger.error('World', `System ${system.constructor.name}(${system.getID()}) already exists`);
            return;
        }

        if(this.systemAddQueue.has(system)) {
            globalThis.logger.error('World', `System ${system.constructor.name}(${system.getID()}) is already in add queue`);
            return;
        }

        this.systemAddQueue.add(system);
    }

    removeSystem(system) {
        if(this.systems[system.getSystemID()] == null) {
            globalThis.logger.error('World', `System ${system.constructor.name}(${system.getID()}) does not exist`);
            return;
        }

        if(this.systemRemoveQueue.has(system)) {
            globalThis.logger.error('World', `System ${system.constructor.name}(${system.getID()}) is already in remove queue`);
            return;
        }

        this.systemRemoveQueue.add(system);
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
        Object.values(this.entities).forEach(entity => { if(entity.enabled == false) return; this.publishEvent(entity, entity.onPreUpdate, deltaTime) });
        Object.values(this.entities).forEach(entity => { if(entity.enabled == false) return; this.publishEvent(entity, entity.onUpdate, deltaTime) });
        Object.values(this.entities).forEach(entity => { if(entity.enabled == false) return; this.publishEvent(entity, entity.onPostUpdate, deltaTime) });
        
        // system post-update
        Object.values(this.systems).forEach(system => this.publishEvent(system, system.onPostUpdate, deltaTime));

        // entity late-update
        Object.values(this.entities).forEach(entity => { if(entity.enabled == false) return; this.publishEvent(entity, entity.onLateUpdate, deltaTime) });

        // system late-update
        Object.values(this.systems).forEach(system => this.publishEvent(system, system.onLateUpdate, deltaTime));

        this.onPostUpdate(deltaTime);
    }

    onPreUpdate(deltaTime) 
    {
        this.time += deltaTime;

        const entityAddQueue = this.entityAddQueue;
        const systemAddQueue = this.systemAddQueue;
        this.entityAddQueue = new Set();
        this.systemAddQueue = new Set();

        for(const entity of entityAddQueue) {
            this.publishEvent(entity, entity.onAwake);
            this.entities[entity.entityID] = entity;
            entity.refLeaf = this.entityTree.insert(entity, entity.collider.getAABB());
            this.emit('addEntity', entity);
        }

        for(const system of systemAddQueue) {
            this.publishEvent(system, system.onAwake);
            this.systems[system.getSystemID()] = system;
        }

        for(const entity of entityAddQueue) {
            this.publishEvent(entity, entity.onStart);
        }

        for(const system of systemAddQueue) {
            this.publishEvent(system, system.onStart);
        }
    }

    onTreeUpdate(deltaTime) {
        const nodes = [...this.entityTree.nodes];
        for (const leaf of nodes) {
            if (!leaf?.isLeaf || !leaf.data) 
                continue;

            const entity = leaf.data;
            if(entity.enabled == false)
                continue;

            const collider = entity.collider;
            if(collider == null)
                continue;

            const aabb = collider.getAABB();
            entity.refLeaf = this.entityTree.update(leaf, aabb);
        }
    }

    onPostUpdate(deltaTime) 
    { 
        const entityRemoveQueue = this.entityRemoveQueue;
        const systemRemoveQueue = this.systemRemoveQueue;
        this.entityRemoveQueue = new Set();
        this.systemRemoveQueue = new Set();

        for(const entity of entityRemoveQueue) {
            this.publishEvent(entity, entity.onDestroy);
            this.entityTree.remove(entity.refLeaf);
            this.emit('removeEntity', entity);
            delete this.entities[entity.entityID];
        }

        for(const system of systemRemoveQueue) {
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
