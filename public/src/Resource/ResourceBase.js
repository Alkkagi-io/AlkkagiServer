import { parseToInteger, parseToFloat, parseToBoolean } from "./DataParseHelper.js";

class ResourceBase {
    constructor() {
        this.id = 0;
        this.name = "";
        this.desc = "";
        this.dict = {};
    }

    init(id, dict) {
        this.id = id;
        this.dict = dict || {};        
        this.name = this.getDictValue("Name", "");
        this.desc = this.getDictValue("Desc", "");
    }

    hasDict(key) {
        return Object.prototype.hasOwnProperty.call(this.dict, key);
    }

    getDictValue(key, defaultValue = "") {
        return this.dict[key];
    }

    getDictValueInt(key, defaultValue = 0) {
        const n = parseToInteger(this.dict[key]);
        return Number.isFinite(n) ? n : defaultValue;
    }

    getDictValueFloat(key, defaultValue = 0) {
        const n = parseToFloat(this.dict[key]);
        return Number.isFinite(n) ? n : defaultValue;
    }

    getDictValueBool(key, defaultValue = false) {
        const b = parseToBoolean(this.dict[key]);
        return (b === undefined || b === null) ? defaultValue : Boolean(b);
    }

    getDictValueArray(key, defaultValue = []) {
        const raw = this.dict[key];
        if (raw === undefined || raw === null) return defaultValue;

        if (Array.isArray(raw)) return raw;

        if (typeof raw === "string") {
            try {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) return arr;
            } catch { /* fallthrough */ }
            const csv = raw.split(",").map(s => s.trim()).filter(s => s.length > 0);
            if (csv.length > 0) return csv;
        }

        return defaultValue;
    }

    static _ensureStore() {
        if (!Object.prototype.hasOwnProperty.call(this, "items")) {
            Object.defineProperty(this, "items", {
                value: new Map(),
                writable: true,
                enumerable: false,
                configurable: true,
            });
        }
    }

    static get(id) {
        this._ensureStore();
        return this.items.get(id);
    }

    static getAll() {
        this._ensureStore();
        return this.items;
    }

    static getWhere(pred) {
        this._ensureStore();
        const out = [];
        for (const v of this.items.values()) {
            if (!pred || pred(v)) out.push(v);
        }
        return out;
    }

    static async load(data, clear = true) {
        const ctor = this;
        ctor._ensureStore();

        let root;
        try {
            const norm = data.charCodeAt(0) === 0xFEFF ? data.slice(1) : data;
            root = JSON.parse(norm);
        } catch {
            throw new Error(`[${ctor.name}] JSON parse error`);
        }

        if (clear) 
            ctor.items.clear();

        for (const idStr in root) {
            if (!Object.prototype.hasOwnProperty.call(root, idStr)) continue;

            const id = Number.parseInt(idStr, 10);
            if (!Number.isFinite(id)) continue;

            const value = root[idStr];
            let dict = value;

            if (typeof value === "string") {
                try {
                    dict = JSON.parse(value);
                } catch {
                    throw new Error(`[${ctor.name}] Skip id=${id} (inner JSON parse error)`);
                }
            }

            if (!dict || typeof dict !== "object") {
                throw new Error(`[${ctor.name}] Skip id=${id} (value is not an object)`);
            }

            const item = new ctor();
            item.init(id, dict);
            ctor.items.set(id, item);
        }
    }
}

export { ResourceBase };