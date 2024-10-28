import {Client, Events, GatewayIntentBits } from "discord.js";
import fs from 'fs'
import path from "path";
import 'dotenv/config';

/*

Discord

Resources:

https://discordjs.guide/#before-you-begin


*/

const token = process.env.DISCORD_APP_TOKEN

const client = new Client({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers
]});



client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);