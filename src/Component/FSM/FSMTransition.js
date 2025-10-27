class FSMTransition {
    constructor(targetState) {
        this.brain = null;
        this.currentState = null;
        this.targetState = targetState;
        this.isReverse = false;
    }

    initialize(brain, currentState) {
        this.brain = brain;
        this.currentState = currentState;
    }

    isTriggered() {
        return true;
    }

    getTargetState() {
        return this.targetState;
    }
    
    setReverse(reverse) {
        this.isReverse = reverse;
        return this;
    }
}

export { FSMTransition };