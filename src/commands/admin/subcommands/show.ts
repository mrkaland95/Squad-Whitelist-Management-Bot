import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";
import {Subcommand} from "../../../types/commands";
import {retrieveDiscordUser, UsersDB} from "../../../db/schema";
import {loadUsers, usersCache} from "../../../cache";

const slashCommand = new SlashCommandSubcommandBuilder()
    .setName('show')
    .setDescription(`Show a user's steamID used for in-game admin permissions.`);

async function execute(interaction: ChatInputCommandInteraction) {
    const user = await retrieveDiscordUser(interaction.user)
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