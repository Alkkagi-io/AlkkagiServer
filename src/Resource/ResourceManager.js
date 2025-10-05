class ResourceManager {
    constructor() {
        this.loaded = false;
    }

    load(force = false) {
        if (this.loaded && !force) 
            return;
        
        // data load

        this.loaded = true;
    }

    #getJsonData(fileName) {
        const baseDir = join(process.cwd(), 'AlkkagiData');

        const path = await import("node:path");
        const fs = await import("node:fs/promises");
        const fss = await import("node:fs");

        const p = path.resolve(baseDir, fileName);
        if (!fss.existsSync(p)) {
            console.log(`[${ctor.name}] File not found: ${p}`);
            return;
        }

        let text;
        try {
            text = await fs.readFile(p, "utf8");
        } catch (e) {
            console.log(`[${ctor.name}] File read error: ${p}`);
            return;
        }
    }
}

export { ResourceManager };