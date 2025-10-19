class HealthComponent {
    constructor(maxHPProvider, onHPChanged) {
        this.maxHPProvider = maxHPProvider;
        this.onHPChanged = onHPChanged;
        this.currentHP = 0;

        this.reset();
    }

    reset() {
        this.currentHP = this.maxHPProvider();
    }

    heal(performer, amount) {
        const prevHP = this.currentHP;
        const maxHP = this.maxHPProvider();

        this.currentHP += amount;
        if(this.currentHP > maxHP)
            this.currentHP = maxHP;

        this.onHPChanged?.(performer, prevHP, this.currentHP);
    }

    damage(performer, amount) {
        const prevHP = this.currentHP;

        this.currentHP -= amount;
        if(this.currentHP < 0)
            this.currentHP = 0;

        this.onHPChanged?.(performer, prevHP, this.currentHP);
    }
}

export { HealthComponent };