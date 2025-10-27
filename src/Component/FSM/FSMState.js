class FSMState {
    constructor() {
        this.brain = null;
        this.transitions = [];
    }

    addTransition(transition) {
        this.transitions.push(transition);
    }

    initialize(brain) {
        this.brain = brain;

        for(const transition of this.transitions) {
            transition.initialize(brain, this);
        }
    }

    onEnterState() { }
    onUpdateState(deltaTime) { }
    onExitState() { }

    enterState() {
        this.onEnterState();
    }

    updateState(deltaTime) {
        this.onUpdateState(deltaTime);

        for(const transition of this.transitions) {
            const isTriggered = transition.isTriggered();
            if(isTriggered == transition.isReverse)
                continue;

            this.brain.changeState(transition.getTargetState());
        }
    }

    exitState() {
        this.onExitState();
    }
}

export { FSMState };