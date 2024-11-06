import 'dotenv/config';
import { TextChannel } from "discord.js";

const mongoDBURL = process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/whitelist-management"
const discordLoggingChannelID = process.env.DISCORD_LOGGING_CHANNEL_ID || ''
const discordAppToken = process.env.DISCORD_APP_TOKEN || ''
const discordAppID = process.env.DISCORD_APP_ID || ''
const guildID = process.env.GUILD_ID || ''
const maxWhitelistSlots = Number(process.env.MAX_WHITELIST_SLOTS) || 100

const requiredValues = [
    // { name: "Mongo DB URL", value: mongoDBURL },
    { name: "Discord App Token", value: discordAppToken },
]


for (const entry of requiredValues) {
    if (!entry.value) {
        console.error(`${entry.name} is required to run this bot. Configure it in the .env file.`)
        process.exit(1)
    }
}

export let discordLoggingChannel: TextChannel | null = null

/*
This is a somewhat silly way of allowing the logging channel/text channel object be referenced from other parts of the project.
The idea is that the channel can be initialized from the main/index file, but not export from there,
so other parts of the code can be used for imports or scripts without having to run the main file.
 */
export function updateLoggingChannel(channel: TextChannel) {
    discordLoggingChannel = channel
}

export default {
    MONGO_DB_URL: mongoDBURL,
    DISCORD_LOGGING_CHANNEL_ID: discordLoggingChannelID,
    DISCORD_APP_TOKEN: discordAppToken,
    DISCORD_APP_ID: discordAppID,
    GUILD_ID: guildID,
    MAX_WHITELIST_SLOTS: maxWhitelistSlots,
}