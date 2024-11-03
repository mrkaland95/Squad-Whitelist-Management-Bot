import 'dotenv/config';

export default {
    MONGO_DB_URL: process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/whitelist-management",
    DISCORD_LOGGING_CHANNEL: process.env.DISCORD_LOGGING_CHANNEL || '',
    DISCORD_APP_TOKEN: process.env.DISCORD_APP_TOKEN || '',
    DISCORD_APP_ID: process.env.DISCORD_APP_ID || '',
    GUILD_ID: process.env.GUILD_ID || '',
    MAX_WHITELIST_SLOTS: process.env.MAX_WHITELIST_SLOTS || 100
}