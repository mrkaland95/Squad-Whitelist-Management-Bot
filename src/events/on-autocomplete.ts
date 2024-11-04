import CustomClient from "../types/custom-client";
import {BaseInteraction, Events} from "discord.js";

export default {
    name: Events.InteractionCreate,
    once: false,
    execute: async function(interaction: BaseInteraction, client: CustomClient){
        if (!interaction.isAutocomplete()) return;

        const command = client.commands.get(interaction.commandName)

        if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

        if (command.autocomplete) {
            try {
                await command.autocomplete(interaction);

            } catch (error) {
                console.error(`Error when attempting to perform autocomplete interaction: `)
                console.error(error);
            }
        }
        else {
            // This is meant to catch developer errors, not runtime errors.
            throw Error(`Command has autocomplete enabled, but no autocomplete function defined.`)
        }
    }
}