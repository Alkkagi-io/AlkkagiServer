import { ServerPacketHandler } from './index.js';
import { EMoveInput } from '../../AlkkagiShared/Datas/EMoveInput.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class C2S_MoveInputPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        const moveComponent = playerHandle.playerEntity.moveComponent;

        switch(packet.moveInput) {
            case EMoveInput.None:
                moveComponent.setMoveDirection(Vector.Zero);
                break;
            case EMoveInput.Up:
                moveComponent.setMoveDirection(Vector.Up);
                break;
            case EMoveInput.Down:
                moveComponent.setMoveDirection(Vector.Down);
                break;
            case EMoveInput.Left:
                moveComponent.setMoveDirection(Vector.Left);
                break;
            case EMoveInput.Right:
                moveComponent.setMoveDirection(Vector.Right);
                break;
            case EMoveInput.UpLeft:
                moveComponent.setMoveDirection(Vector.Up.add(Vector.Left));
                break;
            case EMoveInput.UpRight:
                moveComponent.setMoveDirection(Vector.Up.add(Vector.Right));
                break;
            case EMoveInput.DownLeft:
                moveComponent.setMoveDirection(Vector.Down.add(Vector.Left));
                break;
            case EMoveInput.DownRight:
                moveComponent.setMoveDirection(Vector.Down.add(Vector.Right));
                break;
        }
    }
}

export { C2S_MoveInputPacketHandler };