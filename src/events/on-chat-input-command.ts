import CustomClient from "../types/custom-client";
import { BaseInteraction, Events } from "discord.js";

export default {
    name: Events.InteractionCreate,
	once: false,
    execute: async function(interaction: BaseInteraction, client: CustomClient){
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName)

        if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}


		if (interaction.isChatInputCommand()) {
			try {
				await command.execute(interaction);

			} catch (error) {
				console.error(`There was an error while executing command: ${interaction.commandName}`)
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}
		}
    }
}