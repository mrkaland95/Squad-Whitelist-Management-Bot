import { UsersDB } from "../../../db/schema";
import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";

export default {
        data: new SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription(`Adds a steamID to a users whitelist slots`)
        .addStringOption(option =>
            option
                .setName('steamid')
                .setDescription('The steam64ID to add')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Optional name to describe the user you added')
        ),


    async execute(interaction: ChatInputCommandInteraction) {
        const steamID = interaction.options.getString('steamid')
        const name = interaction.options.getString('name')

        const steamID64Regex  = /^7656119\d{10}$/;

        if (!steamID) {
            return await interaction.followUp({content: `Most supply a value for SteamID`, ephemeral: true})
        }

        // TODO add a message explaining how to find steamID64id
        if (!steamID64Regex.test(steamID)) {
            const msg =
                `The given steamID: \`${steamID}\` is not a correctly formatted steamID. A steamID is a 17 digit number.\n`+
                `TODO: Procedure how to find steamID will be added here`
            return await interaction.followUp({ content: msg, ephemeral: true})
        }
        // TODO add handling if user doesn't exist, i.e initialize them here.
        const user = await UsersDB.findOne({ DiscordID: interaction.user.id })
        if (user) {
            const steamIDs = user.Whitelist64IDs
            const exists = steamIDs.some(item => item.steamID === steamID)
            if (exists) {
                return await interaction.followUp({
                    content: `❌ The SteamID \`${steamID}\` is already whitelisted.`,
                    ephemeral: true
                });
            }
            else {
                if (name) {
                    steamIDs.push({steamID: steamID, name: name})
                } else {
                    steamIDs.push({steamID: steamID})
                }

                await UsersDB.findOneAndUpdate({ DiscordID: user.DiscordID }, {
                    Whitelist64IDs: steamIDs,
                    LastUpdated: Date.now()
                })
                return interaction.followUp({ content: `Succesfully added steamID: \`${steamID}\``, ephemeral: true })
            }
        }
    }
}


/*
TODO implement this
Meant to be an message/set of embeds describing how to find a user's Steam64ID.
 */
function incorrectFormatEmbed() {

}
