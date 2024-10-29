import {REST, Routes } from "discord.js";
import 'dotenv/config';
import { glob } from "glob";
import path from "path";


// const { clientID, guildID, discordToken } = { process.env.}
let clientID = process.env.DISCORD_APP_ID
let guildID = process.env.GUILD_ID
const appToken = process.env.DISCORD_APP_TOKEN

if (!appToken
    || !guildID
    || !clientID
) {
    process.exit(1)
}


const commands: string[] = []

async function main() {
    const rootPath = path.resolve(__dirname, '..')
    const commandFiles = await glob(`${rootPath}/commands/*/*{.ts,.js}`, { windowsPathsNoEscape: true })

    for (const filePath of commandFiles) {
        const command = require(filePath)
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
    }

    clientID = clientID ? clientID : ""
    guildID = guildID ? guildID : ""

    // @ts-ignore
    const rest = new REST().setToken(appToken)
    try {
        console.log(`Refreshing ${commands.length} slash commands.`)

        const data = await rest.put(
            Routes.applicationGuildCommands(clientID, guildID),
            {body: commands},
        )
        // @ts-ignore
        console.log(`Successfully loaded ${data.length} slash commands`)
    } catch (e) {
        console.error(e)
    }

}

main()