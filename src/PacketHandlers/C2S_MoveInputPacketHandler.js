import { ServerPacketHandler } from './index.js';
import { EMoveInput } from '../../AlkkagiShared/Datas/EMoveInput.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class C2S_MoveInputPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        switch(packet.moveInput) {
            case EMoveInput.None:
                playerHandle.playerEntity.setMoveDirection(Vector.Zero);
                break;
            case EMoveInput.Up:
                playerHandle.playerEntity.setMoveDirection(Vector.Up);
                break;
            case EMoveInput.Down:
                playerHandle.playerEntity.setMoveDirection(Vector.Down);
                break;
            case EMoveInput.Left:
                playerHandle.playerEntity.setMoveDirection(Vector.Left);
                break;
            case EMoveInput.Right:
                playerHandle.playerEntity.setMoveDirection(Vector.Right);
                break;
            case EMoveInput.UpLeft:
                playerHandle.playerEntity.setMoveDirection(Vector.Up.add(Vector.Left));
                break;
            case EMoveInput.UpRight:
                playerHandle.playerEntity.setMoveDirection(Vector.Up.add(Vector.Right));
                break;
            case EMoveInput.DownLeft:
                playerHandle.playerEntity.setMoveDirection(Vector.Down.add(Vector.Left));
                break;
            case EMoveInput.DownRight:
                playerHandle.playerEntity.setMoveDirection(Vector.Down.add(Vector.Right));
                break;
        }
    }
}

export { C2S_MoveInputPacketHandler };