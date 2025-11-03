class FSMTransition {
    constructor(targetState, decisions) {
        this.brain = null;
        this.currentState = null;
        this.targetState = targetState;
        this.decisions = decisions;
    }

    initialize(brain, currentState) {
        this.brain = brain;
        this.currentState = currentState;
        for(const decision of this.decisions) {
            decision.initialize(brain, this);
        }
    }

    isTriggered() {
        for(const decision of this.decisions) {
            if(decision.decide() == false)
                return false;
        }

        return true;
    }

    getTargetState() {
        return this.targetState;
    }
}

export { FSMTransition };