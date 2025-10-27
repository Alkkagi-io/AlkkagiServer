class FSMBrain {
    constructor() {
        this.defaultState = null;
        this.currentState = null;
    }

    initialize(defaultState, states) {
        this.defaultState = defaultState;
        this.currentState = this.defaultState;

        for(const state of states) {
            state.initialize(this);
        }
    }

    update(deltaTime) {
        if(this.currentState == null) {
            return;
        }

        this.currentState.updateState(deltaTime);
    }

    changeState(state) {
        if(this.currentState != null) {
            this.currentState.exitState();
        }
        this.currentState = state;
        this.currentState.enterState();
    }

    setAsDefaultState() {
        this.changeState(this.defaultState);
    }
}

export { FSMBrain };