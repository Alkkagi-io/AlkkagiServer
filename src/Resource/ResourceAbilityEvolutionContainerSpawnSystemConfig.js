import { ResourceBase } from "../../AlkkagiShared/Resource/ResourceBase.js";

class ResourceAbilityEvolutionContainerSpawnSystemConfig extends ResourceBase {
    constructor() {
        super();

        this.positionList = [];
        this.spawnCount = 0;
    }

    init(id, dict) {
        super.init(id, dict);

        this.positionList = this.getDictValueArray("PositionList", []);
        this.spawnCount = this.getDictValueInt("SpawnCount", 0);
    }
}

export { ResourceAbilityEvolutionContainerSpawnSystemConfig };