import { Vector } from '../../../AlkkagiShared/Modules/Vector.js';

const ATTACK_MOTION_DIRECTION_MATCH_THRESHOLD = 0.707; // cos(45)

class EntityRule {
    static isAttackMotion(velocity, currentPosition, targetPosition) {
        if(velocity.x < 0.01 && velocity.y < 0.01) {
            return false;
        }

        const propelDirection = Vector.normalize(velocity);
        const targetDirection = Vector.normalize(Vector.subtract(targetPosition, currentPosition));

        // 부딪힌 방향과 운동방향이 45도 이상 틀어지지 않았을 때만 공격으로 판단한다.
        return Vector.dot(propelDirection, targetDirection) > ATTACK_MOTION_DIRECTION_MATCH_THRESHOLD;
    }
}

export { EntityRule };