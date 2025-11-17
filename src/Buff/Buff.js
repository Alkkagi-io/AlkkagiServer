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
        if (this.isPerminent)
            return true;

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
}

export { Buff }