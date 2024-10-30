import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    DiscordID: string;
    DiscordName: string;
    Roles: string[];
    s64IDs: { steamID: string; name?: string }[];
    adminRole64ID?: string[];
    Enabled: boolean;
    TimeAdded: Date;
    LastUpdated: Date;
}



const userSchema = new Schema<IUser>({
    DiscordID: { type: String, unique: true, required: true },
    DiscordName: { type: String, required: true },
    Roles: { type: [String], required: true },
    s64IDs: [
        {
            steamID: { type: String, required: true },
            name: { type: String, required: false },
        },
    ],
    adminRole64ID: { type: [String], required: false },
    Enabled: { type: Boolean, required: true },
    TimeAdded: { type: Date, default: Date.now, immutable: true },
    LastUpdated: { type: Date, default: Date.now, required: true },
});



async function initUserInDB(discordID: string) {

}

export const UsersDB = mongoose.model<IUser>("User", userSchema);
