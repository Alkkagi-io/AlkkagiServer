import { FSMBrain } from '../../Component/FSM/index.js';
import { EEntityType } from '../../../AlkkagiShared/Datas/index.js';
import { BotPlayerAIData, BotPlayerIdleState, BotPlayerMoveState, BotPlayerAttackState, BotPlayerTargetConditionTransition } from './FSM/index.js';
import { Character } from '../Character/Character.js';

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
        this.onDestroyedCallback?.();
    }

    _buildFSM() {
        const fsmBrain = new FSMBrain();

        const idleState = new BotPlayerIdleState();
        const moveState = new BotPlayerMoveState();
        const attackState = new BotPlayerAttackState(moveState);

        idleState.addTransition(new BotPlayerTargetConditionTransition(moveState, null));

        moveState.addTransition(new BotPlayerTargetConditionTransition(idleState, null).setReverse(true)); 
        moveState.addTransition(new BotPlayerTargetConditionTransition(attackState, (target) => {
            switch(target.getEntityType()) {
                case EEntityType.XPObject: // xp object는 끝까지 붙는다.
                    return -1;
                default: // 나머지는 공격대상 어느정도 거리가 있으면 공격태세
                    return 5;
            }
        }));

        fsmBrain.aiData = new BotPlayerAIData(this, this.world);
        // fsmBrain.initialize(idleState, [idleState, moveState, attackState]);

        return fsmBrain;
    }
}

export { BotPlayer };
