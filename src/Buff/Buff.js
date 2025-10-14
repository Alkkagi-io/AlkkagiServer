class Buff {
    constructor() {
        this.id = 0;
        this.icon = "";
        this.time = 0;
        this.isPerminent = false;
        this.live = false;
        this.params = {}
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