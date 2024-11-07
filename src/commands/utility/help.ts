import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/commands";

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help of usage of the commands of this bot.');

async function execute(interaction: ChatInputCommandInteraction) {

    // TODO dynamically load the other commands and split each command into it's own embed.
    const embed = new EmbedBuilder()
        .setTitle(`Help`)
        .setDescription('Available commands:')
        .addFields(
            { name: 'Whitelist show', value: 'Retrieves the saved whitelisted steamIDs you have' },
            { name: 'Whitelist add', value: 'Adds a steamID to your whitelist slots.' },
            { name: 'Whitelist remove', value: 'Removes a steamID to your whitelist slots. Features autocomplete among your saved steamIDs' },
            { name: 'Admin show', value: 'Shows the stored adminID. Only has an effect if the user has any roles with admin permissions.' },
            { name: 'Admin update', value: 'Updates the stored adminID. Only has an effect if the user has any roles with admin permissions.' },
        )

    return await interaction.reply({
        ephemeral: true,
        embeds: [embed]
    })
}

const commandObject: Command = {
    data,
    execute
}

export default commandObject