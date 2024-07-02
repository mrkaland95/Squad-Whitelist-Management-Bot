import {Client, Events, GatewayIntentBits } from "discord.js";

/*

Discord

Resources:

https://discordjs.guide/#before-you-begin


*/


const client = new Client({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers
]});
