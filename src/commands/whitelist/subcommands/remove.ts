import {UsersDB} from "../../../db/schema";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from "discord.js";
import {viewWhitelistedIDsButton} from "../utils/command-utils";
import {refreshUsersCache, retrieveDiscordUser} from "../../../cache";
import {logToDiscord} from "../../../utils/utils";


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
        const existingSteamIDs = user?.Whitelist64IDs
        const steamID = interaction.options.getString('steamid')

        if (!steamID) {
            return await interaction.followUp({
                content: `You must input a value.`,
            })
        }

        if (!existingSteamIDs) {
            return await interaction.followUp({
                content: `You do not have any whitelisted steamIDs.`,
            })
        }

        const matchingSteamIDs = existingSteamIDs.filter(item => item.steamID !== steamID)

        if (matchingSteamIDs.length === existingSteamIDs.length) {
            return interaction.followUp({
                content: `The given steamID \`${steamID}\` does not exist among your whitelist IDs.`,
            })
        }

        const result = await UsersDB.findOneAndUpdate({ DiscordID: user.DiscordID }, {
            Whitelist64IDs: matchingSteamIDs,
        })

        if (!result) {
            return await interaction.followUp({
                content: `Internal Server Error occurred when attempting to remove steamID`
            })
        }

        // State of the DB was changed, so the cache must be refreshed.
        await refreshUsersCache()

        const name = interaction.user.globalName ? interaction.user.globalName : interaction.user.tag

        const msg = `User ${name} removed a steamID from their whitelist \n`+
                    `SteamID: \`${steamID}\``

        await logToDiscord(msg)

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
