import {retrieveDiscordUser, UsersDB} from "../../../db/schema";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from "discord.js";
import {viewWhitelistedIDsButton} from "../utils/command-utils";
import { loadUsers } from "../../../cache";


export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription(`Removes a SteamID from a users saved whitelist slots.`)
        .addStringOption(option =>
            option.setName('steamid')
                .setDescription('steamID to remove')
                .setRequired(true)
                .setAutocomplete(true)),


    async execute(interaction: ChatInputCommandInteraction) {
        const user = await retrieveDiscordUser(interaction.user)
        const steamIDs = user?.Whitelist64IDs
        const steamID = interaction.options.getString('steamid')

        if (!steamID) {
            return await interaction.followUp({
                content: `You must supply a value.`,
                ephemeral: true
            })
        }

        if (!steamIDs) {
            return await interaction.followUp({
                content: `You do not have any whitelisted steamIDs.`,
            })
        }

        const matchingSteamIDs = steamIDs.filter(item => item.steamID !== steamID)

        if (matchingSteamIDs.length === steamIDs.length) {
            return interaction.followUp({
                content: `The given steamID \`${steamID}\` does not exist among your whitelist IDs.`,
            })
        }

        await UsersDB.findOneAndUpdate({ DiscordID: user.DiscordID }, {
            Whitelist64IDs: matchingSteamIDs,
        })

        // Update the cache
        await loadUsers()

        return await interaction.followUp({
            content: `Successfully removed steamID \`${steamID}\` from your whitelisted IDs.\n`,
            components: [viewWhitelistedIDsButton]
        })
    },

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true)
        const user = await retrieveDiscordUser(interaction.user)
        const steamIDs = user.Whitelist64IDs

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
