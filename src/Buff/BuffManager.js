class BuffManager {
    constructor(character) {
        this.character = character;

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
    }

    removeBuff(buff) {
        buff.end();
        this.removeBuffs.push(buff);
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