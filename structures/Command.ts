import Client from "./MarkiBot";
import CommandContext from "./CommandContext";
import { EmbedBuilder } from "discord.js";

type ConfType = {
  enabled: boolean;
  name?: string;
  description?: string;
  cooldown?: number;
  options?: any[];
  botPerms?: string[];
  userPerms?: string[];  
  ownerOnly?: boolean;
  nsfw?: boolean;
};

export default class Command {
  conf: ConfType;
  client: Client;
  constructor(client: Client, options: ConfType = { enabled: true }) {
    this.client = client;
    this.conf = {
      enabled: "enabled" in options ? options.enabled : true,
      name: options.name,
      description: options.description,
      options: options.options,
      botPerms: options.botPerms || [],
      userPerms: options.userPerms || [],
      ownerOnly: "ownerOnly" in options ? options.ownerOnly : false,
    };
  }

  // This function will run everytime the command name is ran with proper prefix
  run(ctx: CommandContext) {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`);
  }

  // This function will fire on command unload (when reloaded)
  unload() {
    // remove command from cache
  }

  // The run event to catch errors in the run function above.
  async _run(ctx: CommandContext) {
    try {
      console.log("Running command")
      this?.run(ctx);
    } catch (err) {
      console.error(err);
    }
  }
}
