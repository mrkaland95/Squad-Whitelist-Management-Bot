import {Events, GatewayIntentBits} from "discord.js";
import 'dotenv/config';
import { loadEvents, loadSlashCommands } from './utils/utils.js'
import { glob } from "glob";
import CustomClient from "./types/custom-client";
import mongoose from "mongoose";
import env from "./load-env";
import {initUserInDB, UsersDB} from "./db/schema";
import {loadUsers, usersCache} from "./cache";
import {generateWhitelistEmbed} from "./commands/whitelist/utils/command-utils";


/*

Discord

Resources:

https://discordjs.guide/#before-you-begin
https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands


*/

mongoose.connect(env.MONGO_DB_URL)

mongoose.connection.once('open', async function() {
	console.log(`MongoDB/Mongoose connection established successfully.`)
})

const token = env.DISCORD_APP_TOKEN

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

	await loadUsers()

	client.on(Events.InteractionCreate, async interaction  => {
		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

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