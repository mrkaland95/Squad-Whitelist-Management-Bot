import { Command } from "../types/commands";
import { Collection } from "discord.js";

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