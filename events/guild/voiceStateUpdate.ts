import { ChannelType, Events, TextChannel, VoiceState } from "discord.js";
import Event from "../../structures/Event";
import MarkiBot from "../../structures/MarkiBot";

export default class extends Event {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: Events.VoiceStateUpdate
        });
    }

    async run(oldState: VoiceState, newState: VoiceState) {
        // Only care about users joining voice channels
        if (oldState.channelId === newState.channelId) return;
        if (!newState.channelId) return; // User left voice

        const channel = newState.channel;
        if (!channel) return;

        // Check if this is the first user in the channel (excluding bots)
        const members = channel.members.filter(member => !member.user.bot);
        if (members.size !== 1) return; // Not the first user

        // Get the notification channel
        const notificationChannel = await this.client.channels.fetch(this.client.config.channels.vc_pings);
        if (!notificationChannel || !(notificationChannel instanceof TextChannel)) return;

        // Get the role to ping
        const roleId = this.client.config.roles.vc_pings;
        
        // Send the notification
        await notificationChannel.send({
            content: `<@&${roleId}> ${newState.member?.displayName} is yapping in <#${channel.id}>! Come join them!`,
        });
    }
}
