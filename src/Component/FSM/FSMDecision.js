class FSMDecision {
    constructor() {
        this.brain = null;
        this.currentState = null;
        this.isReverse = false;
    }

    initialize(brain, currentState) {
        this.brain = brain;
        this.currentState = currentState;
    }

    onDecide() {
        return true;
    }
    
    decide() {
        const decision = this.onDecide();
        if(this.isReverse) {
            return !decision;
        }

        return decision;
    }

    setReverse(reverse) {
        this.isReverse = reverse;
        return this;
    }
}

export { FSMDecision };