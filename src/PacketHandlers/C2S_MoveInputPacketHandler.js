import { ServerPacketHandler } from './index.js';
import { EMoveInput } from '../../AlkkagiShared/Datas/EMoveInput.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { StatConfig } from '../Stat/StatConfig.js';

class C2S_MoveInputPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;
        
        let moveDirection = Vector.Zero();
        switch(packet.moveInput) {
            case EMoveInput.None:
                moveDirection = Vector.Zero();
                break;
            case EMoveInput.Up:
                moveDirection = Vector.Up();
                break;
            case EMoveInput.Down:
                moveDirection = Vector.Down();
                break;
            case EMoveInput.Left:
                moveDirection = Vector.Left();
                break;
            case EMoveInput.Right:
                moveDirection = Vector.Right();
                break;
            case EMoveInput.UpLeft:
                moveDirection = Vector.add(Vector.Up(), Vector.Left());
                break;
            case EMoveInput.UpRight:
                moveDirection = Vector.add(Vector.Up(), Vector.Right());
                break;
            case EMoveInput.DownLeft:
                moveDirection = Vector.add(Vector.Down(), Vector.Left());
                break;
            case EMoveInput.DownRight:
                moveDirection = Vector.add(Vector.Down(), Vector.Right());
                break;
        }

        const moveComponent = playerHandle.playerEntity.moveComponent;
        const moveSpeed = playerHandle.playerEntity.statManager.getValue(StatConfig.Type.MOVE_SPEED);
        if(moveComponent == null)
            return;

        moveComponent.setLocomotionVelocity(moveDirection, moveSpeed);
    }
}

export { C2S_MoveInputPacketHandler };