class PromoSession {
    constructor(name, storage = sessionStorage) {
        this.storage = storage;
        this.name = name;
    }

    set(key, value) {
        const current = this.parseJSON(this.storage.getItem(this.name));
        
        current[key] = value;

        this.storage.setItem(this.name, this.toJSON(current));
    }

    get(key, defaultValue = false) {
        const stored = this.parseJSON(this.storage.getItem(this.name));

        if (typeof stored === 'object' && key in stored) {
            return stored[key];
        }

        return defaultValue;
    }

    getAll() {
        return this.parseJSON(this.storage.getItem(this.name));
    }

    remove(key) {
        const stored = this.parseJSON(this.storage.getItem(this.name));

        if (typeof stored === 'object' && key in stored) {
            delete stored[key];
        }
        
    }

    destroy() {
        this.storage.removeItem(this.name);
    }

    toJSON(string) {
        if (typeof string === 'object') string = JSON.stringify(string);
        return string;
    }

    parseJSON(string) {
        try {
            const parsed = JSON.parse(string);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }
        }
        catch (e) { }

        return {};
    }

}

export default PromoSession;