import { ResourceBase } from "../../AlkkagiShared/Resource/ResourceBase.js";

class ResourceXPSpawnSystemConfig extends ResourceBase {
    constructor() {
        super();

        this.positionList = [];
        this.spawnCount = 0;
        this.spawnTable = [];
        this.totalRates = 0;
    }

    init(id, dict) {
        super.init(id, dict);

        this.positionList = this.getDictValueArray("PositionList", []);
        this.spawnCount = this.getDictValueInt("SpawnCount", 0);
        this.spawnTable = this.getDictValueArray("SpawnTable", []);

        // build data
        this.totalRates = this.spawnTable.reduce((acc, tableRow) => acc + tableRow.Rate, 0);
    }
}

export { ResourceXPSpawnSystemConfig };