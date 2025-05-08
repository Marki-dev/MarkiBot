import { ApplicationCommandOptionType } from 'discord.js';
import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import MarkiBot from "../../structures/MarkiBot"; 

export default class extends Command {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: 'rrcreate',
            description: 'Create a reaction role',
            options: [
                {
                    name: 'message_id',
                    description: 'The ID of the message to add reaction role to',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role to give when reacted',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                },
                {
                    name: 'emoji',
                    description: 'The emoji to react with',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        const messageId = ctx.options.getString('message_id', true);
        const role = ctx.options.getRole('role', true);
        const emoji = ctx.options.getString('emoji', true);

        if (!ctx.guild) {
            await ctx.reply({
                content: '❌ This command can only be used in a guild!',
                ephemeral: true
            });
            return;
        }

        try {
            // Fetch the message to verify it exists
            const message = await ctx.channel.messages.fetch(messageId);
            
            // Create the reaction role in database
            await this.client.prisma.reactionRole.create({
                data: {
                    messageId: message.id,
                    roleId: role.id,
                    emoji: emoji,
                    guildId: ctx.guild.id,
                    channelId: ctx.channel.id
                }
            });

            // Add the initial reaction to the message
            await message.react(emoji);

            await ctx.reply({ 
                content: `✅ Successfully created reaction role:\nMessage: ${message.url}\nRole: ${role}\nEmoji: ${emoji}`,
                ephemeral: true 
            });

        } catch (error: any) {
            if (error.code === 'P2002') {
                await ctx.reply({ 
                    content: '❌ A reaction role with this emoji already exists on this message!',
                    ephemeral: true 
                });
            } else {
                await ctx.reply({ 
                    content: '❌ Failed to create reaction role. Make sure the message ID is valid and I have permission to add reactions.',
                    ephemeral: true 
                });
                console.error(error);
            }
        }
    }
}