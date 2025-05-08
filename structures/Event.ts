import { Events } from 'discord.js';
import Client from "./MarkiBot"

type EventOptions = {
    enabled: boolean;
    name?: Events;
};

export default class Event {
    client: Client;
    conf: EventOptions;

    constructor(client: Client, options: EventOptions = { enabled: true }) {
        this.client = client;
        this.conf = {
            enabled: "enabled" in options ? options.enabled : false,
            name: options.name
        };
    }
}