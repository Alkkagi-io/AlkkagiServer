import { S2C_AddBuffPacket } from "../../AlkkagiShared/Packets/S2C_AddBuffPacket.js";
import { S2C_RemoveBuffPacket } from "../../AlkkagiShared/Packets/S2C_RemoveBuffPacket.js";

class BuffManager {
    constructor(player) {
        this.player = player;

        this.buffs = [];
        this.removeBuffs = [];
    }

    addBuff(buff) {
        // 같은 버프가 있다면 지우고 새로 추가
        for (const b of this.buffs) {
            if (b.id == buff.id) {
                this.removeBuff(b);
            }
        }

        this.buffs.push(buff);
        buff.start();

        const res = new S2C_AddBuffPacket(buff.toData());
        this.player.clientHandle.send(res);
    }

    removeBuff(buff) {
        buff.end();
        this.removeBuffs.push(buff);

        const res = new S2C_RemoveBuffPacket(buff.type);
        this.player.clientHandle.send(res);
    }

    update(dt) {
        if (this.removeBuffs.length > 0) {
            this.buffs = this.buffs.filter(b => !this.removeBuffs.includes(b));
            this.removeBuffs.length = 0;
        }

        for (const buff of this.buffs) {
            var end = !buff.update(dt);
            if (end) {
                this.removeBuff(buff);
            }
        }
    }

    getTypeBuffs(type) {
        return this.getBuffs(buff => buff.type == type);
    }

    getBuffs(filter) {
        return this.buffs.filter(buff => buff.live && filter(buff));
    }
}

export { BuffManager };