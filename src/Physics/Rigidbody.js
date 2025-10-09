import { Vector } from "../../AlkkagiShared/Modules/Vector.js";

class Rigidbody {
    constructor(owner) {
        this.entity = owner;
        this.mass = 1;
        this.k1 = 2.0; // 선형 감쇠(점성 마찰)
        this.k2 = 0.0; // 속도제곱 감쇠(고속 제동)
        this.maxSpeed = 10;
        this.velocity = new Vector(0, 0);
        this.force = new Vector(0, 0);
    }

    addForce(f) {
        this.force.add(f);
    }

    impulse(f) {
        this.velocity.add(f.getMultiplied(1 / this.mass));
    }

    update(deltaTime) {
        const v = this.velocity;
        const speed = this.velocity.getMagnitude();
        const forceDir = new Vector(
            -(v.getMultiplied(k1).x + v.getMultiplied(k2 * speed).x),
            -(v.getMultiplied(k1).y + v.getMultiplied(k2 * speed).y),
        );

        const F = new Vector().add(this.force).add(forceDir);
        const a = F.getDivided(this.mass);

        v.add(a.getMultiplied(deltaTime));

        const sp = v.getMagnitude();
        if (sp > this.maxSpeed) {
            v.multiply(this.maxSpeed / sp);
        }

        this.entity.position.add(v.getMultiplied(deltaTime));

        this.snapStop();
        this.force.set(0, 0);
    }

    snapStop(eps = 0.05) {
        if (this.velocity.getMagnitude() < eps)
            this.velocity.set(0, 0);
    }
}

export { Rigidbody };