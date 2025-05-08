import { ButtonInteraction, Events } from "discord.js";
import Event from "../Event";
import MarkiBot from "../MarkiBot";

export default class extends Event {
    constructor(client: MarkiBot) {
        super(client, {
            enabled: true,
            name: Events.InteractionCreate
        });
    }

    async run(interaction: ButtonInteraction) {
        // Only handle button interactions
        if (!interaction.isButton()) return;

        // Handle approve button
        
    }
}
