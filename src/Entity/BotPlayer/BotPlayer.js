import { FSMBrain } from '../../Component/FSM/index.js';
import { EEntityType } from '../../../AlkkagiShared/Datas/index.js';
import { BotPlayerAIData, BotPlayerIdleState, BotPlayerMoveState, BotPlayerAttackState, BotPlayerTargetConditionDecision, BotPlayerMoveStateDecision } from './FSM/index.js';
import { Character } from '../Character/Character.js';
import { EMoveState } from '../../Component/index.js';
import { Random } from '../../../AlkkagiShared/Modules/Random.js';

const generateLevel = 11;
const TARGET_SCORE_MIN = 2000;
const TARGET_SCORE_MAX = 3000;

class BotPlayer extends Character {
    constructor(world, nickname, onDestroyedCallback) {
        super(world, nickname);

        this.fsmBrain = this._buildFSM();
        this.onDestroyedCallback = onDestroyedCallback;
        this.targetScore = Random.rangeInt(TARGET_SCORE_MIN, TARGET_SCORE_MAX + 1);
    }

    getEntityType() {
        return EEntityType.BotPlayer;
    }

    onStart() {
        super.onStart();

        let remainStatLevel = generateLevel;
        let loopCount = 10;
        while (loopCount > 0 && remainStatLevel > 0) {
            for (let i = 1; i <= Object.values(this.statLevelUpManager.levels).length; i++) {
                const randomLevel = Random.rangeInt(0, 3);
                const curLevel = this.statLevelUpManager.getStatLevelByStatLevelUpType(i);
                if (this.statLevelUpManager.setLevel(i, curLevel + randomLevel)) {
                    remainStatLevel -= randomLevel;
                }
            }
            loopCount--;
        }

        for (let i = 1; i <= Object.values(this.statLevelUpManager.levels).length; i++) {
            const curLevel = this.statLevelUpManager.getStatLevelByStatLevelUpType(i);
            if (curLevel > 0) {
                this.onStatLevelUp(i);
            }
        }
    }

    onUpdate(deltaTime) {
        super.onUpdate(deltaTime);
        this.fsmBrain.update(deltaTime);
    }

    onDestroy() {
        super.onDestroy();
        this.onDestroyedCallback?.(this);
    }

    onGainXP(prevXP, currentXP) {
        super.onGainXP(prevXP, currentXP);
        if (this.score >= this.targetScore) {
            this.world.removeEntity(this);
        }
    }

    _buildFSM() {
        const fsmBrain = new FSMBrain();

        const idleState = new BotPlayerIdleState();
        const moveState = new BotPlayerMoveState((target) => {
            switch(target.getEntityType()) {
                case EEntityType.XPObject:
                    return -1;
                default: 
                    return 3 + this._getDistanceGap(target);
            }
        });
        const attackState = new BotPlayerAttackState();

        idleState.addTransition(moveState, [new BotPlayerTargetConditionDecision(null, null)]);

        moveState.addTransition(idleState, [
            new BotPlayerTargetConditionDecision(
                (target) => {
                    switch(target.getEntityType()) {
                        case EEntityType.BotPlayer:
                        case EEntityType.Player:
                            return 18 + this._getDistanceGap(target);
                        default:
                            return 10000000;
                    }
                }, 
                // null,
                null
            ).setReverse(true)
        ]); 
        moveState.addTransition(attackState, [
            new BotPlayerTargetConditionDecision(
                (target) => {
                    switch(target.getEntityType()) {
                        case EEntityType.XPObject:
                            return -1;
                        default:
                            return 8 + this._getDistanceGap(target);
                    }
                },
                (target) => {
                    switch(target.getEntityType()) {
                        case EEntityType.XPObject:
                            return -1;
                        default:
                            return 3 + this._getDistanceGap(target);
                    }
                },
            ),
            new BotPlayerMoveStateDecision(EMoveState.Propelled).setReverse(true)
        ]);

        fsmBrain.aiData = new BotPlayerAIData(this, this.world);
        fsmBrain.initialize(idleState, [idleState, moveState, attackState]);

        return fsmBrain;
    }

    _getDistanceGap(target) {
        return target.scale * 0.5 + this.scale * 0.5;
    }
}

export { BotPlayer };
