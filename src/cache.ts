/**
 * Utility file meant to store a cache of users
 */
import { initUserInDB, IUser, UsersDB } from "./db/schema";
import { User } from "discord.js";

let usersCache: Map<string, IUser> = new Map()


export async function refreshUsersCache() {
    const users = await UsersDB.find({})
    usersCache = new Map()
    for (const user of users) {
        usersCache.set(user.DiscordID, user)
    }
    return usersCache
}

export async function retrieveDiscordUser(discordUser: User) {
    let user = usersCache.get(discordUser.id)

    if (!user) {
        console.log(`Retrieved from db...`)
        const users = await refreshUsersCache()
        user = users.get(discordUser.id)
    }

    if (!user) {
        user = await initUserInDB(discordUser)
        if (user) {
            console.log(`Successfully initiated database entry for discord user: ${discordUser.globalName}`)
        } else {
            console.error(`Error when initializing Discord user into database.`)
        }
    }

    return user
}