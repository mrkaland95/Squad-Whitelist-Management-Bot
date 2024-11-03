/**
 * Utility file meant to store a cache of users
 */
import { IUser, UsersDB } from "./db/schema";

export let usersCache: Map<string, IUser> = new Map()

export async function loadUsers() {
    const users = await UsersDB.find({})
    usersCache = new Map()
    for (const user of users) {
        usersCache.set(user.DiscordID, user)
    }
    return usersCache
}

