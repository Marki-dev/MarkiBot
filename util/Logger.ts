export default class Logger {
    constructor() { }

    get timestamp(): string {
        const now = new Date();
        const formattedDate = now.toISOString().replace("T", " ").split(".")[0];
        return formattedDate;
    }

    colorize(text: string, colorCode: string): string {
        const ANSI_COLOR_START = "\x1b[";
        const ANSI_COLOR_END = "\x1b[0m";

        const COLORS: Record<string, string> = {
            green: "32m",
            blue: "34m",
            red: "31m",
            yellow: "33m",
        };

        const color = COLORS[colorCode] || "0m";
        return `${ANSI_COLOR_START}${color}${text}${ANSI_COLOR_END}`;
    }

    ready(log: string): void {
        console.log(
            `[${this.timestamp}] ${this.colorize("[READY]", "green")} ${log}`
        );
    }

    info(log: string): void {
        console.log(
            `[${this.timestamp}] ${this.colorize("[INFO]", "blue")} ${log}`
        );
    }

    error(log: string): void {
        console.error(
            `[${this.timestamp}] ${this.colorize("[ERROR]", "red")} ${log}`
        );
    }

    status(service: string, log: string): void {
        console.log(
            `[${this.timestamp}] ${this.colorize(
                `[STATUS]`,
                "blue"
            )} ${service.toLocaleUpperCase()} | ${log}`
        );
    }

    debug(log: string): void {
        console.log(
            `[${this.timestamp}] ${this.colorize("[DEBUG]", "yellow")} ${log}`
        );
    }
    debugOther(name: string = "other", log: string): void {
        if (!process.env.DEV) return;
        console.log(
            `[${this.timestamp}] ${this.colorize(
                "[RANDOM]",
                "orange"
            )} ${this.colorize(`[${name}]`, "yellow")} ${log}`
        );
    }
}
