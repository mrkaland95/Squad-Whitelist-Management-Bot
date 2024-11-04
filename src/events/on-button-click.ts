import CustomClient from "../types/custom-client";
import { BaseInteraction, Events } from "discord.js";
import { generateWhitelistEmbed } from "../commands/whitelist/utils/command-utils";
import { DiscordEvent} from "../types/events";
import { retrieveDiscordUser } from "../cache";

const event: DiscordEvent = {
    name: Events.InteractionCreate,
    once: false,
    execute: async function (interaction: BaseInteraction, client: CustomClient) {
        if (!interaction.isButton()) return

        await interaction.deferReply({
            ephemeral: true
        })

        /*
        It's a bit dumb to hardcode the interaction like this, but for the moment there is only one button for the entire bot.
        Should more buttons be added, refactor so these interactions are handled dynamically.
         */

        if (interaction.customId === 'view_steam_ids') {
            const user = await retrieveDiscordUser(interaction.user)
            if (!user) {
                return await interaction.followUp({
                    content: `Internal Error occurred in the bot.`
                })
            }

            const embed = generateWhitelistEmbed(user.Whitelist64IDs, interaction.user)

            return await interaction.followUp({
                embeds: [embed]
            })
        }
    }
}

export default event