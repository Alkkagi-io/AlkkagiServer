class ResourceManager {
    constructor() {
        this.loaded = false;
    }

    load(force = false) {
        if (this.loaded && !force) 
            return;
        
        // data load

        this.loaded = true;
    }
}

export { ResourceManager };