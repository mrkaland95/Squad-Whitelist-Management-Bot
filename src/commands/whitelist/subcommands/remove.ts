import { UsersDB } from "../../../db/schema";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from "discord.js";
import { generateWhitelistEmbed } from "../utils/utils";


export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription(`Removes a given SteamID from a user's saved whitelist.`)
        .addStringOption(option =>
            option.setName('steamid')
                .setDescription('steamID to remove')
                .setAutocomplete(true)),


    async execute(interaction: ChatInputCommandInteraction) {
        const user = await UsersDB.findOne({ DiscordID: interaction.user.id })
        const steamIDs = user?.Whitelist64IDs
        const steamIDToRemove = interaction.options.getString('steamid')

        if (!steamIDs) {
            return await interaction.followUp({
                content: `You do not have any whitelisted steamIDs.`,
                ephemeral: true
            })
        }

        if (!steamIDToRemove) {
            return await interaction.followUp({
                content: `You must supply a value to remove.`,
                ephemeral: true
            })
        }

        const matchingSteamIDs = steamIDs.filter(item => item.steamID !== steamIDToRemove)

        if (matchingSteamIDs.length === steamIDs.length) {
            return interaction.followUp({
                content: `The given steamID \`${steamIDToRemove}\` does not exist among your whitelist IDs.`,
                ephemeral: true
            })
        }

        await UsersDB.findOneAndUpdate({ DiscordID: user.DiscordID }, {
            Whitelist64IDs: matchingSteamIDs,
            LastUpdated: Date.now()
        })

        const embed = generateWhitelistEmbed(matchingSteamIDs, interaction.user)

        return await interaction.followUp({
            content: `Successfully removed steamID \`${steamIDToRemove}\` from your whitelisted IDs.\n` +
            `Remaining IDs: \n`,
            ephemeral: true,
            embeds: [embed]
        })
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true)
        const user = await UsersDB.findOne({DiscordID: interaction.user.id})
        const steamIDs = user?.Whitelist64IDs

        if (!steamIDs) {
            return await interaction.respond([])
        }

        const matchedIDs = steamIDs.filter(steamID => steamID.steamID.includes(focusedOption.value))
        const processedIDS = []
        for (const id of matchedIDs) {
            if (id.name) {
                processedIDS.push({ name: `${id.steamID} - "${id.name}"`, value: id.steamID})
            } else {
                processedIDS.push({ name: id.steamID, value: id.steamID })
            }
        }

        await interaction.respond(
            processedIDS
        )
    }
}
