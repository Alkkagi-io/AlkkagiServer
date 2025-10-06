import { System } from './System.js';

class TestSystem extends System {
    constructor(world) {
        super(world);
        this.count = 0;
    }

    getSystemID() {
        return 'TestSystem';
    }

    onPreUpdate(deltaTime) {
        super.onPreUpdate(deltaTime);
        globalThis.logger.info('TestSystem', `Pre update. Count: ${this.count}`);

        if(this.count == 70)
            throw new Error('Test error');
    }

    onPostUpdate(deltaTime) {
        super.onPostUpdate(deltaTime);
        globalThis.logger.info('TestSystem', `Post update. Count: ${this.count}`);

        this.count++;
        if(this.count >= 100)
            this.world.removeSystem(this);
    }
    
    onDestroy() {
        super.onDestroy();
        globalThis.logger.info('TestSystem', 'Destroyed');
    }
}

export { TestSystem };