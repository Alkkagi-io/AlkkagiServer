class Buff {
    constructor(icon, time, isPerminent, params = {}) {
        this.icon = icon;
        this.time = time;
        this.isPerminent = isPerminent;
        this.params = params;
        this.live = false;
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