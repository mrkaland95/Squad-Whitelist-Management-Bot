import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import 'dotenv/config';
import { loadSlashCommands} from './utils/utils.js'
import { Command } from "./types/commands";
import { glob } from "glob";


/*

Discord

Resources:

https://discordjs.guide/#before-you-begin


*/


async function main() {
	const commandFiles = await glob(`${__dirname}/commands/*/*{.ts,.js}`, { windowsPathsNoEscape: true })
	const commands = await loadSlashCommands(commandFiles)

	console.log(commands)

	const token = process.env.DISCORD_APP_TOKEN

	const client = new Client({intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	]});


	client.once(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	await client.login(token);
}



main()