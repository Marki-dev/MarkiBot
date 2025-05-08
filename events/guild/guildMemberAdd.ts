import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import Event from "../../structures/Event";
import MarkiBot from "../../structures/MarkiBot";

export default class extends Event {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: Events.GuildMemberAdd
        });
    }

    async run(member: GuildMember) {
        // Get the join/leave channel
        const channel = await this.client.channels.fetch(this.client.config.channels.join_leave);
        if (!channel || !(channel instanceof TextChannel)) return;

        // Create approve button
        const approveButton = new ButtonBuilder()
            .setCustomId(`approve_${member.id}`)
            .setLabel('Approve User')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(approveButton);

        // Create embed for join message
        const embed = {
            color: 0x57F287, // Discord green color
            author: {
                name: `${member.user.tag} joined the server`,
                icon_url: member.user.displayAvatarURL()
            },
            thumbnail: {
                url: member.user.displayAvatarURL()
            },
            fields: [
                {
                    name: 'Account Created',
                    value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
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
                text: '👋 Welcome!'
            }
        };

        member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`Hello ${member.user}, welcome to the server!\nAs this community is for a closed group of friends, we ask that you wait for approval before joining.`)
                    .setFooter({ text: "You will be approved or kicked shortly" })

            ]
        }).catch(e => {
            console.error('Failed to send welcome message:', e);
        });

        // Send join message with button and embed
        await channel.send({
            embeds: [embed],
            components: [row]
        });
    }
}
