import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {Subcommand} from "../../../types/commands";
import {UsersDB} from "../../../db/schema";

const slashCommand = new SlashCommandSubcommandBuilder()
    .setName('show')
    .setDescription(`Show a user's steamID used for in-game admin permissions.`);

async function execute(interaction: ChatInputCommandInteraction) {
    const user = await UsersDB.findOne({DiscordID: interaction.user.id})

    if (!user) {
        await interaction.followUp({
            content: `Internal server error occurred`
        })
        throw Error(`User not yet initialized in DB by the time data was attempted to be changed. A user must be initialized in the CB beforehand.`)
    }

    const steamID = user.AdminRole64ID

    if (!steamID) {
        return await interaction.followUp({
            content: `You do not have an admin steamID installed.`
        })
    }

    await interaction.followUp({
        content: `Installed admin steamID: \`${steamID}\``
    })
}


const command: Subcommand = {
    data: slashCommand,
    execute: execute
}

export default command