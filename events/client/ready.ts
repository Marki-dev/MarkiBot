import { ApplicationCommandDataResolvable, ApplicationCommandType, Events } from 'discord.js';
import MarkiBot from "../../structures/MarkiBot";
import Event from "../../structures/Event";

export default class extends Event {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: Events.ClientReady
        });
    }

    async run(client: MarkiBot) {
        client.logger.ready(`Ready! Logged in as ${client.user?.tag}`);

        // Get all commands from the collections
        const commands = [...client.collections.commands.values()];
        const commandData = commands.map(cmd => ({
            name: cmd.conf.name || '',
            description: cmd.conf.description || 'No description provided',
            options: cmd.conf.options || [],
            type: ApplicationCommandType.ChatInput
        })) as ApplicationCommandDataResolvable[];

        try {
            // Update application commands globally
            await client.application?.commands.set(commandData);
            client.logger.ready(`Successfully registered ${commandData.length} application commands!`);
        } catch (error) {
            client.logger.error(`Error registering application commands: ${error}`);
        }
    }
}