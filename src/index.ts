import { Events, GatewayIntentBits } from "discord.js";
import 'dotenv/config';
import { loadEvents, loadSlashCommands } from './utils/utils.js'
import { glob } from "glob";
import CustomClient from "./types/custom-client";
import mongoose from "mongoose";
import env from "./load-env";
import { refreshUsersCache } from "./cache";


/*

Discord

Resources:

https://discordjs.guide/#before-you-begin
https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands


*/




const token = env.DISCORD_APP_TOKEN
const CACHE_UPDATE_INTERVAL_SECONDS = 30

const client = new CustomClient({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
]});

async function main() {
	const commandFiles = await glob(`${__dirname}/commands/*/*{.ts,.js}`, { windowsPathsNoEscape: true })
	const eventFiles = await glob(`${__dirname}/events/*{.ts, .js]}`, { windowsPathsNoEscape: true })

	const events = await loadEvents(eventFiles)
	client.commands = await loadSlashCommands(commandFiles)

	await refreshUsersCache()

		const user = await UsersDB.findOne({DiscordID: interaction.user.id})

	for (const event of events) {
		if (event.once) {
			// @ts-ignore
			client.once(event.name, (...args) => event.execute(...args, client))
		} else {
			// @ts-ignore
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}



	client.once(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	await client.login(token);
}



main()