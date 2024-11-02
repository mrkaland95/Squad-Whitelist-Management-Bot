import {REST, Routes } from "discord.js";
import 'dotenv/config';
import { glob } from "glob";
import path from "path";
import env from "../load-env";


if (!env.DISCORD_APP_ID
    || !env.DISCORD_APP_TOKEN
    || !env.GUILD_ID
) {
    console.error('Missing required fields in the .env file.')
    process.exit(1)
}


const commands: string[] = []

async function main() {
    const rootPath = path.resolve(__dirname, '..')
    const commandFiles = await glob(`${rootPath}/commands/*/*{.ts,.js}`, { windowsPathsNoEscape: true })

    for (const filePath of commandFiles) {
        const command = require(filePath)?.default

		if (command?.data && command?.execute) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
    }

    const rest = new REST().setToken(env.DISCORD_APP_TOKEN)
    try {
        console.log(`Refreshing ${commands.length} slash commands.`)

        const data = await rest.put(
            Routes.applicationGuildCommands(env.DISCORD_APP_ID, env.GUILD_ID),
            {body: commands},
        )
        // @ts-ignore
        console.log(`Successfully loaded ${data.length} slash commands`)
    } catch (e) {
        console.error(e)
    }

}

main()