import { FSMBrain } from '../../Component/FSM/index.js';
import { EEntityType } from '../../../AlkkagiShared/Datas/index.js';
import { BotPlayerAIData, BotPlayerIdleState, BotPlayerMoveState, BotPlayerAttackState, BotPlayerTargetConditionDecision, BotPlayerMoveStateDecision } from './FSM/index.js';
import { Character } from '../Character/Character.js';
import { EMoveState } from '../../Component/index.js';

class BotPlayer extends Character {
    constructor(world, nickname, onDestroyedCallback) {
        super(world, nickname);

        this.fsmBrain = this._buildFSM();
        this.onDestroyedCallback = onDestroyedCallback;
    }

    getEntityType() {
        return EEntityType.BotPlayer;
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        this.fsmBrain.update(deltaTime);
    }

    onDestroy() {
        super.onDestroy();
        this.onDestroyedCallback?.(this);
    }

    _buildFSM() {
        const fsmBrain = new FSMBrain();

        const idleState = new BotPlayerIdleState();
        const moveState = new BotPlayerMoveState((target) => {
            switch(target.getEntityType()) {
                case EEntityType.XPObject:
                    return -1;
                default: 
                    return 5 + target.scale * 0.5;
            }
        });
        const attackState = new BotPlayerAttackState(moveState);

        idleState.addTransition(moveState, [new BotPlayerTargetConditionDecision(null, null)]);

        moveState.addTransition(idleState, [new BotPlayerTargetConditionDecision(null, null).setReverse(true)]); 
        moveState.addTransition(attackState, [
            new BotPlayerTargetConditionDecision(
                (target) => {
                    switch(target.getEntityType()) {
                        case EEntityType.XPObject:
                            return -1;
                        default:
                            return 10 + target.scale * 0.5;
                    }
                },
                (target) => {
                    switch(target.getEntityType()) {
                        case EEntityType.XPObject:
                            return -1;
                        default:
                            return 5 + target.scale * 0.5;
                    }
                },
            ),
            new BotPlayerMoveStateDecision(EMoveState.Propelled).setReverse(true)
        ]);

        fsmBrain.aiData = new BotPlayerAIData(this, this.world);
        fsmBrain.initialize(idleState, [idleState, moveState, attackState]);

        return fsmBrain;
    }
}

export { BotPlayer };
