import { Events, MessageReaction, User } from "discord.js";
import MarkiBot from "../../structures/MarkiBot";
import Event from "../../structures/Event";

export default class extends Event {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: Events.MessageReactionRemove
        });
    }

    async run(reaction: MessageReaction, user: User) {
        // Don't respond to bot reactions
        if (user.bot) return;

        try {
            // If the reaction is partial, fetch it
            if (reaction.partial) {
                await reaction.fetch();
            }

            // Make sure we have a valid message
            const message = reaction.message;
            if (!message || !message.id) return;

            // If the message is partial, fetch it
            if (message.partial) {
                await message.fetch();
            }

            // Find any reaction role for this message + emoji combination
            const reactionRole = await this.client.prisma.reactionRole.findUnique({
                where: {
                    messageId_emoji: {
                        messageId: message.id,
                        emoji: reaction.emoji.toString()
                    }
                }
            });

            // If no reaction role found, ignore
            if (!reactionRole) return;

            // Make sure we have a valid guild
            const guild = message.guild;
            if (!guild) return;

            // Try to fetch the member
            let member;
            try {
                member = await guild.members.fetch(user.id);
            } catch (error) {
                return;
            }
            if (!member) return;

            // Remove the role
            try {
                await member.roles.remove(reactionRole.roleId);
            } catch (error) {
            }

        } catch (error) {
        }
    }
}
