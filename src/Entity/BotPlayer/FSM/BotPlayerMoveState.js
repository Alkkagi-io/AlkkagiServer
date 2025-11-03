import { StatConfig } from '../../../../AlkkagiShared/Configs/StatConfig.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';
import { FSMState } from '../../../Component/FSM/index.js';

const UPDATE_INTERVAL = 0.5;
const DIRECTION_CHANGE_INTERVAL = 0.25;
const TIGHT_CHASE_RADIUS = 30;
const SIMILARITY_THRESHOLD = 0.700; // cos(sqrt(2)/2) => 0.707 (45도. 8방향중 인접하다면 방향을 바꾸지 않는다.)

const DIRECTIONS = [
    Vector.Up(),
    Vector.Down(),
    Vector.Left(),
    Vector.Right(),
    Vector.add(Vector.Up(), Vector.Left()).normalize(),
    Vector.add(Vector.Up(), Vector.Right()).normalize(),
    Vector.add(Vector.Down(), Vector.Left()).normalize(),
    Vector.add(Vector.Down(), Vector.Right()).normalize(),
];

class BotPlayerMoveState extends FSMState {
    constructor(keepingDistanceProvider) {
        super();
        this.timer = 0;
        this.lastDirectionIndex = 0;
        this.lastDirectionChangeTime = 0;
        this.keepingDistanceProvider = keepingDistanceProvider;
    }

    onEnterState() {
        super.onEnterState();
        this.timer = 0;
    }

    onUpdateState(deltaTime) {
        super.onUpdateState(deltaTime);
        
        this.timer -= deltaTime;

        // 로봇처럼 방향을 확확 바꾸는 걸 방지하기 위해 인터벌을 걸자.
        if(this.brain.aiData.world.time - this.lastDirectionChangeTime < DIRECTION_CHANGE_INTERVAL) {
            return;
        }

        if(this.timer > 0) {
            return;
        }

        this.timer = UPDATE_INTERVAL;
        this._chaseTarget();
    }

    _chaseTarget() {
        const aiData = this.brain.aiData;
        const owner = aiData.owner;
        const target = aiData.world.getEntity(aiData.currentTargetEntityID);
        if(target == null) {
            this.brain.setAsDefaultState();
            return;
        }
    
        const targetDirection = Vector.subtract(target.position, owner.position);
        const normalizedTargetDirection = Vector.normalize(targetDirection);

        const keepingDistance = this.keepingDistanceProvider(target);
        if(keepingDistance > 0 && targetDirection.getSqrMagnitude() < keepingDistance * keepingDistance) {
            normalizedTargetDirection.multiply(-1);
        }

        const currentDirectionIndex = this._getSimilarDirectionIndex(normalizedTargetDirection);
        let currentDirection = DIRECTIONS[currentDirectionIndex];
        if(targetDirection.getSqrMagnitude() > TIGHT_CHASE_RADIUS * TIGHT_CHASE_RADIUS) {
            const lastDirection = DIRECTIONS[this.lastDirectionIndex];
            const lastDirectionSimilarity = Vector.dot(currentDirection, lastDirection);
            if(lastDirectionSimilarity > SIMILARITY_THRESHOLD)
                currentDirection = lastDirection;
        }

        this.lastDirectionIndex = currentDirectionIndex;
        owner.moveComponent.setLocomotionVelocity(currentDirection, owner.statManager.getValue(StatConfig.Type.MOVE_SPEED));
        this.lastDirectionChangeTime = aiData.world.time;
    }

    _getSimilarDirectionIndex(normalizedTargetDirection) {
        const directionSimilarityMap = [];
        for(let i = 0; i < DIRECTIONS.length; i++) {
            const direction = DIRECTIONS[i];
            const similarity = Vector.dot(normalizedTargetDirection, direction);
            directionSimilarityMap.push({ similarity: similarity, directionIndex: i });
        }
        
        directionSimilarityMap.sort((a, b) => b.similarity - a.similarity);
        return directionSimilarityMap[0].directionIndex;
    }
}

export { BotPlayerMoveState };