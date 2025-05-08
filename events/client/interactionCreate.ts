import { Events, Interaction } from "discord.js";
import CommandContext from "../../structures/CommandContext";
import Event from "../../structures/Event";
import Client from "../../structures/MarkiBot";

export default class extends Event {
    constructor(client: Client) {
        super(client, {
            enabled: true,
            name: Events.InteractionCreate
        });
    }
    /**
     * Parses options and flags from an array of strings.
     * @param {client: Client}
     */
    async run(interaction: Interaction) {
        console.log(`Received interaction: ${interaction.id}`);
        if (interaction.isChatInputCommand()) {
            const cmd = this.client.collections.commands.get(interaction.commandName);
            const ctx = new CommandContext({ cmd, client: this.client, interaction });
            if (!cmd)
                return this.client.logger.debug(
                    `Command not found: ${interaction.commandName}`
                );
            this.client.logger.debug(`Running Command: ${interaction.commandName}`);
            cmd._run(ctx);
        }

        if (interaction.isButton()) {
            if (interaction.customId.startsWith('approve_')) {
            const userId = interaction.customId.split('_')[1];
            const guild = interaction.guild;
            if (!guild) return;

            try {
                // Try to get the member
                const member = await guild.members.fetch(userId);
                if (!member) {
                    await interaction.reply({ content: 'User not found in server.', ephemeral: true });
                    return;
                }

                // Add the fren role
                const roleId = this.client.config.roles.fren;
                await member.roles.add(roleId);

                // Update the message to show who approved
                await interaction.message.edit({
                    content: `${interaction.message.content}\n\n✅ Approved by ${interaction.user.tag}`,
                    components: [] // Remove the button
                });

                // Send confirmation
                await interaction.reply({ content: `Successfully approved ${member.user.tag}!`, ephemeral: true });

            } catch (error) {
                console.error('Error approving user:', error);
                await interaction.reply({ content: 'Failed to approve user.', ephemeral: true });
            }
        }
    }
    }
}