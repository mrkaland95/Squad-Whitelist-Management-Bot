import {EmbedBuilder, User} from "discord.js";

/**
 * Generates an embed used for displaying a Discord user's whitelisted steamIDs.
 * @param steamIDs An array of objects containing a steamID and an optional user submitted name to describe whom it belongs to.
 * @param user The discord user object.
 */
export function generateWhitelistEmbed(steamIDs: { steamID: string; name?: string }[], user: User) {
    const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setTitle(`Whitelisted SteamIDs for user "${user.globalName}"`)
        .setTimestamp(Date.now())

    if (!steamIDs.length) {
        embed.setDescription(`No steamIDs to display`)
        return embed
    }

    let formattedSteamIDs = ""
    let formattedNames = ""

    for (let i = 0; i < steamIDs.length; i++) {
        const steamID = steamIDs[i].steamID
        const name = steamIDs[i].name

        formattedSteamIDs += `${i + 1}). ${steamID}`
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
