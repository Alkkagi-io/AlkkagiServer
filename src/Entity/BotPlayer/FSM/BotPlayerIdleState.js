import { Character } from '../../index.js';
import { FSMState } from '../../../Component/FSM/index.js';
import { Vector } from '../../../../AlkkagiShared/Modules/Vector.js';
import { StatConfig } from '../../../../AlkkagiShared/Configs/StatConfig.js';
import { Random } from '../../../../AlkkagiShared/Modules/Random.js';

const UPDATE_INTERVAL = 1;
const TARGET_DETECTION_INTERVAL = 2;

// patrolling
class BotPlayerIdleState extends FSMState {
    constructor() {
        super();
        this.timer = 0;
        this.isRedirectioned = false;
        this.lastTargetDetectionTime = Date.now();
    }

    onEnterState() {
        super.onEnterState();
        this.timer = UPDATE_INTERVAL;
        this.isRedirectioned = false;

        this._findTarget();
    }

    onUpdateState(deltaTime) {
        super.onUpdateState(deltaTime);

        this.timer -= deltaTime;
        if(this.timer > 0)
            return;

        this.timer = UPDATE_INTERVAL;
        this._findTarget();
        this._patrolRedirection();
    }

    _patrolRedirection() {
        if(this.isRedirectioned == false)
        {
            this.isRedirectioned = true;
            this._redirection();
            return;
        }

        const worldWidth = globalThis.gameConfig.worldWidth;
        const worldHeight = globalThis.gameConfig.worldHeight;
        const position = this.brain.aiData.owner.position;
        if(position.x < -worldWidth * 0.5 || position.x > worldWidth * 0.5 || position.y < -worldHeight * 0.5 || position.y > worldHeight * 0.5) {
            this._redirection();
        }
    }

    _redirection() {
        this.brain.aiData.owner.moveComponent.setLocomotionVelocity(Random.direction(), this.brain.aiData.owner.statManager.getValue(StatConfig.Type.MOVE_SPEED) * 5);
    }

    _findTarget() {
        const aiData = this.brain.aiData;
        const options = aiData.options;
        const world = aiData.world;

        const currentTime = Date.now();
        if(currentTime - this.lastTargetDetectionTime < TARGET_DETECTION_INTERVAL * 1000) {
            if(aiData.currentTargetEntityID != -1) {
                const currentTargetEntity = world.getEntity(aiData.currentTargetEntityID);
                if(currentTargetEntity != null) {
                    return;
                }
            }
        }

        const AABB = {
            minX: aiData.owner.position.x - options.sight * 0.5,
            minY: aiData.owner.position.y - options.sight * 0.5,
            maxX: aiData.owner.position.x + options.sight * 0.5,
            maxY: aiData.owner.position.y + options.sight * 0.5
        };
        
        const targetCharacters = [];
        const targetEntities = [];
        world.entityTree.query(AABB, leafNode => {
            const entity = leafNode.data;
            if(entity == null)
                return;
            
            if(entity == aiData.owner)
                return;

            if(entity instanceof Character)
                targetCharacters.push(entity);
            else
                targetEntities.push(entity);
        });

        targetCharacters.sort((a, b) => {
            const aSqrDistance = Vector.subtract(a.position, aiData.owner.position).getSqrMagnitude();
            const bSqrDistance = Vector.subtract(b.position, aiData.owner.position).getSqrMagnitude();
            return aSqrDistance - bSqrDistance;
        });

        if(targetCharacters.length > 0) {
            const targetCharacter = targetCharacters[0];
            const sqrDistance = Vector.subtract(targetCharacter.position, aiData.owner.position).getSqrMagnitude();
            if(sqrDistance < options.characterDetectRadius * options.characterDetectRadius) {
                aiData.currentTargetEntityID = targetCharacter.getID();
                return;
            }
        }
        
        targetEntities.sort((a, b) => {
            const aSqrDistance = Vector.subtract(a.position, aiData.owner.position).getSqrMagnitude();
            const bSqrDistance = Vector.subtract(b.position, aiData.owner.position).getSqrMagnitude();
            return aSqrDistance - bSqrDistance;
        });
        
        if(targetEntities.length > 0) {
            aiData.currentTargetEntityID = targetEntities[0].getID();
            this.lastTargetDetectionTime = currentTime;
        }
    }
}

export { BotPlayerIdleState };