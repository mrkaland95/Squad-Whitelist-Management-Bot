import CustomClient from "../types/custom-client";
import { Events, Message } from "discord.js";

export default {
    name: Events.MessageCreate,
	once: false,
    execute: async function(interaction: Message, client: CustomClient){
		if (interaction.author.bot) return;

		const oldCommands = [
			`!add`,
			'!remove',
			'!whitelist',
			'!admin',
			'!help',
		]

		await interaction.reply(
			`DM commands for this bot have been deprecated. Please use the slash - "/" commands instead. \n`+
					`You may use them here or in any server this bot is situated in.\n`+
					`Use "/help" if you need help for how to use them.`
		)
    }
}