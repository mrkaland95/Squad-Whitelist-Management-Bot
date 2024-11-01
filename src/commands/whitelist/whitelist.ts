import { UsersDB } from "../../db/schema";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, User} from "discord.js";
import add from './subcommands/add'


export default {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDescription(`Retrieves the current whitelisted IDs by the caller.`),

    async execute(interaction: CommandInteraction) {
        // Ephemeral means visible only to the user that called the command.
        await interaction.deferReply( {ephemeral: true })


        const user = await UsersDB.findOne({DiscordID: interaction.user.id})
        const steamIDs = user?.Whitelist64IDs

        /*
        TODO add a more comprehensive warning about requesting whitelist or something along those lines here.
         */
        if (!steamIDs) {
            return await interaction.followUp({content: `You do not have any whitelisted steamIDs.`, ephemeral: true})
        }

        const embed = generateWhitelistEmbed(steamIDs, interaction.user)
        const message = await interaction.followUp({
            ephemeral: true,
            embeds: [embed],
        })
    }
}



/**
 * Generate the embed used to displaying a user's steamIDs.
 * @param steamIDs An array of objects containing a steamID and an optional user submitted name to describe whom it belongs to.
 * @param user The discord user object.
 */
function generateWhitelistEmbed(steamIDs: { steamID: string; name?: string }[], user: User) {
    const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle(`Whitelisted SteamIDs saved by ${user.globalName}`)

    if (!steamIDs || !steamIDs.length) {
        embed.setDescription(`No steamIDs to display`)
        return embed
    }

    let formattedSteamIDs = ""
    let formattedNames = ""

    for (let i = 0; i < steamIDs.length; i++) {
        const steamID = steamIDs[i].steamID
        const name = steamIDs[i].name

        formattedSteamIDs += `${i + 1}.) ${steamID}`
        if (name) {
            formattedNames += `${name}`
        }
        formattedSteamIDs += `\n`
        formattedNames += `\n`
    }

    embed.addFields([
        { name: 'SteamID', value: formattedSteamIDs, inline: true},
        { name: 'Name', value: formattedNames, inline: true}
        ])

    return embed
}


