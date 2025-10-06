class System {
    constructor(world) {
        this.world = world;
    }

    getID() {
        return this.getSystemID();
    }

    getSystemID() {
        throw new Error("Abstract method 'getSystemID' must be implemented");
    }

    onAwake() { }              // called when the system is added to world
    onStart() { }              // called after awake
    onDestroy() { }            // called when the system is removed from world

    onPreUpdate(deltaTime) { }    // called before entity update
    onPostUpdate(deltaTime) { }   // called after entity update
    onLateUpdate(deltaTime) { }   // called after entity late update
}

export { System };