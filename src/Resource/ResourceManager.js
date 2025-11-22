import { ResourceStatLevelUp } from "../../AlkkagiShared/Resource/ResourceStatLevelUp.js";
import { ResourceShopItem } from "../../AlkkagiShared/Resource/ResourceShopItem.js";
import { ResourceCharacterLevel } from "../../AlkkagiShared/Resource/ResourceCharacterLevel.js";
import { ResourceXPSpawnSystemConfig } from "./ResourceXPSpawnSystemConfig.js";
import { ResourceGoldSpawnSystemConfig } from "./ResourceGoldSpawnSystemConfig.js";
import { ResourceAbilityContainerSpawnSystemConfig } from "./ResourceAbilityContainerSpawnSystemConfig.js";
import { ResourceAbilityEvolutionContainerSpawnSystemConfig } from "./ResourceAbilityEvolutionContainerSpawnSystemConfig.js";
import { ResourceAbilityInfo } from "../../AlkkagiShared/Resource/ResourceAbilityInfo.js";
import path from "node:path";
import fs from "node:fs/promises";
import fss from "node:fs";

class ResourceManager {
    constructor() {
        this.loaded = false;
    }

    async load(force = false) {
        if (this.loaded && !force) 
            return;
        
        logger.info('ResourceManager', 'start resource data load');

        // data load
        ResourceStatLevelUp.load(await this._getJsonData('StatLevelUps.json'));
        ResourceShopItem.load(await this._getJsonData('ShopItems.json'));
        ResourceCharacterLevel.load(await this._getJsonData('CharacterLevels.json'));
        ResourceAbilityInfo.load(await this._getJsonData('AbilityInfos.json'));

        // server data load
        ResourceXPSpawnSystemConfig.load(await this._getJsonData('XPSpawnSystemConfig.json', 'resources'));
        ResourceGoldSpawnSystemConfig.load(await this._getJsonData('GoldSpawnSystemConfig.json', 'resources'));
        ResourceAbilityContainerSpawnSystemConfig.load(await this._getJsonData('AbilityContainerSpawnSystemConfig.json', 'resources'));
        ResourceAbilityEvolutionContainerSpawnSystemConfig.load(await this._getJsonData('AbilityEvolutionContainerSpawnSystemConfig.json', 'resources'));

        // indexing
        ResourceAbilityInfo.indexing();

        this.loaded = true;

        logger.info('ResourceManager', 'resource data load successed complete');
    }

    async _getJsonData(fileName, subPath = 'AlkkagiData') {
        logger.info('ResourceManager', `load [${fileName}] resource`);

        const baseDir = path.join(process.cwd(), subPath);

        const p = path.resolve(baseDir, fileName);
        if (!fss.existsSync(p)) {
            logger.error('ResourceManager', `[${fileName}] File not found: ${p}`);
            return;
        }

        let text;
        try {
            text = await fs.readFile(p, "utf8");
        } catch (e) {
            logger.error('ResourceManager', `[${fileName}] File read error: ${p}`);
            return;
        }

        return text;
    }
}

export { ResourceManager };