import mongoose, { Document, Schema } from "mongoose";
import { User } from "discord.js";
import { loadUsers, usersCache} from "../cache";

export interface IUser extends Document {
    DiscordID: string;
    DiscordName: string;
    Roles: string[];
    Whitelist64IDs: { steamID: string; name?: string }[];
    AdminRole64ID?: string;
    Enabled: boolean;
}

/**
 *
 */
const userSchema = new Schema<IUser>({
    DiscordID: { type: String, unique: true, required: true },
    DiscordName: { type: String, required: true },
    Roles: { type: [String], required: true },
    Whitelist64IDs: [
        {
            steamID: { type: String, required: true },
            name: { type: String, required: false },
        },
    ],
    AdminRole64ID: { type: String, required: false },
    Enabled: { type: Boolean, required: true },
    }, {
        timestamps: true
});


export const UsersDB = mongoose.model<IUser>("User", userSchema);

/**
 * Utility function for initializing a discord user if one doesn't exist in the database.
 * @param discordUser An object representing a discord user.
 */
export async function initUserInDB(discordUser: User) {
    const newUser = new UsersDB({
        DiscordID: discordUser.id,
        DiscordName: discordUser.globalName,
        Roles: [],
        Whitelist64IDs: [],
        AdminRole64ID: null,
        Enabled: true,
    })
    return newUser.save()
}

export async function retrieveDiscordUser(discordUser: User) {
    let user = usersCache.get(discordUser.id)
    if (!user) {
        const users = await loadUsers()
        user = users.get(discordUser.id)
    }
    if (!user) {
        user = await initUserInDB(discordUser)
    }

    return user
}