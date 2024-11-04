import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../../../types/commands";
import { incorrectSteamIDFormatResponse, steamID64Regex } from "../../../utils/utils";
import { UsersDB } from "../../../db/schema";
import { refreshUsersCache } from "../../../cache";
import {discordLoggingChannel} from "../../../index";

const slashCommand = new SlashCommandSubcommandBuilder()
    .setName('update')
    .setDescription(`Update a user's SteamID used for in-game admin permissions.`)
    .addStringOption(option =>
        option
            .setName('steamid')
            .setDescription('The steam64ID to update')
            .setRequired(true));


async function execute(interaction: ChatInputCommandInteraction) {
    let steamID = interaction.options.getString('steamid')
    // Since this is a required field, steamID should never be null, since discord won't allow you to put an empty value.
    // But to play nice with TypeScript I have to do this
    if (!steamID) {
        steamID = ""
    }

    if (!steamID64Regex.test(steamID)) {
        return await incorrectSteamIDFormatResponse(interaction, steamID)
    }

    const user = await UsersDB.findOneAndUpdate({
            DiscordID: interaction.user.id
        },{
            AdminRole64ID: steamID
        })


    if (!user) {
        await interaction.followUp({
            content: `Internal server error occurred`
        })
        throw Error(`User not yet initialized in DB by the time data was attempted to be changed. A user must be initialized in the CB beforehand.`)
    }

    // The user object returns the state of the user *before* it was updated.
    const initialSteamID = user.AdminRole64ID

    // State of the DB was updated, so a refresh of the cache is required.
    await refreshUsersCache()

    const name = interaction.user.globalName ? interaction.user.globalName : interaction.user.tag

    if (initialSteamID) {
        discordLoggingChannel?.send({
            content: `User ${name} updated their admin steamID \n`+
                `Old SteamID:  \`${initialSteamID}\`\n`+
                `New SteamID: \`${steamID}\``
        })

    } else {
        discordLoggingChannel?.send({
            content: `User ${name} added an admin steamID \n`+
                `SteamID: \`${steamID}\``
        })
    }


    return await interaction.followUp({
        content: `Admin steamID for user "${interaction.user.globalName}" successfully updated to \`${steamID}\``
    });
}

const command: Subcommand = {
    data: slashCommand,
    execute: execute
};

export default command;