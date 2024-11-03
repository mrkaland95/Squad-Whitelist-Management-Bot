import { Command } from "../types/commands";
import {ChatInputCommandInteraction, Collection} from "discord.js";

export async function importFile(filePath: string) {
  return require(filePath)?.default
}

/**
 * Loads the slash commands from files stored in the commands directory.
 * @param commandFiles
 */
export async function loadSlashCommands(commandFiles: string[]): Promise<Collection<string, Command>> {
	const commands: Collection<string, Command> = new Collection()
	await Promise.all(
		commandFiles.map(async (filePath) => {
			const command = await importFile(filePath)
			if (!command?.data.name) return;
			commands.set(command.data.name, command)
			return command.data
		})
	)

	return commands
}

export function incorrectSteamIDFormatResponse(interaction: ChatInputCommandInteraction, steamID: string) {
	const msg =
		`The given steamID: \`${steamID}\` is not a correctly formatted steamID. A steam64ID is a 17 digit number.\n` +
		`Don't know how to find your steamID? Find it here: https://findsteamid.com/`
	return interaction.followUp({
		content: msg,
	})
}
export const steamID64Regex  = /^7656119\d{10}$/;
