class HealthComponent {
    constructor(maxHPProvider, onHPChanged) {
        this.maxHPProvider = maxHPProvider;
        this.onHPChanged = onHPChanged;

        this.reset();
    }

    reset() {
        this.currentHP = this.maxHPProvider();
    }

    heal(amount) {
        const prevHP = this.currentHP;
        const maxHP = this.maxHPProvider();

        this.currentHP += amount;
        if(this.currentHP > maxHP)
            this.currentHP = maxHP;

        this.onHPChanged?.(prevHP, this.currentHP);
    }

    damage(amount) {
        const prevHP = this.currentHP;

        this.currentHP -= amount;
        if(this.currentHP < 0)
            this.currentHP = 0;

        this.onHPChanged?.(prevHP, this.currentHP);
    }
}

export { HealthComponent };