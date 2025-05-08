import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../generated/prisma";
import { Client, Partials, IntentsBitField, Collection } from "discord.js";

import { config } from "../config"
import Logger from "../util/Logger"
import Loader from "./Loader";
import Functions from "../util/Functions";

export interface MarkiBotOptions { }

export default class MarkiBot extends Client {
    config: typeof config;
    logger: Logger;
    prisma: PrismaClient;
    collections: Record<string, Collection<string, any>>;
    loader: Loader;
    functions: Functions;
    constructor(options: MarkiBotOptions) {
        super({
            partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildPresences
            ],
        });

        this.config = config;

        this.prisma = new PrismaClient();

        this.logger = new Logger();


        this.functions = new Functions(this)

        this.collections = {};
        for (const name of ["commands", "events", "urlEnforcement"])
            this.collections[name] = new Collection<string, any>();

        this.loader = new Loader(this);
        this.loader.start();
    }

    async login() {
        await this.prisma.$connect();
        this.logger.ready("Database has been connected, Data Records accessed");
        this.logger.info("Booting MarkiHost Manager 🚀");
        return super.login(this.config.token);
    }
}
