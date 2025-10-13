import { ResourceStat } from "../../AlkkagiShared/Resource/ResourceStat.js";
import path from "node:path";
import fs from "node:fs/promises";
import fss from "node:fs";
import { ResourceShopItem } from "../../AlkkagiShared/Resource/ResourceShopItem.js";

class ResourceManager {
    constructor() {
        this.loaded = false;
    }

    async load(force = false) {
        if (this.loaded && !force) 
            return;
        
        logger.info('ResourceManager', 'start resource data load');

        // data load
        ResourceStat.load(await this._getJsonData('Stats.json'));
        ResourceShopItem.load(await this._getJsonData('ShopItems.json'));
        
        this.loaded = true;

        logger.info('ResourceManager', 'resource data load successed complete');
    }

    async _getJsonData(fileName) {
        logger.info('ResourceManager', `load [${fileName}] resource`);

        const baseDir = path.join(process.cwd(), 'AlkkagiData');

        const p = path.resolve(baseDir, fileName);
        if (!fss.existsSync(p)) {
            logger.error('ResourceManager', `[${ctor.name}] File not found: ${p}`);
            return;
        }

        let text;
        try {
            text = await fs.readFile(p, "utf8");
        } catch (e) {
            logger.error('ResourceManager', `[${ctor.name}] File read error: ${p}`);
            return;
        }

        return text;
    }
}

export { ResourceManager };