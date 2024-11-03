import {
    SlashCommandSubcommandBuilder, ChatInputCommandInteraction,
} from "discord.js";
import { UsersDB } from "../../../db/schema";
import { generateWhitelistEmbed } from "../utils/command-utils";


export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('show')
        .setDescription(`Retrieves the whitelisted IDs by the caller.`),

    async execute(interaction: ChatInputCommandInteraction) {
        const user = await UsersDB.findOne({ DiscordID: interaction.user.id })
        const steamIDs = user?.Whitelist64IDs

        /*
        TODO add a more comprehensive warning about requesting whitelist or something along those lines here.
         */

        if (!steamIDs) {
            return await interaction.followUp({ content: `You do not have any whitelisted steamIDs.`, ephemeral: true})
        }

        const embed = generateWhitelistEmbed(steamIDs, interaction.user)
        await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        })
    }
}


