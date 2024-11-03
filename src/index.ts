import {Events, GatewayIntentBits} from "discord.js";
import 'dotenv/config';
import {loadSlashCommands} from './utils/utils.js'
import {glob} from "glob";
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
	client.commands = await loadSlashCommands(commandFiles)

	await loadUsers()

	client.on(Events.InteractionCreate, async interaction  => {
		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

		const user = await UsersDB.findOne({DiscordID: interaction.user.id})

		if (!user) {
			const newUser = await initUserInDB(interaction.user)
			if (newUser) {
				console.log(`Successfully initiated database entry for discord user: ${interaction.user.globalName}`)
			}
		}

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

		else if (interaction.isAutocomplete()) {
			if (command.autocomplete) {
				try {
					await command.autocomplete(interaction);

				} catch (error) {
					console.error(error);
				}
			}
			else {
				// This is meant to catch developer errors, not runtime errors.
				throw Error(`Command has autocomplete enabled, but no autocomplete function defined.`)
			}
		}
	})

	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isButton()) return

		await interaction.deferReply({
			ephemeral: true
		})

		/*
		It's a bit dumb to hardcode the interaction like this, but for the moment there is only one button for the entire bot.
		Should more buttons be added, refactor so these interactions are handled dynamically.
		 */

		if (interaction.customId === 'view_steam_ids') {
			const user = usersCache.get(interaction.user.id)
			if (!user) {
				return await interaction.followUp({
					content: `Internal Error occurred in the bot.`
				})
			}

			const embed = generateWhitelistEmbed(user.Whitelist64IDs, interaction.user)

			return await interaction.followUp({
				embeds: [embed]
			})
		}
	})

	client.once(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});

	await client.login(token);
}



main()