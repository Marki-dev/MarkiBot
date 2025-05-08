import Discord, {
  ActionRow,
  APIInteractionGuildMember,
  CacheType,
  Channel,
  ChannelType,
  ChatInputCommandInteraction,
  CommandInteraction,
  DMChannel,
  Embed,
  EmbedBuilder,
  Guild,
  GuildChannel,
  GuildChannelManager,
  GuildMember,
  GuildTextBasedChannel,
  Interaction,
  InteractionReplyOptions,
  Message,
  MessageCreateOptions,
  MessageMentions,
  MessagePayload,
  PermissionFlags,
  User,
} from "discord.js";
import Command from "./Command";
import Client from "./MarkiBot";

type ContextType = {
  cmd: Command;
  client: Client;
  interaction: ChatInputCommandInteraction<CacheType>;
};
export default class CommandContext {
  interaction: ChatInputCommandInteraction<CacheType>;
  command: Command;
  client: Client;
  guild: Discord.Guild | null;
  channel: GuildTextBasedChannel;
  options: Omit<
    Discord.CommandInteractionOptionResolver<Discord.CacheType>,
    "getMessage" | "getFocused"
  >;

  reply(options: string | MessagePayload | InteractionReplyOptions) {
    return this.interaction.reply(options);
  }
  constructor(options: ContextType) {
    this.interaction = options.interaction;
    this.command = options.cmd;
    this.client = options.client;

    this.guild = this.interaction.guild;
    this.channel = this.interaction.channel as GuildTextBasedChannel;

    this.options = this.interaction.options;
  }
  getAuthor() {
    return this.guild?.members.fetch(
      this.interaction.user.id
    ) as unknown as GuildMember;
  }
  uniqueId() {
    return Math.ceil(Math.random() * Date.now() * 5).toString(36);
  }
  async error(error: string, title?: string) {
    let embed = new EmbedBuilder()
      .setTitle(title || "An Error has Occured")
      .setDescription(error)
      .setColor("Red")
      .setThumbnail(this.client.user?.displayAvatarURL() || "");

    if (this.interaction.deferred || this.interaction.replied) {
      // If the interaction has already been replied to or deferred, we need to edit the original reply
      const message = (await this.interaction.fetchReply()) as Message;
      await message
        .edit({ embeds: [embed] })
        .catch(() => this.client.logger.debug("Failed to edit message"));
    } else {
      // Otherwise, we can reply to the interaction normally with the embed
      await this.interaction.reply({
        content: "",
        embeds: [embed],
        ephemeral: true,
      });
    }
  }
  async findUser(
    query: string,
    options?: { idOnly?: boolean }
  ): Promise<User | null> {
    if (!this.guild?.id) {
      throw new Error(`Guild with ID ${this.guild?.id} not found`);
    }

    // First, try to find the user by their ID
    let user = await this.client.users.fetch(query).catch(() => null);

    return user ?? null;
  }
}
