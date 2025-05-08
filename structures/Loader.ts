import klaw from "klaw";
import path from "path";
import DClient from "./MarkiBot";

export default class Loader {
    client: DClient;
    constructor(client: DClient) {
        this.client = client;
    }

    start() {
        this.client.logger.debug("Loading Loaders");
        this.loadFolder("./commands", "loadCommand");
        this.loadFolder("./events", "loadEvent");
    }

    loadFolder(folder: string, funct: "loadCommand" | "loadEvent") {
        this.client.logger.debug(`Loading Function: ${funct}`);
        klaw(folder).on("data", async (file) => {
            const File = path.parse(file.path);
            if (!File.ext || File.ext !== ".ts") return;
            this.client.logger.debug(`Found File: ${File.name}`);
            const response = await this[funct](file.path, `${File.name}${File.ext}`);
            if (response) this.client.logger.error(response);
        });
    }

    async loadCommand(Fpath: string, name: string) {
        try {
            import(Fpath).then((data) => {
                const props = new data.default(this.client);
                if (props.conf.enabled === false) return;
                props.conf.location = path;
                props.conf.fileName = name;
                if (props.init) props.init(this.client);

                props;
                this.client.collections.commands.set(name.replace(/.ts$/g, ""), props);
                this.client.logger.debug(`[Command] ${name} Loaded`);
                return false;
            });
        } catch (error: any) {
            return `Unable to load command ${name}: ${error?.message}`;
        }
    }

    async loadEvent(Fpath: string, name: string) {
        try {
            import(Fpath).then((data) => {
                const props = new data.default(this.client);
                if (props.conf.enabled === false) return;
                props.conf.location = path;
                props.conf.fileName = name;
                props.conf.name = name.replace(/.ts$/g, "");
                if (props.init) props.init(this.client);

                this.client.collections.events.set(props.conf.name, props);
                this.client.on(props.conf.name, (...args) => {
                    return props.run(...args);
                });

                this.client.logger.debug(`[Event] ${name} Loaded`);
                return false;
            });
        } catch (error: any) {
            console.error(error);
            return `Unable to load event ${name}: ${error.message}`;
        }
    }

    async unLoadCommand(command: any) {
        if (!command.conf.fileName) return false;
        this.client.logger.debug(`Unloading Command: ${command.conf.fileName}`);
        this.client.collections.commands.delete(command.conf.fileName);
        return true;
    }

    async reloadCommand(command: any) {
        if (!command.conf.fileName) return false;
        this.unLoadCommand(command);
        return this.loadCommand(command.location, command.conf.fileName);
        return true;
    }

    // unloadEvent(path, name) { }
}
