import { System } from './System.js';
import { Diagnostics } from '../Utils/ETC/Diagnostics.js';

const MEMORY_LOG_INTERVAL = 60;
const NETWORK_LOG_INTERVAL = 60;
const CONNECTION_LOG_INTERVAL = 30;

class DiagnosticsSystem extends System {
    constructor(world, gameServer) {
        super(world);
        this.gameServer = gameServer;

        this.updators = [
            new Updator(MEMORY_LOG_INTERVAL, Diagnostics.logMemoryUsage),
            new Updator(NETWORK_LOG_INTERVAL, () => { Diagnostics.logNetworkSendTraffic(); Diagnostics.resetNetworkSendTraffic(); }),
            new Updator(CONNECTION_LOG_INTERVAL, () => { Diagnostics.logConnectionCount(this.gameServer); }),
        ];
    }

    getSystemID() {
        return 'DiagnosticsSystem';
    }
    
    onPostUpdate(deltaTime) {
        super.onPostUpdate(deltaTime);

        this.updators.forEach(updator => updator.update(deltaTime));
    }
}

class Updator {
    constructor(intervalMilliseconds, callback) {
        this.intervalMilliseconds = intervalMilliseconds;
        this.callback = callback;
        this.timer = intervalMilliseconds;

        if(intervalMilliseconds <= 0) {
            throw new Error('Interval milliseconds must be greater than 0');
        }
    }

    update(deltaTime) {
        this.timer += deltaTime;

        while(this.timer >= this.intervalMilliseconds) {
            this.callback?.();
            this.timer -= this.intervalMilliseconds;
        }
    }
}

export { DiagnosticsSystem };