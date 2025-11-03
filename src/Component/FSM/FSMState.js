import { FSMTransition } from './FSMTransition.js';

class FSMState {
    constructor() {
        this.brain = null;
        this.transitions = [];
    }

    addTransition(targetState, decisions) {
        const transition = new FSMTransition(targetState, decisions);
        this.transitions.push(transition);
        return transition;
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
            if(isTriggered == false)
                continue;

            this.brain.changeState(transition.getTargetState());
        }
    }

    exitState() {
        this.onExitState();
    }
}

export { FSMState };