import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { Subcommand } from "../../../types/commands";
import {steamID64Regex} from "../../../utils/utils";
import {UsersDB} from "../../../db/schema";

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

    // TODO refactor this out to it's own function to handle the few multiple instances where this is required.
    if (!steamID64Regex.test(steamID)) {
        const msg =
            `The given steamID: \`${steamID}\` is not a correctly formatted steamID. A steamID is a 17 digit number.\n`+
            `TODO: Procedure how to find steamID will be added here`
        return await interaction.followUp({
            content: msg,
        })
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

    return await interaction.followUp({
        content: `Admin steamID for user "${interaction.user.globalName}" successfully updated to \`${steamID}\``
    });
}

const command: Subcommand = {
    data: slashCommand,
    execute: execute
};

export default command;