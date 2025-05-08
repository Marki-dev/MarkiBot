import { Events, GuildMember, TextChannel } from "discord.js";
import Event from "../../structures/Event";
import MarkiBot from "../../structures/MarkiBot";

export default class extends Event {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: Events.GuildMemberRemove
        });
    }

    async run(member: GuildMember) {
        // Get the join/leave channel
        const channel = await this.client.channels.fetch(this.client.config.channels.join_leave);
        if (!channel || !(channel instanceof TextChannel)) return;

        // Create embed for leave message
        const embed = {
            color: 0xED4245, // Discord red color
            author: {
                name: `${member.user.tag} left the server`,
                icon_url: member.user.displayAvatarURL()
            },
            thumbnail: {
                url: member.user.displayAvatarURL()
            },
            fields: [
                {
                    name: 'Joined Server',
                    value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`,
                    inline: true
                },
                {
                    name: 'User ID',
                    value: member.id,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: '👋 Goodbye!'
            }
        };

        // Send leave message with embed
        await channel.send({
            embeds: [embed]
        });
    }
}
