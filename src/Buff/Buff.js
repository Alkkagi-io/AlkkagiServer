import { EBuffType } from "../../AlkkagiShared/Datas/EBuffType.js";
import { BuffData } from "../../AlkkagiShared/Modules/BuffData.js";

class Buff {
    constructor(type, time, isPerminent, value) {
        this.type = type;
        this.time = time;
        this.isPerminent = isPerminent;
        this.live = false;
        this.value = value;
    }

    start() {
        this.live = true;
    }

    update(dt) {
        if (this.isPerminent) {
            if (this.type == EBuffType.Shield) {
                return this.value > 0;
            }
            return true;
        }

        if (this.time >= 0) {
            this.time -= dt;
            if (this.time < 0) {
                return false;
            }
        }

        return true;
    }

    end() {
        if (!this.live)
            return;

        this.live = false;
    }

    toData() {
        return new BuffData(this.type, this.isPerminent ? -1 : this.time, this.value);
    }
}

export { Buff }